import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Pagination, Button} from 'react-bootstrap';
import axios from 'axios';
import backgroundImage from '../images/bluebackground.png';
import LogoutNavbar from '../navibars/LogoutNavbar';

const ITEMS_PER_PAGE = 12;


function ResidentPage() {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refereshPage, setRefereshPage] = useState(0);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL+'user/manage/')
      .then(response => {
        const familyMembers = response.data.data.filter(user => user.role === "family_member");
        setResidents(familyMembers);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
}, [refereshPage])
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  function handleDelete(event,username) {
    event.stopPropagation();
    console.log(username);
    axios.delete(process.env.REACT_APP_BACKEND_URL+'user/manage/'+username)
      .then(response => {
        // Handle success response
        console.log(response.data.message);
        setRefereshPage(refereshPage => refereshPage + 1)
      })
      .catch(error => {
        // Handle error response
        console.error('Error fetching data:', error);
      });
  }

  const filteredResidents = residents.filter(resident => {
    const fullName = `${resident.firstname} ${resident.lastname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const indexOfLastResident = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstResident = indexOfLastResident - ITEMS_PER_PAGE;
  const currentResidents = filteredResidents.slice(indexOfFirstResident, indexOfLastResident);

  const paginate = (pageNumber) => {
    
  };

  return (
    <div>
      <LogoutNavbar />
      <div style={backgroundStyle} className="d-flex flex-column">
        <Container>
          <h1 className="mb-4 text-center" style={{ color: '#fff', fontSize: '50px', fontWeight: 'bold' }}>
            Welcome to Staff Page
          </h1>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="searchTerm">
              <Form.Label className="mb-2"> Please enter the resident name to access to their own home page</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name here"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
          </Form>
          <Row>
            {currentResidents.map(resident => (
              <Col key={resident.username} md={4} sm={6} xs={12}>
                <Card className="mb-4 resident-card">
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div>
                      <Link to={`/MusicListHome/${resident.username}`} className="text-decoration-none">
                        <Card.Title className="resident-title">{resident.firstname} {resident.lastname}</Card.Title>
                        <Card.Text>
                          Username: {resident.username}
                        </Card.Text>
                      </Link>
                    </div>
                    <Button 
                      variant="danger" 
                      onClick={(e) => handleDelete(e, resident.username)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="pagination-container">
            {filteredResidents.length > ITEMS_PER_PAGE && (
              <Pagination className="justify-content-center">
                {Array.from({ length: Math.ceil(filteredResidents.length / ITEMS_PER_PAGE) }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default ResidentPage;
