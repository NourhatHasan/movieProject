import { createBrowserRouter, RouteObject } from "react-router-dom"
import { Dashboard } from "../features/dashboard"
import Details from "../features/ItemDetails"
import App from "../layout/App"


export const routs: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [

            { path: 'movies', element: <Dashboard /> },
         //   { path: 'movies/:id', element: <Details /> },
           
        ]


    }
]

export const router = createBrowserRouter(routs)