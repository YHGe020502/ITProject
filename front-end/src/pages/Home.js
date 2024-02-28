import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import backgroundImage from '../images/bluebackground.png';
import logoImage from '../images/MLH-Logo.jpg';
import image1 from '../images/Music-Therapy.jpg';
import image2 from '../images/Martin-Luther-view-village_small-scaled.jpg';

function Home() {
    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
    };

    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>
                        <img
                            src={logoImage}
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                            alt="Music Library Logo"
                        />
                        <span className="custom-font">
                              Music Library
                            </span>
                    </Navbar.Brand>
                    <Button as={Link} to="/signup" variant="outline-primary" className="ml-auto custom-button2">
                        Sign Up
                    </Button>
                </Container>
            </Navbar>
            <div style={backgroundStyle} className="d-flex justify-content-center align-items-center">
                <Container>
                    <Row className="justify-content-center mt-5">
                        <Col xs={12} md={6}>
                            <Card>
                                <Carousel>
                                    <Carousel.Item>
                                        <Card.Img className="mb-3" variant="top" src={image1} style={{ width: '100%', height: '300px' }}/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Card.Img className="mb-3" variant="top" src={image2} style={{ width: '100%', height: '300px' }}/>
                                    </Carousel.Item>
                                    {/* Add more Carousel.Item with different images as needed */}
                                </Carousel>
                                <Card.Body>
                                    <Card.Title className="text-center custom-font1">Welcome to Music Library</Card.Title>
                                    <Card.Text className="text-center custom-font2">
                                        Explore and enjoy a wide variety of music in our library today.
                                    </Card.Text>
                                    <div className="text-center">
                                         <Button as={Link} to="/login" variant="outline-primary" className="custom-button">
                                             Log In
                                         </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default Home;
