import { createContext, useContext } from "react";
import MovieStore from "./MovieStore";

interface Store {
    movieStore: MovieStore;

}

export const store: Store = {
    movieStore : new MovieStore(),
}

export const StoreContext = createContext(store);


export function useStore() {
    return useContext(StoreContext);
}