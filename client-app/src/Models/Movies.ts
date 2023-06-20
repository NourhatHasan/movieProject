export interface Movies {
    id: number
    movieName: string
    description: string
    price: number
    mengde: number
}
export class movieForm {
  
    movieName: string = "";
    description: string = "";
    price: number = 0;
    mengde: number = 0;



    constructor(movie?: movieForm) {
        if (movie) {
            this.movieName = movie.movieName;
            this.description = movie.description;
            this.mengde = movie.mengde;
            this.price = movie.price;
        }
    }

}