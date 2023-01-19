import { faClone, faFilePen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card } from '../../../bootstrap';
import {
    IInspectionHeaderNote,
    IInspectionObjectNote,
} from '../../../features/inspectionJob/inspectionJobSlice';

export function NoteCard(props: {
    note: IInspectionHeaderNote | IInspectionObjectNote;
    editNoteHandler?: (args: { serial?: number; noteID: number }) => void;
    copyNoteHandler?: (args: { serial?: number; noteID: number }) => void;
    deleteNoteHandler?: (args: { serial?: number; noteID: number }) => void;
}) {
    return (
        <>
            <Card className="mb-1">
                <Card.Body>
                    <div className="d-flex flex-row my-2">
                        <div className="flex-grow-1 d-flex flex-column bg-light">
                            <div className="flex-grow-1 d-flex flex-row">
                                <span className="m-1 h6 flex-grow-1">
                                    <pre>{props.note.note}</pre>
                                </span>
                            </div>
                            <div className="d-flex flex-row justify-content-end">
                                <small className="m-1 fst-italic">
                                    {`by ${
                                        props.note.createdByOperator
                                    } on ${new Date(
                                        props.note.createDT,
                                    ).toLocaleString()}`}
                                </small>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            {!!props.deleteNoteHandler && (
                                <Button
                                    className="m-1"
                                    onClick={() => {
                                        'serial' in props.note
                                            ? props.deleteNoteHandler!({
                                                  serial: props.note.serial,
                                                  noteID: props.note.noteID,
                                              })
                                            : props.deleteNoteHandler!({
                                                  noteID: props.note.noteID,
                                              });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            )}
                            {!!props.copyNoteHandler && (
                                <Button
                                    className="m-1"
                                    onClick={() => {
                                        'serial' in props.note
                                            ? props.copyNoteHandler!({
                                                  serial: props.note.serial,
                                                  noteID: props.note.noteID,
                                              })
                                            : props.copyNoteHandler!({
                                                  noteID: props.note.noteID,
                                              });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faClone} />
                                </Button>
                            )}
                            {!!props.editNoteHandler && (
                                <Button
                                    className="m-1"
                                    onClick={() => {
                                        'serial' in props.note
                                            ? props.editNoteHandler!({
                                                  serial: props.note.serial,
                                                  noteID: props.note.noteID,
                                              })
                                            : props.editNoteHandler!({
                                                  noteID: props.note.noteID,
                                              });
                                    }}
                                >
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
