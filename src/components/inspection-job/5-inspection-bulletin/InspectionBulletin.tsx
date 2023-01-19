import {
    faCamera,
    faClone,
    faFileLines,
    faFilePen,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Button, Card } from '../../../bootstrap';
import { IInspectionImageData } from '../../../features/inspectionImageData/inspectionImageDataSlice';
import { IInspectionJob } from '../../../features/inspectionJob/inspectionJobSlice';

export function InspectionBulletin(props: {
    inspectionJob: IInspectionJob;
    inspectionImageData: IInspectionImageData[];
    newBulletinPictureHandler?: () => void;
    editBulletinPictureHandler?: () => void;
    deleteBulletinImageHandler?: (
        pictureFileName: string | undefined,
        bulletinID: number,
    ) => void;
    newBulletinNoteHandler?: () => void;
    editBulletinNoteHandler?: () => void;
    deleteBulletinNoteHandler?: (noteID: number) => void;
}) {
    return (
        <>
            <Accordion
                defaultActiveKey={
                    !!props.inspectionJob.bulletins.length ? '0' : undefined
                }
            >
                <Accordion.Item eventKey="0">
                    <Accordion.Header
                        className={`${
                            !!props.inspectionJob.bulletins.length &&
                            'px-3 text-white bg-warning'
                        }`}
                    >
                        <span>
                            Bulletin for Part{' '}
                            {props.inspectionJob.part.partCode}
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {props.inspectionJob.bulletins?.map((bulletin) => {
                            return (
                                <Card
                                    className="mb-1"
                                    key={bulletin.bulletinID}
                                >
                                    <Card.Body>
                                        <div className="d-flex flex-row my-2">
                                            <div className="flex-grow-1 d-flex flex-column bg-light">
                                                {!!bulletin.pictureFileName && (
                                                    <img
                                                        className="w-100"
                                                        src={
                                                            props.inspectionImageData.find(
                                                                (i) =>
                                                                    i.pictureFileGUID ===
                                                                    bulletin.pictureFileGUID,
                                                            )?.base64Image
                                                        }
                                                        alt="camera"
                                                    />
                                                )}
                                                <div className="flex-grow-1 d-flex flex-row">
                                                    <span className="m-1 h6 flex-grow-1">
                                                        <pre>
                                                            {bulletin.note}
                                                        </pre>
                                                    </span>
                                                </div>
                                                <div className="d-flex flex-row justify-content-end">
                                                    <small className="m-1 fst-italic">
                                                        {`by ${
                                                            bulletin.createdByOperator
                                                        } on ${new Date(
                                                            bulletin.createDT,
                                                        ).toLocaleString()}`}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column">
                                                <Button
                                                    className="m-1"
                                                    onClick={() => {
                                                        if (
                                                            !!bulletin.pictureFileName
                                                        ) {
                                                            props.deleteBulletinImageHandler!(
                                                                bulletin.pictureFileName,
                                                                bulletin.bulletinID,
                                                            );
                                                        } else {
                                                            props.deleteBulletinNoteHandler!(
                                                                bulletin.bulletinID,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </Button>
                                                {!!props.editBulletinPictureHandler && (
                                                    <Button className="m-1">
                                                        <FontAwesomeIcon
                                                            icon={faFilePen}
                                                        />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                        <div className="d-flex flex-row justify-content-center">
                            {props.newBulletinPictureHandler && (
                                <Button
                                    className="mx-2"
                                    onClick={() => {
                                        props.newBulletinPictureHandler!();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        size="2x"
                                    />
                                </Button>
                            )}
                            {props.newBulletinNoteHandler && (
                                <Button
                                    className="mx-2"
                                    onClick={() => {
                                        props.newBulletinNoteHandler!();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faFileLines}
                                        size="2x"
                                    />
                                </Button>
                            )}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}
