import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Container>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <div className="footer-info">
                <img src="/logo-white.png" alt="HIV Treatment Center" className="footer-logo" />
                <p>
                  Dedicated to providing comprehensive HIV treatment and care with the highest standards of 
                  medical excellence and compassionate support.
                </p>
                <div className="footer-social">
                  <a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                  <a href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
                  <a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
                  <a href="#" className="social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                  <a href="#" className="social-icon"><FontAwesomeIcon icon={faYoutube} /></a>
                </div>
              </div>
            </Col>
            
            <Col lg={2} md={6} sm={12}>
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/services">Our Services</Link></li>
                  <li><Link to="/doctors">Our Specialists</Link></li>
                  <li><Link to="/news">Latest News</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>
            </Col>
            
            <Col lg={3} md={6} sm={12}>
              <div className="footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li><Link to="/services/testing">HIV Testing & Screening</Link></li>
                  <li><Link to="/services/treatment">Antiretroviral Therapy</Link></li>
                  <li><Link to="/services/prevention">PrEP & Prevention</Link></li>
                  <li><Link to="/services/counseling">Counseling Services</Link></li>
                  <li><Link to="/services/support">Support Groups</Link></li>
                  <li><Link to="/services/education">Community Education</Link></li>
                </ul>
              </div>
            </Col>
            
            <Col lg={3} md={6} sm={12}>
              <div className="footer-contact">
                <h4>Contact Us</h4>
                <div className="contact-info">
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    123 Medical Center Drive, Suite 200<br />
                    New York, NY 10001
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    <a href="tel:+18001234567">(800) 123-4567</a>
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    <a href="mailto:info@hivtreatmentcenter.org">info@hivtreatmentcenter.org</a>
                  </p>
                </div>
                <div className="footer-appointment">
                  <Button variant="light">Book an Appointment</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom">
        <Container>
          <Row>
            <Col md={6}>
              <div className="copyright">
                &copy; {new Date().getFullYear()} HIV Treatment Center. All Rights Reserved.
              </div>
            </Col>
            <Col md={6}>
              <div className="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Sitemap</a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 