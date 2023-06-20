import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";




export default observer( function Navbar() {

   
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

               

                <Menu.Item as={NavLink} to={'/createMovie'} >
                   
                        <Button
                        content="add movie"
                        color='blue'

                    
                     

                        />
                    
                </Menu.Item>

            </Container>


        </Menu>
    )
}
)