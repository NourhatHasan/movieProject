import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu, Dropdown, Icon } from "semantic-ui-react";
import { useStore } from "./Stores/Store";




export default observer( function Navbar() {

    const { userStore } = useStore();
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

                {userStore.user?.username == 'Solin' && (
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
               

            </Container>


        </Menu>
    )
}
)