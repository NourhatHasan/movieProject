import { createContext, useContext } from "react";
import CommentStore from "./CommentStore";
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
    commentStore: CommentStore;
}

const movieStore = new MovieStore();
const userStore = new UserStore();
const tokenStore = new TokenStore();
const modalStore = new ModalStore();
const shopingStore = new ShopingStore(movieStore, userStore);
const commentStore = new CommentStore();

export const store: Store = {
    movieStore,
    userStore,
    tokenStore,
    modalStore,
    shopingStore,
    commentStore,
};

export const StoreContext = createContext(store);


export function useStore() {
    return useContext(StoreContext);
}