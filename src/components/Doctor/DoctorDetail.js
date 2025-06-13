import React from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faBriefcase, 
  faAward,
  faUserMd,
  faStethoscope,
  faBookMedical
} from '@fortawesome/free-solid-svg-icons';

const DoctorDetail = ({ doctor }) => {
  if (!doctor) return null;

  return (
    <div className="doctor-detail">
      <Row>
        {/* Bên trái - Thông tin cơ bản */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.fullName}
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <h3>{doctor.title} {doctor.fullName}</h3>
                <p className="text-muted">{doctor.specialization}</p>
              </div>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faUserMd} className="me-2" />
                  <strong>Chuyên môn:</strong>
                  <div className="mt-2">
                    {doctor.expertise.map((item, index) => (
                      <Badge bg="primary" className="me-2 mb-2" key={index}>
                        {item}
                      </Badge>
                    ))}
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                  <strong>Dịch vụ:</strong>
                  <ul className="mt-2">
                    {doctor.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Bên phải - Thông tin chi tiết */}
        <Col md={6}>
          {/* Quá trình đào tạo */}
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
              Quá trình đào tạo
            </Card.Header>
            <ListGroup variant="flush">
              {doctor.education.map((edu, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between">
                    <strong>{edu.degree}</strong>
                    <span className="text-muted">{edu.year}</span>
                  </div>
                  <div>{edu.school}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Kinh nghiệm làm việc */}
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <FontAwesomeIcon icon={faBriefcase} className="me-2" />
              Kinh nghiệm làm việc
            </Card.Header>
            <ListGroup variant="flush">
              {doctor.experience.map((exp, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between">
                    <strong>{exp.position}</strong>
                    <span className="text-muted">{exp.year}</span>
                  </div>
                  <div>{exp.hospital}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Thành tựu */}
          <Card className="mb-4">
            <Card.Header className="bg-warning text-dark">
              <FontAwesomeIcon icon={faAward} className="me-2" />
              Thành tựu
            </Card.Header>
            <ListGroup variant="flush">
              {doctor.achievements.map((achievement, index) => (
                <ListGroup.Item key={index}>
                  <FontAwesomeIcon icon={faBookMedical} className="me-2 text-muted" />
                  {achievement}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDetail; 