import { makeAutoObservable, runInAction } from "mobx";
import { CardItem, CardItems } from "../../Models/CardItems";
import { CardItemToAdd } from "../../Models/CardItemToAdd";

import agent from "../api/agent";
import MovieStore from "./MovieStore";
import { store } from "./Store";

export default class ShopingStore {
    CardItems: CardItems[] = [];
    loading: boolean = false;
    movieStore: MovieStore;
    itemLoading: boolean = false;

    constructor(movieStore: MovieStore) {
        this.movieStore = movieStore;
        makeAutoObservable(this);
         
    }
    get movies() {
      

        return this.movieStore.movies;
    }

    addToCard = async (movie: CardItemToAdd) => {
        this.loading = true;

        try {
            var item = await agent.card.AddItem(movie);
            runInAction( () => {
                const cardItem = new CardItem(
                    item.userId,
                    item.movieId,
                    item.movieName,
                    item.description,
                    item.price,
                    item.totalPrice,
                    1 
                );
                this.CardItems.push(item);

                let theMovie = this.movies.find(x => x.id === item.movieId);
                console.log(theMovie);

                if (theMovie) {
                    store.movieStore.changeMenegde(theMovie, item.mengde);

                }
                this.loading = false;

            })

        }
        catch (error) {
            runInAction(() => {
                this.loading = false;
                console.log(error);
            })

        }

    }


    loadCardMovies = async () => {
        this.itemLoading = true;
        try {
            const items = await agent.card.CartItems();

            runInAction(() => {
                this.CardItems = items;
                console.log(items.map((item) => item.mengde));
                this.itemLoading = false;
            })
        }
        catch (error) {
            runInAction(() => {
                this.itemLoading = false;
                console.log(error);
            })

        }


    }
}