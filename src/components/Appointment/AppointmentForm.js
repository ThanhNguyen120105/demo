import React, { useState, useEffect } from 'react';
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
import { useLocation } from 'react-router-dom';
import { doctorsData } from '../Doctors/Doctors';

const AppointmentForm = () => {
  const location = useLocation();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    doctor: '',
    date: '',
    healthIssues: '',
    customerId: '',
    phone: '',
    dob: '',
    name: '',
    registrationType: 'online'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Check if there's a selected doctor in the location state
    if (location.state?.selectedDoctor) {
      setFormData(prev => ({
        ...prev,
        doctor: location.state.selectedDoctor
      }));
    }
  }, [location]);

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
      'hiv-test': 'Xét nghiệm và điều trị HIV',
      'counseling': 'Tư vấn tâm lý và hỗ trợ tinh thần',
      'prevention': 'Tư vấn phòng ngừa và an toàn',
      'treatment-support': 'Hỗ trợ điều trị và theo dõi'
    };
    return serviceTypes[value] || value;
  };

  return (
    <Container>
      <style jsx>{`
        .booking-options {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .booking-option {
          flex: 1;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }
        
        .booking-option:hover {
          border-color: #007bff;
          box-shadow: 0 4px 12px rgba(0,123,255,0.15);
        }
        
        .booking-option.active {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 4px 12px rgba(0,123,255,0.2);
        }
        
        .option-header {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .option-icon {
          font-size: 2rem;
          color: #007bff;
          margin-bottom: 0.5rem;
        }
        
        .option-header h6 {
          font-weight: bold;
          margin: 0;
          color: #2c3e50;
        }
        
        .option-description {
          font-size: 0.9rem;
          color: #6c757d;
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .option-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .option-features li {
          font-size: 0.85rem;
          color: #495057;
          padding: 0.25rem 0;
          position: relative;
          padding-left: 1.5rem;
        }
        
        .option-features li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #28a745;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .booking-options {
            flex-direction: column;
          }
        }
        
        @media (max-width: 992px) {
          .booking-options {
            flex-wrap: wrap;
          }
          .booking-option {
            flex: 1 1 calc(50% - 0.5rem);
          }
        }
      `}</style>
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
              <div className="booking-type-selection">
                <h5 className="mb-3 text-center">Chọn loại hỗ trợ</h5>
                <Row>
                  <Col xs={12}>
                    <div className="booking-options">
                      <div 
                        className={`booking-option ${formData.registrationType === 'direct' ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, registrationType: 'direct'})}
                      >
                        <div className="option-header">
                          <FontAwesomeIcon icon={faCalendarAlt} className="option-icon" />
                          <h6>Đăng ký trực tiếp</h6>
                        </div>
                        <p className="option-description">
                          Đến trực tiếp cơ sở y tế để đăng ký và khám. Thích hợp cho những ai muốn gặp trực tiếp bác sĩ.
                        </p>
                        <ul className="option-features">
                          <li>Gặp bác sĩ trực tiếp</li>
                          <li>Thăm khám ngay lập tức</li>
                          <li>Không cần đặt lịch trước</li>
                        </ul>
                      </div>

                      <div 
                        className={`booking-option ${formData.registrationType === 'online' ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, registrationType: 'online'})}
                      >
                        <div className="option-header">
                          <FontAwesomeIcon icon={faStethoscope} className="option-icon" />
                          <h6>Đăng ký trực tuyến</h6>
                        </div>
                        <p className="option-description">
                          Đặt lịch hẹn với thông tin cá nhân đầy đủ. Phù hợp cho việc theo dõi điều trị và quản lý hồ sơ y tế.
                        </p>
                        <ul className="option-features">
                          <li>Lưu trữ hồ sơ y tế</li>
                          <li>Theo dõi lịch sử điều trị</li>
                          <li>Nhắc nhở tái khám</li>
                        </ul>
                      </div>
                      
                      <div 
                        className={`booking-option ${formData.registrationType === 'anonymous' ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, registrationType: 'anonymous'})}
                      >
                        <div className="option-header">
                          <FontAwesomeIcon icon={faUser} className="option-icon" />
                          <h6>Ẩn danh</h6>
                        </div>
                        <p className="option-description">
                          Đăng ký với thông tin tối thiểu, bảo vệ danh tính. Phù hợp nếu bạn lo ngại về kỳ thị hoặc muốn giữ bí mật.
                        </p>
                        <ul className="option-features">
                          <li>Bảo vệ danh tính</li>
                          <li>Thông tin tối thiểu</li>
                          <li>Tuyệt đối bảo mật</li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faStethoscope} className="label-icon" />
                   Dịch vụ hỗ trợ
                </label>
                <Form.Select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                > 
          
                  <option value="hiv-test">🧪 Xét nghiệm và điều trị HIV</option>
     
                </Form.Select>
            
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
                  {doctorsData.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.position}
                    </option>
                  ))}
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
              {formData.registrationType === 'direct' && (
                <div className="direct-notice mb-3">
                  <div className="alert alert-info">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    <strong>Đăng ký trực tiếp</strong><br/>
                    <small>Bạn đã chọn đến trực tiếp cơ sở y tế. Vui lòng cung cấp thông tin liên lạc để chúng tôi có thể hướng dẫn bạn.</small>
                  </div>
                </div>
              )}
              
              {formData.registrationType === 'online' && (
                <div className="online-notice mb-3">
                  <div className="alert alert-primary">
                    <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                    <strong>Đăng ký trực tuyến</strong><br/>
                    <small>Bạn đã chọn đặt lịch trực tuyến. Vui lòng điền đầy đủ thông tin để hoàn tất việc đăng ký.</small>
                  </div>
                </div>
              )}

              {formData.registrationType === 'anonymous' && (
                <div className="anonymous-notice mb-3">
                  <div className="alert alert-success">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    <strong>Đặt lịch ẩn danh</strong><br/>
                    <small>Bạn đã chọn đặt lịch ẩn danh. Chúng tôi chỉ cần thông tin cơ bản để liên lạc và xác nhận lịch hẹn.</small>
                  </div>
                </div>
              )}

              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faPhone} className="me-1" />
                  Số Điện Thoại *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập số điện thoại để liên lạc"
                />
                <small className="text-muted">Số điện thoại để xác nhận lịch hẹn và liên lạc khẩn cấp</small>
              </div>

              {formData.registrationType !== 'anonymous' && (
                <>
                  <div className="form-group">
                    <Form.Label>
                      <FontAwesomeIcon icon={faUser} className="me-1" />
                      Họ Tên Đầy Đủ *
                    </Form.Label>
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
                    <Form.Label>Mã Khách Hàng (nếu có)</Form.Label>
                    <Form.Control
                      type="text"
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleInputChange}
                      placeholder="Nhập mã khách hàng (nếu có)"
                    />
                  </div>
                </>
              )}

              {formData.registrationType === 'anonymous' && (
                <div className="form-group">
                  <Form.Label>
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    Tên gọi (tùy chọn)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Tên bạn muốn được gọi (có thể là tên giả)"
                  />
                  <small className="text-muted">Để bác sĩ có thể xưng hô một cách thân thiện trong buổi tư vấn</small>
                </div>
              )}

              <div className="privacy-assurance">
                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <strong>Cam kết bảo mật</strong><br/>
                  <small>
                    • Thông tin của bạn được mã hóa và bảo mật tuyệt đối<br/>
                    • Chúng tôi không chia sẻ thông tin với bên thứ ba<br/>
                    • Đội ngũ y tế được đào tạo về tính bảo mật và không phán xét<br/>
                    • Bạn có quyền yêu cầu xóa thông tin bất kỳ lúc nào
                  </small>
                </div>
              </div>

              <div className="form-submit">
                <Button variant="primary" type="submit" className="w-100">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  {formData.registrationType === 'anonymous' ? 'Hoàn Tất Đặt Lịch Ẩn Danh' : 'Hoàn Tất Đặt Lịch'}
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
          <p>
            Cảm ơn bạn đã đăng ký dịch vụ <strong>{getServiceTypeName(formData.serviceType)}</strong>
            {formData.registrationType === 'anonymous' && <span className="text-success"> (Đặt lịch ẩn danh)</span>}.
          </p>
          
          {formData.registrationType === 'anonymous' ? (
            <div className="alert alert-success text-start">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              <strong>Đặt lịch ẩn danh thành công!</strong><br/>
              <small>
                • Thông tin của bạn được bảo mật hoàn toàn<br/>
                • Chúng tôi sẽ liên lạc qua số điện thoại đã cung cấp<br/>
                • Bạn có thể sử dụng tên gọi đã chọn khi đến khám<br/>
                • Mọi thông tin y tế sẽ được giữ bí mật tuyệt đối
              </small>
            </div>
          ) : (
            <p>
              Vui lòng kiểm tra{' '}
              <a 
                href="/appointment-history" 
                className="text-primary fw-bold"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/appointment-history';
                }}
              >
                Lịch Sử Cuộc Hẹn
              </a>{' '}
              để xác nhận trạng thái.
            </p>
          )}

          {formData.serviceType && (
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <strong>Dịch vụ:</strong> {getServiceTypeName(formData.serviceType)}<br/>
                <strong>Loại đặt lịch:</strong> {
                  formData.registrationType === 'anonymous' ? 'Ẩn danh (Bảo mật)' : 
                  formData.registrationType === 'direct' ? 'Đăng ký trực tiếp' :
                  'Đăng ký trực tuyến'
                }<br/>
                {formData.date && (
                  <>
                    <strong>Ngày hẹn:</strong> {new Date(formData.date).toLocaleString('vi-VN')}
                  </>
                )}
                {formData.phone && (
                  <>
                    <br/><strong>Liên lạc:</strong> {formData.phone}
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