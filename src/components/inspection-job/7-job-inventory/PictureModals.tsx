import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Camera from 'react-html5-camera-photo';
import { Button, Form, Modal } from '../../../bootstrap';
import { ImagePreview } from '../../CameraScreen';

export function NewPictureModal(props: {
    title: string;
    showModal: boolean;
    showHideModalSetter: (value: React.SetStateAction<boolean>) => void;
    dataUri: string;
    setDataUri: (value: React.SetStateAction<string>) => void;
    caption: string;
    setCaption: (value: React.SetStateAction<string>) => void;
    saveImageHandler: () => void;
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
                {props.dataUri ? (
                    <div className="d-flex flex-column align-items-end">
                        <ImagePreview dataUri={props.dataUri} />
                        <Button
                            className="m-2"
                            onClick={() => {
                                props.setDataUri('');
                            }}
                        >
                            <span>Retake </span>
                            <FontAwesomeIcon icon={faCamera} size="2x" />
                        </Button>
                    </div>
                ) : (
                    <Camera
                        isImageMirror={false}
                        onTakePhoto={(dataUri) => props.setDataUri(dataUri)}
                        imageType={'jpg'}
                    />
                )}
                <Form>
                    <Form.Group>
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={props.caption}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                props.setCaption(value);
                            }}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    disabled={!!!props.dataUri || !!!props.caption}
                    onClick={() => props.saveImageHandler()}
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

export function EditPictureModal(props: {
    title: string;
    showModal: boolean;
    showHideModalSetter: (value: React.SetStateAction<boolean>) => void;
    dataUri: string;
    setDataUri: (value: React.SetStateAction<string>) => void;
    caption: string;
    setCaption: (value: React.SetStateAction<string>) => void;
    saveImageHandler: () => void;
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
                {props.dataUri ? (
                    <div className="d-flex flex-column align-items-end">
                        <ImagePreview dataUri={props.dataUri} />
                        <Button
                            className="m-2"
                            onClick={() => {
                                props.setDataUri('');
                            }}
                        >
                            <span>Retake </span>
                            <FontAwesomeIcon icon={faCamera} size="2x" />
                        </Button>
                    </div>
                ) : (
                    <Camera
                        isImageMirror={false}
                        onTakePhoto={(dataUri) => props.setDataUri(dataUri)}
                        imageType={'jpg'}
                    />
                )}
                <Form>
                    <Form.Group>
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={props.caption}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const target = event.target;
                                const value = target.value;
                                props.setCaption(value);
                            }}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    disabled={!!!props.dataUri || !!!props.caption}
                    onClick={() => props.saveImageHandler()}
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
