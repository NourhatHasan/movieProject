import { Button, Container, Menu } from "semantic-ui-react";

export default function Navbar() {
   
    return (
        <Menu inverted fixed='top' >
            <Container >

                <Menu.Item  >
                    <img src={"/filmLogo.jpg"} alt='logo' style={{ marginRight: 10 }} />
                   Watch Now
                </Menu.Item>

                <Menu.Item
                   
                    name='movies'

                />

                <Menu.Item>
                    <Button
                        content="add movie"
                        color='blue'


                    />
                </Menu.Item>

            </Container>


        </Menu>
    )
}
