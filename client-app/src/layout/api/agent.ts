import axios, { AxiosResponse } from 'axios'
import { Movies } from '../../Models/Movies';


const sleep = (delay: number) => {

    return new Promise((resolve) => {

        setTimeout(resolve, delay)
    })
}


axios.defaults.baseURL = 'https://localhost:7155/api'

axios.interceptors.response.use(async responce => {
    try {
        await sleep(1000)
            return responce;
        
    }
    catch (error) {

        console.log(error);
        return Promise.reject(error);
    }

})

const responceBody= <T> (responce: AxiosResponse<T>) => responce.data;


const requests = {
    get:<T> (url: string) => axios.get<T>(url).then(responceBody),
    post:<T> (url: string, body: {}) => axios.post<T>(url, body).then(responceBody),
    put:<T> (url: string, body: {}) => axios.put<T>(url, body).then(responceBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responceBody),
}


const movies = {
    list: () => requests.get<Movies[]>('/Movie'),
    details: (id: number) => requests.get<Movies>(`/Movie/${id}`),
    create: (movie: Movies) => requests.post<void>('/Movie', movie),
    update: (movie: Movies, id: number) => requests.put<void>(`/Movie/${id}`, movie),
    del: (id: number) => requests.delete<void>(`/Movie/${id}`),
}

const agent = {
    movies
}

export default agent;