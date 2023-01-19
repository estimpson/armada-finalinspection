import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import {
    Accordion,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Row,
} from '../../../bootstrap';
import { IInspectionImageData } from '../../../features/inspectionImageData/inspectionImageDataSlice';
import {
    addObjectNoteAsync,
    addObjectPictureAsync,
    IInspectionJob,
    removeObjectNoteAsync,
    removeObjectPictureAsync,
    setObjectStatusAsync,
} from '../../../features/inspectionJob/inspectionJobSlice';
import { CombineBox } from './CombineBox';
import { InventoryBox } from './InventoryBox';
import { EditPictureModal, NewPictureModal } from './PictureModals';

export function JobInventory(props: {
    inspectionJob: IInspectionJob;
    inspectionImageData: IInspectionImageData[];
}) {
    const dispatch = useAppDispatch();
    const [newPictureSerial, setNewPictureSerial] = useState(0);
    const [showNewPicture, setShowNewPicture] = useState(false);
    const [showEditPicture, setShowEditPicture] = useState(false);
    const [showNewNote, setShowNewNote] = useState(false);
    const [dataUri, setDataUri] = useState('');
    const [note, setNote] = useState('');
    const [caption, setCaption] = useState('');

    function newImageHandler(serial: number): void {
        setNewPictureSerial(serial);
        setDataUri('');
        setCaption('');
        setShowNewPicture(true);
    }

    function newNoteHandler(serial: number): void {
        setNewPictureSerial(serial);
        setNote('');
        setShowNewNote(true);
    }

    const saveImageHandler = () => {
        dispatch(
            addObjectPictureAsync({
                serial: newPictureSerial,
                picture: dataUri,
                note: caption,
            }),
        );
        setShowNewPicture(false);
    };

    const deleteImageHandler = (serial: number, pictureID: number) => {
        dispatch(
            removeObjectPictureAsync({ serial: serial, pictureID: pictureID }),
        );
    };

    const saveNoteHandler = () => {
        dispatch(addObjectNoteAsync({ serial: newPictureSerial, note: note }));
        setShowNewNote(false);
    };

    const deleteObjectNoteHandler = (args: {
        serial?: number | undefined;
        noteID: number;
    }) => {
        dispatch(
            removeObjectNoteAsync({
                serial: args.serial!,
                noteID: args.noteID,
            }),
        );
    };

    const setObjectStatusHandler = (
        serial: number,
        status: 'ACCEPTED' | 'SORT' | 'NEW',
    ) => {
        dispatch(setObjectStatusAsync({ serial: serial, status: status }));
    };

    const currentSerialCard = useRef<HTMLDivElement>(null);

    useEffect(() => {
        currentSerialCard.current?.scrollIntoView();
    }, [currentSerialCard, props.inspectionJob.currentObjectSerial]);

    return (
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span>Inventory</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row xs={1} className="g-4">
                            {props.inspectionJob.objects!.map((object) => {
                                return (
                                    <Col
                                        key={object.serial}
                                        ref={
                                            object.serial ===
                                            props.inspectionJob
                                                .currentObjectSerial
                                                ? currentSerialCard
                                                : null
                                        }
                                    >
                                        <InventoryBox
                                            inspectionJob={props.inspectionJob}
                                            inspectionImageData={
                                                props.inspectionImageData
                                            }
                                            object={object}
                                            setObjectStatusHandler={
                                                setObjectStatusHandler
                                            }
                                            newImageHandler={newImageHandler}
                                            // editImageHandler={(
                                            //     serial: number,
                                            //     pictureID: number,
                                            // ) => {
                                            //     setNewPictureSerial(serial);
                                            //     setDataUri(
                                            //         props.inspectionImageData.find(
                                            //             (i) =>
                                            //                 i.pictureFileGUID ===
                                            //                 object.pictures.find(
                                            //                     (p) =>
                                            //                         p.pictureID ===
                                            //                         pictureID,
                                            //                 )?.pictureFileGUID,
                                            //         )?.base64Image || '',
                                            //     );
                                            //     setCaption(
                                            //         object.pictures.find(
                                            //             (p) =>
                                            //                 p.pictureID ===
                                            //                 pictureID,
                                            //         )?.note || '',
                                            //     );
                                            //     setShowEditPicture(true);
                                            // }}
                                            newNoteHandler={newNoteHandler}
                                            deleteImageHandler={
                                                deleteImageHandler
                                            }
                                            deleteNoteHandler={
                                                deleteObjectNoteHandler
                                            }
                                        />
                                    </Col>
                                );
                            })}
                            {props.inspectionJob
                                .objects!.flatMap((object) => object.combines)
                                .filter(
                                    (combine) => combine.fromNewQuantity > 0,
                                )
                                .map((combine) => (
                                    <Col
                                        key={combine.fromSerial}
                                        ref={
                                            combine.fromSerial ===
                                            props.inspectionJob
                                                .currentObjectSerial
                                                ? currentSerialCard
                                                : null
                                        }
                                    >
                                        <CombineBox
                                            inspectionJob={props.inspectionJob}
                                            inspectionImageData={
                                                props.inspectionImageData
                                            }
                                            object={combine}
                                            newImageHandler={newImageHandler}
                                            newNoteHandler={newNoteHandler}
                                            deleteImageHandler={
                                                deleteImageHandler
                                            }
                                            deleteNoteHandler={
                                                deleteObjectNoteHandler
                                            }
                                        />
                                    </Col>
                                ))}
                        </Row>
                        {!!props.inspectionJob.partPackaging
                            .specialInstructions && (
                            <Form.Group as={Row} className="my-3">
                                <Form.Label column sm="3" className="mb-3">
                                    Special Instructions
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        className="px-3 text-white bg-warning"
                                        plaintext
                                        readOnly
                                        value={
                                            props.inspectionJob.partPackaging
                                                .specialInstructions
                                        }
                                    />
                                </Col>
                            </Form.Group>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <NewPictureModal
                title={`Take a Picture of Serial ${newPictureSerial}`}
                showModal={showNewPicture}
                showHideModalSetter={setShowNewPicture}
                dataUri={dataUri}
                setDataUri={setDataUri}
                caption={caption}
                setCaption={setCaption}
                saveImageHandler={saveImageHandler}
            />

            <EditPictureModal
                title={`Retake a Picture of Serial ${newPictureSerial}`}
                showModal={showEditPicture}
                showHideModalSetter={setShowNewPicture}
                dataUri={dataUri}
                setDataUri={setDataUri}
                caption={caption}
                setCaption={setCaption}
                saveImageHandler={saveImageHandler}
            />

            <NewNoteModal
                title={`Enter a Note for Serial ${newPictureSerial}`}
                showModal={showNewNote}
                showHideModalSetter={setShowNewNote}
                note={note}
                setNote={setNote}
                saveNoteHandler={saveNoteHandler}
            />
        </>
    );
}

function NewNoteModal(props: {
    title: string;
    showModal: boolean;
    showHideModalSetter: (value: React.SetStateAction<boolean>) => void;
    note: string;
    setNote: (value: React.SetStateAction<string>) => void;
    saveNoteHandler: () => void;
}) {
    return (
        <Modal
            show={props.showModal}
            onHide={() => props.showHideModalSetter(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
                <Modal.Body></Modal.Body>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={props.note}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                props.setNote(value);
                            }}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => props.saveNoteHandler()}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => props.showHideModalSetter(false)}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
