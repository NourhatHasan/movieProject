import { createContext, useContext } from "react";
import ModalStore from "./ModalStore";

import MovieStore from "./MovieStore";
import ShopingStore from "./shopingStore";
import TokenStore from "./TokenStore";
import UserStore from "./UserStore";

interface Store {
    movieStore: MovieStore;
    userStore: UserStore;
    tokenStore: TokenStore;
    modalStore: ModalStore;
    shopingStore: ShopingStore;
}

const movieStore = new MovieStore();
const userStore = new UserStore();
const tokenStore = new TokenStore();
const modalStore = new ModalStore();
const shopingStore = new ShopingStore(movieStore, userStore);

export const store: Store = {
    movieStore,
    userStore,
    tokenStore,
    modalStore,
    shopingStore,
};

export const StoreContext = createContext(store);


export function useStore() {
    return useContext(StoreContext);
}