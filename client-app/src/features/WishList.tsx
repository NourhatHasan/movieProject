import { observer } from "mobx-react-lite";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import Loading from "../layout/loading";
import { useStore } from "../layout/Stores/Store";

import { LogInInfo } from "../Models/User";



interface props {
    user: LogInInfo;

}
export default observer(function WishList({ user }: props) {

    const { userStore, shopingStore } = useStore();




    const truncateDes = (description: string, maxWords: number) => {
        const words = description.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return description;
    };

  

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon="heart" content='WishList' floated='left'
                        style={{
                            color: 'red'
                        }}
                    />
                    {userStore.getIsLogdIn() && (
                        <Card.Group itemsPerRow='5'>
                            {shopingStore.wishList.map((list) => (
                                <Card key={list.id}>
                                    <Card.Content>
                                        <Card.Header>{list.movieName}</Card.Header>
                                        <Card.Description>{truncateDes(list.description || '', 6)}</Card.Description>
                                    </Card.Content>




                                </Card>
                            ))}
                        </Card.Group>
                    )}




                </Grid.Column>
            </Grid>


        </Tab.Pane>

    )
})