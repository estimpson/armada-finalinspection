import {
    faCamera,
    faClone,
    faFileLines,
    faFilePen,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Button,
    Card,
    Container,
    FloatingLabel,
    Form,
} from '../../../bootstrap';
import { IInspectionImageData } from '../../../features/inspectionImageData/inspectionImageDataSlice';
import {
    IInspectionJob,
    IInspectionObjectCombine,
} from '../../../features/inspectionJob/inspectionJobSlice';

export function CombineBox(props: {
    inspectionJob: IInspectionJob;
    inspectionImageData: IInspectionImageData[];
    object: IInspectionObjectCombine;
    newImageHandler?: (serial: number) => void;
    copyImageHandler?: (serial: number, pictureID: number) => void;
    editImageHandler?: (serial: number, pictureID: number) => void;
    deleteImageHandler?: (serial: number, pictureID: number) => void;
    newNoteHandler?: (serial: number) => void;
    copyNoteHandler?: (args: { serial?: number; noteID: number }) => void;
    editNoteHandler?: (args: { serial?: number; noteID: number }) => void;
    deleteNoteHandler?: (args: { serial?: number; noteID: number }) => void;
}) {
    var isCurrent =
        props.object.fromSerial === props.inspectionJob.currentObjectSerial;

    return (
        <>
            <Card bg={isCurrent ? 'info' : ''}>
                <Card.Body>
                    <Card.Title>{`S${
                        props.object.fromSerial
                    }${' [Combined from Partial]'}`}</Card.Title>
                    <Form>
                        <FloatingLabel
                            controlId="floatingInput-quantityOriginal"
                            label="Quantity Original"
                            className="mb-3"
                        >
                            <Form.Control
                                readOnly
                                value={props.object.fromOriginalQuantity.toLocaleString()}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInput-quantityRemaining"
                            label="Quantity Remaining"
                            className="mb-3"
                        >
                            <Form.Control
                                readOnly
                                value={props.object.fromNewQuantity.toLocaleString()}
                            />
                        </FloatingLabel>
                    </Form>
                    {props.object.pictures && (
                        <Container fluid className="d-flex flex-column p-0">
                            {props.object.pictures.map((objectImage) => (
                                <div
                                    key={objectImage.pictureID}
                                    className="d-flex flex-row my-2"
                                >
                                    <div className="flex-grow-1">
                                        <img
                                            className="w-100"
                                            src={
                                                props.inspectionImageData.find(
                                                    (i) =>
                                                        i.pictureFileGUID ===
                                                        objectImage.pictureFileGUID,
                                                )?.base64Image
                                            }
                                            alt="camera"
                                            key={objectImage.pictureID}
                                        />
                                        <div className="bg-light d-flex flex-column">
                                            <span className="w-100 ms-1 fw-bold fs-5">
                                                <pre>{objectImage.note}</pre>
                                            </span>
                                            <div className="d-flex flex-row justify-content-end fst-italic">
                                                <span className="me-1 fs-6">
                                                    {`by ${
                                                        objectImage.createdByOperator
                                                    } on ${new Date(
                                                        objectImage.createDT,
                                                    ).toLocaleString()}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <Button
                                            className="m-1"
                                            onClick={() => {
                                                props.deleteImageHandler!(
                                                    props.object.fromSerial,
                                                    objectImage.pictureID,
                                                );
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                        {!!props.copyImageHandler && (
                                            <Button className="m-1">
                                                <FontAwesomeIcon
                                                    icon={faClone}
                                                />
                                            </Button>
                                        )}
                                        {!!props.editImageHandler && (
                                            <Button
                                                className="m-1"
                                                onClick={() => {
                                                    console.log('edit picture');
                                                    props.editImageHandler!(
                                                        props.object.fromSerial,
                                                        objectImage.pictureID,
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFilePen}
                                                />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Container>
                    )}
                    {props.object.notes && (
                        <Container fluid className="d-flex flex-column p-0">
                            {props.object.notes.map((objectNote) => (
                                <div
                                    key={objectNote.noteID}
                                    className="d-flex flex-row my-2"
                                >
                                    <div className="flex-grow-1 bg-light">
                                        <p
                                            className="w-100"
                                            key={objectNote.noteID}
                                        >
                                            <pre>{objectNote.note}</pre>
                                        </p>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <Button
                                            className="m-1"
                                            onClick={() => {
                                                props.deleteNoteHandler!({
                                                    serial: props.object
                                                        .fromSerial,
                                                    noteID: objectNote.noteID,
                                                });
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                        {!!props.copyNoteHandler && (
                                            <Button className="m-1">
                                                <FontAwesomeIcon
                                                    icon={faClone}
                                                />
                                            </Button>
                                        )}
                                        {!!props.editNoteHandler && (
                                            <Button className="m-1">
                                                <FontAwesomeIcon
                                                    icon={faFilePen}
                                                />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Container>
                    )}
                    <Container
                        fluid
                        className="d-flex flex-row justify-content-center"
                    >
                        {props.newImageHandler && (
                            <Button
                                className="mx-2"
                                onClick={() => {
                                    props.newImageHandler!(
                                        props.object.fromSerial,
                                    );
                                }}
                            >
                                <FontAwesomeIcon icon={faCamera} size="2x" />
                            </Button>
                        )}
                        {props.newNoteHandler && (
                            <Button
                                className="mx-2"
                                onClick={() => {
                                    props.newNoteHandler!(
                                        props.object.fromSerial,
                                    );
                                }}
                            >
                                <FontAwesomeIcon icon={faFileLines} size="2x" />
                            </Button>
                        )}
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}
