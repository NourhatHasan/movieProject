import { makeAutoObservable, runInAction } from "mobx";
import { bool } from "yup";
import { Movies } from "../../Models/Movies";
import agent from "../api/agent";

export default class MovieStore{
    movies: Movies[] = [];
    selectedMovie: Movies | undefined = undefined;
    OpenForm = false;
    loading = false;
    initLoading = false;
    form = false;

    constructor() {
        makeAutoObservable(this)
    }


    loadMovies = async () => {
        this.initLoading = true;
        try {
            const themovies = await agent.movies.list();

            runInAction(() => {
                this.movies = themovies;
                this.initLoading = false;
            })
        }
        catch (error) {
            runInAction(() => {
                console.log(error);
            })
           
        }
       

    }

    loadMovie = async (id:number) => {
        this.OpenForm = false;
        this.loading = true;

        try {
            this.selectedMovie = undefined;
            var movie = this.movies.find(x => x.id === id);
            if (movie) {
                this.selectedMovie = movie;
                this.loading = false;
            }
          
          
                movie = await agent.movies.details(id);
                runInAction(() => {
                    this.selectedMovie = movie;
                    this.loading = false;
                })

          

        }
        catch (error) {
            runInAction(() => {
                console.log(error);
            })

        }

    }


    deleteMovie = async (id: number) => {
        this.loading = true;
        try {
           
             await agent.movies.del(id);
          
            this.movies = this.movies.filter(x => x.id !== id);
            if (this.selectedMovie?.id === id) {
                this.selectedMovie = undefined;
               
            }
            
            this.loading = false;
        }
        catch (error) {
            runInAction(() => {
                console.log(error);
            })

        }
    }

    handleSetForm = (id?: number) => {
        id ? this.loadMovie(id) : this.selectedMovie = undefined;
        this.form = true;
    }
    handleDeleteSetForm = () => {
        this.form = false;

    }

    addMovie = async (movie: Movies) => {
       
        this.loading = true;
        try {
            await agent.movies.create(movie);
            runInAction(() => {
                this.movies.push(movie);
                this.selectedMovie = movie;
                this.form = false;
                this.loading = false;
            })
           

        }
        catch (error) {
            runInAction(() => {
                console.log(error);
            })

        }
    }

   updateMovie = async (movie: Movies) => {
    this.loading = true;
    try {
        await agent.movies.update(movie, movie.id);
        runInAction(() => {
            this.movies = [...this.movies.filter(x => x.id !== movie.id), movie];
        
            this.selectedMovie = movie;
            this.form = false;
            this.loading = false;
        });
    } catch (error) {
        runInAction(() => {
            console.log(error);
        });
    }
}


}