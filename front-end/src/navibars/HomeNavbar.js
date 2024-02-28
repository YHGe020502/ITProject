import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import logoImage from '../images/MLH-Logo.jpg';
import '../components/customCss.css';

export default function HomeNavbar() {
  return (
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
          <span className="custom-font">Music Library</span>
        </Navbar.Brand>
        <Button as={Link} to="/" variant="outline-primary" className="ml-auto custom-button2">
          Home
        </Button>
      </Container>
    </Navbar>
  );
}
