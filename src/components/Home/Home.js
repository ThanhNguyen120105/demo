import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope, faUsers, faHeartbeat, faBriefcaseMedical, 
  faMicroscope, faHandHoldingMedical, faCalendarCheck, faUserMd,
  faImage, faPhone, faHistory, faTrophy, faStar, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './Home.css';

// Import demo data
import { services, doctors, news, stats } from '../../data/demoData';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Animated section wrapper component
const AnimatedSection = ({ children, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Counter icons mapping
const counterIcons = [
  { icon: faHistory },   // Years of Experience
  { icon: faUsers },     // Patients Treated
  { icon: faUserMd },    // Specialist Doctors
  { icon: faTrophy }     // Treatment Success Rate
];

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <motion.div 
                className="hero-content"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1>Leading HIV Treatment & Care Center</h1>
                <p>
                  We provide comprehensive and compassionate HIV care, utilizing the latest 
                  treatments and prevention methods to improve health outcomes and quality of life.
                </p>
                <div className="hero-buttons">
                  <Button variant="primary" className="me-3">Our Services</Button>
                  <Button variant="outline-primary" as={Link} to="/appointment">Make an Appointment</Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} md={12}>
              <motion.div 
                className="hero-image"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "400px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faImage} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="counter-section">
        <Container>
          <motion.div variants={staggerContainer}>
            <Row>
              {stats.map((stat, index) => (
                <Col md={3} sm={6} key={index}>
                  <motion.div 
                    className="counter-box"
                    variants={fadeIn}
                  >
                    <div className="counter-icon">
                      <FontAwesomeIcon icon={counterIcons[index].icon} />
                    </div>
                    <div className="counter-number">{stat.value}</div>
                    <div className="counter-text">{stat.label}</div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection className="section-padding">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <motion.div 
                className="about-image"
                variants={fadeIn}
              >
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "350px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faImage} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </motion.div>
            </Col>
            <Col lg={6} md={12}>
              <motion.div 
                className="about-content"
                variants={staggerContainer}
              >
                <motion.div className="section-title text-start" variants={fadeIn}>
                  <h2>About Our HIV Treatment Center</h2>
                </motion.div>
                <motion.p variants={fadeIn}>
                  For over 20 years, our center has been at the forefront of HIV treatment and care. 
                  We offer a comprehensive approach to HIV management, combining cutting-edge medical 
                  treatments with compassionate support services.
                </motion.p>
                <motion.p variants={fadeIn}>
                  Our multidisciplinary team includes infectious disease specialists, pharmacists, 
                  nutritionists, and mental health professionals working together to provide 
                  personalized care for each patient.
                </motion.p>
                <motion.ul className="about-list" variants={staggerContainer}>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faStethoscope} className="list-icon" />
                    State-of-the-art diagnostic facilities
                  </motion.li>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faHeartbeat} className="list-icon" />
                    Comprehensive care programs
                  </motion.li>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faUsers} className="list-icon" />
                    Support groups and counseling
                  </motion.li>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faMicroscope} className="list-icon" />
                    Cutting-edge research participation
                  </motion.li>
                </motion.ul>
                <motion.div variants={fadeIn}>
                  <Button variant="primary">Learn More About Us</Button>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection className="section-padding bg-light">
        <Container>
          <motion.div className="section-title" variants={fadeIn}>
            <h2>Our HIV Treatment Services</h2>
            <p>Comprehensive care and support for individuals living with HIV</p>
          </motion.div>
          <motion.div variants={staggerContainer}>
            <Row>
              {services.slice(0, 4).map((service, index) => (
                <Col lg={3} md={6} key={index}>
                  <motion.div 
                    className="service-card"
                    variants={fadeIn}
                  >
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
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
          <motion.div className="text-center mt-5" variants={fadeIn}>
            <Button variant="outline-primary" as={Link} to="/services">
              View All Services
            </Button>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection className="section-padding">
        <Container>
          <motion.div className="section-title" variants={fadeIn}>
            <h2>Why Choose Our HIV Treatment Center</h2>
            <p>Expert care with a compassionate approach</p>
          </motion.div>
          <motion.div variants={staggerContainer}>
            <Row>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faUserMd} />
                  </div>
                  <h3>Expert Specialists</h3>
                  <p>
                    Our team includes world-renowned infectious disease specialists with decades of experience.
                  </p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faBriefcaseMedical} />
                  </div>
                  <h3>Advanced Treatment</h3>
                  <p>
                    We offer the latest antiretroviral therapies and treatment protocols for optimal results.
                  </p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faHandHoldingMedical} />
                  </div>
                  <h3>Compassionate Care</h3>
                  <p>
                    We provide emotional support and counseling alongside medical treatment.
                  </p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                  </div>
                  <h3>Convenient Access</h3>
                  <p>
                    We offer flexible scheduling, telehealth options, and prompt appointments.
                  </p>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* Doctors Section */}
      <AnimatedSection className="section-padding bg-light">
        <Container>
          <motion.div className="section-title" variants={fadeIn}>
            <h2>Our Specialist Team</h2>
            <p>Expert physicians dedicated to HIV treatment and care</p>
          </motion.div>
          <motion.div variants={staggerContainer}>
            <Row>
              {doctors.slice(0, 4).map((doctor, index) => (
                <Col lg={3} md={6} key={index}>
                  <motion.div 
                    className="doctor-card"
                    variants={fadeIn}
                  >
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
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
          <motion.div className="text-center mt-5" variants={fadeIn}>
            <Button variant="outline-primary" as={Link} to="/doctors">
              View All Specialists
            </Button>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* Latest News Section */}
      <AnimatedSection className="section-padding">
        <Container>
          <motion.div className="section-title" variants={fadeIn}>
            <h2>Latest News & Articles</h2>
            <p>Stay updated with the latest in HIV research and treatment</p>
          </motion.div>
          <motion.div variants={staggerContainer}>
            <Row>
              {news.slice(0, 3).map((item, index) => (
                <Col lg={4} md={6} key={index}>
                  <motion.div variants={fadeIn}>
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
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
          <motion.div className="text-center mt-5" variants={fadeIn}>
            <Button variant="outline-primary" as={Link} to="/news">
              View All News
            </Button>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* Appointment Section */}
      <AnimatedSection className="appointment-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <motion.div 
                className="appointment-content"
                variants={staggerContainer}
              >
                <motion.h2 variants={fadeIn}>Request an Appointment Today</motion.h2>
                <motion.p variants={fadeIn}>
                  Our specialists are ready to provide you with the best HIV care and treatment.
                  Schedule an appointment online or call us directly.
                </motion.p>
                <motion.div className="appointment-buttons" variants={fadeIn}>
                  <Button variant="light" className="me-3" as={Link} to="/appointment">Book Online</Button>
                  <div className="appointment-phone">
                    <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                    <div>
                      <span>Call Us</span>
                      <span className="phone-number">(800) 123-4567</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
            <Col lg={6} md={12} className="d-none d-lg-block">
              <motion.div 
                className="appointment-image"
                variants={fadeIn}
              >
                <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "350px", borderRadius: "10px"}}>
                  <FontAwesomeIcon icon={faCalendarCheck} style={{fontSize: "80px", color: "#ccc"}} />
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </AnimatedSection>
    </main>
  );
};

export default Home; 