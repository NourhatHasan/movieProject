import { makeAutoObservable, runInAction } from "mobx";
import { CardItems } from "../../Models/CardItems";
import { CardItemToAdd } from "../../Models/CardItemToAdd";

import agent from "../api/agent";
import MovieStore from "./MovieStore";
import { store } from "./Store";

export default class ShopingStore {
    CardItems: CardItems[] = [];
    loading: boolean = false;
    movieStore: MovieStore;

    constructor(movieStore: MovieStore) {
        this.movieStore = movieStore;
        makeAutoObservable(this);
         
    }
    get movies() {
      
        console.log(this.movieStore.movies);
        return this.movieStore.movies;
    }

    addToCard = async (movie: CardItemToAdd) => {
        this.loading = true;

        try {
            var item = await agent.card.AddItem(movie);
            runInAction(async () => {

                this.CardItems.push(item);

                let theMovie = this.movies.find(x => x.id === item.movieId);


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
}