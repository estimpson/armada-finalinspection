import { isFulfilled } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button, Form, Modal } from '../../bootstrap';
import {
    applicationErrorOccurred,
    ApplicationErrorType,
} from '../../features/applicationError/applicationErrorSlice';
import {
    selectScannerData,
    scanHandled,
} from '../../features/barcodeScanner/barcodeScannerSlice';
import {
    getInspectionImageData,
    selectInspectionImageData,
} from '../../features/inspectionImageData/inspectionImageDataSlice';
import {
    addBulletin,
    addHeaderNoteAsync,
    addHeaderPictureAsync,
    IInspectionJob,
    openInspectionJobAsync,
    removeBulletin,
    removeHeaderNoteAsync,
    removeHeaderPictureAsync,
    selectInspectionJob,
    setObjectStatusAsync,
} from '../../features/inspectionJob/inspectionJobSlice';
import { selectApiDetails } from '../../features/localApi/localApiSlice';
import {
    getPackingJobsList,
    IPackingJob,
    selectPackingJobList,
} from '../../features/packingJobList/packingJobListSlice';
import { InspectionBulletin } from './5-inspection-bulletin/InspectionBulletin';
import { JobHeader } from './6-job-header/JobHeader';
import { JobInventory } from './7-job-inventory/JobInventory';
import { ImagePreview } from '../CameraScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import Camera from 'react-html5-camera-photo';
import { removeHeaderPicture } from '../../features/inspectionJob/inspectionJobAPI';
import { PriorLots } from './8-prior-lots/PriorLots';
import { InspectionJobQueueDetails } from './1-inspection-job-queue/InspectionJobQueueDetails';

