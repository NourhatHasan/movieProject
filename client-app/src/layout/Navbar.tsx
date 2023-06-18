import { observer } from "mobx-react-lite";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "./Stores/Store";



export default observer( function Navbar() {

    const { movieStore } = useStore();
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

                            onClick={()=>movieStore.handleSetForm()}

                        />
                    
                </Menu.Item>

            </Container>


        </Menu>
    )
}
)