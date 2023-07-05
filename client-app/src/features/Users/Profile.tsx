import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Container, Grid, Header, Item, Tab } from "semantic-ui-react";
import Loading from "../../layout/loading";
import { useStore } from "../../layout/Stores/Store";
import { Movies } from "../../Models/Movies";
import OrdersPage from "../OrdersPage";




export default observer(function Profile() {

    const { userStore: { user }, shopingStore } = useStore();



    useEffect(() => {
        shopingStore.getOrders()
    }, [shopingStore])



    const panes = [
        {
            menuItem: ' your Orders', render: () => <OrdersPage user={user!}/>
        }
        //  { menuItem: ' wish list', render: () => <wishList user={user} /> },

    ];



    if (shopingStore.orderLoading) return <Loading content={"Orders are loading"} />
    return (
        <Container style={{ marginTop: '10em' }}>

            {user && (
                <>
                    <Item.Group>
                        <Header as="h1">{`Hi ${user.username}!!`}</Header>
                    </Item.Group>

                    <Tab
                        menu={{
                            fluid: true, vertical: false, inverted: true,
                        }}
                        menuPosition='left'
                        panes={panes}
                    />

                    <div style={{ marginTop: '2em', textAlign: 'center' }}>
                        <Button
                            secondary
                            icon='arrow left'
                            content='Go to movies'
                            as={Link}
                            to='/movies'
                        />
                    </div>

                </>

            )}
      

        </Container>

    )
})