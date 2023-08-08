import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { number } from "yup";
import { MovieComments } from "../../Models/movieComments";
import { store } from "./Store";

export default class CommentStore {
    comments: MovieComments[] = [];
    hubConnection: HubConnection | null = null;
    constructor() {
        makeAutoObservable(this);
    }

    createhubConnection = (movieId: number) => {
        if (movieId && store.userStore.user) {

            console.log(store.userStore.user.username)
           
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/comment?movieId=' + movieId, {

                    accessTokenFactory: () => store.tokenStore.token!
                   
               
                })
          
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            console.log(store.tokenStore.token);

            this.hubConnection.start().catch(error => console.log("Error establishing the connection ", error));
            this.hubConnection.on('LoadComments', (comments: MovieComments[]) => {
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'z')
                    })
                    this.comments = comments
                });
            });

            this.hubConnection.on('ReceiveComment', (comment: MovieComments) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.push(comment)
                })
            })
            
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error stopping the connection ", error));
      
    }
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }


    addComment = async (values: any) => {

        values.movieId = store.movieStore.selectedMovie?.id;
        console.log(values)
        try {
          console.log("try")
            var comment = await this.hubConnection?.invoke('SendComment', values);
            console.log(comment)
            }
           catch (error) {
            console.log(error);
        }
    }
}