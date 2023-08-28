import { makeAutoObservable, runInAction } from "mobx";
import { CardItem, CardItems } from "../../Models/CardItems";
import { movieForm, Movies } from "../../Models/Movies";
import { Photos } from "../../Models/photo";
import agent from "../api/agent";

export default class MovieStore {
    movies: Movies[] = [];
    selectedMovie: Movies | null = null;
    loading: boolean = false;
    initLoading: boolean = false;
    
    constructor() {
        makeAutoObservable(this);
    }

   

    loadMovies = async () => {
        this.initLoading = true;
        try {
            const themovies = await agent.movies.list();
            console.log("Fetched movies:", themovies);
            runInAction(() => {
                this.movies = themovies.filter(movie => movie.mengde !== 0);
                console.log("Filtered movies:", this.movies);
                this.initLoading = false;
                
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        }
    }

    loadMovie = async (id: number) => {

        this.initLoading = true;

        try {
           
            var movie = this.movies.find(x => x.id === id);
            if (movie) {
                this.selectedMovie = movie;
             

            }
          
               
                movie = await agent.movies.details(id);
                runInAction(() => {

                    this.movies.push(movie!);
                    this.selectedMovie = movie!;
                   
                    this.initLoading = false;
                   
                })


          

        }
        catch (error) {
            runInAction(() => {
                this.initLoading = false;
                console.log(error);
            })

        }

    }


    resetSelectedMovie=() =>{
        this.selectedMovie = null;
    }

    deleteMovie = async (id: number) => {
        this.loading = true;
        try {
           
             await agent.movies.del(id);
          
            this.movies = this.movies.filter(x => x.id !== id);
            if (this.selectedMovie?.id === id) {
                this.selectedMovie = null;
               
            }
            
            this.loading = false;
        }
        catch (error) {
            runInAction(() => {
                console.log(error);
            })

        }
    }

    addMovie = async (movie: movieForm, photoFile: Blob) => {
        this.loading = true;
        try {
            var result= await agent.movies.create(movie, photoFile);
            const photoData = result.data.photo;
            let returnMovie: Movies = {
                id: movie.id,
                movieName: movie.movieName,
                mengde: movie.mengde,
                description: movie.description,
                price: movie.price,
                photo: {
                    id: photoData!.id,
                    url: photoData!.url
                }

            }
            runInAction(() => {
                this.movies.push(returnMovie);
                this.selectedMovie = returnMovie;
              //  console.log(result.data.id)
                this.loadMovie(result.data.id)
                this.loading = false;
                
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        }
    };

    updateMovie = async (movie: Movies) => {
        this.loading = true;
        try {
            await agent.movies.update(movie, movie.id);
            runInAction(() => {
                this.movies = [...this.movies.filter(x => x.id !== movie.id), movie];
                this.selectedMovie = movie;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        }
    };


    changeMenegde = (movie: Movies, mengde: any) => {
        if (movie) {
            movie.mengde = (movie.mengde || 0) - mengde;
        } else {
            this.loadMovies();
        }
    }

    increaseMenegde = (movie: Movies, mengde: number) => {
        if (movie) {
            movie.mengde = (movie.mengde || 0) + mengde;
        } else {
            this.loadMovies();
        }
    }

    addMenegde = (movie: Movies,  item: CardItems) => {
        if (movie) {
            movie.mengde = (movie.mengde || 0) + item.mengde;
        } else {
            this.loadMovies();
        }
    }
    updateMovieMengde = (itemMengde: number, oldMengde: number, id: number) => {
        var movie = this.movies.find(x => x.id === id);
        if (itemMengde < oldMengde) {
           
            var newMengde = oldMengde - itemMengde;
            this.increaseMenegde(movie!, newMengde)
            

        } else {
            var newMengde = itemMengde - oldMengde;
            this.changeMenegde(movie!, newMengde);
            
        }
    }
}