import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function App() {
    return (
        <>
            <ToastContainer position="bottom-right" toastClassName="custom-toast" />
            <Navbar />
            <Container style={{ marginTop: '5em' }}>
                <Outlet />
            </Container>
        </>
    );
}

export default observer(App);
