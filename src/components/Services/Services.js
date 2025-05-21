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
            <h1>Dịch Vụ Điều Trị HIV</h1>
            <p>Chăm sóc toàn diện cho phòng ngừa, điều trị và hỗ trợ</p>
          </div>
        </Container>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Dịch Vụ Toàn Diện Của Chúng Tôi</h2>
            <p>Các chương trình chăm sóc cá nhân hóa được thiết kế để hỗ trợ mọi khía cạnh của việc sống chung với HIV</p>
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
                      Tìm Hiểu Thêm
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
                  <h2>Phương Pháp Tiếp Cận Lấy Bệnh Nhân Làm Trung Tâm</h2>
                </div>
                <p>
                  Tại Trung tâm Điều trị HIV của chúng tôi, chúng tôi tin vào phương pháp tiếp cận chăm sóc toàn diện 
                  xem xét toàn bộ con người – không chỉ riêng vi-rút. Mô hình lấy bệnh nhân làm trung tâm của chúng tôi bao gồm:
                </p>
                <ul className="care-list">
                  <li>Kế hoạch điều trị cá nhân hóa phù hợp với nhu cầu sức khỏe cụ thể của bạn</li>
                  <li>Đội ngũ chăm sóc đa ngành cùng phối hợp vì lợi ích của bạn</li>
                  <li>Tích hợp chăm sóc y tế với sức khỏe tâm thần và hỗ trợ xã hội</li>
                  <li>Giáo dục và trao quyền để giúp bạn tích cực tham gia vào quá trình chăm sóc</li>
                  <li>Theo dõi liên tục và điều chỉnh kế hoạch điều trị của bạn</li>
                </ul>
                <Button variant="primary">Đặt Lịch Tư Vấn</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Insurance & Payment */}
      <section className="section-padding">
        <Container>
          <div className="section-title">
            <h2>Bảo Hiểm & Các Tùy Chọn Thanh Toán</h2>
            <p>Chăm sóc dễ tiếp cận cho tất cả mọi người bất kể điều kiện tài chính</p>
          </div>
          <Row>
            <Col lg={6} md={12}>
              <div className="insurance-box">
                <h3>Bảo Hiểm</h3>
                <p>
                  Chúng tôi chấp nhận hầu hết các gói bảo hiểm lớn, Medicare và Medicaid. Nhân viên của chúng tôi sẽ làm việc với 
                  bạn để xác minh phạm vi bảo hiểm cho các dịch vụ bạn cần.
                </p>
                <h4>Các Gói Bảo Hiểm Được Chấp Nhận:</h4>
                <ul>
                  <li>Medicare và Medicaid</li>
                  <li>Blue Cross Blue Shield</li>
                  <li>Aetna</li>
                  <li>Cigna</li>
                  <li>UnitedHealthcare</li>
                  <li>Humana</li>
                  <li>Và nhiều gói khác</li>
                </ul>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="payment-box">
                <h3>Hỗ Trợ Tài Chính</h3>
                <p>
                  Chúng tôi tin rằng mọi người đều xứng đáng được tiếp cận với dịch vụ chăm sóc HIV chất lượng. Nếu bạn không có bảo hiểm hoặc 
                  lo lắng về chi phí, chúng tôi cung cấp:
                </p>
                <ul>
                  <li>Phí theo thang trượt dựa trên thu nhập</li>
                  <li>Hỗ trợ đăng ký vào các chương trình hỗ trợ thuốc</li>
                  <li>Hỗ trợ định hướng Chương trình Ryan White HIV/AIDS</li>
                  <li>Giúp đỡ đăng ký bảo hiểm</li>
                  <li>Thông tin về các tùy chọn tham gia thử nghiệm lâm sàng</li>
                </ul>
                <p>Các nhân viên tư vấn tài chính của chúng tôi luôn sẵn sàng thảo luận về các tùy chọn của bạn và tìm giải pháp phù hợp.</p>
                <Button variant="outline-primary">Liên Hệ Dịch Vụ Tài Chính</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Appointment CTA */}
      <section className="appointment-cta">
        <Container>
          <div className="cta-content text-center">
            <h2>Sẵn Sàng Bắt Đầu Hành Trình Chăm Sóc Của Bạn?</h2>
            <p>
              Đặt lịch hẹn với các chuyên gia của chúng tôi ngay hôm nay. Chúng tôi chào đón bệnh nhân mới, và có 
              các cuộc hẹn khẩn cấp khi cần thiết.
            </p>
            <div className="cta-buttons">
              <Button variant="light" className="me-3">Đặt Lịch Trực Tuyến</Button>
              <Button variant="outline-light">Gọi (800) 123-4567</Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default Services; 