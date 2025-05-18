import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faUsers, faHandHoldingMedical, faHeart, faFlask, faImage, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './About.css';

// Import demo data
import { stats } from '../../data/demoData';

const About = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="page-header">
        <Container>
          <div className="page-header-content">
            <h1>About Our Center</h1>
            <p>Leading the way in HIV treatment, research, and compassionate care</p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
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
                  <h2>Our Story</h2>
                </div>
                <p>
                  Founded in 2003, the HIV Treatment and Medical Services Center was established with 
                  a clear mission: to provide comprehensive, compassionate care for individuals living 
                  with HIV while working toward ending the epidemic through prevention, education, and research.
                </p>
                <p>
                  What began as a small clinic with a dedicated team of three specialists has grown into 
                  a leading medical institution with multiple locations, over 30 healthcare professionals, 
                  and more than 15,000 patients served.
                </p>
                <p>
                  Throughout our growth, we've maintained our founding principles of patient-centered care, 
                  medical excellence, and a commitment to treating each person with dignity and respect, 
                  regardless of background or circumstances.
                </p>
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

      {/* Mission & Vision */}
      <section className="section-padding bg-light">
        <Container>
          <Row>
            <Col lg={6} md={12}>
              <div className="mission-box">
                <div className="section-title text-start">
                  <h2>Our Mission</h2>
                </div>
                <p>
                  Our mission is to provide exceptional, comprehensive healthcare services to individuals 
                  living with HIV, while advancing prevention efforts, enhancing quality of life, and 
                  working toward an AIDS-free generation.
                </p>
                <ul className="mission-list">
                  <li>
                    <FontAwesomeIcon icon={faStethoscope} className="icon" />
                    <span>Delivering the highest standard of medical care</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faUsers} className="icon" />
                    <span>Supporting patients with comprehensive services</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faHandHoldingMedical} className="icon" />
                    <span>Providing accessible care regardless of financial resources</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faHeart} className="icon" />
                    <span>Treating all individuals with dignity, respect, and compassion</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faFlask} className="icon" />
                    <span>Advancing HIV treatment through research and innovation</span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="vision-box">
                <div className="section-title text-start">
                  <h2>Our Vision</h2>
                </div>
                <p>
                  We envision a future where HIV is no longer a public health threat, where prevention 
                  is widely accessible, and where all individuals living with HIV receive optimal care 
                  that allows them to live long, healthy, and fulfilling lives.
                </p>
                <div className="vision-image">
                  <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "200px", borderRadius: "10px"}}>
                    <FontAwesomeIcon icon={faHeart} style={{fontSize: "60px", color: "#ccc"}} />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Our Core Values</h2>
            <p>The principles that guide our approach to HIV care and treatment</p>
          </div>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <h3>Excellence</h3>
                  <p>
                    We are committed to delivering the highest quality medical care using evidence-based 
                    practices and maintaining rigorous professional standards in all aspects of our service.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <h3>Compassion</h3>
                  <p>
                    We approach each patient with empathy, understanding, and respect, recognizing the 
                    unique challenges faced by individuals living with or affected by HIV.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <h3>Inclusion</h3>
                  <p>
                    We welcome and serve all individuals regardless of race, ethnicity, gender, sexual 
                    orientation, religion, socioeconomic status, or background.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <h3>Innovation</h3>
                  <p>
                    We continuously seek to improve our services through research, technology, and creative 
                    approaches to treatment and support.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <h3>Integrity</h3>
                  <p>
                    We maintain the highest ethical standards in our care, research, and operations, 
                    prioritizing patient confidentiality and trust.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <h3>Collaboration</h3>
                  <p>
                    We partner with patients, families, community organizations, researchers, and other 
                    healthcare providers to deliver comprehensive care and advance our mission.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-light">
        <Container>
          <div className="section-title">
            <h2>Our Leadership Team</h2>
            <p>Guided by expertise, compassion, and a commitment to excellence</p>
          </div>
          <Row>
            <Col lg={3} md={6} sm={12}>
              <div className="leadership-card">
                <div className="leader-image">
                  <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "250px", width: "100%"}}>
                    <FontAwesomeIcon icon={faUserTie} style={{fontSize: "60px", color: "#ccc"}} />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Dr. Elizabeth Morgan</h3>
                  <p className="leader-position">Executive Director</p>
                  <p className="leader-bio">
                    Infectious disease specialist with 25+ years of experience in HIV medicine and healthcare leadership.
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="leadership-card">
                <div className="leader-image">
                  <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "250px", width: "100%"}}>
                    <FontAwesomeIcon icon={faUserTie} style={{fontSize: "60px", color: "#ccc"}} />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Dr. David Chen</h3>
                  <p className="leader-position">Medical Director</p>
                  <p className="leader-bio">
                    Board-certified physician overseeing clinical services and quality of care standards.
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="leadership-card">
                <div className="leader-image">
                  <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "250px", width: "100%"}}>
                    <FontAwesomeIcon icon={faUserTie} style={{fontSize: "60px", color: "#ccc"}} />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Dr. Maya Johnson</h3>
                  <p className="leader-position">Research Director</p>
                  <p className="leader-bio">
                    Leading researcher focused on advancing HIV treatment protocols and clinical trials.
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="leadership-card">
                <div className="leader-image">
                  <div className="placeholder-image bg-light d-flex align-items-center justify-content-center" style={{height: "250px", width: "100%"}}>
                    <FontAwesomeIcon icon={faUserTie} style={{fontSize: "60px", color: "#ccc"}} />
                  </div>
                </div>
                <div className="leader-info">
                  <h3>Robert Santiago</h3>
                  <p className="leader-position">Community Outreach Director</p>
                  <p className="leader-bio">
                    Public health expert leading prevention, education, and community engagement initiatives.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-primary">View Full Team</Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content text-center">
            <h2>Join Our Mission</h2>
            <p>
              Whether you're seeking care, looking to volunteer, considering a career with us, or 
              interested in supporting our work, we welcome you to join our community dedicated to 
              transforming lives affected by HIV.
            </p>
            <div className="cta-buttons">
              <Button variant="light" className="me-3">Make an Appointment</Button>
              <Button variant="outline-light">Support Our Work</Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default About; 