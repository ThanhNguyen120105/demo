import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import './Services.css';

// Import demo data
import { services } from '../../data/demoData';

const Services = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="page-header">
        <Container>
          <div className="page-header-content">
            <h1>HIV Treatment Services</h1>
            <p>Comprehensive care for prevention, treatment, and support</p>
          </div>
        </Container>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Our Comprehensive Services</h2>
            <p>Personalized care programs designed to support all aspects of living with HIV</p>
          </div>
          <Row>
            {services.map((service) => (
              <Col lg={4} md={6} key={service.id} className="mb-4">
                <Card className="service-card h-100">
                  <div className="service-icon">
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                    <Link to={`/services/${service.slug}`} className="btn btn-outline-primary">
                      Learn More
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Care Approach */}
      <section className="section-padding bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="care-approach-image">
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "350px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faImage} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="care-approach-content">
                <div className="section-title text-start">
                  <h2>Our Patient-Centered Approach</h2>
                </div>
                <p>
                  At our HIV Treatment Center, we believe in a comprehensive approach to care that considers 
                  the whole person – not just the virus. Our patient-centered model includes:
                </p>
                <ul className="care-list">
                  <li>Personalized treatment plans tailored to your specific health needs</li>
                  <li>Multidisciplinary care teams that collaborate on your behalf</li>
                  <li>Integration of medical care with mental health and social support</li>
                  <li>Education and empowerment to help you actively participate in your care</li>
                  <li>Continuous monitoring and adjustment of your treatment plan</li>
                </ul>
                <Button variant="primary">Schedule a Consultation</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Insurance & Payment */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Insurance & Payment Options</h2>
            <p>Accessible care for all individuals regardless of financial circumstances</p>
          </div>
          <Row>
            <Col lg={6} md={12}>
              <div className="insurance-box">
                <h3>Insurance Coverage</h3>
                <p>
                  We accept most major insurance plans, Medicare, and Medicaid. Our staff will work with 
                  you to verify your coverage for the services you need.
                </p>
                <h4>Accepted Insurance Plans:</h4>
                <ul>
                  <li>Medicare and Medicaid</li>
                  <li>Blue Cross Blue Shield</li>
                  <li>Aetna</li>
                  <li>Cigna</li>
                  <li>UnitedHealthcare</li>
                  <li>Humana</li>
                  <li>And many others</li>
                </ul>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="payment-box">
                <h3>Financial Assistance</h3>
                <p>
                  We believe that everyone deserves access to quality HIV care. If you're uninsured or 
                  concerned about costs, we offer:
                </p>
                <ul>
                  <li>Sliding scale fees based on income</li>
                  <li>Assistance with enrollment in medication assistance programs</li>
                  <li>Support navigating the Ryan White HIV/AIDS Program</li>
                  <li>Help applying for insurance coverage</li>
                  <li>Information about clinical trial participation options</li>
                </ul>
                <p>Our financial counselors are available to discuss your options and find solutions that work for you.</p>
                <Button variant="outline-primary">Contact Financial Services</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Appointment CTA */}
      <section className="appointment-cta">
        <Container>
          <div className="cta-content text-center">
            <h2>Ready to Start Your Care Journey?</h2>
            <p>
              Schedule an appointment with our specialists today. New patients are welcome, and urgent 
              appointments are available when needed.
            </p>
            <div className="cta-buttons">
              <Button variant="light" className="me-3">Book Online</Button>
              <Button variant="outline-light">Call (800) 123-4567</Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default Services; 