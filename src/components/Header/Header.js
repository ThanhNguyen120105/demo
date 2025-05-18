import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCalendarAlt, faUser, faQuestionCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <header className="header">
      <div className="top-bar">
        <Container>
          <div className="top-bar-content">
            <div className="top-bar-contact">
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <span>Hotline: (800) 123-4567</span>
              </div>
            </div>
            <div className="top-bar-actions">
              <div className="action-item">
                <FontAwesomeIcon icon={faUser} />
                <span>For Patients</span>
              </div>
              <div className="action-item">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>FAQ</span>
              </div>
              <div className="action-item appointment-btn">
                <Link to="/appointment" className="top-bar-appointment-link">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Navbar expanded={expanded} expand="lg" className="main-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src="/logo.png" alt="HIV Treatment Center" className="logo" />
          </Navbar.Brand>
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
              
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle as={Nav.Link}>
                  Services
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/services/testing" onClick={() => setExpanded(false)}>HIV Testing</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/services/treatment" onClick={() => setExpanded(false)}>Treatment Programs</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/services/prevention" onClick={() => setExpanded(false)}>Prevention Services</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/services/counseling" onClick={() => setExpanded(false)}>Counseling</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              <Nav.Link as={Link} to="/doctors" onClick={() => setExpanded(false)}>Our Specialists</Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={() => setExpanded(false)}>About Us</Nav.Link>
              <Nav.Link as={Link} to="/news" onClick={() => setExpanded(false)}>News & Research</Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)}>Contact</Nav.Link>
            </Nav>
            <div className="navbar-buttons">
              <Button variant="outline-primary" className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
              <Button 
                variant="primary" 
                className="appointment-btn"
                as={Link}
                to="/appointment"
                onClick={() => setExpanded(false)}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Book Appointment
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 