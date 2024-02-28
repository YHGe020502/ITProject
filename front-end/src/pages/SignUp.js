import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignupForm from '../components/SignUpForm';
import backgroundImage from '../images/bluebackground.png';
import HomeNavbar from '../navibars/HomeNavbar'; 
import backButtonIcon from '../images/back-button-icon.png';

function Signup() {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div>
      <HomeNavbar />
    <div style={backgroundStyle} className="d-flex justify-content-center align-items-center">
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={6}>
            <SignupForm />
          </Col>
        </Row>
      </Container>
      <Link to="/login" style={{ position: 'absolute', top: '80px', left: '20px', textDecoration: 'none' }}>
                <img src={backButtonIcon} alt="Back to Music List Home" style={{ width: '30px', height: '30px' }} />
            </Link>
    </div>
    </div>
  );
}

export default Signup;

