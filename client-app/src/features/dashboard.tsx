import { Card, List, Segment } from "semantic-ui-react";
import { Movies } from "../Models/Movies";
import { DashItems } from "./Items";
import { useEffect, useState } from 'react';

import axios from 'axios';
import Details from "./ItemDetails";

export function Dashboard() {

    const [movie, setMovie] = useState([]);
    useEffect(() => {
        axios.get('https://localhost:7155/api/Movie')
            .then(Response => {
                console.log(Response.data)
                setMovie(Response.data)
            })
    }, [])


    return (
        <Segment divided>

            <DashItems movies={movie} />

            <Details />
          

        </Segment>
    )
}

