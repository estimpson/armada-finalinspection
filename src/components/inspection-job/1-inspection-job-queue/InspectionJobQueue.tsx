import { Card, Col, Row } from '../../../bootstrap';
import { IInspectionJob } from '../../../features/inspectionJob/inspectionJobSlice';
import { IPackingJob } from '../../../features/packingJobList/packingJobListSlice';

export function InspectionJobQueue(props: {
    packingJobList: IPackingJob[];
    inspectionJob?: IInspectionJob;
}) {
    const activeJob = !!props.inspectionJob;
    return (
        <Card.Body className="px-0">
            <Card.Title>Inspection Lot Queue</Card.Title>
            <Row>
                <Col className="form-label">Queue Length</Col>
            </Row>
            <Row>
                <Col className="mb-1">
                    {props.packingJobList.filter((pj) => pj.packingJobNumber)
                        .length - (activeJob ? 1 : 0)}{' '}
                    Lot
                    {!!(
                        props.packingJobList.filter((pj) => pj.packingJobNumber)
                            .length -
                            (activeJob ? 1 : 0) !==
                        1
                    ) && 's'}{' '}
                    Remaining
                </Col>
            </Row>
        </Card.Body>
    );
}
