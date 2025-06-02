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
import { stats, services, news } from '../../data/demoData';
import homepageImage from '../../assets/images/homepage.jpg';
import homepage2Image from '../../assets/images/homepage2.jpg';
import appointmentImage from '../../assets/images/appoinment_with_doctor.jpg';
import thuocHIVMoiImage from '../../assets/images/thuoc_HIV_moi.jpg';
import tuanLeVangImage from '../../assets/images/tuan_le_vang.jpg';
import thuThuocImage from '../../assets/images/thu_thuoc.jpg';

// Import doctor images
import id1Image from '../../assets/images/id1.png';
import id2Image from '../../assets/images/id2.png';
import id3Image from '../../assets/images/id3.png';
import id4Image from '../../assets/images/id4.png';

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
                  <Button variant="primary" as={Link} to="/about">Tìm Hiểu Thêm Về Chúng Tôi</Button>
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
              <Col lg={3} md={6}>
                <motion.div 
                  className="doctor-card"
                  variants={fadeIn}
                >
                  <div className="card-img">
                    <img 
                      src={id1Image} 
                      alt="Bác sĩ NGUYỄN VĂN AN"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px 10px 0 0"
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Bác sĩ NGUYỄN VĂN AN</h3>
                    <div className="doctor-specialty">Bác sĩ Chăm sóc và Điều trị HIV</div>
                    <p className="card-text">Chịu trách nhiệm chẩn đoán và điều trị cho người bị HIV. Tư vấn cá nhân hóa phác đồ điều trị ARV.</p>
                    <Link to="/doctors/1" className="card-link">
                      Xem Hồ Sơ
                    </Link>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div 
                  className="doctor-card"
                  variants={fadeIn}
                >
                  <div className="card-img">
                    <img 
                      src={id2Image} 
                      alt="Bác sĩ TRẦN THỊ MINH"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        objectPosition: "top",
                        borderRadius: "10px 10px 0 0"
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Bác sĩ TRẦN THỊ MINH</h3>
                    <div className="doctor-specialty">Dược sĩ Lâm sàng HIV</div>
                    <p className="card-text">Dược sĩ lâm sàng chuyên về HIV với kinh nghiệm trong tư vấn sử dụng thuốc và theo dõi tương tác thuốc.</p>
                    <Link to="/doctors/2" className="card-link">
                      Xem Hồ Sơ
                    </Link>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div 
                  className="doctor-card"
                  variants={fadeIn}
                >
                  <div className="card-img">
                    <img 
                      src={id3Image} 
                      alt="Bác sĩ LÊ VĂN PHÚC"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px 10px 0 0"
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Bác sĩ LÊ VĂN PHÚC</h3>
                    <div className="doctor-specialty">Bác sĩ Chăm sóc chính HIV</div>
                    <p className="card-text">Chăm sóc chính toàn diện với chuyên môn sâu về HIV, tư vấn điều trị và theo dõi tiến trình bệnh.</p>
                    <Link to="/doctors/3" className="card-link">
                      Xem Hồ Sơ
                    </Link>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div 
                  className="doctor-card"
                  variants={fadeIn}
                >
                  <div className="card-img">
                    <img 
                      src={id4Image} 
                      alt="Bác sĩ NGUYỄN THỊ HÀ"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px 10px 0 0"
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">Bác sĩ NGUYỄN THỊ HÀ</h3>
                    <div className="doctor-specialty">Bác Sĩ Tâm thần, Sức khỏe Tâm thần HIV</div>
                    <p className="card-text">Chuyên gia sức khỏe tâm thần với chuyên môn về các thách thức tâm lý liên quan đến HIV.</p>
                    <Link to="/doctors/4" className="card-link">
                      Xem Hồ Sơ
                    </Link>
                  </div>
                </motion.div>
              </Col>
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
              <Col lg={4} md={6}>
                <motion.div variants={fadeIn}>
                  <Card className="news-card">
                    <div className="card-img">
                      <img 
                        src={thuocHIVMoiImage}
                        alt="Điều Trị HIV Tác Động Dài"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "10px 10px 0 0"
                        }}
                      />
                      <div className="news-date">
                        <span className="day">15</span>
                        <span className="month">Th3</span>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title>Điều Trị HIV Tác Động Dài Mới Được FDA Phê Duyệt</Card.Title>
                      <Card.Text>
                        FDA đã phê duyệt một loại thuốc điều trị HIV tác động dài mới, mở ra hy vọng mới cho bệnh nhân.
                      </Card.Text>
                      <Link to="/news/1" className="card-link">
                        Đọc Thêm
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              <Col lg={4} md={6}>
                <motion.div variants={fadeIn}>
                  <Card className="news-card">
                    <div className="card-img">
                      <img 
                        src={tuanLeVangImage}
                        alt="Tuần Lễ Nâng Cao Nhận Thức về PrEP"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "10px 10px 0 0"
                        }}
                      />
                      <div className="news-date">
                        <span className="day">10</span>
                        <span className="month">Th3</span>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title>Phòng Ngừa HIV: Thông Báo Sự Kiện Tuần Lễ Nâng Cao Nhận Thức về PrEP</Card.Title>
                      <Card.Text>
                        Tuần lễ nâng cao nhận thức về PrEP sẽ diễn ra với nhiều hoạt động giáo dục và tư vấn.
                      </Card.Text>
                      <Link to="/news/2" className="card-link">
                        Đọc Thêm
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              <Col lg={4} md={6}>
                <motion.div variants={fadeIn}>
                  <Card className="news-card">
                    <div className="card-img">
                      <img 
                        src={thuThuocImage}
                        alt="Nghiên Cứu Tối Ưu Hóa Điều Trị HIV"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "10px 10px 0 0"
                        }}
                      />
                      <div className="news-date">
                        <span className="day">05</span>
                        <span className="month">Th3</span>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title>Nghiên Cứu: Cần Người Tham Gia cho Thử Nghiệm Tối Ưu Hóa Điều Trị HIV</Card.Title>
                      <Card.Text>
                        Chúng tôi đang tìm kiếm người tham gia cho nghiên cứu mới về tối ưu hóa phác đồ điều trị HIV.
                      </Card.Text>
                      <Link to="/news/3" className="card-link">
                        Đọc Thêm
                      </Link>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
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
                <img 
                  src={appointmentImage} 
                  alt="Đặt lịch hẹn"
                  style={{
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </AnimatedSection>
    </main>
  );
};

export default Home; 