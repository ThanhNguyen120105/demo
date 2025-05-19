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
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceTime: 'inHours',
    doctor: '',
    date: '',
    healthIssues: '',
    customerId: '',
    phone: '',
    dob: '',
    name: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formStep === 1) {
      setFormStep(2);
    } else if (formStep === 2) {
      setShowSuccessModal(true);
      console.log('Form submitted:', formData);
    }
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
            </div>
          )}

          {formStep === 2 && (
            <div className="form-step-container animated fadeIn">
              <div className="form-group">
                <Form.Label>Phone Number *</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <Form.Label>Date of Birth *</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <Form.Label>Customer ID (if any)</Form.Label>
                <Form.Control
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  placeholder="Enter customer ID (if any)"
                />
              </div>

              <div className="form-submit">
                <Button variant="primary" type="submit">
                  Complete
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center w-100">
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-success me-2"
              size="2x"
            />
            Registration Successful
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Thank you for your registration.</p>
          <p>
            Please check your{' '}
            <a 
              href="/appointment-history" 
              className="text-primary fw-bold"
              onClick={(e) => {
                e.preventDefault();
                // Add navigation logic here if using React Router
                window.location.href = '/appointment-history';
              }}
            >
              Appointment History
            </a>{' '}
             to confirm the status.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="primary" 
            onClick={() => setShowSuccessModal(false)}
            className="px-4"
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentForm; 