import { Button, Container, Menu } from "semantic-ui-react";


interface props{
    handleSetForm: () => void;

}
export default function Navbar({ handleSetForm }: props) {
   
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

                            onClick={() => handleSetForm()}

                        />
                    
                </Menu.Item>

            </Container>


        </Menu>
    )
}
