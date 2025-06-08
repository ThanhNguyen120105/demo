import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUser, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const { email, password } = formData;

  // Chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state?.from?.pathname]);

  // Xóa lỗi khi component unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Xóa lỗi khi người dùng nhập
    if (error) {
      clearError();
    }
    
    // Xóa success message khi người dùng nhập
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Chuyển hướng được xử lý trong useEffect
        console.log('Login successful');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
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
                
                {/* Hiển thị thông báo thành công */}
                {successMessage && (
                  <Alert variant="success" className="mb-4">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    {successMessage}
                  </Alert>
                )}
                
                {/* Hiển thị thông báo lỗi */}
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    {error}
                  </Alert>
                )}
                
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang đăng nhập...
                      </>
                    ) : (
                      <>
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    Đăng Nhập
                      </>
                    )}
                  </Button>
                </Form>                <div className="text-center mt-4">
                  <p className="auth-switch-text">
                    Bạn chưa có tài khoản?{' '}
                    <Link to="/signup" className="auth-link">
                      Đăng ký
                    </Link>
                  </p>
                    <div className="mt-2">
                    <Link to="/doctor/login" className="text-primary text-decoration-none">
                      <FontAwesomeIcon icon={faUserMd} className="me-2" />
                      Đăng nhập dành cho Bác sĩ
                    </Link>
                  </div>
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