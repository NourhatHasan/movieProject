import { Photos } from "./photo"

export interface Movies {
    id: number
    movieName: string
    description: string
    price: number
    mengde: any
    photo: Photos | null;
}
export class movieForm {
    id: number = 0;
    movieName: string = "";
    description: string = "";
    price: number = 0;
    mengde: any = 0;
    photo: Photos | null = null;

    constructor(movie?: movieForm) {
        if (movie) {
            this.id = movie.id;
            this.movieName = movie.movieName;
            this.description = movie.description;
            this.mengde = movie.mengde;
            this.price = movie.price;
            this.photo = movie.photo
          

        }
    }

}