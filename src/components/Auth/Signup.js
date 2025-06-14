import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faPhone, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { email, name, phone, password, confirmPassword } = formData;

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Xóa lỗi validation khi người dùng nhập
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
    
    // Xóa lỗi chung
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    } else if (name.trim().length < 2) {
      errors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    if (!email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    if (!phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', { email, name, phone, password });
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      console.log('Calling register API...');
      const result = await register({
        email,
        name: name.trim(),
        phone: phone.trim(),
        password
      });
      
      console.log('Register result:', result);
      
      if (result.success) {
        console.log('Register successful, redirecting to login...');
        // Sau khi đăng ký thành công, chuyển đến trang login
        navigate('/login', { 
          replace: true,
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập.',
            email: email // Pre-fill email trong form login
          }
        });
      } else {
        console.log('Register failed:', result.message);
        // Hiển thị lỗi cho người dùng (error sẽ được hiển thị từ AuthContext)
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      // Lỗi sẽ được hiển thị thông qua error state từ AuthContext
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
                    <FontAwesomeIcon icon={faUserPlus} className="auth-icon" />
                  </div>
                  <h2 className="auth-title">Tạo Tài Khoản</h2>
                  <p className="auth-subtitle">Tham gia cộng đồng y tế của chúng tôi</p>
                </div>
                
                {/* Hiển thị thông báo lỗi */}
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    {error}
                  </Alert>
                )}
                
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
                        className={`auth-input ${validationErrors.email ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                      />
                      {validationErrors.email && (
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.email}
                        </Form.Control.Feedback>
                      )}
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
                        className={`auth-input ${validationErrors.name ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                      />
                      {validationErrors.name && (
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.name}
                        </Form.Control.Feedback>
                      )}
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
                        className={`auth-input ${validationErrors.phone ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                      />
                      {validationErrors.phone && (
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.phone}
                        </Form.Control.Feedback>
                      )}
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
                        className={`auth-input ${validationErrors.password ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                      />
                      {validationErrors.password && (
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.password}
                        </Form.Control.Feedback>
                      )}
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
                        className={`auth-input ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                      />
                      {validationErrors.confirmPassword && (
                        <Form.Control.Feedback type="invalid">
                          {validationErrors.confirmPassword}
                        </Form.Control.Feedback>
                      )}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang tạo tài khoản...
                      </>
                    ) : (
                      <>
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    Tạo Tài Khoản
                      </>
                    )}
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