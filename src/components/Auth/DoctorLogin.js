import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt, faUserMd, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, updateUserAuth } = useAuth();
  
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
    if (isAuthenticated && user && user.role === 'DOCTOR') {
      navigate('/doctor/dashboard', { replace: true });
    }
  }, [navigate, isAuthenticated, user]);

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
    
    // Validate form
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('DoctorLogin - Attempting login for:', email);
      const result = await authAPI.loginAsDoctor({ email, password });
      console.log('DoctorLogin - Login result:', result);
      
      if (result.success) {
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        
        // Cập nhật AuthContext với thông tin doctor
        const doctorUser = {
          ...result.data,
          token: result.token || localStorage.getItem('token'),
          role: 'DOCTOR'
        };
        
        console.log('DoctorLogin - Setting doctor user in AuthContext:', doctorUser);
        updateUserAuth(doctorUser, true);
        
        // Chờ một chút để hiển thị message
        setTimeout(() => {
          navigate('/doctor/dashboard', { 
            replace: true,
            state: { message: 'Chào mừng bác sĩ đến với hệ thống!' }
          });
        }, 1500); // Tăng thời gian hiển thị thông báo thành công
      } else {
        // Xử lý các trường hợp lỗi cụ thể
        let errorMessage = 'Đăng nhập thất bại';
        if (result.message) {
          if (result.message.includes('password') || result.message.includes('mật khẩu')) {
            errorMessage = 'Tài khoản hoặc mật khẩu không chính xác';
          } else if (result.message.includes('email') || result.message.includes('not found')) {
            errorMessage = 'Email không tồn tại trong hệ thống';
          } else if (result.message.includes('role') || result.message.includes('permission')) {
            errorMessage = 'Tài khoản không có quyền truy cập vào hệ thống bác sĩ';
          } else {
            errorMessage = result.message;
          }
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Doctor login error:', error);
      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';
      
      // Xử lý các loại lỗi network
      if (!navigator.onLine) {
        errorMessage = 'Không có kết nối internet. Vui lòng kiểm tra và thử lại.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Kết nối đến server quá chậm. Vui lòng thử lại sau.';
      } else if (error.response) {
        // Xử lý response error
        switch (error.response.status) {
          case 401:
            errorMessage = 'Email hoặc mật khẩu không chính xác';
            break;
          case 403:
            errorMessage = 'Tài khoản không có quyền truy cập';
            break;
          case 404:
            errorMessage = 'Email không tồn tại trong hệ thống';
            break;
          case 500:
            errorMessage = 'Lỗi server. Vui lòng thử lại sau';
            break;
          default:
            errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
        }
      }
      setError(errorMessage);
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

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={isLoading}
                    className="auth-btn w-100"
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
