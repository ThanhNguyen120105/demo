import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope, faUsers, faHeartbeat, faBriefcaseMedical, 
  faMicroscope, faHandHoldingMedical, faCalendarCheck, faUserMd,
  faImage, faPhone, faHistory, faTrophy, faStar, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import './Home.css';
import AnimatedSection from '../common/AnimatedSection';
import { stats, services, doctors, news } from '../../data/demoData';
import homepageImage from '../../assets/images/homepage.jpg';
import homepage2Image from '../../assets/images/homepage2.jpg';

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
                <h1>Trung Tâm Điều Trị & Chăm Sóc HIV Hàng Đầu</h1>
                <p>
                  Chúng tôi cung cấp dịch vụ chăm sóc HIV toàn diện và tận tâm, sử dụng các phương pháp 
                  điều trị và phòng ngừa tiên tiến nhất để cải thiện kết quả sức khỏe và chất lượng cuộc sống.
                </p>
                <div className="hero-buttons">
                  <Button variant="primary" className="me-3">Dịch Vụ Của Chúng Tôi</Button>
                  <Button variant="outline-primary" as={Link} to="/appointment">Đặt Lịch Hẹn</Button>
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
                <img src={homepageImage} alt="HIV Treatment Center" />
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
                 <motion.div variants={fadeIn} className="about-content-image">
                  <img src={homepage2Image} alt="HIV Treatment Center About" style={{width: "100%", borderRadius: "10px", marginBottom: "20px"}} />
                </motion.div>
              </motion.div>
            </Col>
            <Col lg={6} md={12}>
              <motion.div 
                className="about-content"
                variants={staggerContainer}
              >
                <motion.div className="section-title text-start" variants={fadeIn}>
                  <h2>Về Trung Tâm Điều Trị HIV Của Chúng Tôi</h2>
                </motion.div>
              
                <motion.p variants={fadeIn}>
                  Trong hơn 20 năm, trung tâm của chúng tôi đã luôn đi đầu trong điều trị và chăm sóc HIV. 
                  Chúng tôi cung cấp phương pháp tiếp cận toàn diện đối với quản lý HIV, kết hợp các phương pháp 
                  điều trị y tế tiên tiến với dịch vụ hỗ trợ tận tâm.
                </motion.p>
                <motion.p variants={fadeIn}>
                  Đội ngũ đa ngành của chúng tôi bao gồm các chuyên gia về bệnh truyền nhiễm, dược sĩ, 
                  chuyên gia dinh dưỡng và các chuyên gia sức khỏe tâm thần cùng làm việc để cung cấp 
                  dịch vụ chăm sóc cá nhân hóa cho từng bệnh nhân.
                </motion.p>
                <motion.ul className="about-list" variants={staggerContainer}>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faStethoscope} className="list-icon" />
                    Cơ sở chẩn đoán hiện đại
                  </motion.li>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faHeartbeat} className="list-icon" />
                    Chương trình chăm sóc toàn diện
                  </motion.li>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faUsers} className="list-icon" />
                    Nhóm hỗ trợ và tư vấn
                  </motion.li>
                  <motion.li variants={fadeIn}>
                    <FontAwesomeIcon icon={faMicroscope} className="list-icon" />
                    Tham gia nghiên cứu tiên tiến
                  </motion.li>
                </motion.ul>
                <motion.div variants={fadeIn}>
                  <Button variant="primary">Tìm Hiểu Thêm Về Chúng Tôi</Button>
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
            <h2>Dịch Vụ Điều Trị HIV Của Chúng Tôi</h2>
            <p>Chăm sóc và hỗ trợ toàn diện cho người sống chung với HIV</p>
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
                        Tìm Hiểu Thêm
                      </Link>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
          <motion.div className="text-center mt-5" variants={fadeIn}>
            <Button variant="outline-primary" as={Link} to="/services">
              Xem Tất Cả Dịch Vụ
            </Button>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection className="section-padding">
        <Container>
          <motion.div className="section-title" variants={fadeIn}>
            <h2>Tại Sao Chọn Trung Tâm Điều Trị HIV Của Chúng Tôi</h2>
            <p>Chăm sóc chuyên nghiệp với phương pháp tiếp cận tận tâm</p>
          </motion.div>
          <motion.div variants={staggerContainer}>
            <Row>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faUserMd} />
                  </div>
                  <h3>Các Chuyên Gia Hàng Đầu</h3>
                  <p>
                    Đội ngũ của chúng tôi bao gồm các chuyên gia về bệnh truyền nhiễm nổi tiếng thế giới với hàng chục năm kinh nghiệm.
                  </p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faBriefcaseMedical} />
                  </div>
                  <h3>Điều Trị Tiên Tiến</h3>
                  <p>
                    Chúng tôi cung cấp các liệu pháp kháng retrovirus và phác đồ điều trị mới nhất để đạt kết quả tối ưu.
                  </p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faHandHoldingMedical} />
                  </div>
                  <h3>Chăm Sóc Tận Tâm</h3>
                  <p>
                    Chúng tôi cung cấp hỗ trợ tinh thần và tư vấn song song với điều trị y tế.
                  </p>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div className="feature-box" variants={fadeIn}>
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={faCalendarCheck} />
                  </div>
                  <h3>Tiếp Cận Thuận Tiện</h3>
                  <p>
                    Chúng tôi cung cấp lịch hẹn linh hoạt, tùy chọn khám từ xa và lịch hẹn nhanh chóng.
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
            <h2>Đội Ngũ Chuyên Gia Của Chúng Tôi</h2>
            <p>Các bác sĩ chuyên khoa tận tâm với điều trị và chăm sóc HIV</p>
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
                        Xem Hồ Sơ
                      </Link>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
          <motion.div className="text-center mt-5" variants={fadeIn}>
            <Button variant="outline-primary" as={Link} to="/doctors">
              Xem Tất Cả Chuyên Gia
            </Button>
          </motion.div>
        </Container>
      </AnimatedSection>

      {/* Latest News Section */}
      <AnimatedSection className="section-padding">
        <Container>
          <motion.div className="section-title" variants={fadeIn}>
            <h2>Tin Tức & Bài Viết Mới Nhất</h2>
            <p>Cập nhật với những thông tin mới nhất về nghiên cứu và điều trị HIV</p>
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
                          Đọc Thêm
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
              Xem Tất Cả Tin Tức
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
                <motion.h2 variants={fadeIn}>Đặt Lịch Hẹn Ngay Hôm Nay</motion.h2>
                <motion.p variants={fadeIn}>
                  Các chuyên gia của chúng tôi đã sẵn sàng để cung cấp cho bạn dịch vụ chăm sóc và điều trị HIV tốt nhất.
                  Đặt lịch hẹn trực tuyến hoặc gọi trực tiếp cho chúng tôi.
                </motion.p>
                <motion.div className="appointment-buttons" variants={fadeIn}>
                  <Button variant="light" className="me-3" as={Link} to="/appointment">Đặt Lịch Trực Tuyến</Button>
                  <div className="appointment-phone">
                    <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                    <div>
                      <span>Gọi Cho Chúng Tôi</span>
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