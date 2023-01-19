import { Card, Col, Row } from '../../../bootstrap';
import { IInspectionJob } from '../../../features/inspectionJob/inspectionJobSlice';

export function LotQuantitySummary(props: { inspectionJob: IInspectionJob }) {
    const allInventory = props.inspectionJob.objects.every(
        (o) =>
            o.inspectionStatus ===
            props.inspectionJob.objects[0].inspectionStatus,
    );
    const allStatus = props.inspectionJob.objects[0]?.inspectionStatus;
    const acceptedCount = props.inspectionJob.objects.filter(
        (o) => o.inspectionStatus === 'ACCEPTED',
    ).length;
    const sortCount = props.inspectionJob.objects.filter(
        (o) => o.inspectionStatus === 'SORT',
    ).length;
    const newCount = props.inspectionJob.objects.filter(
        (o) => o.inspectionStatus === 'NEW' || o.inspectionStatus === 'SCANNED',
    ).length;

    const allCombines = props.inspectionJob.objects.flatMap((o) => o.combines);

    return (
        <Card.Body className="px-0">
            <Card.Title>Lot Quantity Summary</Card.Title>
            <Row>
                <Col className="form-label">Total Quantity Produced</Col>
            </Row>
            <Row>
                <Col className="mb-1">{`${
                    props.inspectionJob.completeBoxes
                        ? `${
                              props.inspectionJob.completeBoxes
                          } @ ${props.inspectionJob.partPackaging!.standardPack.toLocaleString()}${
                              props.inspectionJob.partialBoxQuantity
                                  ? ' + '
                                  : ''
                          }`
                        : ''
                }${
                    props.inspectionJob.partialBoxQuantity
                        ? `${props.inspectionJob.partialBoxQuantity.toLocaleString()}`
                        : ''
                } = ${(
                    (props.inspectionJob.completeBoxes || 0) *
                        props.inspectionJob.partPackaging!.standardPack +
                    (props.inspectionJob.partialBoxQuantity || 0)
                ).toLocaleString()} pieces`}</Col>
            </Row>
            <Row>
                <Col className="form-label">Serial Range</Col>
            </Row>
            <Row>
                <Col className="mb-1">{`${
                    props.inspectionJob.objects[0]?.serial
                }${`${
                    props.inspectionJob.objects.length > 1
                        ? ` to ${
                              props.inspectionJob.objects[
                                  props.inspectionJob.objects.length - 1
                              ]?.serial
                          }`
                        : ''
                }`}`}</Col>
            </Row>
            {!!allCombines.length && (
                <>
                    <Row>
                        <Col className="form-label">Combined</Col>
                    </Row>
                    <Row>
                        <Col className="mb-1">
                            {`${allCombines
                                .reduce(
                                    (tot, c) =>
                                        tot +
                                        c.fromOriginalQuantity -
                                        c.fromNewQuantity,
                                    0,
                                )
                                .toLocaleString()} from ${
                                allCombines.length
                            } serial${
                                allCombines.length ? '' : 's'
                            } [${allCombines
                                .map(
                                    (c) =>
                                        `${c.fromSerial}${
                                            c.fromNewQuantity
                                                ? ' (qty. remaining: ' +
                                                  c.fromNewQuantity.toLocaleString() +
                                                  ')'
                                                : ''
                                        }`,
                                )
                                .join(', ')}]`}
                        </Col>
                    </Row>
                </>
            )}
            <Row>
                <Col className="form-label">Disposition</Col>
            </Row>
            <Row>
                <Col className="mb-1">{`${
                    allInventory
                        ? `All inventory ${
                              allStatus === 'ACCEPTED'
                                  ? 'approved'
                                  : allStatus === 'SORT'
                                  ? 'requires sort'
                                  : 'must be marked'
                          }`
                        : `${
                              !!acceptedCount ? `${acceptedCount} approved` : ''
                          }${
                              !!acceptedCount && (!!sortCount || !!newCount)
                                  ? ' | '
                                  : ''
                          }${!!sortCount ? `${sortCount} to sort` : ''}${
                              !!sortCount && !!newCount ? ' | ' : ''
                          }${!!newCount ? `${newCount} remaining ` : ''}`
                }`}</Col>
            </Row>
        </Card.Body>
    );
}
