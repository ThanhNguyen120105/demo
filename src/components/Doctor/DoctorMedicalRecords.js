import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import DoctorSidebar from './DoctorSidebar';
import './Doctor.css';

// TODO: Thay thế bằng API call để lấy thông tin bác sĩ đang đăng nhập
const mockCurrentDoctor = {
  id: 1,
  name: "Bác sĩ NGUYỄN VĂN AN",
  position: "Bác sĩ Chăm sóc và Điều trị HIV",
  image: "/images/id1.png",
  description: "Chịu trách nhiệm chẩn đoán và điều trị cho người bị HIV. Tư vấn cá nhân hóa phác đồ điều trị ARV, hỗ trợ tâm lý cho bệnh nhân nhằm duy trì chất lượng sống và ngăn ngừa lây truyền HIV trong cộng đồng",
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
    "2010-2015: Bác sĩ Y khoa - Đại học Y Hà Nội",
    "2015-2018: Thạc sĩ Y khoa - Đại học Y Hà Nội",
    "2018-2021: Tiến sĩ Y khoa - Đại học Y Hà Nội"
  ],
  experience: [
    "2015-2018: Bác sĩ nội trú - Bệnh viện Bạch Mai",
    "2018-2021: Bác sĩ chuyên khoa - Bệnh viện Bạch Mai",
    "2021-nay: Trưởng khoa HIV/AIDS - Bệnh viện Bạch Mai"
  ],
  achievements: [
    "Nghiên cứu về hiệu quả của phác đồ điều trị ARV mới",
    "Đóng góp vào việc cải thiện chất lượng điều trị HIV/AIDS tại Việt Nam",
    "Đào tạo nhiều bác sĩ trẻ về điều trị HIV/AIDS"
  ]
};

const DoctorMedicalRecords = () => {
  const [doctor, setDoctor] = useState(mockCurrentDoctor);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [activeTab, setActiveTab] = useState('medical-records');

  const handleInputChange = (field, value) => {
    setDoctor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setDoctor(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleAddItem = (field) => {
    setDoctor(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveItem = (field, index) => {
    setDoctor(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Gọi API để cập nhật thông tin bác sĩ
      console.log('Cập nhật thông tin bác sĩ:', doctor);
      setAlertVariant('success');
      setAlertMessage('Cập nhật thông tin thành công!');
      setShowAlert(true);
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setAlertVariant('danger');
      setAlertMessage('Có lỗi xảy ra khi cập nhật thông tin!');
      setShowAlert(true);
    }
  };

  return (
    <div className="doctor-dashboard">
      <Container fluid>
        <Row>
          <DoctorSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          />
          
          <Col md={9} lg={10} className="main-content">
            <div className="content-header">
              <h2>Hồ sơ y tế</h2>
              <p>Quản lý thông tin cá nhân</p>
            </div>

            <Card>
              <Card.Body>
                {showAlert && (
                  <Alert 
                    variant={alertVariant} 
                    onClose={() => setShowAlert(false)} 
                    dismissible
                  >
                    {alertMessage}
                  </Alert>
                )}

                <Form>
                  <Row>
                    {/* Thông tin cơ bản */}
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header className="bg-light">
                          <h5 className="mb-0">Thông tin cơ bản</h5>
                        </Card.Header>
                        <Card.Body>
                          <Form.Group className="mb-3">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                              type="text"
                              value={doctor.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Chức vụ</Form.Label>
                            <Form.Control
                              type="text"
                              value={doctor.position}
                              onChange={(e) => handleInputChange('position', e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Học vị</Form.Label>
                            <Form.Control
                              type="text"
                              value={doctor.title}
                              onChange={(e) => handleInputChange('title', e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Chuyên khoa</Form.Label>
                            <Form.Control
                              type="text"
                              value={doctor.specialization}
                              onChange={(e) => handleInputChange('specialization', e.target.value)}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={doctor.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Chuyên môn và Dịch vụ */}
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header className="bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Chuyên môn</h5>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAddItem('expertise')}
                            >
                              Thêm chuyên môn
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          {doctor.expertise.map((item, index) => (
                            <div key={index} className="mb-2 d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('expertise', index, e.target.value)}
                                className="me-2"
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem('expertise', index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>

                      <Card className="mb-4">
                        <Card.Header className="bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Dịch vụ</h5>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAddItem('services')}
                            >
                              Thêm dịch vụ
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          {doctor.services.map((item, index) => (
                            <div key={index} className="mb-2 d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('services', index, e.target.value)}
                                className="me-2"
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem('services', index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    {/* Học vấn và Kinh nghiệm */}
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header className="bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Học vấn</h5>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAddItem('education')}
                            >
                              Thêm học vấn
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          {doctor.education.map((item, index) => (
                            <div key={index} className="mb-2 d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('education', index, e.target.value)}
                                className="me-2"
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem('education', index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>

                      <Card className="mb-4">
                        <Card.Header className="bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Kinh nghiệm</h5>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAddItem('experience')}
                            >
                              Thêm kinh nghiệm
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          {doctor.experience.map((item, index) => (
                            <div key={index} className="mb-2 d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('experience', index, e.target.value)}
                                className="me-2"
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem('experience', index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Thành tựu */}
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header className="bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Thành tựu</h5>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleAddItem('achievements')}
                            >
                              Thêm thành tựu
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          {doctor.achievements.map((item, index) => (
                            <div key={index} className="mb-2 d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                                className="me-2"
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveItem('achievements', index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleSave}
                    >
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorMedicalRecords; 