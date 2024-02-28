import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import backgroundImage from '../images/bluebackground.png';
import HomeNavbar from '../navibars/HomeNavbar'; 
import backButtonIcon from '../images/back-button-icon.png';

export default function Login() {
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
        <LoginForm />
        <Link to="/" style={{ position: 'absolute', top: '80px', left: '20px', textDecoration: 'none' }}>
                <img src={backButtonIcon} alt="Back to Music List Home" style={{ width: '30px', height: '30px' }} />
            </Link>
      </div>
      <div className="text-center mt-3">
        Haven't had an account?
        <a href="/signup"> Sign up Now</a>
      </div>
    </div>
  );
}




