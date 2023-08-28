import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Container, Grid, Header, Icon, Item, Segment } from "semantic-ui-react";
import Loading from "../layout/loading";
import { useStore } from "../layout/Stores/Store";
import ItemDetailsChat from "./ItemDetailsChat";




export default observer(function ItemDetails() {
    const { movieStore, userStore } = useStore();
    const { selectedMovie: movie, initLoading, loadMovie } = movieStore;
    const { id } = useParams();


    useEffect(() => {
        if (id) {
            const movieId = parseInt(id, 10);
          
            loadMovie(movieId);
           

        }
    }, [id, loadMovie])





    if (!movie) {
      
        return null;
    }

    if (initLoading) return <Loading content={"movie details loading"} />
    return (
        <Container style={{ marginTop: '10em' }}>
            <Grid>
                <Grid.Column width={10}>
                    <Segment.Group>
                        <Segment attached='top' style={{ padding: '1em', marginBottom: '2em' }}>
                            <Item.Group>
                                <Item.Image src={movie.photo?.url} />
                                <Item.Content>
                                    <Header
                                        size='huge'
                                        content={movie.movieName}
                                        style={{ color: 'blue', padding: '0.5em' }}
                                    />
                                </Item.Content>
                            </Item.Group>
                        </Segment>

                        <Segment>
                            <Grid>
                                <Grid.Column width={1}>
                                    <Icon size='large' color='blue' name='info circle' />
                                </Grid.Column>
                                <Grid.Column width={15}>
                                    <p>{movie.description}</p>
                                </Grid.Column>
                            </Grid>
                        </Segment>

                        <Segment>
                            <Grid>
                                <Grid.Column width={8}>
                                    <Grid.Row>
                                        <Icon size='large' color='blue' name='dollar sign' />
                                        <p>{movie.price}</p>
                                    </Grid.Row>
                                </Grid.Column>

                                <Grid.Column width={8}>
                                    <Grid.Row>
                                        <Icon size='large' color='blue' name='film' />
                                        <p>{movie.mengde}</p>
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid>
                        </Segment>

                        <Segment attached='bottom'>
                            {userStore.user?.username === 'Solin' && (
                                <Button
                                    primary
                                    icon='edit'
                                    content='Edit Movie'
                                    as={Link} to={`/Edit/${movie.id}`}
                                />


                            )}
                            <Button
                                secondary
                                icon='arrow left'
                                content='Go Back'
                                as={Link} to={'/movies'}

                            />
                          
                        </Segment>
                     
                    </Segment.Group>
                </Grid.Column>
                <Grid.Column width={6}>
                   
                    <Segment>
                        <ItemDetailsChat movieId={movie.id} />
                    </Segment>

                    <Segment>

                    </Segment>
                </Grid.Column>
            </Grid>
        </Container>
    );
  
})