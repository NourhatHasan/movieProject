import {  Grid, Segment } from "semantic-ui-react";


import Details from "./ItemDetails";

import FormCE from "./formCE";
import { DashItems } from "./Items";
import { useEffect } from "react";
import { useStore } from "../layout/Stores/Store";
import { observer } from "mobx-react-lite";
import Loading from "../layout/loading";


export const Dashboard = observer(function  Dashboard( ) {

    const { movieStore } = useStore();
   
    useEffect(() => {

        movieStore.loadMovies();

    }, [movieStore])


    if (movieStore.initLoading) return <Loading content={"movies loading"} />
    return (
        <Segment divided="true">
            <Grid>
                <Grid.Column width={12}>
                    <DashItems
                        movies={movieStore.movies}
                    />


                </Grid.Column>
                <Grid.Column width={4}>
                    <div>
                       
                        <Details
                           
                           // handleSetForm={() => handleSetForm(movieStore.selectedMovie?.id!)}

                            />
                        
                        {movieStore.form &&
                            (

                           
                            <FormCE
                             //   handledeleteSetForm={handledeleteSetForm}
                             
                             // addUpdateMovie={addUpdateMovie}
                              
                            />
                              
                            )}
                       
                </div>
                </Grid.Column>
            </Grid>
           

         
          

        </Segment>
    )
}
)
