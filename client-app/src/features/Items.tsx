import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { Movies } from "../Models/Movies";



interface props {
    movies: Movies[]
};
export function DashItems({ movies }: props) {
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
                         name={movie.id}
                       //  onClick={e => handleIsMain(photo, e)}
                       //  loading={target === photo.id && mainLoading}
                         color='green'
                         icon='info circle'
                         //disabled={photo.isMain || deleteLoading}
                         fluid />
                     <Button
                         basic
                         name={movie.id}
                       //  onClick={e => handleDelete(photo.id, e)}
                       //  loading={deleteTarget === photo.id && deleteLoading}

                       //  disabled={mainLoading || photo.isMain}
                         color='red'
                         icon='trash'
                         fluid

                     />
                 </Button.Group>
                </Card>
         ))}
        </Card.Group>
    )
}