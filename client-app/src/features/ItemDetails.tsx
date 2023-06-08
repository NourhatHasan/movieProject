import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { Movies } from "../Models/Movies";

interface props {
    submiting: boolean;
    movie: Movies | undefined;
  
}

export default function Details({ submiting, movie}: props) {


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
            <Button.Group widths={2} >
                <Button basic
                    name={movie.id}
                    onClick={e => movie}
                    //  loading={target === photo.id && mainLoading}
                    color='green'
                    icon='info circle'
                    //disabled={photo.isMain || deleteLoading}
                    fluid />
                <Button
                    basic
                    name={movie.id}
                   // onClick={() => deleteMovie(movie.id)}
                    color="red"
                    icon="trash"
                    fluid
                />
            </Button.Group>
        </Card>
    )
}