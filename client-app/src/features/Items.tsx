import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { Movies } from "../Models/Movies";



interface props {
    movies: Movies[];
    getSelectedMovie: (id: number) => void;
    submiting: boolean;
    deleteMovie: (id: number) => void;
  
};
export function DashItems({ movies, getSelectedMovie, submiting, deleteMovie }: props) {
    return (

        <Card.Group itemsPerRow='4'>
         {movies.map((movie: Movies) => (
         <Card key={movie.id} >
         
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
                         // name={movie.id}
                         onClick={() => getSelectedMovie(movie.id)}
                       
                         color='green'
                         icon='info circle'
                         disabled={submiting}
                       
                         fluid />

                     <Button
                         basic
                         onClick={() => deleteMovie(movie.id)}
                         loading={submiting}
                         disabled={submiting}
                         color="red"
                         icon="trash"
                         fluid
                     />
                     </ Button.Group>
                </Card>
         ))}
        </Card.Group>
    )
}