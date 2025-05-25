import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserMd, 
  faClock, 
  faCommentMedical, 
  faCheckCircle,
  faHeartbeat,
  faUser,
  faEnvelope,
  faPhone,
  faArrowRight,
  faArrowLeft,
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceTime: 'inHours',
    serviceType: '',
    doctor: '',
    date: '',
    healthIssues: '',
    customerId: '',
    phone: '',
    dob: '',
    name: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formStep === 1) {
      if (!formData.serviceType) {
        alert('Vui lòng chọn loại dịch vụ');
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      setShowSuccessModal(true);
      console.log('Form submitted:', formData);
    }
  };

  const getServiceTypeName = (value) => {
    const serviceTypes = {
      'hiv-test': 'Xét nghiệm HIV',
      'treatment-program': 'Chương trình Điều trị',
      'prevention-service': 'Dịch vụ Phòng ngừa',
      'counseling': 'Tư vấn'
    };
    return serviceTypes[value] || value;
  };

  const getServiceDescription = (value) => {
    const descriptions = {
      'hiv-test': 'Xét nghiệm phát hiện virus HIV, bao gồm test nhanh và xét nghiệm định lượng',
      'treatment-program': 'Chương trình điều trị ARV và theo dõi sức khỏe cho người nhiễm HIV',
      'prevention-service': 'Dịch vụ phòng ngừa lây nhiễm HIV, PrEP, PEP và tư vấn an toàn',
      'counseling': 'Tư vấn tâm lý, hỗ trợ tinh thần và giải đáp thắc mắc về HIV/AIDS'
    };
    return descriptions[value] || '';
  };

  return (
    <Container>
      <div className="simple-form-container">
        <div className="form-header">
          <div className="form-icon">
            <FontAwesomeIcon icon={faHeartbeat} />
          </div>
          <h2 className="simple-form-title">Đặt Lịch Hẹn Khám</h2>
          <p className="form-subtitle">Lên lịch hẹn với các chuyên gia y tế của chúng tôi</p>
        </div>
        
        <div className="form-progress">
          <div className={`progress-step ${formStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Thông Tin Cơ Bản</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Thông Tin Cá Nhân</div>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          {formStep === 1 && (
            <div className="form-step-container animated fadeIn">
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faClock} className="label-icon" />
                  Chọn thời gian dịch vụ
                </label>
                <Row>
                  <Col xs={12}>
                    <div className="button-group">
                      <Button
                        variant={formData.serviceTime === 'inHours' ? 'primary' : 'outline-primary'}
                        className="time-button"
                        onClick={() => setFormData({...formData, serviceTime: 'inHours'})}
                      >
                       <FontAwesomeIcon icon={faClock} className="button-icon" /> Trong Giờ
                      </Button>
                      <Button
                        variant={formData.serviceTime === 'outHours' ? 'primary' : 'outline-primary'}
                        className="time-button"
                        onClick={() => setFormData({...formData, serviceTime: 'outHours'})}
                      >
                        <FontAwesomeIcon icon={faClock} className="button-icon" /> Ngoài Giờ
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faStethoscope} className="label-icon" />
                  Chọn loại dịch vụ
                </label>
                <Form.Select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Chọn loại dịch vụ bạn cần</option>
                  <option value="hiv-test">🧪 Xét nghiệm HIV</option>
                  <option value="treatment-program">💊 Chương trình Điều trị</option>
                  <option value="prevention-service">🛡️ Dịch vụ Phòng ngừa</option>
                  <option value="counseling">💬 Tư vấn</option>
                </Form.Select>
                {formData.serviceType && (
                  <div className="service-description">
                    <small className="text-muted">
                      <FontAwesomeIcon icon={faCommentMedical} className="me-1" />
                      {getServiceDescription(formData.serviceType)}
                    </small>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faUserMd} className="label-icon" />
                  Chọn bác sĩ
                </label>
                <Form.Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Chọn bác sĩ bạn ưa thích</option>
                  <option value="dr1">Bác sĩ A - Chuyên Gia Bệnh Truyền Nhiễm</option>
                  <option value="dr2">Bác sĩ B - Chuyên Gia Điều Trị HIV</option>
                  <option value="dr3">Bác sĩ C - Bác Sĩ Đa Khoa</option>
                </Form.Select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} className="label-icon" />
                  Chọn ngày và giờ
                </label>
                <div className="date-input-wrapper">
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control date-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nhập vấn đề sức khỏe của bạn</label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập các vấn đề sức khỏe, câu hỏi cho bác sĩ và các vấn đề sức khỏe bạn cần kiểm tra"
                  name="healthIssues"
                  value={formData.healthIssues}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-submit">
                <Button variant="primary" type="submit" className="submit-button">
                  Tiếp Theo
                </Button>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="form-step-container animated fadeIn">
              <div className="form-group">
                <Form.Label>Số Điện Thoại *</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <Form.Label>Ngày Sinh *</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <Form.Label>Họ Tên Đầy Đủ *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>

              <div className="form-group">
                <Form.Label>Mã Khách Hàng (nếu có)</Form.Label>
                <Form.Control
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  placeholder="Nhập mã khách hàng (nếu có)"
                />
              </div>

              <div className="form-submit">
                <Button variant="primary" type="submit">
                  Hoàn Tất
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center w-100">
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-success me-2"
              size="2x"
            />
            Đăng Ký Thành Công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Cảm ơn bạn đã đăng ký dịch vụ <strong>{getServiceTypeName(formData.serviceType)}</strong>.</p>
          <p>
            Vui lòng kiểm tra{' '}
            <a 
              href="/appointment-history" 
              className="text-primary fw-bold"
              onClick={(e) => {
                e.preventDefault();
                // Add navigation logic here if using React Router
                window.location.href = '/appointment-history';
              }}
            >
              Lịch Sử Cuộc Hẹn
            </a>{' '}
             để xác nhận trạng thái.
          </p>
          {formData.serviceType && (
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <strong>Dịch vụ:</strong> {getServiceTypeName(formData.serviceType)}<br/>
                <strong>Thời gian:</strong> {formData.serviceTime === 'inHours' ? 'Trong giờ' : 'Ngoài giờ'}
                {formData.date && (
                  <>
                    <br/><strong>Ngày hẹn:</strong> {new Date(formData.date).toLocaleString('vi-VN')}
                  </>
                )}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="primary" 
            onClick={() => setShowSuccessModal(false)}
            className="px-4"
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentForm; 