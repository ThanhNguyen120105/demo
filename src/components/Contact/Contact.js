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
            <h1>Liên Hệ</h1>
            <p>Kết nối với các chuyên gia điều trị và chăm sóc HIV của chúng tôi</p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={6} md={12}>
              <div className="contact-form-container">
                <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
                <p>
                  Điền vào mẫu dưới đây và một trong những thành viên của đội ngũ chúng tôi sẽ liên hệ lại với bạn
                  trong vòng 24-48 giờ.
                </p>
                <Form className="contact-form">
                  <Form.Group className="mb-3">
                    <Form.Label>Họ Tên</Form.Label>
                    <Form.Control type="text" placeholder="Nhập họ tên đầy đủ của bạn" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Địa Chỉ Email</Form.Label>
                    <Form.Control type="email" placeholder="Nhập địa chỉ email của bạn" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Số Điện Thoại</Form.Label>
                    <Form.Control type="tel" placeholder="Nhập số điện thoại của bạn" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Chủ Đề</Form.Label>
                    <Form.Control as="select">
                      <option>Thắc Mắc Chung</option>
                      <option>Yêu Cầu Cuộc Hẹn</option>
                      <option>Câu Hỏi Về Bảo Hiểm</option>
                      <option>Thông Tin Điều Trị</option>
                      <option>Khác</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Nội Dung</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Nhập nội dung tin nhắn của bạn" />
                  </Form.Group>
                  <div className="privacy-note mb-4">
                    <small>
                      Bằng cách gửi mẫu này, bạn đồng ý với chính sách bảo mật của chúng tôi. Thông tin của bạn sẽ được
                      giữ bí mật và sẽ không được chia sẻ với bên thứ ba.
                    </small>
                  </div>
                  <Button variant="primary" type="submit" className="w-100">
                    Gửi Tin Nhắn
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="contact-info-container">
                <h2>Thông Tin Liên Hệ Của Chúng Tôi</h2>
                <p>
                  Liên hệ trực tiếp với trung tâm chính của chúng tôi hoặc ghé thăm một trong những cơ sở chuyên khoa. Đối với
                  các vấn đề y tế khẩn cấp, vui lòng gọi đường dây hỗ trợ 24/7 của chúng tôi.
                </p>
                
                <div className="emergency-box mb-4">
                  <h3>Đường Dây Nóng HIV 24/7</h3>
                  <div className="emergency-phone">
                    <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                    <span>(800) 555-7890</span>
                  </div>
                  <p>
                    Đối với các vấn đề khẩn cấp, câu hỏi về thuốc, hoặc hướng dẫn ngay lập tức,
                    đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng 24 giờ một ngày, 7 ngày một tuần.
                  </p>
                </div>
                
                <h3>Các Địa Điểm Trung Tâm Điều Trị HIV</h3>
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
          title="Các Địa Điểm Trung Tâm Điều Trị HIV"
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
            <h2>Các Câu Hỏi Thường Gặp Về Liên Hệ</h2>
            <p>Câu trả lời nhanh cho những câu hỏi phổ biến về việc liên hệ với trung tâm chúng tôi</p>
          </div>
          <Row>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>Giờ làm việc của các bạn là gì?</h3>
                <p>
                  Trung tâm điều trị chính của chúng tôi mở cửa từ Thứ Hai đến Thứ Sáu từ 8:00 sáng đến 6:00 chiều,
                  và Thứ Bảy từ 9:00 sáng đến 1:00 chiều. Vui lòng kiểm tra giờ làm việc cụ thể cho từng
                  địa điểm vì chúng có thể khác nhau. Đường dây nóng 24/7 của chúng tôi luôn sẵn sàng cho các vấn đề khẩn cấp.
                </p>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>Tôi có thể đặt lịch hẹn nhanh như thế nào?</h3>
                <p>
                  Đối với bệnh nhân mới, chúng tôi thường sắp xếp tư vấn ban đầu trong vòng 1-2 tuần.
                  Các cuộc hẹn khẩn cấp có sẵn trong vòng 24-48 giờ cho các vấn đề y tế cấp bách.
                  Bệnh nhân đã đăng ký thường có thể được khám trong vòng vài ngày.
                </p>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>Tôi có cần giấy giới thiệu để đặt lịch hẹn không?</h3>
                <p>
                  Không, bạn không cần giấy giới thiệu để đặt lịch hẹn với trung tâm của chúng tôi.
                  Bạn có thể liên hệ trực tiếp với chúng tôi qua đường dây đặt lịch hoặc yêu cầu cuộc hẹn
                  trực tuyến. Tuy nhiên, bảo hiểm của bạn có thể yêu cầu giấy giới thiệu để được bảo hiểm chi trả, vì vậy chúng tôi khuyên
                  bạn nên kiểm tra chi tiết gói bảo hiểm của mình.
                </p>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="faq-item">
                <h3>Làm thế nào để tôi nhận được hồ sơ y tế của mình?</h3>
                <p>
                  Bạn có thể yêu cầu hồ sơ y tế bằng cách điền vào mẫu đơn có sẵn trên trang web của chúng tôi
                  hoặc tại bất kỳ địa điểm nào của chúng tôi. Hồ sơ có thể được gửi trực tiếp đến bạn hoặc đến một nhà cung cấp dịch vụ chăm sóc sức khỏe khác.
                  Để đảm bảo quyền riêng tư và bảo mật, chúng tôi yêu cầu giấy tờ nhận dạng phù hợp cho tất cả các yêu cầu về hồ sơ.
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