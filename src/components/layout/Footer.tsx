import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectApiDetails } from '../../features/localApi/localApiSlice';

console.log(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);

export function Footer() {
    const apiDetails = useSelector(selectApiDetails);
    return (
        <Container fluid as="footer" className={'footer mt-auto px-0'}>
            <Container
                fluid
                className={
                    (!!apiDetails.port
                        ? 'bg-light text-muted '
                        : 'text-white bg-danger ') +
                    'px-5 pt-2 pb-1 d-flex justify-content-between fs-6'
                }
            >
                <p className="m-0">
                    © {new Date().getFullYear()} Fore-Thought, LLC
                </p>
                <p className="m-0">
                    <a href="/" className="text-decoration-none text-reset">
                        Fx Final Inspection v{process.env.REACT_APP_VERSION} (
                        {!!apiDetails.port ? 'Ready' : 'Awaiting API'})
                    </a>
                </p>
            </Container>
        </Container>
    );
}
