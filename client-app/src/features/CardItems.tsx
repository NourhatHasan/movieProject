import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Icon, Input, List, ListItem } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";

export default observer(function CardItems() {
    const { shopingStore } = useStore();
    const handleDelete = (movieId: any) => {
        // Implement your logic to delete the item based on the movieId
    };

    const handleIncreaseAmount = (movieId: any) => {
        // Implement your logic to increase the amount of the item based on the movieId
    };

    const handleDecreaseAmount = (movieId: any) => {
        // Implement your logic to decrease the amount of the item based on the movieId
    };


    useEffect(() => {
        shopingStore.loadCardMovies();
    }, [shopingStore]);

  

    return (
        <div style={{ marginTop: '6em' }}>
            <List divided>
                {shopingStore.CardItems.map((movie) => (
                    <List.Item key={movie.movieId}>
                        <List.Content floated="left">{movie.movieName}</List.Content>
                        <List.Content floated="right">
                            <Button icon onClick={() => handleDecreaseAmount(movie.movieId)}>
                                <Icon name="minus" />
                            </Button>

                            <span style={{ marginRight: '8px', marginLeft: '8px' }}>{movie.mengde}</span>

                            <Button icon onClick={() => handleIncreaseAmount(movie.movieId)}>
                                <Icon name="plus" />
                            </Button>

                            <Button icon color="red" onClick={() => handleDelete(movie.movieId)}>
                                <Icon name="trash" />
                            </Button>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    );
});