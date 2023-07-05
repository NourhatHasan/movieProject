import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";
import { Order } from "../Models/Orders";
import { LogInInfo } from "../Models/User";



interface props {
    user: LogInInfo;

}
export default observer(function OrederPage({ user }: props) {

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
                    <Header icon='shopping cart' content='Orders' floated='left' />
                    {userStore.getIsLogdIn() && (
                        <Card.Group itemsPerRow='5'>
                            {shopingStore.order.map((order) => (
                                <Card key={order.id}>
                                    <Card.Content>
                                        <Card.Header>{order.movieName}</Card.Header>
                                        <Card.Description>{truncateDes(order.des || '', 6)}</Card.Description>
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