import React from 'react';
import { Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAward,
  faBookMedical,
  faEnvelope,
  faPhone,
  faBirthdayCake,
  faVenusMars,
  faHospital,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';

const DoctorDetail = ({ doctor }) => {
  if (!doctor) return null;

  // Format ngày sinh
  const formatBirthdate = (birthdate) => {
    if (!birthdate) return 'Chưa có thông tin';
    try {
      const date = new Date(birthdate);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return birthdate;
    }
  };

  // Format giới tính
  const formatGender = (gender) => {
    if (!gender) return 'Chưa có thông tin';
    return gender === 'MALE' ? 'Nam' : gender === 'FEMALE' ? 'Nữ' : gender;
  };

  return (
    <div className="doctor-detail">
      <Row>
        {/* Bên trái - Thông tin cơ bản */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150?text=Doctor';
                  }}
                />
                <h3>{doctor.name}</h3>
                <p className="text-muted">{doctor.position}</p>
                {doctor.hospital && (
                  <p className="text-info">
                    <FontAwesomeIcon icon={faHospital} className="me-2" />
                    {doctor.hospital}
                  </p>
                )}
              </div>

              <ListGroup variant="flush">
                {doctor.email && (
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    <strong>Email:</strong> {doctor.email}
                  </ListGroup.Item>
                )}

                {doctor.phoneNumber && (
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    <strong>Số điện thoại:</strong> {doctor.phoneNumber}
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <FontAwesomeIcon icon={faBirthdayCake} className="me-2" />
                  <strong>Ngày sinh:</strong> {formatBirthdate(doctor.birthdate)}
                </ListGroup.Item>

                <ListGroup.Item>
                  <FontAwesomeIcon icon={faVenusMars} className="me-2" />
                  <strong>Giới tính:</strong> {formatGender(doctor.gender)}
                </ListGroup.Item>

                {doctor.specialization && (
                  <ListGroup.Item>
                    <FontAwesomeIcon icon={faUserMd} className="me-2" />
                    <strong>Chuyên khoa:</strong>
                    <div className="mt-2">
                      <Badge bg="primary">{doctor.specialization}</Badge>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Bên phải - Thông tin chi tiết */}
        <Col md={6}>
          {/* Mô tả */}
          {doctor.description && (
            <Card className="mb-4">
              <Card.Header className="bg-info text-white">
                <FontAwesomeIcon icon={faBookMedical} className="me-2" />
                Mô tả
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{doctor.description}</p>
              </Card.Body>
            </Card>
          )}

          {/* Thành tựu và Giải thưởng */}
          {doctor.awards && doctor.awards.trim() && (
            <Card className="mb-4">
              <Card.Header className="bg-warning text-dark">
                <FontAwesomeIcon icon={faAward} className="me-2" />
                Thành tựu & Giải thưởng
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{doctor.awards}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDetail; 