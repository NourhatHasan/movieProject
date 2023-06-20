import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound() {
    return (
        <Segment vertical style={{ marginTop: '7em' }}>
            <Container text textAlign="center">
                <Header as="h2" icon>
                    <Icon name="search" />
                    Oops... Could not find the page.
                </Header>
                <p>Please check the URL or try again later.</p>
                <Button primary as={Link} to="/movies">
                    Go back to Movies
                </Button>
            </Container>
        </Segment>
    );
}
