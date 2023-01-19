import { Card, Col, Container, Row } from '../../../bootstrap';
import { IInspectionJob } from '../../../features/inspectionJob/inspectionJobSlice';

export function BeginJobSummary(props: { inspectionJob: IInspectionJob }) {
    return (
        <Card.Body className="px-0">
            <Card.Title>Lot In Progress</Card.Title>
            <Container className="m-0 p-0">
                <Row>
                    <Col className="form-label">Part Number</Col>
                </Row>
                <Row>
                    <Col className="mb-1">
                        {props.inspectionJob.part!.partCode}
                    </Col>
                </Row>
                <Row>
                    <Col className="form-label">Package Type</Col>
                </Row>
                <Row>
                    <Col className="mb-1">
                        {props.inspectionJob.partPackaging!.packageCode}
                    </Col>
                </Row>
                <Row>
                    <Col className="form-label">Weighed</Col>
                </Row>
                <Row>
                    <Col
                        className={`mb-1 ${
                            !props.inspectionJob.pieceWeightValid &&
                            'px-3 text-white bg-warning'
                        }`}
                    >
                        {props.inspectionJob.pieceWeightQuantity} @
                        {props.inspectionJob.pieceWeight?.toPrecision(3)}
                        {!props.inspectionJob.pieceWeightValid
                            ? ` !! ${props.inspectionJob.pieceWeightDiscrepancyNote} !!`
                            : ''}
                    </Col>
                </Row>
                <Row>
                    <Col className="form-label">Deflashed</Col>
                </Row>
                <Row>
                    <Col className="mb-1">{`By ${props.inspectionJob.deflashOperator} @ ${props.inspectionJob.deflashMachineCode}`}</Col>
                </Row>
                {props.inspectionJob.partPackaging!.specialInstructions && (
                    <>
                        <Row>
                            <Col className="form-label">
                                Special Instructions
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-1 px-3 text-white bg-warning">
                                {
                                    props.inspectionJob.partPackaging!
                                        .specialInstructions
                                }
                            </Col>
                        </Row>
                    </>
                )}
                <Row>
                    <Col className="form-label">Packing Operator</Col>
                </Row>
                <Row>
                    <Col className="mb-1">
                        {props.inspectionJob.packingOperator}
                    </Col>
                </Row>
            </Container>
        </Card.Body>
    );
}
