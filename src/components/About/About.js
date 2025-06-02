import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faUsers, faHandHoldingMedical, faHeart, faFlask, faImage, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './About.css';

// Import images
import storyImage from '../../assets/images/story.jpg';
import visionImage from '../../assets/images/vision.jpg';
import chinhTrucImage from '../../assets/images/chinh_truc.jpg';
import doiMoiImage from '../../assets/images/doi_moi.jpg';
import hoaNhapImage from '../../assets/images/hoa_nhap.jpg';
import hopTacImage from '../../assets/images/hop_tac.jpg';
import longTracAnImage from '../../assets/images/long_trac_an.jpg';
import xuatSacImage from '../../assets/images/xuat_sac.jpg';

// Import demo data
import { stats } from '../../data/demoData';

const About = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="page-header">
        <Container>
          <div className="page-header-content">
            <h1>Về Trung Tâm Của Chúng Tôi</h1>
            <p>Dẫn đầu trong điều trị, nghiên cứu HIV và chăm sóc đầy tận tâm</p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="about-image">
                <img 
                  src={storyImage} 
                  alt="Câu chuyện của chúng tôi"
                  style={{
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="about-content">
                <div className="section-title text-start">
                  <h2>Câu Chuyện Của Chúng Tôi</h2>
                </div>
                <div className='text-start'>
                <p>
                  Được thành lập vào năm 2003, Trung tâm Điều trị và Dịch vụ Y tế HIV được
                  thiết lập với sứ mệnh rõ ràng: cung cấp dịch vụ chăm sóc toàn diện, tận tâm cho
                  những người sống chung với HIV đồng thời nỗ lực chấm dứt dịch bệnh thông qua
                  phòng ngừa, giáo dục và nghiên cứu.
                </p>
                <p>
                  Khởi đầu là một phòng khám nhỏ với đội ngũ ba chuyên gia tận tâm đã phát triển thành
                  một cơ sở y tế hàng đầu với nhiều chi nhánh, hơn 30 chuyên gia y tế,
                  và phục vụ hơn 15.000 bệnh nhân.
                </p>
                <p>
                  Xuyên suốt quá trình phát triển, chúng tôi vẫn duy trì các nguyên tắc nền tảng về chăm
                  sóc lấy bệnh nhân làm trung tâm, xuất sắc về y khoa, và cam kết đối xử với mỗi người một
                  cách tôn trọng và đúng phẩm giá, bất kể nguồn gốc hay hoàn cảnh nào.
                </p>
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

      {/* Mission & Vision */}
      <section className="section-padding bg-light">
        <Container>
          <Row>
            <Col lg={6} md={12}>
              <div className="mission-box">
                <div className="section-title text-center">
                  <h2>Sứ Mệnh Của Chúng Tôi</h2>
                </div>
                <p className='text-start'>
                  Sứ mệnh của chúng tôi là cung cấp dịch vụ chăm sóc sức khỏe toàn diện, xuất sắc cho những
                  người sống chung với HIV, đồng thời thúc đẩy nỗ lực phòng ngừa, nâng cao chất lượng cuộc
                  sống, và hướng tới một thế hệ không còn AIDS.
                </p>
                <ul className="mission-list text-start">
                  <li>
                    <FontAwesomeIcon icon={faStethoscope} className="icon" />
                    <span>Cung cấp tiêu chuẩn chăm sóc y tế cao nhất</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faUsers} className="icon" />
                    <span>Hỗ trợ bệnh nhân với các dịch vụ toàn diện</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faHandHoldingMedical} className="icon" />
                    <span>Cung cấp dịch vụ chăm sóc dễ tiếp cận bất kể nguồn lực tài chính</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faHeart} className="icon" />
                    <span>Đối xử với mọi cá nhân bằng phẩm giá, tôn trọng và lòng trắc ẩn</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faFlask} className="icon" />
                    <span>Thúc đẩy điều trị HIV thông qua nghiên cứu và đổi mới</span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="vision-box">
                <div className="section-title text-center">
                  <h2>Tầm Nhìn Của Chúng Tôi</h2>
                </div>
                <p className='text-start'>
                  Chúng tôi hình dung một tương lai nơi HIV không còn là mối đe dọa sức khỏe cộng đồng, nơi
                  mà biện pháp phòng ngừa được tiếp cận rộng rãi, và nơi tất cả những người sống chung với HIV
                  đều nhận được sự chăm sóc tối ưu cho phép họ sống một cuộc đời dài lâu, khỏe mạnh và trọn vẹn.
                </p>
                <div className="vision-image">
                  <img 
                    src={visionImage} 
                    alt="Tầm nhìn của chúng tôi"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px"
                    }}
                  />
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
            <h2>Giá Trị Cốt Lõi Của Chúng Tôi</h2>
            <p>Nguyên tắc định hướng phương pháp tiếp cận của chúng tôi trong chăm sóc và điều trị HIV</p>
          </div>
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <div style={{ position: 'relative' }}>
                    <h3>Xuất Sắc</h3>
                    <img 
                      src={xuatSacImage}
                      alt="Xuất sắc"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '35px',
                        height: '35px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p className='text-start'>
                      Chúng tôi cam kết cung cấp dịch vụ chăm sóc y tế chất lượng cao nhất sử dụng các
                      phương pháp dựa trên bằng chứng và duy trì các tiêu chuẩn chuyên môn nghiêm ngặt
                      trong mọi khía cạnh của dịch vụ.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <div style={{ position: 'relative' }}>
                    <h3>Lòng Trắc Ẩn</h3>
                    <img 
                      src={longTracAnImage}
                      alt="Lòng trắc ẩn"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '35px',
                        height: '35px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p className='text-start'>
                      Chúng tôi tiếp cận mỗi bệnh nhân với sự đồng cảm, thấu hiểu và tôn trọng, nhận thức
                      được những thách thức riêng biệt mà những người sống chung với hoặc bị ảnh hưởng bởi HIV
                      phải đối mặt.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <div style={{ position: 'relative' }}>
                    <h3>Hòa Nhập</h3>
                    <img 
                      src={hoaNhapImage}
                      alt="Hòa nhập"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '35px',
                        height: '35px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p className='text-start'>
                      Chúng tôi chào đón và phục vụ tất cả mọi người bất kể chủng tộc, dân tộc, giới tính,
                      xu hướng tính dục, tôn giáo, tình trạng kinh tế xã hội hoặc nguồn gốc.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <div style={{ position: 'relative' }}>
                    <h3>Đổi Mới</h3>
                    <img 
                      src={doiMoiImage}
                      alt="Đổi mới"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '45px',
                        height: '45px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: '50%',
                        border: '2px solid #f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transform: 'scale(1.1)'
                      }}
                    />
                    <p className='text-start'>
                      Chúng tôi không ngừng tìm cách cải thiện dịch vụ thông qua nghiên cứu, công nghệ và
                      các phương pháp sáng tạo trong điều trị và hỗ trợ.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <div style={{ position: 'relative' }}>
                    <h3>Chính Trực</h3>
                    <img 
                      src={chinhTrucImage}
                      alt="Chính trực"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '35px',
                        height: '35px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p className='text-start'>
                      Chúng tôi duy trì các tiêu chuẩn đạo đức cao nhất trong chăm sóc, nghiên cứu và hoạt động,
                      ưu tiên bảo mật và niềm tin của bệnh nhân.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Card className="value-card">
                <Card.Body>
                  <div style={{ position: 'relative' }}>
                    <h3>Hợp Tác</h3>
                    <img 
                      src={hopTacImage}
                      alt="Hợp tác"
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '35px',
                        height: '35px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #f8f9fa',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <p className='text-start'>
                      Chúng tôi hợp tác với bệnh nhân, gia đình, tổ chức cộng đồng, nhà nghiên cứu và các
                      nhà cung cấp dịch vụ chăm sóc sức khỏe khác để cung cấp dịch vụ chăm sóc toàn diện và
                      thúc đẩy sứ mệnh của chúng tôi.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>


      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content text-start">
            <h2 className='text-center'>Tham Gia Cùng Sứ Mệnh Của Chúng Tôi</h2>
            <p>
              Cho dù bạn đang tìm kiếm dịch vụ chăm sóc, muốn tình nguyện, xem xét cơ hội nghề nghiệp
              với chúng tôi, hoặc quan tâm đến việc hỗ trợ công việc của chúng tôi, chúng tôi
              hoan nghênh bạn tham gia cộng đồng của chúng tôi, nơi tận tâm thay đổi cuộc sống
              của những người bị ảnh hưởng bởi HIV.
            </p>
            <div className="cta-buttons">
              <Button variant="light" className="me-3">Đặt Lịch Hẹn</Button>
              <Button variant="outline-light">Hỗ Trợ Công Việc Của Chúng Tôi</Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default About; 