

import './App.css';

import { Container } from 'semantic-ui-react';
import { Dashboard } from '../features/dashboard';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { Movies } from '../Models/Movies';
import agent from './api/agent';




function App() {

    const [movies, setMovies] = useState<Movies[]>([]);
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);

    const [selectedMovie, setSelectedMovie] = useState<Movies>();
    const [form, setForm] = useState(false);

    useEffect(() => {
        agent.movies.list().then(response => {
            setMovies(response);
            setLoading(false)
        })

    }, [])

    const getSelectedMovie = async (id: number) => {

        setSubmiting(true);
        try {
            agent.movies.details(id).then(Response => {
                setSelectedMovie(Response);
                setSubmiting(false);
            })
        }
        catch (error) {

            console.error('Error occurred while deleting the movie:', error);
        }

    }

    const deleteMovie = async (id: number) => {

        setSubmiting(true);


        try {

            await agent.movies.del(id).then(() => {

                setMovies([...movies.filter(x => x.id !== id)]);
                if (selectedMovie && selectedMovie!.id === id) {
                    setSelectedMovie(undefined)
                }
                setSubmiting(false);
            })
        }
        catch (error) {

            console.error('Error occurred while deleting the movie:', error);
        }

    }


    const addUpdateMovie = async (themovie: Movies) => {




        try {
            if (themovie.id) {
                await agent.movies.update(themovie, themovie.id);
                setMovies((prevMovies) => {
                    return prevMovies.map((movie) =>
                        movie.id === themovie.id ? themovie : movie
                    );
                });
                setSelectedMovie(themovie);
                setForm(false);
            }
            else {

                await agent.movies.create(themovie);
                setMovies((prevMovies) => [...prevMovies, themovie]);
                setSelectedMovie(themovie);
            }



        }


        catch (error) {

            console.error('Error occurred while deleting the movie:', error);
        }

    }


    const handleSetForm = () => {
        setForm(true);
    }
    const handledeleteSetForm = () => {
        setForm(false);
    }

    return (
        <>
            <Navbar />
            <Container style={{ marginTop: '5em' }}>
                <Dashboard
                    handledeleteSetForm={handledeleteSetForm}
                    handleSetForm={handleSetForm}
                    addUpdateMovie={addUpdateMovie}
                    deleteMovie={deleteMovie}
                    getSelectedMovie={getSelectedMovie}
                    loading={loading}
                    submiting={submiting}
                    form={form}
                    movies={movies}
                    selectedMovie={selectedMovie}

                />

            </Container>
           
        </>
         
  );
}

export default App;


