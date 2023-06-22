import { makeAutoObservable, runInAction } from "mobx";
import { LogInInfo, UserFormValues } from "../../Models/User";
import { router } from "../../routing/router";
import agent from "../api/agent";
import modalStore from "./ModalStore";
import { store } from "./Store";

export default class UserStore {
    user: LogInInfo | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    //if we have a user we will get it 
    getIsLogdIn() {
        return !!this.user;
    }

    login = async (user: UserFormValues) => {
        try {
            const logInuser = await agent.user.logIn(user);
            console.log(logInuser);
            store.tokenStore.setToken(logInuser.token!);
            runInAction(() => {
                this.user = logInuser;
                router.navigate('/movies')
                store.modalStore.closeModal();
            })
         
       
        }
        catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.tokenStore.setToken(null);
       //remove the token from local storage
      //  localStorage.removeItem('jwt');
        this.user = null;
        router.navigate('/');
     
    }

    getCurrentUser = async () => {
        try {
            const user = await agent.user.current();
            runInAction(() => {
                 this.user=user
            })
           
        }
        catch (error) {
            console.log(error);
        }

    }

    register = async (user: UserFormValues) => {
        try {
            const Registeruser = await agent.user.register(user);
            store.tokenStore.setToken(Registeruser.token!);
            runInAction(() => {
                this.user = Registeruser;
                router.navigate('/movies')
                store.modalStore.closeModal();
            })

        }
        catch (error) {
            console.log(error);
        }

    }


}