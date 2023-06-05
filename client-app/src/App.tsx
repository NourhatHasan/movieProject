
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';



function App() {

    const [movie, setMovie] = useState([]);
    useEffect(() => {
        axios.get('https://localhost:7155/api/Movie')
            .then(Response => {
                console.log(Response.data)
                setMovie(Response.data)
            })
    }, [])

    return (

        <>
            <Header as='h2' style={{
                marginTop: '2em' }}
                icon='film' content='Movies' />
            <div style={{ margin: '2em' }}>
                <List>
                    {movie.map((mo: any) => (
                        <List.Item key={mo.id}>{mo.movieName} </List.Item>

                    ))}

                </List>
            </div>
        </>
  );
}

export default App;
