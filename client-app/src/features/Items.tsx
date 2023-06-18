import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";
import { Movies } from "../Models/Movies";
interface Props {
    movies: Movies[];


}

export const DashItems = observer( function DashItems({ movies }: Props) {
    const [target, setTarget] = useState<number>(0);
    const [viewTarget, setViewTarget] = useState<number>(0);
    const { movieStore } = useStore();

    function handleDelete(e: SyntheticEvent<HTMLButtonElement>, id: number) {
        setTarget(id);
       movieStore.deleteMovie(id);

        if (id === viewTarget) {
            setViewTarget(0); // Clear the selected movie state
        }
    }

    function handleView(e: SyntheticEvent<HTMLButtonElement>, id: number) {
        setViewTarget(0); // Clear the selected movie state
        setViewTarget(id);
        movieStore.loadMovie(id)
    }

    return (
        <Card.Group itemsPerRow="4">
            {movies.map((movie: Movies) => (
                <Card key={String(movie.id)}>
                    <Card.Content>
                        <Card.Header>{movie.movieName}</Card.Header>
                        <Card.Description>{movie.description}</Card.Description>
                    </Card.Content>
                    <Card.Content>
                        <Grid columns={2}>
                            <Grid.Column>
                                <Icon name="dollar sign" />
                                <span>{movie.price}</span>
                            </Grid.Column>
                            <Grid.Column>
                                <Icon name="film" />
                                <span>{movie.mengde}</span>
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                    <Button.Group widths={2}>
                        <Button
                            basic
                            name={movie.id}
                            onClick={(e) => handleView(e, movie.id)}
                            color="green"
                            icon="info circle"
                            disabled={movieStore.loading && viewTarget === movie.id}
                            loading={movieStore.loading && viewTarget === movie.id}
                            fluid
                        />
                        <Button
                            basic
                            name={movie.id}
                            onClick={(e) => handleDelete(e, movie.id)}
                            loading={movieStore.loading && target === movie.id}
                            disabled={movieStore.loading && target === movie.id}
                            color="red"
                            icon="trash"
                            fluid
                        />
                    </Button.Group>
                </Card>
            ))}
        </Card.Group>
    );
}
)
