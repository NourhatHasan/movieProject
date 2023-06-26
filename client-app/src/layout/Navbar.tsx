import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu, Dropdown, Icon, Label, Popup } from "semantic-ui-react";
import ShopingStore from "./Stores/shopingStore";
import { useStore } from "./Stores/Store";
import CardItems  from "../features/CardItems";



export default observer(function Navbar() {

    

    const { userStore, shopingStore } = useStore();



    useEffect(() => {
        shopingStore.loadCardMovies();
    }, [shopingStore]);

   

    return (
        <Menu inverted fixed='top' >
            <Container >

                <Menu.Item header as={NavLink} to={ '/'} >
                    <img src={"/filmLogo.jpg"} alt='logo' style={{ marginRight: 10 }} />
                   Watch Now
                </Menu.Item>

                <Menu.Item as={NavLink} to={'/movies'}
                   
                    name='movies'

                />

                {userStore.user?.username === 'Solin' && (
                    <Menu.Item as={NavLink} to={'/createMovie'} >

                        <Button
                            content="add movie"
                            color='blue'
                        />

                    </Menu.Item>

                )}

             
              
                <Menu.Item position="right">
                    <Dropdown pointing="top right" text={userStore.user?.username} className="user-dropdown">
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={``} className="dropdown-item">
                                <Icon name="user" />
                                Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={userStore.logout} className="dropdown-item">
                                <Icon name="power" />
                                Log Out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                   
                  
                </Menu.Item>

                {userStore.user?.username !== 'Solin' && (
                    <Menu.Item style={{ marginTop: '10px' }} >
                        <Popup
                            hoverable
                            trigger={
                                <Button color="blue" icon>
                                    <Icon name="shopping bag" style={{ marginRight: "10px" }} />
                                    {shopingStore.CardItems.length > 0 && (
                                        <Label circular color="red" size="tiny" floating>
                                            {shopingStore.CardItems.length}
                                        </Label>
                                    )}
                                </Button>
                            }
                            content=<CardItems />
                            />
                    </Menu.Item>
                 
                )}
            </Container>


        </Menu>
    )
}    
)   