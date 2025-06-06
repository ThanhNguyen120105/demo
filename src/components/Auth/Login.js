import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Add actual login functionality here
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
                    <FontAwesomeIcon icon={faUser} className="auth-icon" />
                  </div>
                  <h2 className="auth-title">Chào Mừng Trở Lại</h2>
                  <p className="auth-subtitle">Đăng nhập để tiếp tục</p>
                </div>
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
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

                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="auth-input-icon">
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu của bạn"
                        className="auth-input"
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox" 
                      id="rememberMe" 
                      label="Ghi nhớ đăng nhập" 
                      className="auth-checkbox"
                    />
                    <Link to="/forgot-password" className="auth-link forgot-link">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="auth-button w-100"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    Đăng Nhập
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="auth-switch-text">
                    Bạn chưa có tài khoản?{' '}
                    <Link to="/signup" className="auth-link">
                      Đăng ký
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

export default Login; 