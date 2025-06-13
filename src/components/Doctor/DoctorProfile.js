import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faGraduationCap, 
  faBriefcase,
  faAward,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import './DoctorProfile.css';

const DoctorProfile = ({ doctor, onSave }) => {
  const [editedDoctor, setEditedDoctor] = useState(doctor);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayItemChange = (field, index, value) => {
    setEditedDoctor(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const handleAddItem = (field) => {
    setEditedDoctor(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveItem = (field, index) => {
    setEditedDoctor(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Gọi API để cập nhật thông tin bác sĩ
      await onSave(editedDoctor);
      setAlert({
        show: true,
        type: 'success',
        message: 'Cập nhật thông tin thành công!'
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Có lỗi xảy ra khi cập nhật thông tin!'
      });
    }
  };

  return (
    <Container className="doctor-profile">
      {alert.show && (
        <Alert 
          variant={alert.type} 
          onClose={() => setAlert({ ...alert, show: false })} 
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Thông tin cơ bản */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            Thông tin cơ bản
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedDoctor.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chức vụ</Form.Label>
                  <Form.Control
                    type="text"
                    name="position"
                    value={editedDoctor.position}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Học vị</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editedDoctor.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chuyên khoa</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={editedDoctor.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editedDoctor.description}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Chuyên môn */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            Chuyên môn
          </Card.Header>
          <Card.Body>
            {editedDoctor.expertise.map((item, index) => (
              <div key={index} className="mb-2 d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayItemChange('expertise', index, e.target.value)}
                  className="me-2"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem('expertise', index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleAddItem('expertise')}
              className="mt-2"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Thêm chuyên môn
            </Button>
          </Card.Body>
        </Card>

        {/* Dịch vụ */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            Dịch vụ
          </Card.Header>
          <Card.Body>
            {editedDoctor.services.map((item, index) => (
              <div key={index} className="mb-2 d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayItemChange('services', index, e.target.value)}
                  className="me-2"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem('services', index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleAddItem('services')}
              className="mt-2"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Thêm dịch vụ
            </Button>
          </Card.Body>
        </Card>

        {/* Học vấn */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
            Học vấn
          </Card.Header>
          <Card.Body>
            {editedDoctor.education.map((item, index) => (
              <div key={index} className="education-item mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Bằng cấp {index + 1}</h6>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem('education', index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
                <Form.Control
                  as="textarea"
                  value={item}
                  onChange={(e) => handleArrayItemChange('education', index, e.target.value)}
                  rows={2}
                />
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleAddItem('education')}
              className="mt-2"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Thêm bằng cấp
            </Button>
          </Card.Body>
        </Card>

        {/* Kinh nghiệm */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faBriefcase} className="me-2" />
            Kinh nghiệm
          </Card.Header>
          <Card.Body>
            {editedDoctor.experience.map((item, index) => (
              <div key={index} className="experience-item mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Kinh nghiệm {index + 1}</h6>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem('experience', index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
                <Form.Control
                  as="textarea"
                  value={item}
                  onChange={(e) => handleArrayItemChange('experience', index, e.target.value)}
                  rows={2}
                />
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleAddItem('experience')}
              className="mt-2"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Thêm kinh nghiệm
            </Button>
          </Card.Body>
        </Card>

        {/* Thành tựu */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <FontAwesomeIcon icon={faAward} className="me-2" />
            Thành tựu
          </Card.Header>
          <Card.Body>
            {editedDoctor.achievements.map((item, index) => (
              <div key={index} className="achievement-item mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Thành tựu {index + 1}</h6>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveItem('achievements', index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
                <Form.Control
                  as="textarea"
                  value={item}
                  onChange={(e) => handleArrayItemChange('achievements', index, e.target.value)}
                  rows={2}
                />
              </div>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleAddItem('achievements')}
              className="mt-2"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Thêm thành tựu
            </Button>
          </Card.Body>
        </Card>

        <div className="text-end">
          <Button type="submit" variant="primary" size="lg">
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default DoctorProfile; 