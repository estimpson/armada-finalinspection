import { faClone, faFilePen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '../../../bootstrap';
import { IInspectionImageData } from '../../../features/inspectionImageData/inspectionImageDataSlice';
import {
    IInspectionHeaderPicture,
    IInspectionObjectPicture,
} from '../../../features/inspectionJob/inspectionJobSlice';

export function ImageCard(props: {
    picture: IInspectionHeaderPicture | IInspectionObjectPicture;
    inspectionImageData: IInspectionImageData[];
    editImageHandler?: () => void;
    copyImageHandler?: () => void;
    deleteImageHandler?: (pictureFileName: string, pictureID: number) => void;
}) {
    return (
        <>
            <Card className="mb-1" key={props.picture.pictureID}>
                <Card.Body>
                    <div className="d-flex flex-row my-2">
                        <div className="flex-grow-1 d-flex flex-column bg-light">
                            {!!props.picture.pictureFileName && (
                                <img
                                    className="w-100"
                                    src={
                                        props.inspectionImageData.find(
                                            (i) =>
                                                i.pictureFileGUID ===
                                                props.picture.pictureFileGUID,
                                        )?.base64Image
                                    }
                                    alt="camera"
                                />
                            )}
                            <div className="flex-grow-1 d-flex flex-row">
                                <span className="m-1 h6 flex-grow-1">
                                    <pre>{props.picture.note}</pre>
                                </span>
                            </div>
                            <div className="d-flex flex-row justify-content-end">
                                <small className="m-1 fst-italic">
                                    {`by ${
                                        props.picture.createdByOperator
                                    } on ${new Date(
                                        props.picture.createDT,
                                    ).toLocaleString()}`}
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            {!!props.deleteImageHandler && (
                                <Button
                                    className="m-1"
                                    onClick={() => {
                                        props.deleteImageHandler!(
                                            props.picture.pictureFileName,
                                            props.picture.pictureID,
                                        );
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            )}
                            {!!props.copyImageHandler && (
                                <Button className="m-1">
                                    <FontAwesomeIcon icon={faClone} />
                                </Button>
                            )}
                            {!!props.editImageHandler && (
                                <Button className="m-1">
                                    <FontAwesomeIcon icon={faFilePen} />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}
