import { makeAutoObservable, runInAction } from "mobx";
import { Card } from "semantic-ui-react";
import { CardItemMengdeUpdate } from "../../Models/CardItemMengdeUpdate";
import { CardItem, CardItems } from "../../Models/CardItems";
import { CardItemToAdd } from "../../Models/CardItemToAdd";
import { Movies } from "../../Models/Movies";

import agent from "../api/agent";
import MovieStore from "./MovieStore";
import { store } from "./Store";

export default class ShopingStore {
    CardItems: CardItems[]  = [];
    loading: boolean = false;
    movieStore: MovieStore;
    itemLoading: boolean = false;
    deleteLoading: boolean = false;
    updateLoading: boolean = false;

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
            var theMovie = this.movieStore.movies.find(x => x.id === movie.movieId);
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

               

                if (theMovie?.mengde === 1) {
                    this.movieStore.movies = this.movieStore.movies.filter(x => x.id !== theMovie?.id);
                }
              
                if (theMovie?.mengde>1) {
                    store.movieStore.changeMenegde(theMovie!, item.mengde);

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

    deleteMovie = async (id: number) => {
        this.deleteLoading = true;
        try {
            await agent.card.deleteItem(id);
            var movie = await this.movies.find(x => x.id === id);
            
            this.loadCardMovies();
            runInAction(() => {
               var theItem= this.CardItems.find(x => x.movieId === id);
                this.CardItems = this.CardItems.filter(x => x.movieId !== id);

                this.loadCardMovies();
                this.movieStore.addMenegde(movie!, theItem!);
                this.deleteLoading = false;
            })

        } catch (error) {
            runInAction(() => {
                this.deleteLoading = false;
                console.log(error);
            })
        }
    }

    updatemovie = async (id:number,movie: CardItemMengdeUpdate) => {

        const item = this.CardItems.find(x => x.movieId === id);
        
        if (!item) return;
        
        this.updateLoading = true;
        try {
           
            var oldMengde = item?.mengde;
            await agent.card.updateMenegde(id, movie!);
            this.loadCardMovies();
            runInAction(() => {
                item!.mengde = movie!.mengde;
               
                 if (item?.mengde === 0) {
                     this.deleteMovie(id)
                     this.CardItems = [];
                     console.log(CardItem.length)
                }

               
                this.loadCardMovies();

              
                this.movieStore.updateMovieMengde(item!.mengde, oldMengde!, item!.movieId)
               
            })
        
            this.updateLoading = false;
        }
        catch (error) {
            runInAction(() => {
                this.updateLoading = false;
                console.log(error);
            })
        }

    }
}


  