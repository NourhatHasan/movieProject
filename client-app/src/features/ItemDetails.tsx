import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";



export default observer(function Details() {
    const { movieStore: { selectedMovie: movie, handleSetForm } } = useStore();


    if (!movie) {
        return null;
    }

    return (

        <Card>
            <Card.Content>
                <Card.Header>{movie.movieName}</Card.Header>
                <Card.Description>{movie.description}</Card.Description>
            </Card.Content>
            <Card.Content>
                <Grid columns={2}>
                    <Grid.Column>
                        <Icon name='dollar sign' />
                        <span>{movie.price}</span>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='film' />
                        <span>{movie.mengde}</span>
                    </Grid.Column>
                </Grid>
            </Card.Content>

            <Button
                name={movie.id}
                onClick={()=>handleSetForm(movie.id)}

                positive
                icon='edit'
           


            />

        </Card>
    )
})