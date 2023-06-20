

import './App.css';

import { Container } from 'semantic-ui-react';
import Navbar from './Navbar';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router';


function App() {

   
    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '5em' }}>

                <Outlet />

            </Container>
           
        </>
         
  );
}

export default observer(App);

