import { useRef } from 'react';
import Split from 'react-split';
import { useAppSelector } from '../app/hooks';
import { Col, Container, Row } from '../bootstrap';
import { selectIdentity } from '../features/identity/identitySlice';
import { selectInspectionJob } from '../features/inspectionJob/inspectionJobSlice';
import { InspectionJob } from './inspection-job/InspectionJob';
import { InspectionJobSummary } from './inspection-job/InspectionJobSummary';
import Login from './Login';

export default function Home() {
    // dependent data
    const inspectionJob = useAppSelector(selectInspectionJob);

    const identity = useAppSelector(selectIdentity);

    const scrollPanel = useRef<HTMLDivElement>(null);

    return (
        <>
            {identity?.userName ? (
                <Split
                    className="d-flex"
                    direction="horizontal"
                    sizes={[25, 75]}
                    minSize={100}
                    expandToMin={false}
                    gutterSize={10}
                    gutterAlign="center"
                    snapOffset={30}
                    dragInterval={1}
                    style={{ height: '100%', overflow: 'hidden' }}
                >
                    <Container
                        fluid
                        className="d-flex flex-column p-0"
                        style={{ overflow: 'hidden' }}
                    >
                        <Container
                            fluid
                            className="p-0"
                            style={{ overflow: 'auto', overflowX: 'hidden' }}
                        >
                            <InspectionJobSummary
                                inspectionJob={inspectionJob}
                            />
                        </Container>
                    </Container>
                    <Container
                        className="col-md-8 col-lg-6"
                        style={{ overflow: 'auto' }}
                        ref={scrollPanel}
                    >
                        <Row>
                            <Col sm="8"></Col>
                        </Row>
                        <InspectionJob
                            inspectionJob={inspectionJob}
                            scrollPanel={scrollPanel.current}
                        />
                    </Container>
                </Split>
            ) : (
                <Container className="col-md-6 col-lg-4">
                    <Login />
                </Container>
            )}
        </>
    );
}
