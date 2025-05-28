import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Doctors.css';

// Import images from assets
import id1Image from '../../assets/images/id1.png';
import id2Image from '../../assets/images/id2.png';
import id3Image from '../../assets/images/id3.png';
import id4Image from '../../assets/images/id4.png';
import id5Image from '../../assets/images/id5.png';
import id6Image from '../../assets/images/id6.png';

const doctorsData = [
  {
    id: 1,
    name: "Bác sĩ NGUYỄN VĂN AN",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Hà Nội",
    image: id1Image,
    description: "Chịu trách nhiệm chẩn đoán và điều trị cho người bị HIV. Tư vấn cá nhân hóa phác đồ điều trị ARV,  hỗ trợ tâm lý cho bệnh nhân nhằm duy trì chất lượng sống và ngăn ngừa lây truyền HIV trong cộng đồng"
  },
  {
    id: 2,
    name: "Bác sĩ TRẦN THỊ MINH",
    position: "Dược sĩ Lâm sàng HIV",
    hospital: "Bệnh viện Đại học Y dược Huế",
    image: id2Image,
    description: "Dược sĩ lâm sàng chuyên về HIV với kinh nghiệm trong tư vấn sử dụng thuốc, theo dõi tương tác thuốc và tối ưu hóa hiệu quả điều trị. Hỗ trợ bệnh nhân trong việc quản lý phác đồ và nâng cao chất lượng sống."
  },
  {
    id: 3,
    name: "Bác sĩ LÊ VĂN PHÚC",
    position: "Bác sĩ Chăm sóc chính HIV",
    hospital: "Bệnh viện Bạch Mai",
    image: id3Image,
    description: "Chăm sóc chính toàn diện với chuyên môn sâu về HIV, tư vấn điều trị, theo dõi tiến trình bệnh và hỗ trợ tâm lý cho người bệnh. Cam kết nâng cao chất lượng sống và phòng ngừa lây nhiễm hiệu quả trong cộng đồng."
  },
  {
    id: 4,
    name: "Bác sĩ NGUYỄN THỊ HÀ",
    position: "Bác Sĩ Tâm thần, Sức khỏe Tâm thần HIV",
    hospital: "Bệnh Viện Tâm Thần TP.HCM",
    image: id4Image,
    description: "Chuyên gia sức khỏe tâm thần với chuyên môn về các thách thức tâm lý liên quan đến HIV"
  },
  {
    id: 5,
    name: "GS.TS. PHẠM VĂN THANH",
    position: "Giám đốc Trung tâm Điều trị HIV/AIDS",
    hospital: "Bệnh viện đa khoa sài gòn",
    image: id5Image,
    description: "GS.TS Phạm Văn Thanh là chuyên gia hàng đầu trong lĩnh vực điều trị HIV/AIDS. Với hơn 25 năm kinh nghiệm, ông đã đồng hành cùng hàng nghìn bệnh nhân HIV, phát triển nhiều phác đồ điều trị tiên tiến và có nhiều công trình nghiên cứu về HIV/AIDS."
  },
  {
    id: 6,
    name: "Bác sĩ TRẦN VĂN MINH",
    position: "Bác sĩ Nghiên cứu và Phòng ngừa HIV",
    hospital: "Bệnh viện Từ Dũ, TP.HCM",
    image: id6Image,
    description: "BS. Trần Văn Minh là chuyên gia có nhiều kinh nghiệm trong lĩnh vực nghiên cứu và phòng ngừa HIV. Ông đã tham gia nhiều dự án nghiên cứu về HIV/AIDS, phát triển các chương trình giáo dục và tư vấn phòng ngừa HIV hiệu quả."
  }
];

const Doctors = () => {
  return (
    <div className="doctors-page">
      <Container>
        <h1 className="text-center my-5">Đội Ngũ Chuyên Gia Y Tế</h1>
        <Row>
          {doctorsData.map((doctor) => (
            <Col key={doctor.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 doctor-card">
                <div className="doctor-image-container">
                  <Card.Img 
                    variant="top" 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="doctor-image"
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="doctor-name">{doctor.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{doctor.position}</Card.Subtitle>
                  <Card.Text className="hospital-name fw-bold text-primary">{doctor.hospital}</Card.Text>
                  <Card.Text className="doctor-description flex-grow-1">{doctor.description}</Card.Text>
                  <div className="d-flex justify-content-between mt-auto pt-3">
                    <button className="btn btn-primary">Đặt Lịch Hẹn</button>
                    <button className="btn btn-outline-primary">Xem Chi Tiết</button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Doctors; 