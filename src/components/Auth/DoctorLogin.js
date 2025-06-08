import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUserMd, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '../../services/api';
import './Auth.css';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  const { email, password } = formData;

  // Kiểm tra xem đã đăng nhập chưa và có phải doctor không
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'DOCTOR') {
          navigate('/doctor/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Xóa lỗi và success message khi người dùng nhập
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.loginAsDoctor({ email, password });
      
      if (result.success) {
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Chờ một chút để hiển thị message
        setTimeout(() => {
          navigate('/doctor/dashboard', { 
            replace: true,
            state: { message: 'Chào mừng bác sĩ đến với hệ thống!' }
          });
        }, 1000);
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Doctor login error:', error);
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="auth-card shadow-lg">
              <Card.Header className="text-center bg-primary text-white py-4">
                <div className="auth-header">
                  <FontAwesomeIcon icon={faUserMd} size="3x" className="mb-3" />
                  <h2 className="mb-0">Đăng nhập Bác sĩ</h2>
                  <p className="mb-0 mt-2">Truy cập hệ thống quản lý bệnh nhân</p>
                </div>
              </Card.Header>
              
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-3">
                    <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                    {error}
                  </Alert>
                )}
                
                {successMessage && (
                  <Alert variant="success" className="mb-3">
                    <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                    {successMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="doctor@example.com"
                        required
                        disabled={isLoading}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faLock} />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                        required
                        disabled={isLoading}
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg"
                      disabled={isLoading}
                      className="auth-btn"
                    >
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          {' '}Đang đăng nhập...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                          Đăng nhập
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <div className="auth-links">
                    <Link to="/login" className="text-decoration-none">
                      ← Quay lại đăng nhập thường
                    </Link>
                  </div>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      Dành cho bác sĩ được cấp tài khoản bởi nhân viên quản lý
                    </small>
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

export default DoctorLogin;
