import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';
import './Contact.css';

// Import demo data
import { locations } from '../../data/demoData';

const Contact = () => {
  return (
    <main>
      {/* Page Header */}
      <section className="page-header">
        <Container>
          <div className="page-header-content">
            <h1>Contact Us</h1>
            <p>Get in touch with our HIV treatment and care specialists</p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={6} md={12}>
              <div className="contact-form-container">
                <h2>Send Us a Message</h2>
                <p>
                  Fill out the form below and one of our team members will get back to you 
                  within 24-48 hours.
                </p>
                <Form className="contact-form">
                  <Form.Group className="mb-3">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your full name" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email address" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter your phone number" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control as="select">
                      <option>General Inquiry</option>
                      <option>Appointment Request</option>
                      <option>Insurance Question</option>
                      <option>Treatment Information</option>
                      <option>Other</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Enter your message" />
                  </Form.Group>
                  <div className="privacy-note mb-4">
                    <small>
                      By submitting this form, you agree to our privacy policy. Your information will remain 
                      confidential and will not be shared with third parties.
                    </small>
                  </div>
                  <Button variant="primary" type="submit" className="w-100">
                    Send Message
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="contact-info-container">
                <h2>Our Contact Information</h2>
                <p>
                  Reach out directly to our main center or visit one of our specialized locations. For 
                  urgent medical concerns, please call our 24/7 helpline.
                </p>
                
                <div className="emergency-box mb-4">
                  <h3>24/7 HIV Helpline</h3>
                  <div className="emergency-phone">
                    <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                    <span>(800) 555-7890</span>
                  </div>
                  <p>
                    For urgent concerns, medication questions, or immediate guidance,
                    our support team is available 24 hours a day, 7 days a week.
                  </p>
                </div>
                
                <h3>HIV Treatment Center Locations</h3>
                <div className="locations-container">
                  {locations.map((location) => (
                    <Card className="location-card mb-3" key={location.id}>
                      <Card.Body>
                        <h4>{location.name}</h4>
                        <ul className="location-details">
                          <li>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                            <span>{location.address}</span>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faPhone} className="icon" />
                            <span>{location.phone}</span>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faEnvelope} className="icon" />
                            <span>{location.email}</span>
                          </li>
                          <li>
                            <FontAwesomeIcon icon={faClock} className="icon" />
                            <span>{location.hours}</span>
                          </li>
                        </ul>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map */}
      <section className="map-section">
        <iframe 
          title="HIV Treatment Center Locations"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304591!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1642532334888!5m2!1sen!2sus" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy">
        </iframe>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-light">
        <Container>
          <div className="section-title">
            <h2>Frequently Asked Contact Questions</h2>
            <p>Quick answers to common questions about contacting our center</p>
          </div>
          <Row>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>What are your hours of operation?</h3>
                <p>
                  Our main treatment center is open Monday through Friday from 8:00 AM to 6:00 PM, 
                  and Saturdays from 9:00 AM to 1:00 PM. Please check the specific hours for each 
                  location as they may vary. Our 24/7 helpline is always available for urgent concerns.
                </p>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>How quickly can I get an appointment?</h3>
                <p>
                  For new patients, we typically schedule initial consultations within 1-2 weeks. 
                  Urgent appointments are available within 24-48 hours for pressing medical concerns. 
                  Established patients can often be seen within a few days.
                </p>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>Do I need a referral to make an appointment?</h3>
                <p>
                  No, you do not need a referral to schedule an appointment with our center. 
                  You can contact us directly through our appointment line or request an appointment 
                  online. However, your insurance may require a referral for coverage, so we recommend 
                  checking your plan details.
                </p>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>How can I get my medical records?</h3>
                <p>
                  You can request your medical records by filling out a release form available on our website 
                  or at any of our locations. Records can be sent directly to you or to another healthcare 
                  provider. For privacy and security, we require proper identification for all records requests.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Contact; 