import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Button, Toast } from 'react-bootstrap';
import logoImage from '../images/MLH-Logo.jpg';
import '../components/customCss.css';

export default function LogoutNavbar() {
  const [show, setShow] = useState(false);

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
        <Button variant="outline-primary" onClick={() => setShow(true)} className="ml-auto custom-button2">
          Sign out
        </Button>
        <Toast show={show} onClose={() => setShow(false)} className="custom-toast">
          <Toast.Header>
            <strong className="me-auto"></strong>
          </Toast.Header>
          <Toast.Body>Are you sure you want to sign out?</Toast.Body>
          <div className="d-flex justify-content-around mt-2">
            <Button as={Link} to="/" style={{ backgroundColor: '#7dc5eb', borderColor: '#7dc5eb' }}variant="info" className="mr-2">
              Yes
            </Button>
            <Button variant="info" style={{ backgroundColor: '#7dc5eb', borderColor: '#7dc5eb' }}onClick={() => setShow(false)}>No</Button>
          </div>
          <div className="mt-2"></div>
        </Toast>
      </Container>
    </Navbar>
  );
}