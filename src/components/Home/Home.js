import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope, faUsers, faHeartbeat, faBriefcaseMedical, 
  faMicroscope, faHandHoldingMedical, faCalendarCheck, faUserMd,
  faImage, faPhone
} from '@fortawesome/free-solid-svg-icons';
import './Home.css';

// Import demo data
import { services, doctors, news, stats } from '../../data/demoData';

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="hero-content">
                <h1>Leading HIV Treatment & Care Center</h1>
                <p>
                  We provide comprehensive and compassionate HIV care, utilizing the latest 
                  treatments and prevention methods to improve health outcomes and quality of life.
                </p>
                <div className="hero-buttons">
                  <Button variant="primary" className="me-3">Our Services</Button>
                  <Button variant="outline-primary">Make an Appointment</Button>
                </div>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="hero-image">
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "400px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faImage} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="counter-section">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col md={3} sm={6} key={index}>
                <div className="counter-box">
                  <div className="counter-number">{stat.value}</div>
                  <div className="counter-text">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="about-image">
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "350px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faImage} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="about-content">
                <div className="section-title text-start">
                  <h2>About Our HIV Treatment Center</h2>
                </div>
                <p>
                  For over 20 years, our center has been at the forefront of HIV treatment and care. 
                  We offer a comprehensive approach to HIV management, combining cutting-edge medical 
                  treatments with compassionate support services.
                </p>
                <p>
                  Our multidisciplinary team includes infectious disease specialists, pharmacists, 
                  nutritionists, and mental health professionals working together to provide 
                  personalized care for each patient.
                </p>
                <ul className="about-list">
                  <li>
                    <FontAwesomeIcon icon={faStethoscope} className="list-icon" />
                    State-of-the-art diagnostic facilities
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faHeartbeat} className="list-icon" />
                    Comprehensive care programs
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faUsers} className="list-icon" />
                    Support groups and counseling
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMicroscope} className="list-icon" />
                    Cutting-edge research participation
                  </li>
                </ul>
                <Button variant="primary">Learn More About Us</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-light">
        <Container>
          <div className="section-title">
            <h2>Our HIV Treatment Services</h2>
            <p>Comprehensive care and support for individuals living with HIV</p>
          </div>
          <Row>
            {services.slice(0, 4).map((service, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="service-card">
                  <div className="card-icon">
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{service.title}</h3>
                    <p className="card-text">{service.description}</p>
                    <Link to={`/services/${service.slug}`} className="card-link">
                      Learn More
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-primary" as={Link} to="/services">
              View All Services
            </Button>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Why Choose Our HIV Treatment Center</h2>
            <p>Expert care with a compassionate approach</p>
          </div>
          <Row>
            <Col lg={3} md={6}>
              <div className="feature-box">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faUserMd} />
                </div>
                <h3>Expert Specialists</h3>
                <p>
                  Our team includes world-renowned infectious disease specialists with decades of experience.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="feature-box">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faBriefcaseMedical} />
                </div>
                <h3>Advanced Treatment</h3>
                <p>
                  We offer the latest antiretroviral therapies and treatment protocols for optimal results.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="feature-box">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faHandHoldingMedical} />
                </div>
                <h3>Compassionate Care</h3>
                <p>
                  We provide emotional support and counseling alongside medical treatment.
                </p>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="feature-box">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <h3>Convenient Access</h3>
                <p>
                  We offer flexible scheduling, telehealth options, and prompt appointments.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Doctors Section */}
      <section className="section-padding bg-light">
        <Container>
          <div className="section-title">
            <h2>Our Specialist Team</h2>
            <p>Expert physicians dedicated to HIV treatment and care</p>
          </div>
          <Row>
            {doctors.slice(0, 4).map((doctor, index) => (
              <Col lg={3} md={6} key={index}>
                <div className="doctor-card">
                  <div className="card-img">
                    <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "200px", borderRadius: "10px 10px 0 0"}}>
                      <FontAwesomeIcon icon={faUserMd} style={{fontSize: "60px", color: "#ccc"}} />
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{doctor.name}</h3>
                    <div className="doctor-specialty">{doctor.specialty}</div>
                    <p className="card-text">{doctor.shortBio}</p>
                    <Link to={`/doctors/${doctor.id}`} className="card-link">
                      View Profile
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-primary" as={Link} to="/doctors">
              View All Specialists
            </Button>
          </div>
        </Container>
      </section>

      {/* Latest News Section */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Latest News & Articles</h2>
            <p>Stay updated with the latest in HIV research and treatment</p>
          </div>
          <Row>
            {news.slice(0, 3).map((item, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="news-card">
                  <div className="card-img">
                    <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "200px", borderRadius: "10px 10px 0 0"}}>
                      <FontAwesomeIcon icon={faImage} style={{fontSize: "60px", color: "#ccc"}} />
                    </div>
                    <div className="news-date">
                      <span className="day">{item.date.day}</span>
                      <span className="month">{item.date.month}</span>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{item.summary}</Card.Text>
                    <Link to={`/news/${item.id}`} className="card-link">
                      Read More
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-primary" as={Link} to="/news">
              View All News
            </Button>
          </div>
        </Container>
      </section>

      {/* Appointment Section */}
      <section className="appointment-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="appointment-content">
                <h2>Request an Appointment Today</h2>
                <p>
                  Our specialists are ready to provide you with the best HIV care and treatment.
                  Schedule an appointment online or call us directly.
                </p>
                <div className="appointment-buttons">
                  <Button variant="light" className="me-3">Book Online</Button>
                  <div className="appointment-phone">
                    <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                    <div>
                      <span>Call Us</span>
                      <span className="phone-number">(800) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6} md={12} className="d-none d-lg-block">
              <div className="appointment-image">
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "350px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faCalendarCheck} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Home; 