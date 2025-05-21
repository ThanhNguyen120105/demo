import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Doctors.css';

const doctorsData = [
  {
    id: 1,
    name: "PROF.DR. NGUYỄN VĂN AN",
    position: "Giám đốc Trung tâm Tim mạch",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Thành phố Hồ Chí Minh",
    description: "GS.TS Nguyễn Văn An là một trong những chuyên gia hàng đầu trong lĩnh vực Y học Tim mạch tại Việt Nam. Với hơn 30 năm kinh nghiệm trong lĩnh vực y tế, ông đã thực hiện thành công hàng nghìn ca phẫu thuật tim phức tạp."
  },
  {
    id: 2,
    name: "PGS.TS. TRẦN THỊ MINH",
    position: "Trưởng khoa Sản phụ khoa",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Hà Nội",
    description: "PGS.TS Trần Thị Minh là chuyên gia hàng đầu trong lĩnh vực Sản phụ khoa với hơn 25 năm kinh nghiệm. Bà đã thực hiện thành công nhiều ca phẫu thuật phức tạp và có nhiều công trình nghiên cứu khoa học giá trị."
  },
  {
    id: 3,
    name: "TS. LÊ VĂN PHÚC",
    position: "Giám đốc Trung tâm Nội soi và Phẫu thuật Nội soi Tiêu hóa",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Thành phố Hồ Chí Minh",
    description: "TS. Lê Văn Phúc là chuyên gia hàng đầu trong lĩnh vực Nội soi và Phẫu thuật Nội soi Tiêu hóa. Với hơn 20 năm kinh nghiệm, ông đã thực hiện thành công hàng nghìn ca phẫu thuật nội soi phức tạp."
  },
  {
    id: 4,
    name: "BS. NGUYỄN THỊ HÀ",
    position: "Trưởng khoa Nhi",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Hà Nội",
    description: "BS. Nguyễn Thị Hà là chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực Nhi khoa. Bà đã điều trị thành công nhiều ca bệnh phức tạp và có nhiều đóng góp trong việc nâng cao chất lượng chăm sóc trẻ em."
  },
  {
    id: 5,
    name: "GS.TS. PHẠM VĂN THANH",
    position: "Giám đốc Trung tâm Thần kinh",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Thành phố Hồ Chí Minh",
    description: "GS.TS Phạm Văn Thanh là chuyên gia hàng đầu trong lĩnh vực Thần kinh. Với hơn 25 năm kinh nghiệm, ông đã thực hiện thành công nhiều ca phẫu thuật thần kinh phức tạp và có nhiều công trình nghiên cứu khoa học."
  },
  {
    id: 6,
    name: "BS. TRẦN VĂN MINH",
    position: "Trưởng khoa Chấn thương Chỉnh hình",
    hospital: "Bệnh viện Đa khoa Tâm Anh, Hà Nội",
    description: "BS. Trần Văn Minh là chuyên gia có nhiều kinh nghiệm trong lĩnh vực Chấn thương Chỉnh hình. Ông đã thực hiện thành công nhiều ca phẫu thuật phức tạp và có nhiều đóng góp trong việc phát triển các kỹ thuật mới."
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
                <Card.Body>
                  <Card.Title className="doctor-name">{doctor.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{doctor.position}</Card.Subtitle>
                  <Card.Text className="hospital-name">{doctor.hospital}</Card.Text>
                  <Card.Text className="doctor-description">{doctor.description}</Card.Text>
                  <div className="d-flex justify-content-between mt-3">
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