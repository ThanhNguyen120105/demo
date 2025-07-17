import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner 
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faEnvelope, 
  faLock, 
  faPhone, 
  faUser, 
  faCalendarAlt, 
  faVenus,
  faMars,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { managerAPI } from '../../services/api';

const CreateStaffAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    fullName: '',
    birthdate: '',
    gender: 'MALE'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Phone validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Họ và tên là bắt buộc';
    }

    // Birthdate validation
    if (!formData.birthdate) {
      errors.birthdate = 'Ngày sinh là bắt buộc';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const result = await managerAPI.createStaffAccount(formData);

      if (result.success) {
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          phoneNumber: '',
          fullName: '',
          birthdate: '',
          gender: 'MALE'
        });
      } else {
        setError(result.message || 'Có lỗi xảy ra khi tạo tài khoản');
      }
    } catch (error) {
      console.error('Error creating staff account:', error);
      setError('Không thể kết nối tới server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      phoneNumber: '',
      fullName: '',
      birthdate: '',
      gender: 'MALE'
    });
    setValidationErrors({});
    setError('');
    setSuccess(false);
  };

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                Tạo tài khoản Staff
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {success && (
                <Alert variant="success" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  Tạo tài khoản Staff thành công!
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faEnvelope} className="me-2 text-primary" />
                        Email *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Nhập email"
                        isInvalid={!!validationErrors.email}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faLock} className="me-2 text-primary" />
                        Mật khẩu *
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu"
                        isInvalid={!!validationErrors.password}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                        Họ và tên *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên"
                        isInvalid={!!validationErrors.fullName}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.fullName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
                        Số điện thoại *
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                        isInvalid={!!validationErrors.phoneNumber}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.phoneNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                        Ngày sinh *
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        isInvalid={!!validationErrors.birthdate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.birthdate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={formData.gender === 'MALE' ? faMars : faVenus} className="me-2 text-primary" />
                        Giới tính *
                      </Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Làm mới
                  </Button>
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Tạo tài khoản Staff
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateStaffAccount;
