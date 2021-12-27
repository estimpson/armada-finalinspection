import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    FloatingLabel,
} from '../bootstrap';
import {
    IIdentity,
    loginAsync,
    selectIdentity,
} from '../features/identity/identitySlice';
import {
    IInspectionJob,
    selectInspectionJob,
} from '../features/inspectionJob/inspectionJobSlice';
import { InspectionJob } from './inspection-job/InspectionJob';

export default function Home() {
    const dispatch = useAppDispatch();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    // dependent data
    const inspectionJob: IInspectionJob = useAppSelector(selectInspectionJob);

    const identity: IIdentity = useAppSelector(selectIdentity);

    return (
        <>
            <Container className="col-md-8 col-lg-6">
                <Row>
                    <InspectionJob inspectionJob={inspectionJob} />
                </Row>
                {identity?.userName ? (
                    <></>
                ) : (
                    <>
                        <h1>Please login</h1>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <FloatingLabel
                                        controlId="floatingInput-user"
                                        label="User"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            placeholder="user"
                                            onChange={(e) =>
                                                setUser(e.target.value)
                                            }
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel
                                        controlId="floatingInput-password"
                                        label="Password"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            type="password"
                                            placeholder="password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </FloatingLabel>
                                    <Form.Group>
                                        <Button
                                            onClick={() =>
                                                dispatch(
                                                    loginAsync({
                                                        user: user,
                                                        password: password,
                                                    }),
                                                )
                                            }
                                        >
                                            Submit
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
        </>
    );
}
