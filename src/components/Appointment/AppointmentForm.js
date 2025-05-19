import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    location: '',
    serviceTime: 'inHours',
    specialty: '',
    serviceType: 'regular',
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
        <h2 className="simple-form-title">Book appointment</h2>
        
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Choose a location</label>
            <div className="radio-options">
              <Form.Check
                type="radio"
                id="location-1"
                label="A hospital"
                name="location"
                value="hanoi"
                checked={formData.location === 'hanoi'}
                onChange={handleInputChange}
                className="radio-option"
              />
              <Form.Check
                type="radio"
                id="location-2"
                label="B hospital"
                name="location"
                value="hcm"
                checked={formData.location === 'hcm'}
                onChange={handleInputChange}
                className="radio-option"
              />
              <Form.Check
                type="radio"
                id="location-3"
                label="C hospital"
                name="location"
                value="q8"
                checked={formData.location === 'q8'}
                onChange={handleInputChange}
                className="radio-option"
              />
              <Form.Check
                type="radio"
                id="location-4"
                label="D hospital"
                name="location"
                value="q7"
                checked={formData.location === 'q7'}
                onChange={handleInputChange}
                className="radio-option"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Choose a service time</label>
            <Row>
              <Col xs={12}>
                <div className="button-group">
                  <Button
                    variant={formData.serviceTime === 'inHours' ? 'primary' : 'outline-primary'}
                    className="time-button"
                    onClick={() => setFormData({...formData, serviceTime: 'inHours'})}
                  >
                   In hours
                  </Button>
                  <Button
                    variant={formData.serviceTime === 'outHours' ? 'primary' : 'outline-primary'}
                    className="time-button"
                    onClick={() => setFormData({...formData, serviceTime: 'outHours'})}
                  >
                    Out hours
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          <div className="form-group">
            <label className="form-label">Chọn chuyên khoa</label>
            <Form.Select
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Choose a specialty</option>
              <option value="general">general</option>
              <option value="internal">internal</option>
              <option value="cardiology">cardiology</option>
              <option value="neurology">neurology</option>
            </Form.Select>
          </div>

          <div className="form-group">
            <label className="form-label">Choose a service type</label>
            <Row>
              <Col xs={12}>
                <div className="button-group">
                  <Button
                    variant={formData.serviceType === 'regular' ? 'primary' : 'outline-primary'}
                    className="type-button"
                    onClick={() => setFormData({...formData, serviceType: 'regular'})}
                  >
                    <FontAwesomeIcon icon={faUser} /> Regular
                  </Button>
                  <Button
                    variant={formData.serviceType === 'vip' ? 'primary' : 'outline-primary'}
                    className="type-button"
                    onClick={() => setFormData({...formData, serviceType: 'vip'})}
                  >
                    <FontAwesomeIcon icon={faUser} /> VIP
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          <div className="form-group">
            <label className="form-label">Choose a doctor</label>
            <Form.Select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Choose a doctor</option>
              <option value="dr1">Doctor A</option>
              <option value="dr2">Doctor B</option>
              <option value="dr3">Doctor C</option>
            </Form.Select>
          </div>

          <div className="form-group">
            <label className="form-label">Choose a date - time</label>
            <div className="date-input-wrapper">
              <Form.Control
                type="text"
                placeholder="Choose a date - time you want to check"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="form-control"
              />
              <span className="calendar-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </span>
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