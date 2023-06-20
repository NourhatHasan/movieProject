import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom"
import { Dashboard } from "../features/dashboard"
import FormCE from "../features/formCE"
import Home from "../features/Home"
import ItemDetails from "../features/ItemDetails"
import NotFound from "../features/NotFound"
import App from "../layout/App"


export const routs: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Home /> },
            { path: '/movies', element: <Dashboard /> },
            { path: '/movies/:id', element: <ItemDetails /> },
            { path: '/Edit/:id', element: <FormCE key='edit' /> },
            { path: '/createMovie', element: <FormCE key='create' /> },
           
           { path: 'notFound', element: <NotFound /> },
            { path: '*', element: <Navigate replace to='/NotFound' /> }
           
        ]


    }
]

export const router = createBrowserRouter(routs)