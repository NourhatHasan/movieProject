import React, { SyntheticEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Icon, List} from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";
import Navbar from "../layout/Navbar";

export default observer(function CardItems() {
    const { shopingStore } = useStore();
    const [delteTarget, SetDeleteTarget] = useState<number>(0);



    const handleDelete = (e: SyntheticEvent<HTMLButtonElement>, movieId: number) => { 
        SetDeleteTarget(movieId);
        shopingStore.deleteMovie(movieId);
        
    };

    const handleIncreaseAmount = (movieId: number) => {
        shopingStore.updatemovie(movieId,)
    };

    const handleDecreaseAmount = (movieId: number) => {
        
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

                            <Button icon
                                onClick={() => handleIncreaseAmount(movie.movieId)}
                                loading={shopingStore.updateLoading}
                            >
                                <Icon name="plus" />
                            </Button>

                            <Button
                                name={movie.movieId}
                                icon
                                color="red"
                                onClick={(e) => handleDelete(e, movie.movieId)}
                                loading={shopingStore.deleteLoading && delteTarget === movie.movieId}
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