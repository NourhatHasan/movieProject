

import './App.css';

import { Container } from 'semantic-ui-react';
import { Dashboard } from '../features/dashboard';
import Navbar from './Navbar';
import Footer from './footer';



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
