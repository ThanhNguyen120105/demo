import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DoctorDetail from '../Doctor/DoctorDetail';
import './Doctors.css';

// Import images from assets
import id1Image from '../../assets/images/id1.png';
import id2Image from '../../assets/images/id2.png';
import id3Image from '../../assets/images/id3.png';
import id4Image from '../../assets/images/id4.png';
import id5Image from '../../assets/images/id5.png';
import id6Image from '../../assets/images/id6.png';

export const doctorsData = [
  {
    id: 1,
    name: "Bác sĩ NGUYỄN VĂN AN",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    image: id1Image,
    description: "Chịu trách nhiệm chẩn đoán và điều trị cho người bị HIV. Tư vấn cá nhân hóa phác đồ điều trị ARV,  hỗ trợ tâm lý cho bệnh nhân nhằm duy trì chất lượng sống và ngăn ngừa lây truyền HIV trong cộng đồng",
    title: "Tiến sĩ, Bác sĩ",
    specialization: "Chuyên khoa HIV/AIDS",
    expertise: [
      "Điều trị HIV/AIDS",
      "Tư vấn và xét nghiệm HIV",
      "Quản lý điều trị ARV",
      "Theo dõi và đánh giá hiệu quả điều trị"
    ],
    services: [
      "Khám và tư vấn HIV",
      "Xét nghiệm HIV",
      "Theo dõi điều trị ARV",
      "Tư vấn dự phòng lây nhiễm"
    ],
    education: [
      {
        year: "2010-2015",
        degree: "Bác sĩ Y khoa",
        school: "Đại học Y Hà Nội"
      },
      {
        year: "2015-2018",
        degree: "Thạc sĩ Y khoa",
        school: "Đại học Y Hà Nội"
      },
      {
        year: "2018-2021",
        degree: "Tiến sĩ Y khoa",
        school: "Đại học Y Hà Nội"
      }
    ],
    experience: [
      {
        year: "2021-nay",
        position: "Bác sĩ chuyên khoa HIV/AIDS",
        hospital: "Bệnh viện Bạch Mai"
      },
      {
        year: "2018-2021",
        position: "Bác sĩ nội trú",
        hospital: "Bệnh viện Bạch Mai"
      }
    ],
    achievements: [
      "Đã điều trị thành công cho hơn 1000 bệnh nhân HIV",
      "Tham gia nhiều nghiên cứu khoa học về điều trị HIV",
      "Đạt giải thưởng 'Bác sĩ trẻ xuất sắc' năm 2022",
      "Có nhiều bài báo khoa học đăng trên tạp chí quốc tế"
    ]
  },
  {
    id: 2,
    name: "Bác sĩ TRẦN THỊ B",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    image: id2Image,
    description: "Chuyên gia tư vấn và điều trị HIV, với kinh nghiệm lâu năm trong việc chăm sóc bệnh nhân HIV/AIDS. Đặc biệt quan tâm đến việc cải thiện chất lượng cuộc sống cho người bệnh thông qua các phương pháp điều trị hiện đại và hỗ trợ tâm lý toàn diện.",
    title: "Tiến sĩ, Bác sĩ",
    specialization: "Chuyên khoa HIV/AIDS",
    expertise: [
      "Điều trị HIV/AIDS",
      "Tư vấn tâm lý cho bệnh nhân HIV",
      "Quản lý điều trị ARV",
      "Nghiên cứu lâm sàng về HIV"
    ],
    services: [
      "Khám và tư vấn HIV",
      "Tư vấn tâm lý",
      "Theo dõi điều trị ARV",
      "Tư vấn dinh dưỡng cho bệnh nhân HIV"
    ],
    education: [
      {
        year: "2008-2014",
        degree: "Bác sĩ Y khoa",
        school: "Đại học Y Dược TP.HCM"
      },
      {
        year: "2014-2017",
        degree: "Thạc sĩ Y khoa",
        school: "Đại học Y Dược TP.HCM"
      },
      {
        year: "2017-2020",
        degree: "Tiến sĩ Y khoa",
        school: "Đại học Y Dược TP.HCM"
      }
    ],
    experience: [
      {
        year: "2020-nay",
        position: "Bác sĩ chuyên khoa HIV/AIDS",
        hospital: "Bệnh viện Bệnh Nhiệt đới TP.HCM"
      },
      {
        year: "2017-2020",
        position: "Bác sĩ nội trú",
        hospital: "Bệnh viện Bệnh Nhiệt đới TP.HCM"
      }
    ],
    achievements: [
      "Đã điều trị thành công cho hơn 800 bệnh nhân HIV",
      "Chủ nhiệm 3 đề tài nghiên cứu khoa học cấp Bộ",
      "Đạt giải thưởng 'Bác sĩ tiêu biểu' năm 2021",
      "Có 15 bài báo khoa học đăng trên tạp chí quốc tế"
    ]
  },
  {
    id: 3,
    name: "Bác sĩ LÊ VĂN C",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    image: id3Image,
    description: "Chuyên gia trong lĩnh vực điều trị HIV với hơn 10 năm kinh nghiệm. Tập trung vào việc phát triển các phác đồ điều trị cá nhân hóa và nghiên cứu các phương pháp điều trị mới cho bệnh nhân HIV.",
    title: "Thạc sĩ, Bác sĩ",
    specialization: "Chuyên khoa HIV/AIDS",
    expertise: [
      "Điều trị HIV/AIDS",
      "Nghiên cứu lâm sàng",
      "Quản lý điều trị ARV",
      "Tư vấn phòng chống lây nhiễm"
    ],
    services: [
      "Khám và tư vấn HIV",
      "Xét nghiệm HIV",
      "Theo dõi điều trị ARV",
      "Tư vấn phòng chống lây nhiễm"
    ],
    education: [
      {
        year: "2012-2018",
        degree: "Bác sĩ Y khoa",
        school: "Đại học Y Dược Huế"
      },
      {
        year: "2018-2020",
        degree: "Thạc sĩ Y khoa",
        school: "Đại học Y Dược Huế"
      }
    ],
    experience: [
      {
        year: "2020-nay",
        position: "Bác sĩ chuyên khoa HIV/AIDS",
        hospital: "Bệnh viện Trung ương Huế"
      },
      {
        year: "2018-2020",
        position: "Bác sĩ nội trú",
        hospital: "Bệnh viện Trung ương Huế"
      }
    ],
    achievements: [
      "Đã điều trị thành công cho hơn 500 bệnh nhân HIV",
      "Tham gia 5 đề tài nghiên cứu khoa học",
      "Đạt giải thưởng 'Bác sĩ trẻ tiềm năng' năm 2020",
      "Có 8 bài báo khoa học đăng trên tạp chí quốc tế"
    ]
  },
  {
    id: 4,
    name: "Bác sĩ PHẠM THỊ D",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    image: id4Image,
    description: "Chuyên gia tư vấn và điều trị HIV với kinh nghiệm chuyên sâu trong việc chăm sóc bệnh nhân nhiễm HIV. Đặc biệt quan tâm đến việc cải thiện chất lượng cuộc sống cho người bệnh thông qua các phương pháp điều trị toàn diện.",
    title: "Thạc sĩ, Bác sĩ",
    specialization: "Chuyên khoa HIV/AIDS",
    expertise: [
      "Điều trị HIV/AIDS",
      "Tư vấn tâm lý",
      "Quản lý điều trị ARV",
      "Chăm sóc bệnh nhân HIV"
    ],
    services: [
      "Khám và tư vấn HIV",
      "Tư vấn tâm lý",
      "Theo dõi điều trị ARV",
      "Tư vấn dinh dưỡng"
    ],
    education: [
      {
        year: "2013-2019",
        degree: "Bác sĩ Y khoa",
        school: "Đại học Y Dược Cần Thơ"
      },
      {
        year: "2019-2021",
        degree: "Thạc sĩ Y khoa",
        school: "Đại học Y Dược Cần Thơ"
      }
    ],
    experience: [
      {
        year: "2021-nay",
        position: "Bác sĩ chuyên khoa HIV/AIDS",
        hospital: "Bệnh viện Đa khoa Trung ương Cần Thơ"
      },
      {
        year: "2019-2021",
        position: "Bác sĩ nội trú",
        hospital: "Bệnh viện Đa khoa Trung ương Cần Thơ"
      }
    ],
    achievements: [
      "Đã điều trị thành công cho hơn 400 bệnh nhân HIV",
      "Tham gia 3 đề tài nghiên cứu khoa học",
      "Đạt giải thưởng 'Bác sĩ trẻ tiềm năng' năm 2021",
      "Có 5 bài báo khoa học đăng trên tạp chí quốc tế"
    ]
  },
  {
    id: 5,
    name: "Bác sĩ HOÀNG VĂN E",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    image: id5Image,
    description: "Chuyên gia trong lĩnh vực điều trị HIV với kinh nghiệm chuyên sâu về các phác đồ điều trị ARV mới nhất. Tập trung vào việc nghiên cứu và áp dụng các phương pháp điều trị tiên tiến cho bệnh nhân HIV.",
    title: "Tiến sĩ, Bác sĩ",
    specialization: "Chuyên khoa HIV/AIDS",
    expertise: [
      "Điều trị HIV/AIDS",
      "Nghiên cứu lâm sàng",
      "Quản lý điều trị ARV",
      "Phát triển phác đồ điều trị mới"
    ],
    services: [
      "Khám và tư vấn HIV",
      "Xét nghiệm HIV",
      "Theo dõi điều trị ARV",
      "Tư vấn điều trị chuyên sâu"
    ],
    education: [
      {
        year: "2011-2017",
        degree: "Bác sĩ Y khoa",
        school: "Đại học Y Dược Hải Phòng"
      },
      {
        year: "2017-2019",
        degree: "Thạc sĩ Y khoa",
        school: "Đại học Y Dược Hải Phòng"
      },
      {
        year: "2019-2022",
        degree: "Tiến sĩ Y khoa",
        school: "Đại học Y Dược Hải Phòng"
      }
    ],
    experience: [
      {
        year: "2022-nay",
        position: "Bác sĩ chuyên khoa HIV/AIDS",
        hospital: "Bệnh viện Đa khoa Trung ương Hải Phòng"
      },
      {
        year: "2019-2022",
        position: "Bác sĩ nội trú",
        hospital: "Bệnh viện Đa khoa Trung ương Hải Phòng"
      }
    ],
    achievements: [
      "Đã điều trị thành công cho hơn 600 bệnh nhân HIV",
      "Chủ nhiệm 2 đề tài nghiên cứu khoa học cấp Bộ",
      "Đạt giải thưởng 'Bác sĩ trẻ xuất sắc' năm 2022",
      "Có 10 bài báo khoa học đăng trên tạp chí quốc tế"
    ]
  },
  {
    id: 6,
    name: "Bác sĩ VŨ THỊ F",
    position: "Bác sĩ Chăm sóc và Điều trị HIV",
    image: id6Image,
    description: "Chuyên gia tư vấn và điều trị HIV với kinh nghiệm chuyên sâu trong việc chăm sóc bệnh nhân nhiễm HIV. Đặc biệt quan tâm đến việc cải thiện chất lượng cuộc sống cho người bệnh thông qua các phương pháp điều trị toàn diện.",
    title: "Thạc sĩ, Bác sĩ",
    specialization: "Chuyên khoa HIV/AIDS",
    expertise: [
      "Điều trị HIV/AIDS",
      "Tư vấn tâm lý",
      "Quản lý điều trị ARV",
      "Chăm sóc bệnh nhân HIV"
    ],
    services: [
      "Khám và tư vấn HIV",
      "Tư vấn tâm lý",
      "Theo dõi điều trị ARV",
      "Tư vấn dinh dưỡng"
    ],
    education: [
      {
        year: "2014-2020",
        degree: "Bác sĩ Y khoa",
        school: "Đại học Y Dược Thái Nguyên"
      },
      {
        year: "2020-2022",
        degree: "Thạc sĩ Y khoa",
        school: "Đại học Y Dược Thái Nguyên"
      }
    ],
    experience: [
      {
        year: "2022-nay",
        position: "Bác sĩ chuyên khoa HIV/AIDS",
        hospital: "Bệnh viện Đa khoa Trung ương Thái Nguyên"
      },
      {
        year: "2020-2022",
        position: "Bác sĩ nội trú",
        hospital: "Bệnh viện Đa khoa Trung ương Thái Nguyên"
      }
    ],
    achievements: [
      "Đã điều trị thành công cho hơn 300 bệnh nhân HIV",
      "Tham gia 2 đề tài nghiên cứu khoa học",
      "Đạt giải thưởng 'Bác sĩ trẻ tiềm năng' năm 2022",
      "Có 4 bài báo khoa học đăng trên tạp chí quốc tế"
    ]
  }
];

const Doctors = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleAppointment = (doctorId) => {
    navigate('/appointment', { state: { selectedDoctor: doctorId } });
  };

  const handleViewDetail = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

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
                  <Card.Subtitle className="mb-3 text-muted">{doctor.position}</Card.Subtitle>
                  <Card.Text className="doctor-description flex-grow-1">{doctor.description}</Card.Text>
                  <div className="d-flex justify-content-between mt-auto pt-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAppointment(doctor.id)}
                    >
                      Đặt Lịch Hẹn
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => handleViewDetail(doctor)}
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin chi tiết bác sĩ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && <DoctorDetail doctor={selectedDoctor} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Doctors; 