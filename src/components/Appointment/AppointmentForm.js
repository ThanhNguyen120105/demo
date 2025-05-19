import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserMd, 
  faClock, 
  faCommentMedical, 
  faCheckCircle,
  faHeartbeat,
  faUser,
  faEnvelope,
  faPhone,
  faArrowRight,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    serviceTime: 'inHours',
    doctor: '',
    date: '',
    healthIssues: '',
    customerId: ''
  });
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [firstTimeInfo, setFirstTimeInfo] = useState({
    phone: '',
    name: '',
    dob: '',
    customerId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFirstTimeInputChange = (e) => {
    const { name, value } = e.target;
    setFirstTimeInfo({
      ...firstTimeInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId) {
      setShowFirstTimeModal(true);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const handleFirstTimeSubmit = (e) => {
    e.preventDefault();
    console.log('First time registration info:', firstTimeInfo);
    setShowFirstTimeModal(false);
  };

  return (
    <Container>
      <div className="simple-form-container">
        <div className="form-header">
          <div className="form-icon">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <h2 className="simple-form-title">Book Your Appointment</h2>
          <p className="form-subtitle">Schedule a visit with our medical specialists</p>
        </div>
        
        <div className="form-progress">
          <div className={`progress-step ${formStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Basic Info</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Personal Details</div>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          {formStep === 1 && (
            <div className="form-step-container animated fadeIn">
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faClock} className="label-icon" />
                  Choose a service time
                </label>
                <Row>
                  <Col xs={12}>
                    <div className="button-group">
                      <Button
                        variant={formData.serviceTime === 'inHours' ? 'primary' : 'outline-primary'}
                        className="time-button"
                        onClick={() => setFormData({...formData, serviceTime: 'inHours'})}
                      >
                       <FontAwesomeIcon icon={faClock} className="button-icon" /> In Hours
                      </Button>
                      <Button
                        variant={formData.serviceTime === 'outHours' ? 'primary' : 'outline-primary'}
                        className="time-button"
                        onClick={() => setFormData({...formData, serviceTime: 'outHours'})}
                      >
                        <FontAwesomeIcon icon={faClock} className="button-icon" /> Out Hours
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faUserMd} className="label-icon" />
                  Choose a doctor
                </label>
                <Form.Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select your preferred doctor</option>
                  <option value="dr1">Doctor A - Infectious Disease Specialist</option>
                  <option value="dr2">Doctor B - HIV Treatment Specialist</option>
                  <option value="dr3">Doctor C - General Practitioner</option>
                </Form.Select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} className="label-icon" />
                  Choose a date and time
                </label>
                <div className="date-input-wrapper">
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control date-input"
                  />
                </div>
              </div>

          <div className="form-group">
            <label className="form-label">Enter your health issues</label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your health issues, questions for the doctor and health issues you need to check"
              name="healthIssues"
              value={formData.healthIssues}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

      

          <div className="form-submit">
            <Button variant="primary" type="submit" className="submit-button">
              Next
            </Button>
          </div>
        </Form>
      </div>
      <Modal show={showFirstTimeModal} onHide={() => setShowFirstTimeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đăng ký thông tin lần đầu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFirstTimeSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={firstTimeInfo.phone}
                onChange={handleFirstTimeInputChange}
                required
                placeholder="Nhập số điện thoại"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh *</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={firstTimeInfo.dob}
                onChange={handleFirstTimeInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={firstTimeInfo.name}
                onChange={handleFirstTimeInputChange}
                required
                placeholder="Nhập họ và tên"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã khách hàng (nếu có)</Form.Label>
              <Form.Control
                type="text"
                name="customerId"
                value={firstTimeInfo.customerId}
                onChange={handleFirstTimeInputChange}
                placeholder="Nhập mã khách hàng (nếu có)"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowFirstTimeModal(false)} className="me-2">
                Quay lại
              </Button>
              <Button variant="primary" type="submit">
                Kiểm tra thông tin
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AppointmentForm; 