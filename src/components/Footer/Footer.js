import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';
import logo from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <Container>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <div className="footer-info">
                <div className="d-flex align-items-center mb-3">
                  <img src={logo} alt="HIV Treatment Center" className="footer-logo me-2" />
                  <h5 className="mb-0 text-white text-start">HIV Treatment Center</h5>
                </div>
                <p className="text-start">
                  Cam kết cung cấp điều trị và chăm sóc HIV toàn diện với tiêu chuẩn cao nhất về chất lượng y tế và hỗ trợ tận tâm.
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
                <h4 className="text-start">Liên kết Nhanh</h4>
                <ul className="text-start">
                  <li><Link to="/">Trang chủ</Link></li>
                  <li><Link to="/about">Về chúng tôi</Link></li>
                  <li><Link to="/services">Dịch vụ của chúng tôi</Link></li>
                  <li><Link to="/doctors">Chuyên gia của chúng tôi</Link></li>
                  <li><Link to="/news">Tin tức mới nhất</Link></li>
                  <li><Link to="/contact">Liên hệ với chúng tôi</Link></li>
                </ul>
              </div>
            </Col>
            
            <Col lg={3} md={6} sm={12}>
              <div className="footer-links">
                <h4 className="text-start">Dịch vụ của chúng tôi</h4>
                <ul className="text-start">
                  <li><Link to="/services/testing">Xét nghiệm & Sàng lọc HIV</Link></li>
                  <li><Link to="/services/treatment">Liệu pháp Kháng retrovirus</Link></li>
                  <li><Link to="/services/prevention">PrEP & Phòng ngừa</Link></li>
                  <li><Link to="/services/counseling">Dịch vụ Tư vấn</Link></li>
                  <li><Link to="/services/support">Nhóm hỗ trợ</Link></li>
                  <li><Link to="/services/education">Giáo dục Cộng đồng</Link></li>
                </ul>
              </div>
            </Col>
            
            <Col lg={3} md={6} sm={12}>
              <div className="footer-contact">
                <h4 className="text-start">Liên hệ với chúng tôi</h4>
                <div className="contact-info text-start">
                  <p>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    123 Đường Trung tâm Y tế, Phòng 200<br />
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-bottom">
        <Container>
          <Row>
            <Col md={6}>
              <div className="copyright text-start">
                &copy; {new Date().getFullYear()} HIV Treatment Center. Đã đăng ký Bản quyền
              </div>
            </Col>
            <Col md={6}>
              <div className="footer-bottom-links text-start">
                <a href="#">Chính sách Bảo mật</a>
                <a href="#">Điều khoản Dịch vụ</a>
                <a href="#">Sơ đồ trang web</a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 