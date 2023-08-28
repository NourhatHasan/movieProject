import {  Grid, Segment } from "semantic-ui-react";

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
        <Segment divided="true" style={{ marginTop: '5em' }}>
            <Grid>
                <Grid.Column width={16}>
                    <DashItems
                        movies={movieStore.movies}
                    />


                </Grid.Column>
              
            </Grid>
           

         
          

        </Segment>
    )
}
)
