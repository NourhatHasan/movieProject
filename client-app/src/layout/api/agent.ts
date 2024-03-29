import axios, { AxiosError, AxiosResponse } from 'axios'
import { request } from 'http';
import { toast } from 'react-toastify';
import { CardItemMengdeUpdate } from '../../Models/CardItemMengdeUpdate';
import { CardItems } from '../../Models/CardItems';
import { CardItemToAdd } from '../../Models/CardItemToAdd';
import { CheckOutForm } from '../../Models/checkOut';
import { movieForm, Movies } from '../../Models/Movies';
import { Order } from '../../Models/Orders';
import { LogInInfo, UserFormValues } from '../../Models/User';
import { WishList } from '../../Models/WishList';
import { router } from '../../routing/router';
import { store } from '../Stores/Store';


const sleep = (delay: number) => {

    return new Promise((resolve) => {

        setTimeout(resolve, delay)
    })
}
const responceBody = <T>(responce: AxiosResponse<T>) => responce.data;

axios.defaults.baseURL = 'http://localhost:5000/api'



axios.interceptors.request.use((config: any) => {
    const token = store.tokenStore.token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;

})


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

    create: (movie: movieForm, file: Blob) => {
        const formData = new FormData();
        formData.append('File', file!); // Append the file
        formData.append('MovieName', movie.movieName);
        formData.append('description', movie.description);
        formData.append('price', movie.price.toString());
        formData.append('mengde', movie.mengde.toString());

        return axios.post<Movies>('/Movie', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    update: (movie: Movies, id: number, file: Blob) => {
        const formData = new FormData();
        formData.append('File', file!); // Append the file
        formData.append('MovieName', movie.movieName);
        formData.append('description', movie.description);
        formData.append('price', movie.price.toString());
        formData.append('mengde', movie.mengde.toString());

        return axios.put<Movies>(`/Movie/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    del: (id: number) => requests.delete<void>(`/Movie/${id}`),
}

const user = {
    current: () => requests.get<LogInInfo>('/User/CurrentUser'),
    logIn: (user: UserFormValues) =>
        requests.post<LogInInfo>('/Authentication/logginn', user)
            .catch((error: AxiosError) => {
                if (error.response?.status === 400) {
                    throw new Error('Bad request');
                }
                throw error;
            }),
    register: (user: UserFormValues) => requests.post<LogInInfo>('/Authentication/register', user),
}

const card = {
    CartItems: () => requests.get<CardItems[]>('/User/GetItems'),
    CartItem: (id: number) => requests.get<CardItems>(`/User/${id}`),
    AddItem: (movie: CardItemToAdd) => requests.post<CardItems>('/User', movie),
    deleteItem: (id: number) => requests.delete<CardItems>(`/User/${id}`),
    updateMenegde: (id: number, update: CardItemMengdeUpdate) => requests.put(`/User/${id}`, update),
    updateWishList: (id: number) => requests.post<WishList>(`/User/Wish/${id}`, {}),
    getWishList: () => requests.get < WishList[]>(`/User/GetWishItems`)
}

const payment = {
    totalAmount: (userId: number) => requests.post<void>(`/Payment/totalAmount?userId=${userId}`, {}),
    Process: (values: CheckOutForm, totalAmount: number) => requests.post(`/Payment/Process?totalAmount=${totalAmount}`,values),
    checkOut: (userId: number, values: CheckOutForm) => requests.post(`/Payment/checkout/${userId}`, values),
    updateOrder: (userId: number) => requests.post < Order>(`/Payment/updateOrder/${userId}`, {}),
    clearItems: (userId: number) => requests.delete(`/Payment?userId=${userId}`),
    getOrders: () => requests.get<Order[]>(`/Payment/GetOrders`)
}


const agent = {
    movies,
    user,
    card,
    payment
}

export default agent;