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
  faUserPlus,
  faUserTie,
  faClipboardList
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
                <span>Đường dây nóng: (800) 123-4567</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faHospital} />
                <span>Cấp cứu 24/7</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faLocationArrow} />
                <span>123 Đường Trung tâm Y tế</span>
              </div>
            </div>
            <div className="top-bar-actions">
              <div className="action-item">
                <FontAwesomeIcon icon={faUser} />
                <span>Bệnh nhân</span>
              </div>
              <div className="action-item">
                <FontAwesomeIcon icon={faHeartbeat} />
                <span>Dịch vụ</span>
              </div>
              <div className="action-item">
                <Link to="/doctor/dashboard" className="action-link">
                  <FontAwesomeIcon icon={faUserMd} />
                  <span>Bác sĩ</span>
                </Link>
              </div>
              <div className="action-item">
                <Link to="/staff/doctor-management" className="action-link">
                  <FontAwesomeIcon icon={faUserTie} />
                  <span>Staff</span>
                </Link>
              </div>
              <div className="action-item">
                <Link to="/qna" className="action-link">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                  <span>Hỏi & Đáp</span>
                </Link>
              </div>
              <div className="top-auth-buttons">
                <Link to="/login" className="top-auth-link login-link">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Đăng nhập</span>
                </Link>
                <Link to="/signup" className="top-auth-link signup-link">
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Đăng ký</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Navbar expand="lg" className="main-navbar" expanded={expanded}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-container">
            <div className="brand-logo">
              <img src={logo} alt="HIV Treatment Center" className="logo" />
              
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
                  <span>Trang chủ</span>
                </div>
              </Nav.Link>
              
              
              
              <Nav.Link as={Link} to="/doctors" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faUserMd} className="nav-icon" />
                  <span>Chuyên gia của chúng tôi</span>
                </div>
              </Nav.Link>
              
              <Nav.Link as={Link} to="/appointment-history" onClick={() => setExpanded(false)}>
                <div className="nav-icon-container">
                  <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
                  <span>Lịch sử đặt hẹn</span>
                </div>
              </Nav.Link>
              
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle as={Nav.Link}>
                  <div className="nav-icon-container">
                    <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                    <span>Giới thiệu & Tài nguyên</span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/about" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faInfoCircle} className="dropdown-icon" /> Về chúng tôi
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/news" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faNewspaper} className="dropdown-icon" /> Tin tức & Nghiên cứu
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/qna" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faQuestionCircle} className="dropdown-icon" /> Hỏi & Đáp
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/contact" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faEnvelope} className="dropdown-icon" /> Liên hệ
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
              <Dropdown className="nav-dropdown">
                <Dropdown.Toggle as={Nav.Link}>
                  <div className="nav-icon-container">
                    <FontAwesomeIcon icon={faUserTie} className="nav-icon" />
                    <span>Quản lý</span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/staff/doctor-management" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faClipboardList} className="dropdown-icon" /> Quản lý Bác sĩ & Lịch hẹn
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/doctor/dashboard" onClick={() => setExpanded(false)}>
                    <FontAwesomeIcon icon={faUserMd} className="dropdown-icon" /> Dashboard Bác sĩ
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>

            <div className="header-action-buttons">
              {showSearch ? (
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <Form.Control 
                      type="text" 
                      placeholder="Tìm kiếm..." 
                      className="search-input" 
                      autoFocus 
                    />
                    <button 
                      className="search-close-btn" 
                      onClick={() => setShowSearch(false)}
                      aria-label="Close search"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline-secondary" 
                  className="search-btn" 
                  onClick={() => setShowSearch(true)}
                  aria-label="Search"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              )}
              
              <Button 
                variant="primary" 
                className="appointment-btn pulse-hover" 
                as={Link}
                to="/appointment"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Đặt lịch hẹn
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 