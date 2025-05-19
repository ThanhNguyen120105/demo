import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faCalendarAlt, 
  faUser, 
  faQuestionCircle, 
  faSearch, 
  faSignInAlt, 
  faHospital,
  faHome,
  faStethoscope,
  faNotesMedical,
  faInfoCircle,
  faNewspaper,
  faEnvelope,
  faHeartbeat,
  faUserMd,
  faLocationArrow,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="header">
      <div className="top-bar">
        <Container>
          <div className="top-bar-content">
            <div className="top-bar-contact">
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} className="pulse" />
                <span>Hotline: (800) 123-4567</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faHospital} />
                <span>24/7 Emergency</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faLocationArrow} />
                <span>123 Medical Center Dr</span>
              </div>
            </div>
            <div className="top-bar-actions">
              <div className="action-item">
                <FontAwesomeIcon icon={faUser} />
                <span>Patients</span>
              </div>
              <div className="action-item">
                <FontAwesomeIcon icon={faHeartbeat} />
                <span>Services</span>
              </div>
              <div className="action-item">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>FAQ</span>
              </div>
              <div className="top-auth-buttons">
                <Link to="/login" className="top-auth-link login-link">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="top-auth-link signup-link">
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Navbar expanded={expanded} expand="lg" className="main-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-container">
            <div className="brand-logo">
              <img src="/logo.png" alt="HIV Treatment Center" className="logo" />
              <div className="brand-text">
                <span className="brand-name">HIV Treatment Center</span>
                <span className="brand-tagline">Compassionate Care. Better Lives.</span>
              </div>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setExpanded(expanded ? false : "expanded")}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto main-nav">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faHome} className="nav-icon" />
                  <span>Home</span>
                </div>
              </Nav.Link>
              
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle as={Nav.Link}>
                  <div className="nav-icon-container">
                    <FontAwesomeIcon icon={faNotesMedical} className="nav-icon" />
                    <span>Services</span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/services/testing" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faStethoscope} className="dropdown-icon" /> HIV Testing
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/services/treatment" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faNotesMedical} className="dropdown-icon" /> Treatment Programs
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/services/prevention" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faHeartbeat} className="dropdown-icon" /> Prevention Services
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/services/counseling" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faUser} className="dropdown-icon" /> Counseling
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/appointment-history" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="dropdown-icon" /> Appointment History
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              <Nav.Link as={Link} to="/doctors" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faUserMd} className="nav-icon" />
                  <span>Our Specialists</span>
                </div>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/appointment-history" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
                  <span>Appointments</span>
                </div>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/about" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                  <span>About Us</span>
                </div>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/news" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faNewspaper} className="nav-icon" />
                  <span>News & Research</span>
                </div>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
                  <span>Contact</span>
                </div>
              </Nav.Link>
            </Nav>

            <div className="header-action-buttons">
              {showSearch ? (
                <div className="search-container animated fadeIn">
                  <Form className="d-flex">
                    <div className="search-input-wrapper">
                      <FontAwesomeIcon icon={faSearch} className="search-icon" />
                      <Form.Control
                        type="search"
                        placeholder="Search..."
                        className="search-input"
                        aria-label="Search"
                        autoFocus
                      />
                      <Button 
                        variant="link" 
                        className="search-close-btn" 
                        onClick={() => setShowSearch(false)}
                      >
                        ✕
                      </Button>
                    </div>
                  </Form>
                </div>
              ) : (
                <Button 
                  variant="outline-primary" 
                  className="search-btn"
                  onClick={() => {setShowSearch(true); setExpanded(false);}}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              )}
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