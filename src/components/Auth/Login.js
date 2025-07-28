import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUser, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardRoute } from '../../constants/userRoles';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, isAuthenticated, user, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const { email, password } = formData;
  // Chuyển hướng nếu đã đăng nhập - redirect dựa trên role
  useEffect(() => {
    if (isAuthenticated && user) {
      // Ưu tiên redirect đến trang đích (nếu có)
      const from = location.state?.from?.pathname;
      
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else {
        // Auto-redirect dựa trên role của user
        const dashboardRoute = getDashboardRoute(user);
        console.log('Login - Auto-redirecting to:', dashboardRoute, 'for user role:', user.role);
        navigate(dashboardRoute, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.state?.from?.pathname]);

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
    e.preventDefault(); // Ngăn form tự động submit
    
    // Validate form
    if (!email || !password) {
      clearError();
      setError('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      clearError();
      setError('Email không hợp lệ');
      return;
    }
    
    try {
      const result = await login({ email, password });
      
      if (!result.success) {
        // Hiển thị lỗi từ API
        setError(result.message || 'Đăng nhập thất bại');
        return; // Thêm return để ngăn chặn việc tiếp tục xử lý
      }

      // Nếu đăng nhập thành công
      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
      // Chuyển hướng được xử lý trong useEffect
      console.log('Login successful');
      
    } catch (error) {
      console.error('Login error:', error);
      // Hiển thị lỗi từ API hoặc lỗi mặc định
      setError(error.message || 'Đã xảy ra lỗi khi đăng nhập');
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
                
                <Form onSubmit={handleSubmit} noValidate>
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
                    <Link to="/doctor-login" className="text-primary text-decoration-none">
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