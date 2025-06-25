import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faCalendarAlt, 
  faUser, 
  faSignInAlt, 
  faHospital,
  faInfoCircle,
  faNewspaper,
  faEnvelope,
  faLocationArrow,
  faUserPlus,
  faSignOutAlt,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardRoute, isDoctor, isCustomer, isStaff } from '../../constants/userRoles';
import { getUserInfoFromToken } from '../../utils/jwtUtils';
import './Header.css';
import logo from '../../assets/images/logo.png';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  // Debug: Log user data
  console.log('Header - User data:', user);
  console.log('Header - isAuthenticated:', isAuthenticated);
  console.log('Header - localStorage user:', localStorage.getItem('user'));
    // Helper function để lấy display name
  const getDisplayName = (user) => {
    if (!user) return 'Người dùng';
    
    // Debug: log tất cả properties của user
    console.log('Header - All user properties:', Object.keys(user));
    console.log('Header - User fullName:', user.fullName);
    console.log('Header - User name:', user.name);
    console.log('Header - User username:', user.username);
    console.log('Header - User email:', user.email);
    console.log('Header - User doctorName:', user.doctorName);
    console.log('Header - User displayName:', user.displayName);
    
    // Nếu không có thông tin user đầy đủ, thử decode từ token
    if (!user.fullName && !user.name && !user.username && !user.email && user.token) {
      console.log('Header - Trying to decode user info from token');
      const tokenInfo = getUserInfoFromToken(user.token);
      console.log('Header - Token info:', tokenInfo);
      
      if (tokenInfo && tokenInfo.fullName) {
        return tokenInfo.fullName;
      }
      if (tokenInfo && tokenInfo.email) {
        return tokenInfo.email.split('@')[0];
      }
    }
    
    // Logic cũ
    const candidates = [
      user.fullName,
      user.name, 
      user.username,
      user.doctorName,
      user.displayName,
      user.email?.split('@')[0]
    ];
    
    for (const candidate of candidates) {
      if (candidate && 
          candidate !== 'User' && 
          candidate !== 'user' && 
          !candidate.includes('@example.com')) {
        return candidate;
      }
    }    
    return 'Người dùng';
  };
  const handleLogout = () => {
    logout();
    setExpanded(false);
    setDropdownOpen(false);
    // Điều hướng về trang chủ sau khi đăng xuất
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to check if current path matches nav item
  const isActive = (path) => {
    return location.pathname === path;
  };
  // Function to check if current path is in dropdown items
  const isDropdownActive = () => {
    const dropdownPaths = ['/about', '/news', '/contact'];
    return dropdownPaths.includes(location.pathname);
  };

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="top-bar">
        <Container>          <div className="top-bar-content">
            <div className="top-bar-left">
              {/* Có thể để logo hoặc tên công ty ở đây */}
            </div>
            
            <div className="top-bar-right">
              {/* Phần thông tin liên hệ */}
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
              
              {/* Divider */}
              <div className="top-bar-divider"></div>
              
              {/* Auth section */}
              <div className="top-bar-auth">
                {isAuthenticated ? (
                  <div className="user-dropdown top-user-dropdown" ref={dropdownRef}>
                    <div 
                      className="top-auth-link user-link"
                      onClick={toggleDropdown}
                      style={{ cursor: 'pointer' }}
                    >                      <FontAwesomeIcon icon={faUserCircle} />
                      <span>Xin chào, {getDisplayName(user)}</span>
                    </div>                    {dropdownOpen && (
                      <div className="dropdown-menu show">
                        <Link to={getDashboardRoute(user)} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          {isDoctor(user) ? 'Dashboard bác sĩ' : 'Thông tin cá nhân'}
                        </Link>
                        
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                          Đăng xuất
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="top-auth-buttons">
                    <Link to="/login" className="top-auth-link login-link">
                      <FontAwesomeIcon icon={faSignInAlt} />
                      <span>Đăng nhập</span>
                    </Link>
                    <Link to="/signup" className="top-auth-link signup-link">
                      <FontAwesomeIcon icon={faUserPlus} />
                      <span>Đăng ký</span>
                    </Link>
                  </div>                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="main-navbar" expanded={expanded}>
        <Container>
          <div className="navbar-wrapper">
            {/* Phần 1: Logo */}
            <div className="navbar-section navbar-logo">
              <Navbar.Brand as={Link} to="/" className="brand-container">
                <div className="brand-logo">
                  <img src={logo} alt="HIV Treatment Center" className="logo" />
                </div>
              </Navbar.Brand>
            </div>

            {/* Toggle button cho mobile */}
            <Navbar.Toggle 
              aria-controls="main-navbar-nav" 
              onClick={() => setExpanded(expanded ? false : "expanded")}
              className="main-navbar-toggle"
            />

            <Navbar.Collapse id="main-navbar-nav">
              {/* Phần 2: Navigation Options */}              <div className="navbar-section navbar-navigation">
                <Nav className="main-nav">
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    <div className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                      <span>Trang chủ</span>
                    </div>
                  </Nav.Link>
                  
                  <Nav.Link as={Link} to="/doctors" onClick={() => setExpanded(false)}>
                    <div className={`nav-item ${isActive('/doctors') ? 'active' : ''}`}>
                      <span>Chuyên gia của chúng tôi</span>
                    </div>
                  </Nav.Link>                  <Nav.Link as={Link} to="/qna" onClick={() => setExpanded(false)}>
                    <div className={`nav-item ${isActive('/qna') ? 'active' : ''}`}>
                      <span>Hỏi & Đáp</span>
                    </div>
                  </Nav.Link>
                  
                  {/* Chỉ hiển thị cho CUSTOMER */}
                  {user?.role === 'CUSTOMER' && (
                    <Nav.Link as={Link} to="/lich-su-kham-benh" onClick={() => setExpanded(false)}>
                      <div className={`nav-item ${isActive('/lich-su-kham-benh') ? 'active' : ''}`}>
                        <span>Lịch sử khám bệnh</span>
                      </div>
                    </Nav.Link>
                  )}
                  
                  <Dropdown className="nav-dropdown">
                    <Dropdown.Toggle as={Nav.Link}>
                      <div className={`nav-item ${isDropdownActive() ? 'active' : ''}`}>
                        <span>Giới thiệu & Tài nguyên</span>
                      </div>
                    </Dropdown.Toggle>                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/about" onClick={() => setExpanded(false)}>
                        <FontAwesomeIcon icon={faInfoCircle} className="dropdown-icon" /> Về chúng tôi
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/news" onClick={() => setExpanded(false)}>
                        <FontAwesomeIcon icon={faNewspaper} className="dropdown-icon" /> Tin tức & Nghiên cứu
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/contact" onClick={() => setExpanded(false)}>
                        <FontAwesomeIcon icon={faEnvelope} className="dropdown-icon" /> Liên hệ
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </div>

              {/* Phần 3: Thông báo và Đặt lịch hẹn */}
              <div className="navbar-section navbar-actions">
                <div className="header-action-buttons">
                  <NotificationBell />
                  
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
              </div>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;