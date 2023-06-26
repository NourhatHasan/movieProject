import { makeAutoObservable } from "mobx"

export interface CardItems {
    userId: number
    movieId: number
    movieName: string
    description: string
    price: number
    totalPrice: number
    mengde: number
}

export class CardItem implements CardItems {
    userId: number;
    movieId: number;
    movieName: string;
    description: string;
    price: number;
    totalPrice: number;
    mengde: number;

    constructor(
        userId: number,
        movieId: number,
        movieName: string,
        description: string,
        price: number,
        totalPrice: number,
        mengde: number
    ) {
        this.userId = userId;
        this.movieId = movieId;
        this.movieName = movieName;
        this.description = description;
        this.price = price;
        this.totalPrice = totalPrice;
        this.mengde = mengde;

        makeAutoObservable(this);
    }

    setMengde(mengde: number) {
        this.mengde = mengde;
    }

}