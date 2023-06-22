import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../features/Home';
import { useStore } from './Stores/Store';
import { useEffect } from 'react';
import Loading from './loading';
import ModalCOntainer from '../features/Modals/ModalCOntainer';

function App() {
    const location = useLocation();
    const { tokenStore, userStore } = useStore();

    useEffect(() => {
        if (tokenStore.token) {
            userStore.getCurrentUser().finally(() => tokenStore.setApploaded());
        }
        else {
            tokenStore.setApploaded();
        }
    }, [tokenStore, userStore])

    if (!tokenStore.apploaded) return <Loading content={"app loading...."} />
    return (
        <>
            <ModalCOntainer />
            <ToastContainer position="bottom-right" toastClassName="custom-toast" />
            {location.pathname === '/' ? <Home /> : (
                <>
                    <Navbar />
                    <Container >
                        <Outlet />
                    </Container>
                </>
            )}
           
        </>
    );
}

export default observer(App);
