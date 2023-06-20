import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'react-toastify';
import { Movies } from '../../Models/Movies';
import { router } from '../../routing/router';


const sleep = (delay: number) => {

    return new Promise((resolve) => {

        setTimeout(resolve, delay)
    })
}
const responceBody = <T>(responce: AxiosResponse<T>) => responce.data;

axios.defaults.baseURL = 'https://localhost:5000/api'

axios.interceptors.response.use(async responce => {
   
        await sleep(1000)
            return responce;

}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            toast.error("Bad-Request");
            break;
      
        case 404:
             toast.error("Not-Found");
            { router.navigate('/notFound') }
            break;
        case 403:
            toast.error("Forbidden");

            break;
        case 401:
            toast.error("un-Authorized")
            break;

    }
    return Promise.reject(error);
})

  




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