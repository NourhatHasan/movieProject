/* eslint-disable react/jsx-no-undef */
import React, { SyntheticEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Grid, Header, Icon, List} from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";

import { CardItemMengdeUpdate } from "../Models/CardItemMengdeUpdate";
import CheckOut from "./CheckOut";


export default observer(function CardItems() {
    const { shopingStore, movieStore, modalStore } = useStore();
    const [delteTarget, SetDeleteTarget] = useState<number>(0);
    const [loadingMap, setLoadingMap] = useState<{ [key: number]: boolean }>({});
   

    const handleDelete = (e: SyntheticEvent<HTMLButtonElement>, movieId: number) => { 
        SetDeleteTarget(movieId);
        shopingStore.deleteMovie(movieId);
        
    };


   
   const handleIncreaseAmount = async (e: SyntheticEvent<HTMLButtonElement>, movieId: number) => {
    setLoadingMap((prevLoadingMap) => ({
    ...prevLoadingMap,
      [movieId]: true,
     }));

       const movie = shopingStore.CardItems.find((x) => x.movieId === movieId);
       const dashItem = movieStore.movies.find(x => x.id === movieId);
       if (dashItem!.mengde > 0) {
           const updateMengde = movie!.mengde + 1;
           const cardItemMengdeUpdate: CardItemMengdeUpdate = {
               mengde: updateMengde,
           };
           await shopingStore.updatemovie(movieId, cardItemMengdeUpdate);
       }
    
  

  

  setLoadingMap((prevLoadingMap) => ({
    ...prevLoadingMap,
    [movieId]: false,
  }));
};

const handleDecreaseAmount = async (e: SyntheticEvent<HTMLButtonElement>, movieId: number) => {
  setLoadingMap((prevLoadingMap) => ({
    ...prevLoadingMap,
    [movieId]: true,
  }));

  const movie = shopingStore.CardItems.find((x) => x.movieId === movieId);
  const updatedMengde = movie!.mengde - 1;

  if (updatedMengde >= 0) {
    const cardItemMengdeUpdate: CardItemMengdeUpdate = {
      mengde: updatedMengde,
    };

    await shopingStore.updatemovie(movieId, cardItemMengdeUpdate);
  }

  setLoadingMap((prevLoadingMap) => ({
    ...prevLoadingMap,
    [movieId]: false,
  }));
};

    useEffect(() => {
        shopingStore.loadCardMovies();
        shopingStore.TotalAmount();
    }, [shopingStore]);


  

    return (
        <div >
            <div style={{ maxHeight: "300px", overflow: "auto" }}>
            <List divided relaxed>
                {shopingStore.CardItems.map((movie) => (
                    <List.Item key={movie.movieId}>
                        <List.Content floated="left" as={Header} style={{ marginTop: '2em' }}>
                            {movie.movieName}
                        </List.Content>

                        <List.Content floated="right" style={{ marginTop: '2em' }}>
                            Price:  {movie.totalPrice} $
                        </List.Content>

                        <List.Content floated="left" style={{ marginTop: '2em' }}>
                            <Button icon
                                onClick={(e) => handleDecreaseAmount(e, movie.movieId)}
                                loading={loadingMap[movie.movieId]}
                            >
                                <Icon name="minus" />
                            </Button>

                            <span className="item-quantity">{movie.mengde}</span>

                            <Button icon
                                onClick={(e) => handleIncreaseAmount(e, movie.movieId)}
                                loading={loadingMap[movie.movieId]}
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
            <div style={{ display: "flex", alignItems: "center", marginTop:'2em' }}>
                <Button
                    fluid
                    color="red"
                    content={"check out"}
                    style={{ marginRight: "auto" }}
                    onClick={() => modalStore.openModal(<CheckOut/>)}
                    size="huge" inverted
                />
                <div style={{ marginLeft:'1em' }}>total: {shopingStore.amount} $</div>
            </div>

                   
           
            
        </div>
    );
});