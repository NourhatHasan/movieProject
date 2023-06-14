import {  Grid, Segment } from "semantic-ui-react";
import { movieForm, Movies } from "../Models/Movies";
import { DashItems } from "./Items";
import { useEffect, useState } from 'react';
import Details from "./ItemDetails";
import agent from "../layout/api/agent";
import Loading from "../layout/loading";
import FormCE from "./formCE";


interface props {

    handledeleteSetForm: () => void
    handleSetForm: () => void
    addUpdateMovie: (movie: Movies) => void;
    deleteMovie: (id: number) => void;
    getSelectedMovie: (id: number) => void;
    loading: boolean;
    submiting: boolean;
    form: boolean;
    selectedMovie: Movies | undefined;
    movies: Movies[];

}
export function Dashboard({
    handledeleteSetForm,
    handleSetForm, addUpdateMovie, deleteMovie
    , getSelectedMovie, loading, submiting, form, selectedMovie, movies

}: props) {

   

    if (loading) return <Loading content={"movies loading"} />
    return (
        <Segment divided="true">
            <Grid>
                <Grid.Column width={12}>
                    <DashItems movies={movies}
                        getSelectedMovie={getSelectedMovie}
                        submiting={submiting}
                        deleteMovie={deleteMovie}


                    />
                </Grid.Column>
                <Grid.Column width={4}>
                <div>
                    <Details
                            submiting={submiting}
                            movie={selectedMovie}
                            handlesetForm={handleSetForm}
                        
                        />
                        {form &&
                            (

                           
                            <FormCE
                                handledeleteSetForm={handledeleteSetForm}
                                movie={selectedMovie}
                                addUpdateMovie={addUpdateMovie}
                            />
                              
                            )}
                       
                </div>
                </Grid.Column>
            </Grid>
           

         
          

        </Segment>
    )
}

