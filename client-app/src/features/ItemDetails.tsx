import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { Movies } from "../Models/Movies";

interface props {
    submiting: boolean;
    movie: Movies | undefined;
    handlesetForm: ()=>void
}

export default function Details({ submiting, movie, handlesetForm }: props) {
   

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
                name={movie.id.toString()}
                onClick={() => handlesetForm()}
                
                positive
                icon='edit'
               // disabled={submiting && viewtarget === movie.id}
               // loading={submiting && viewtarget === movie.id}
              
                 
                />
            
        </Card>
    )
}