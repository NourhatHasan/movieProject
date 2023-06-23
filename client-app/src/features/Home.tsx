
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Container, Segment, Image, Header, Button } from "semantic-ui-react";
import { useStore } from "../layout/Stores/Store";

import LogIn from "./Users/LogIn";
import Register from "./Users/Register";

const Home = observer(() => {
    const { userStore, modalStore } = useStore();

    return (
        <Segment
            inverted
            textAlign="center"
            vertical
            className="masthead"
            style={{
                background: "linear-gradient(to bottom right, #4286f4, #03c4a1)",
                minHeight: "100vh",
                minWidth: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container text>
                <Header as="h1" inverted>
                    <Image size="massive" src="/FilmLogo.jpg" alt="logo" style={{ marginBottom: 12 }} />
                    Welcome to Movies
                </Header>
                {userStore.getIsLogdIn() ? (
                    <div style={{ marginTop: "2em" }}>
                        <Button as={Link} to="/movies" size="huge" inverted>
                            Go to Movies!
                        </Button>
                    </div>
                ) : (
                    <div style={{ marginTop: "2em" }}>
                            <Button
                                onClick={() => modalStore.openModal(<LogIn />)}
                                size="huge" inverted>
                            Log In!
                            </Button>
                          
                            <Button
                                onClick={() => modalStore.openModal(<Register />)}
                                    size="huge" inverted>
                                    Register!
                                </Button>
                    </div>
                )}
            </Container>
        </Segment>
    );
});

export default Home;