export function InspectionJob(props: {
    inspectionJob?: IInspectionJob;
    packingJobList?: IPackingJob[];
    scrollPanel: HTMLDivElement | null;
}) {
    const [showNewBulletinPicture, setShowNewBulletinPicture] = useState(false);
    const [showNewBulletinNote, setShowNewBulletinNote] = useState(false);
    const [showNewJobHeaderPicture, setShowNewJobHeaderPicture] =
        useState(false);
    const [showNewJobHeaderNote, setShowNewJobHeaderNote] = useState(false);
    const [dataUri, setDataUri] = useState('');
    const [note, setNote] = useState('');
    const [caption, setCaption] = useState('');

    const dispatch = useAppDispatch();

    // dependend state
    const apiDetails = useAppSelector(selectApiDetails);
    const scannerData = useAppSelector(selectScannerData);
    const packingJobList = useAppSelector(selectPackingJobList);
    const inspectionJob = useAppSelector(selectInspectionJob);
    const inspectionImageData = useAppSelector(selectInspectionImageData);

    // load state
    useEffect(() => {
        if (apiDetails.port) {
            dispatch(getPackingJobsList({}));
        }
    }, [dispatch, apiDetails]);

    useEffect(() => {
        if (!!!inspectionJob) return;
        console.log(inspectionJob);
        let jobPictureFileGUIDs: string[] = [];
        jobPictureFileGUIDs = jobPictureFileGUIDs
            .concat(inspectionJob?.pictures?.map((p) => p.pictureFileGUID))
            .concat(
                inspectionJob!.bulletins
                    ?.filter((b) => !!b.pictureFileGUID)
                    .map((b) => b.pictureFileGUID!),
            );
        jobPictureFileGUIDs = inspectionJob?.objects?.reduce(
            (previous, current) =>
                previous.concat(current.pictures.map((p) => p.pictureFileGUID)),
            jobPictureFileGUIDs,
        );
        console.log(jobPictureFileGUIDs);
        let missingPictureFileGUIDs = jobPictureFileGUIDs?.filter(
            (p) =>
                inspectionImageData.findIndex(
                    (i) => i.pictureFileGUID === p,
                ) === -1,
        );
        console.log(missingPictureFileGUIDs);
        if (!!missingPictureFileGUIDs?.length) {
            dispatch(getInspectionImageData(missingPictureFileGUIDs.join(',')));
        }
    }, [dispatch, inspectionJob, inspectionImageData]);

    // respond to scans
    useEffect(() => {
        if (!scannerData) return;
        let data = scannerData.scanData;
        dispatch(scanHandled());
        if (data.startsWith('XX')) {
            data = data.substring(2);
        }
        if (data.startsWith('X') || data.startsWith('S')) {
            data = data.substring(1);
        }
        const serial = parseInt(data);
        if (isNaN(serial)) {
            console.log(`No serial in scan data: ${scannerData.scanData}`);
        }

        const packingJob = packingJobList.find((packingJob) => {
            let object = packingJob.objects?.find((object) => {
                return object.serial === serial;
            });
            return object;
        });
        if (!packingJob) {
            console.log(packingJobList);
            console.log(`No packing job found for serial: ${serial}`);
            return;
        }

        let isCurrentInspectionJobStarted =
            inspectionJob?.inspectionStatus === 'SCANNING BEGUN' ||
            inspectionJob?.inspectionStatus === 'SCANNING COMPLETE';
        let isScannedPackingJobSameAsCurrent =
            packingJob.packingJobNumber === inspectionJob?.packingJobNumber;
        let duplicateScan = !!inspectionJob?.objects?.find(
            (scannedObject) =>
                scannedObject.serial === serial &&
                !!scannedObject.inspectionStatus,
        );

        if (
            isCurrentInspectionJobStarted &&
            !isScannedPackingJobSameAsCurrent
        ) {
            console.log(
                'Send an error that the current job should be closed or cancelled first',
            );
            dispatch(
                applicationErrorOccurred({
                    type: ApplicationErrorType.InvalidOperation,
                    message: 'Current job should be closed or cancelled first',
                }),
            );
            return;
        }

        // if (duplicateScan) {
        //     console.log('Send duplicate scan error');
        //     dispatch(
        //         applicationErrorOccurred({
        //             type: ApplicationErrorType.InvalidOperation,
        //             message: `Duplicate scan, serial: ${serial}`,
        //         }),
        //     );
        //     return;
        // }

        const openJob = async () => {
            if (!isScannedPackingJobSameAsCurrent) {
                console.log('Open inspection job');
                const openInspectionJobAction = await dispatch(
                    openInspectionJobAsync(packingJob.packingJobNumber),
                );
                if (isFulfilled(openInspectionJobAction)) {
                    dispatch(
                        setObjectStatusAsync({
                            serial: serial,
                            status: 'SCANNED',
                        }),
                    );
                }
                return;
            } else {
                dispatch(
                    setObjectStatusAsync({
                        serial: serial,
                        status: 'SCANNED',
                    }),
                );
            }
        };
        openJob();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scannerData]);

    function newBulletinPictureHandler(): void {
        setDataUri('');
        setCaption('');
        setShowNewBulletinPicture(true);
    }

    function newBulletinNoteHandler(): void {
        setNote('');
        setShowNewBulletinNote(true);
    }

    function newHeaderPictureHandler(): void {
        setDataUri('');
        setCaption('');
        setShowNewJobHeaderPicture(true);
    }

    function newHeaderNoteHandler(): void {
        setNote('');
        setShowNewJobHeaderNote(true);
    }

    useEffect(() => {
        props.scrollPanel?.scrollTo(0, 0);
    }, [props.scrollPanel, inspectionJob?.inspectionJobNumber]);

    return (
        <>
            <div tabIndex={0}>
                {inspectionJob && inspectionJob.inspectionJobNumber ? (
                    <>
                        <InspectionBulletin
                            inspectionJob={inspectionJob}
                            inspectionImageData={inspectionImageData}
                            newBulletinPictureHandler={
                                newBulletinPictureHandler
                            }
                            newBulletinNoteHandler={newBulletinNoteHandler}
                            deleteBulletinImageHandler={(
                                pictureFileName: string | undefined,
                                bulletinID: number,
                            ) => {
                                dispatch(
                                    removeBulletin({
                                        pictureFileName,
                                        bulletinID,
                                    }),
                                );
                            }}
                            deleteBulletinNoteHandler={(bulletinID: number) => {
                                dispatch(
                                    removeBulletin({
                                        pictureFileName: undefined,
                                        bulletinID: bulletinID,
                                    }),
                                );
                            }}
                        ></InspectionBulletin>
                        <PriorLots
                            inspectionJob={inspectionJob}
                            inspectionImageData={inspectionImageData}
                        />
                        <JobHeader
                            inspectionJob={inspectionJob}
                            inspectionImageData={inspectionImageData}
                            newHeaderPictureHandler={newHeaderPictureHandler}
                            newHeaderNoteHandler={newHeaderNoteHandler}
                            deleteHeaderImageHandler={(
                                pictureFileName: string,
                                pictureID: number,
                            ) => dispatch(removeHeaderPictureAsync(pictureID))}
                            deleteHeaderNoteHandler={(args: {
                                noteID: number;
                            }) => dispatch(removeHeaderNoteAsync(args.noteID))}
                        ></JobHeader>
                        <JobInventory
                            inspectionJob={inspectionJob}
                            inspectionImageData={inspectionImageData}
                        />
                    </>
                ) : (
                    <InspectionJobQueueDetails
                        packingJobList={packingJobList}
                    />
                )}
            </div>

            <Modal
                show={showNewBulletinPicture}
                onHide={() => setShowNewBulletinPicture(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Take a Picture of Part {inspectionJob?.part?.partCode}
                    </Modal.Title>
                    <Modal.Body></Modal.Body>
                </Modal.Header>
                <Modal.Body>
                    {dataUri ? (
                        <div className="d-flex flex-column align-items-end">
                            <ImagePreview dataUri={dataUri} />
                            <Button
                                className="m-2"
                                onClick={() => {
                                    setDataUri('');
                                }}
                            >
                                <span>Retake </span>
                                <FontAwesomeIcon icon={faCamera} size="2x" />
                            </Button>
                        </div>
                    ) : (
                        <Camera
                            isImageMirror={false}
                            onTakePhoto={(dataUri) => setDataUri(dataUri)}
                            imageType={'jpg'}
                        />
                    )}
                    <Form>
                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={caption}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const value = target.value;
                                    setCaption(value);
                                }}
                            ></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        disabled={!!!dataUri || !!!caption}
                        onClick={() => {
                            dispatch(
                                addBulletin({
                                    image64Data: dataUri,
                                    note: caption,
                                }),
                            );
                            setShowNewBulletinPicture(false);
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowNewBulletinPicture(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showNewBulletinNote}
                onHide={() => setShowNewBulletinNote(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Enter a Note for Part {inspectionJob?.part?.partCode}
                    </Modal.Title>
                    <Modal.Body></Modal.Body>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                value={note}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const value = target.value;
                                    setNote(value);
                                }}
                            ></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            dispatch(
                                addBulletin({
                                    image64Data: null,
                                    note: note,
                                }),
                            );
                            setShowNewBulletinNote(false);
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowNewBulletinNote(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showNewJobHeaderPicture}
                onHide={() => setShowNewJobHeaderPicture(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Take a Picture for this Job</Modal.Title>
                    <Modal.Body></Modal.Body>
                </Modal.Header>
                <Modal.Body>
                    {dataUri ? (
                        <div className="d-flex flex-column align-items-end">
                            <ImagePreview dataUri={dataUri} />
                            <Button
                                className="m-2"
                                onClick={() => {
                                    setDataUri('');
                                }}
                            >
                                <span>Retake </span>
                                <FontAwesomeIcon icon={faCamera} size="2x" />
                            </Button>
                        </div>
                    ) : (
                        <Camera
                            isImageMirror={false}
                            onTakePhoto={(dataUri) => setDataUri(dataUri)}
                            imageType={'jpg'}
                        />
                    )}
                    <Form>
                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={caption}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const value = target.value;
                                    setCaption(value);
                                }}
                            ></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        disabled={!!!dataUri || !!!caption}
                        onClick={() => {
                            dispatch(addHeaderPictureAsync(dataUri));
                            setShowNewJobHeaderPicture(false);
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowNewJobHeaderPicture(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showNewJobHeaderNote}
                onHide={() => setShowNewJobHeaderNote(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Enter a Note for this Job</Modal.Title>
                    <Modal.Body></Modal.Body>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                value={note}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const value = target.value;
                                    setNote(value);
                                }}
                            ></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            dispatch(addHeaderNoteAsync(note));
                            setShowNewJobHeaderNote(false);
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowNewJobHeaderNote(false)}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
