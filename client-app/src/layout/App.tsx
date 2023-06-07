
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Container, Header } from 'semantic-ui-react';
import { Dashboard } from '../features/dashboard';
import Navbar from './Navbar';



function App() {

   

    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '5em' }}>
                <Dashboard  />

            </Container>
        </>
         
  );
}

export default App;
