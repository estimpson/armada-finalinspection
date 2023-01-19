import {
    Accordion,
    Card,
    Col,
    Container,
    Row,
    Table,
} from '../../../bootstrap';
import { IInspectionImageData } from '../../../features/inspectionImageData/inspectionImageDataSlice';
import { IInspectionJob } from '../../../features/inspectionJob/inspectionJobSlice';
import { LotTable } from '../shared/LotTable';

export function PriorLots(props: {
    inspectionJob: IInspectionJob;
    inspectionImageData: IInspectionImageData[];
}) {
    return (
        <>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header
                        className={`${
                            !!props.inspectionJob.bulletins.length &&
                            'px-3 text-white bg-warning'
                        }`}
                    >
                        <span>
                            Prior Lots of Part{' '}
                            {props.inspectionJob.part.partCode}
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {props.inspectionJob.priorLots?.map((priorLot) => {
                            return (
                                <Card className="mb-1" key={priorLot.rowID}>
                                    <Card.Body>
                                        <div className="d-flex flex-row my-2">
                                            <div className="flex-grow-1 d-flex flex-column bg-light">
                                                <Container className="m-0 p-0">
                                                    <LotTable lot={priorLot} />
                                                </Container>
                                            </div>
                                        </div>
                                        {!!priorLot.notes?.length && (
                                            <Accordion>
                                                <Accordion.Item eventKey="0"></Accordion.Item>
                                                <Accordion.Header>
                                                    <span>Notes</span>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {priorLot.notes?.map(
                                                        (note) => {
                                                            return (
                                                                <Card
                                                                    className="mb-1"
                                                                    key={
                                                                        note.noteID
                                                                    }
                                                                >
                                                                    <Card.Body>
                                                                        <div className="d-flex flex-row my-2">
                                                                            <div className="flex-grow-1 d-flex flex-column bg-light">
                                                                                <div className="flex-grow-1 d-flex flex-row">
                                                                                    <span className="m-1 h6 flex-grow-1">
                                                                                        <pre>
                                                                                            {
                                                                                                note.note
                                                                                            }
                                                                                        </pre>
                                                                                    </span>
                                                                                </div>
                                                                                <div className="d-flex flex-row justify-content-end">
                                                                                    <small className="m-1 fst-italic">
                                                                                        {`by ${
                                                                                            note.createdByOperator
                                                                                        } on ${new Date(
                                                                                            note.createDT,
                                                                                        ).toLocaleString()}`}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>
                                                            );
                                                        },
                                                    )}
                                                </Accordion.Body>
                                            </Accordion>
                                        )}
                                        {!!priorLot.pictures?.length && (
                                            <Accordion>
                                                <Accordion.Item eventKey="0"></Accordion.Item>
                                                <Accordion.Header>
                                                    <span>Pictures</span>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {priorLot.pictures?.map(
                                                        (picture) => {
                                                            return (
                                                                <Card
                                                                    className="mb-1"
                                                                    key={
                                                                        picture.pictureID
                                                                    }
                                                                >
                                                                    <Card.Body>
                                                                        <div className="d-flex flex-row my-2">
                                                                            <div className="flex-grow-1 d-flex flex-column bg-light">
                                                                                {!!picture.pictureFileName && (
                                                                                    <img
                                                                                        className="w-100"
                                                                                        src={
                                                                                            props.inspectionImageData.find(
                                                                                                (
                                                                                                    i,
                                                                                                ) =>
                                                                                                    i.pictureFileGUID ===
                                                                                                    picture.pictureFileGUID,
                                                                                            )
                                                                                                ?.base64Image
                                                                                        }
                                                                                        alt="camera"
                                                                                    />
                                                                                )}
                                                                                <div className="flex-grow-1 d-flex flex-row">
                                                                                    <span className="m-1 h6 flex-grow-1">
                                                                                        <pre>
                                                                                            {
                                                                                                picture.note
                                                                                            }
                                                                                        </pre>
                                                                                    </span>
                                                                                </div>
                                                                                <div className="d-flex flex-row justify-content-end">
                                                                                    <small className="m-1 fst-italic">
                                                                                        {`by ${
                                                                                            picture.createdByOperator
                                                                                        } on ${new Date(
                                                                                            picture.createDT,
                                                                                        ).toLocaleString()}`}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Card.Body>
                                                                </Card>
                                                            );
                                                        },
                                                    )}
                                                </Accordion.Body>
                                            </Accordion>
                                        )}
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}
