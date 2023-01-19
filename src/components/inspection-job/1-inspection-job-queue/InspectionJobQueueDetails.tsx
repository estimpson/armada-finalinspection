import { faBoxOpen, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch } from '../../../app/hooks';
import { Button, Card, Container } from '../../../bootstrap';
import { openInspectionJobAsync } from '../../../features/inspectionJob/inspectionJobSlice';
import {
    getPackingJobsList,
    IPackingJob,
} from '../../../features/packingJobList/packingJobListSlice';
import { LotTable } from '../shared/LotTable';

export function InspectionJobQueueDetails(props: {
    packingJobList: IPackingJob[];
}) {
    const dispatch = useAppDispatch();

    const refreshPackingJobList = async () => {
        dispatch(getPackingJobsList({}));
    };

    const openInspectionJob = async (packingJobNumber: string) => {
        dispatch(openInspectionJobAsync(packingJobNumber));
    };

    return (
        <>
            <Card.Body className="px-0">
                <Card.Title>
                    <Container
                        fluid
                        className="d-flex flex-row justify-content-between"
                    >
                        Inspection Lot Queue Details
                        <Button
                            className="mx-2"
                            onClick={() => refreshPackingJobList()}
                        >
                            Refresh Job Queue{' '}
                            <FontAwesomeIcon icon={faRefresh} size="1x" />
                        </Button>
                    </Container>
                </Card.Title>

                {props.packingJobList
                    ?.filter((packingJob) => packingJob.part)
                    .map((packingJob) => {
                        return (
                            <Card className="mb-1" key={packingJob.rowID}>
                                <Card.Body>
                                    <div className="d-flex flex-row my-2">
                                        <div className="flex-grow-1 d-flex flex-column bg-light">
                                            <Container className="m-0 p-0">
                                                <LotTable lot={packingJob} />
                                            </Container>
                                        </div>
                                    </div>
                                    <Container
                                        fluid
                                        className="d-flex flex-row justify-content-start"
                                    >
                                        <Button
                                            className="mx-2"
                                            onClick={() =>
                                                openInspectionJob(
                                                    packingJob.packingJobNumber,
                                                )
                                            }
                                        >
                                            Inspect This Lot{' '}
                                            <FontAwesomeIcon
                                                icon={faBoxOpen}
                                                size="1x"
                                            />
                                        </Button>
                                    </Container>
                                </Card.Body>
                            </Card>
                        );
                    })}
            </Card.Body>
        </>
    );
}
