import { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { Movies } from "../Models/Movies";



interface props {
    movies: Movies[];
    getSelectedMovie: (id: number) => void;
    submiting: boolean;
    deleteMovie: (id: number) => void;
  
  
};
export function DashItems({ movies, getSelectedMovie, submiting, deleteMovie }: props) {

    const [target, setTarget] = useState < number>(0);
    const [viewtarget, setViewTarget] = useState<number>(0);


    function handleDelete(e: SyntheticEvent<HTMLButtonElement>, id: number) {
        setTarget(id);
        deleteMovie(id)

        if (id === viewtarget) {
            setViewTarget(0); // Clear the selected movie state
        }
     
       
    }

    function handleView(e: SyntheticEvent<HTMLButtonElement>, id: number) {
      
         setViewTarget(0); // Clear the selected movie state
        
        setViewTarget(id);
       
        getSelectedMovie(id)
      
        
    }
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
                         name={movie.id.toString()}
                         onClick={(e) => handleView(e, movie.id)}
                         color='green'
                         icon='info circle'
                         disabled={submiting && viewtarget === movie.id}
                         loading={submiting && viewtarget === movie.id}
                       
                         fluid />

                     <Button
                         basic
                         name={movie.id.toString()}
                        
                         onClick={(e) => handleDelete(e, movie.id)}
                         loading={submiting && target === movie.id}
                         disabled={submiting && target === movie.id}
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