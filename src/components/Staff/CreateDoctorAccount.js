import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, faEnvelope, faLock, faPhone, faUser, faCalendarAlt, 
  faVenusMars, faImage, faHospital, faStethoscope, faAward, faFileText 
} from '@fortawesome/free-solid-svg-icons';
import { doctorAPI } from '../../services/api';

const CreateDoctorAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    birthdate: '',
    gender: '',
    avatarURL: '',
    specialization: '',
    hospital: '',
    description: '',
    awards: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [validated, setValidated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.content) {
      setMessage({ type: '', content: '' });
    }
  };

  const validateForm = () => {
    const { email, password, fullName, phoneNumber } = formData;
    
    if (!email || !password || !fullName || !phoneNumber) {
      setMessage({ type: 'danger', content: 'Vui lòng điền đầy đủ thông tin' });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'danger', content: 'Email không hợp lệ' });
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage({ type: 'danger', content: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return false;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setMessage({ type: 'danger', content: 'Số điện thoại không hợp lệ (10-11 số)' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const result = await doctorAPI.createDoctor(formData);
      
      if (result.success) {
        setMessage({ type: 'success', content: result.message });
        // Reset form after successful creation
        setFormData({
          email: '',
          password: '',
          fullName: '',
          phoneNumber: '',
          birthdate: '',
          gender: '',
          avatarURL: '',
          specialization: '',
          hospital: '',
          description: '',
          awards: ''
        });
        setValidated(false);
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Create doctor account error:', error);
      setMessage({ 
        type: 'danger', 
        content: 'Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      birthdate: '',
      gender: '',
      avatarURL: '',
      specialization: '',
      hospital: '',
      description: '',
      awards: ''
    });
    setMessage({ type: '', content: '' });
    setValidated(false);
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <FontAwesomeIcon icon={faUserMd} size="2x" className="mb-2" />
              <h3 className="mb-0">Tạo Tài Khoản Bác Sĩ</h3>
              <p className="mb-0 mt-2">Tạo tài khoản mới cho bác sĩ trong hệ thống</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {message.content && (
                <Alert variant={message.type} className="mb-4">
                  {message.content}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Họ và tên <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập họ và tên
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="doctor@example.com"
                        required
                        disabled={loading}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập email hợp lệ
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faPhone} className="me-2" />
                        Số điện thoại <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="0901234567"
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập số điện thoại hợp lệ
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faLock} className="me-2" />
                        Mật khẩu <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                        required
                        disabled={loading}
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Thông tin cá nhân */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Ngày sinh
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faVenusMars} className="me-2" />
                        Giới tính
                      </Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                        Chuyên khoa
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="VD: Điều trị HIV/AIDS"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Thông tin công việc */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faHospital} className="me-2" />
                        Bệnh viện
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        placeholder="Tên bệnh viện nơi công tác"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faImage} className="me-2" />
                        Ảnh đại diện
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="avatarURL"
                        value={formData.avatarURL}
                        onChange={handleInputChange}
                        placeholder="https://example.com/avatar.jpg"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Mô tả chi tiết */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faFileText} className="me-2" />
                        Mô tả
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả kinh nghiệm, chuyên môn của bác sĩ..."
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faAward} className="me-2" />
                        Giải thưởng & Thành tựu
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="awards"
                        value={formData.awards}
                        onChange={handleInputChange}
                        placeholder="Các giải thưởng, thành tựu đã đạt được..."
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleReset}
                    disabled={loading}
                    className="me-md-2"
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Reset
                  </Button>
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUserMd} className="me-2" />
                        Tạo Tài Khoản
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

export default CreateDoctorAccount;
