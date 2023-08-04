import { makeAutoObservable, runInAction } from "mobx";
import { Card } from "semantic-ui-react";
import { CardItemMengdeUpdate } from "../../Models/CardItemMengdeUpdate";
import { CardItem, CardItems } from "../../Models/CardItems";
import { CardItemToAdd } from "../../Models/CardItemToAdd";
import { CheckOutForm } from "../../Models/checkOut";
import { Movies } from "../../Models/Movies";
import { Order } from "../../Models/Orders";
import { WishList } from "../../Models/WishList";
import { router } from "../../routing/router";

import agent from "../api/agent";
import MovieStore from "./MovieStore";
import { store } from "./Store";
import UserStore from "./UserStore";

export default class ShopingStore {
    CardItems: CardItems[] = [];
    loading: boolean = false;
    movieStore: MovieStore;
    userStore: UserStore | undefined;
    itemLoading: boolean = false;
    deleteLoading: boolean = false;
    updateLoading: boolean = false;
    amount: number = 0;
    order: Order[] = [];
    orderLoading: boolean = false;
    wishListLoading: boolean = false;
    wishList: WishList[] = [];


    constructor(movieStore: MovieStore, userStore: UserStore) {
        this.movieStore = movieStore;
        this.userStore = userStore;
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

            runInAction(() => {
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

                if (theMovie?.mengde > 1) {
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
            this.TotalAmount();
            runInAction(() => {
                var theItem = this.CardItems.find(x => x.movieId === id);
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

    updatemovie = async (id: number, movie: CardItemMengdeUpdate) => {

        const item = this.CardItems.find(x => x.movieId === id);
        const theMovie = this.movies.find(x => x.id === id);


        if (!item) return;

        this.updateLoading = true;
        try {

            var oldMengde = item?.mengde;
            await agent.card.updateMenegde(id, movie!);
            this.loadCardMovies();
            runInAction(() => {
                item!.mengde = movie!.mengde;

                if (theMovie?.mengde === 1) {
                    console.log(theMovie?.mengde);
                    this.movieStore.movies = this.movieStore.movies.filter(x => x.id !== id)
                    this.movieStore.loadMovies();

                }

                if (item.mengde === 0) {
                    this.deleteMovie(id)


                }
                this.loadCardMovies();
                this.TotalAmount();

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

    TotalAmount = async () => {
        try {
            const total = await agent.payment.totalAmount(this.userStore!.user!.id);

            this.amount = Number(total);
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        }
    }

    process = async (values: CheckOutForm): Promise<Boolean> => {
        try {
            var amount = this.amount;
            return await agent.payment.Process(values, this.amount)
                .then((response: any) => {
                    var isSuccess = response.success === true;
                    if (isSuccess) {
                        console.log("Process completed successfully");

                    } else {
                        console.log("Process failed");

                    }
                    return isSuccess;
                })
        }
        catch (error) {
            console.log(error);
            return false;
        }

    }

    updateOrder = () => {
        var userId = this.userStore!.user!.id;
        var order = agent.payment.updateOrder(userId);

        console.log(order)
    }
    clearItems = () => {
        var userId = this.userStore!.user!.id;
        var clear = agent.payment.clearItems(userId);
        this.CardItems = [];
        this.amount = 0;
    }

    checkOut = async (values: CheckOutForm) => {
        try {
            var userId = this.userStore!.user!.id;

           
            var amount = this.amount;
            console.log(amount);


            this.process(values);
            
            this.process(values)
                .then((isSuccessful) => {
                    if (isSuccessful) {
                        this.updateOrder();
                        this.clearItems();
                        this.getOrders();
                    }
                })

            runInAction(() => {
                this.CardItems = [];
                this.amount = 0;
                
                store.modalStore.closeModal();
                router.navigate(`/Profile`);
            })


        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        }
    }

    getOrders = async () => {
        this.orderLoading = true;
        try {
            const orders = await agent.payment.getOrders();

            runInAction(() => {
                this.order = orders;
                console.log(orders.map((item) => item.movieName));
                this.orderLoading = false;
            })

        }
        catch (error) {
            runInAction(() => {
                this.orderLoading = false;
                console.log(error);
            });
        }
    }

    updateWishList = async (id: number) => {
        try {
            const wishItem = await agent.card.updateWishList(id);
            runInAction(() => {
                var movie = this.movieStore.movies.find(x => x.id === id);
                var item = this.wishList.find(x => x.movieName === movie?.movieName);
                if (item) {
                    this.wishList= this.wishList.filter(x => x.movieName !== movie?.movieName);
                }
                else {
                    this.wishList.push(wishItem)
                }
                this.getWishLisat();
            })
        }
        catch (error) {
            runInAction(() => {

                console.log(error);
            });
        }
    }


    getWishLisat = async () => {
        this.wishListLoading = true;
            try {
                var wishList = await agent.card.getWishList();
                runInAction(() => {
                    this.wishList = wishList;
                    this.wishListLoading = false;
                })
            }
            catch (error) {
                runInAction(() => {

                    console.log(error);
                    this.wishListLoading = false;
                })
        }

    }

}