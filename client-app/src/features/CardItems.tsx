import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Icon, List} from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";

export default observer(function CardItems() {
    const { shopingStore } = useStore();
    const handleDelete = (movieId: any) => {
       
    };

    const handleIncreaseAmount = (movieId: any) => {
       
    };

    const handleDecreaseAmount = (movieId: any) => {
       
    };


    useEffect(() => {
        shopingStore.loadCardMovies();
    }, [shopingStore]);

  

    return (
        <div className="card-items-container">
            <List divided relaxed>
                {shopingStore.CardItems.map((movie) => (
                    <List.Item key={movie.movieId}>
                        <List.Content floated="left">
                            {movie.movieName}
                        </List.Content>
                        <List.Content floated="right">
                            <Button icon onClick={() => handleDecreaseAmount(movie.movieId)}>
                                <Icon name="minus" />
                            </Button>

                            <span className="item-quantity">{movie.mengde}</span>

                            <Button icon onClick={() => handleIncreaseAmount(movie.movieId)}>
                                <Icon name="plus" />
                            </Button>

                            <Button
                                icon
                                color="red"
                                onClick={() => handleDelete(movie.movieId)}
                            >
                                <Icon name="trash" />
                            </Button>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    );
});