import { createContext, useContext } from "react";
import modalStore from "./ModalStore";
import MovieStore from "./MovieStore";
import TokenStore from "./TokenStore";
import UserStore from "./UserStore";

interface Store {
    movieStore: MovieStore;
    userStore: UserStore;
    tokenStore: TokenStore;
    modalStore: modalStore;
}

export const store: Store = {
    movieStore: new MovieStore(),
    userStore: new UserStore(),
    tokenStore: new TokenStore(),
    modalStore: new modalStore(),

}

export const StoreContext = createContext(store);


export function useStore() {
    return useContext(StoreContext);
}