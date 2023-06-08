import {  Grid, Segment } from "semantic-ui-react";
import { Movies } from "../Models/Movies";
import { DashItems } from "./Items";
import { useEffect, useState } from 'react';
import Details from "./ItemDetails";
import agent from "../layout/api/agent";
import Loading from "../layout/loading";

export function Dashboard() {

    const [movie, setMovie] = useState<Movies[]>([]);
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movies>();
    useEffect(() => {
        agent.movies.list().then(response => {
            setMovie(response);
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
            setMovie([...movie.filter(x => x.id !== id)]);
            if (selectedMovie && selectedMovie!.id === id) {
                setSelectedMovie(undefined)
            }
            await agent.movies.del(id).then(() => {
               
             
              setSubmiting(false);
            })
        }
        catch (error) {

            console.error('Error occurred while deleting the movie:', error);
        }
    
    }

    if (loading) return <Loading content={"movies loading"} />
    return (
        <Segment divided="true">
            <Grid>
                <Grid.Column width={13}>
                    <DashItems movies={movie}
                        getSelectedMovie={getSelectedMovie}
                        submiting={submiting}
                        deleteMovie={deleteMovie}
                      
                    />
                </Grid.Column>
                <Grid.Column width={3}>
                    <Details
                        submiting={submiting}
                        movie={selectedMovie}

                        
                    />
                </Grid.Column>
            </Grid>
           

         
          

        </Segment>
    )
}

