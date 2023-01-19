import {
    faCamera,
    faClone,
    faFileLines,
    faFilePen,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch } from '../../../app/hooks';
import { Accordion, Button, Card, Form } from '../../../bootstrap';
import { IInspectionImageData } from '../../../features/inspectionImageData/inspectionImageDataSlice';
import {
    finalizeInspectionJobAsync,
    IInspectionJob,
    newJob,
    setHeaderStatusAsync,
} from '../../../features/inspectionJob/inspectionJobSlice';
import { ImageCard } from '../shared/ImageCard';
import { NoteCard } from '../shared/NoteCard';

export function JobHeader(props: {
    inspectionJob: IInspectionJob;
    inspectionImageData: IInspectionImageData[];
    newHeaderPictureHandler?: () => void;
    editHeaderImageHandler?: () => void;
    copyHeaderImageHandler?: () => void;
    deleteHeaderImageHandler?: (
        pictureFileName: string,
        pictureID: number,
    ) => void;
    newHeaderNoteHandler?: () => void;
    editHeaderNoteHandler?: (args: { noteID: number }) => void;
    copyHeaderNoteHandler?: (args: { noteID: number }) => void;
    deleteHeaderNoteHandler?: (args: { noteID: number }) => void;
}) {
    const dispatch = useAppDispatch();

    return (
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <span>
                            Lot of Serial{' '}
                            {props.inspectionJob.objects[0]?.serial} Notes {'&'}{' '}
                            Pictures / Status
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {props.inspectionJob.pictures?.map((picture) => {
                            return (
                                <ImageCard
                                    picture={picture}
                                    inspectionImageData={
                                        props.inspectionImageData
                                    }
                                    editImageHandler={
                                        props.editHeaderImageHandler
                                    }
                                    copyImageHandler={
                                        props.copyHeaderImageHandler
                                    }
                                    deleteImageHandler={
                                        props.deleteHeaderImageHandler
                                    }
                                />
                            );
                        })}
                        {props.inspectionJob.notes?.map((note) => {
                            return (
                                <NoteCard
                                    note={note}
                                    key={note.noteID}
                                    editNoteHandler={
                                        props.editHeaderNoteHandler
                                    }
                                    copyNoteHandler={
                                        props.copyHeaderNoteHandler
                                    }
                                    deleteNoteHandler={
                                        props.deleteHeaderNoteHandler
                                    }
                                />
                            );
                        })}
                        <div className="d-flex flex-row justify-content-center">
                            {props.newHeaderPictureHandler && (
                                <Button
                                    className="mx-2"
                                    onClick={() => {
                                        props.newHeaderPictureHandler!();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        size="2x"
                                    />
                                </Button>
                            )}
                            {props.newHeaderNoteHandler && (
                                <Button
                                    className="mx-2"
                                    onClick={() => {
                                        props.newHeaderNoteHandler!();
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faFileLines}
                                        size="2x"
                                    />
                                </Button>
                            )}
                        </div>
                        <Form>
                            <Form.Check
                                inline
                                className="mb-3"
                                type="checkbox"
                                checked={props.inspectionJob.objects.every(
                                    (o) => o.inspectionStatus === 'ACCEPTED',
                                )}
                                label="Approve Lot"
                                name="groupStatus"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const checked = target.checked;
                                    console.log(
                                        `rework status: ${
                                            checked ? 'ACCEPTED' : 'NEW'
                                        }`,
                                    );
                                    dispatch(
                                        setHeaderStatusAsync(
                                            checked ? 'ACCEPTED' : 'NEW',
                                        ),
                                    );
                                }}
                            />
                            <Form.Check
                                inline
                                className="mb-3"
                                type="checkbox"
                                checked={props.inspectionJob.objects.every(
                                    (o) => o.inspectionStatus === 'SORT',
                                )}
                                label="Lot Requires Sort"
                                name="groupStatus"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const target = event.target;
                                    const checked = target.checked;
                                    console.log(
                                        `rework status: ${
                                            checked ? 'SORT' : 'NEW'
                                        }`,
                                    );
                                    dispatch(
                                        setHeaderStatusAsync(
                                            checked ? 'SORT' : 'NEW',
                                        ),
                                    );
                                }}
                            />
                        </Form>

                        <div className="d-flex flex-row justify-content-center mb-2">
                            {props.inspectionJob.inspectionStatus ===
                                'SCANNING COMPLETE' && (
                                <Button
                                    className="mx-2"
                                    onClick={() =>
                                        dispatch(finalizeInspectionJobAsync())
                                    }
                                >
                                    Finalize Inspection
                                </Button>
                            )}
                            <Button
                                className="mx-2"
                                onClick={() => dispatch(newJob())}
                            >
                                Close Inspection w/o Finalizing to Resume Later
                            </Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}
