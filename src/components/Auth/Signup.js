import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faPhone, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const { email, name, phone, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    console.log('Signup data:', formData);
    // Add actual signup functionality here
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="auth-icon-wrapper">
                    <FontAwesomeIcon icon={faUserPlus} className="auth-icon" />
                  </div>
                  <h2 className="auth-title">Tạo Tài Khoản</h2>
                  <p className="auth-subtitle">Tham gia cộng đồng y tế của chúng tôi</p>
                </div>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="auth-input-icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ email của bạn"
                        className="auth-input"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Họ và Tên</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="auth-input-icon">
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên đầy đủ của bạn"
                        className="auth-input"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số Điện Thoại</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="auth-input-icon">
                        <FontAwesomeIcon icon={faPhone} />
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại của bạn"
                        className="auth-input"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật Khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="auth-input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Tạo mật khẩu"
                        className="auth-input"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Xác Nhận Mật Khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="auth-input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Xác nhận mật khẩu của bạn"
                        className="auth-input"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="terms"
                      label="Tôi đồng ý với Điều khoản và Chính sách Bảo mật"
                      className="auth-checkbox"
                      required
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="auth-button w-100"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    Tạo Tài Khoản
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="auth-switch-text">
                    Bạn đã có tài khoản?{' '}
                    <Link to="/login" className="auth-link">
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup; 