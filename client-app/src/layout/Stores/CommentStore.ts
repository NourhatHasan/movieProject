import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
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

         //   console.log(store.tokenStore.token)
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/comment?movieId=' + movieId, {
                  
                        accessTokenFactory: () => store.tokenStore.token!
                    
               
                })
          


                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            this.hubConnection.start().catch(error => console.log("Error establishing the connection ", error));
            this.hubConnection.on('LoadComments', (comments: MovieComments[]) => {
               runInAction(()=> this.comments = comments);
            })

            this.hubConnection.on('ReceiveComment', (comment: MovieComments) => {
               runInAction(()=> this.comments.push(comment))
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
}