import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Card } from 'react-bootstrap';
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
  faStethoscope,
  faVial,
  faSyringe,
  faHospital,
  faMapMarkerAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import './AppointmentForm.css';
import { useLocation } from 'react-router-dom';
import { doctorsData } from '../Doctors/Doctors';
import BackButton from '../common/BackButton';

const AppointmentForm = () => {
  const location = useLocation();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: 'hiv-care',
    serviceDetail: '',
    doctor: '',
    date: '',
    time: '',
    healthIssues: '',
    customerId: '',
    phone: '',
    dob: '',
    name: '',
    registrationType: 'hiv-care',
    consultationType: 'direct' // direct: khám trực tiếp, anonymous: khám ẩn danh
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ]);

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
      if (!formData.serviceDetail) {
        alert('Vui lòng chọn chi tiết dịch vụ');
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      if (!formData.consultationType) {
        alert('Vui lòng chọn loại hình khám');
        return;
      }
      setFormStep(3);
    } else if (formStep === 3) {
      if (!formData.date || !formData.time) {
        alert('Vui lòng chọn ngày và giờ khám');
        return;
      }
      setFormStep(4);
    } else if (formStep === 4) {
      if (!formData.name || !formData.phone || !formData.dob) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }
      setShowSuccessModal(true);
      console.log('Form submitted:', formData);
    }
  };

  const handlePreviousStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const getServiceTypeName = (value) => {
    return 'Khám & Điều trị HIV';
  };

  const getServiceDetailName = (type, value) => {
    const serviceDetails = {
      'hiv-testing': 'Tư vấn và xét nghiệm HIV',
      'viral-load-monitoring': 'Theo dõi tải lượng virus',
      'routine-checkup': 'Khám định kỳ'
    };
    return serviceDetails[value] || value;
  };

  return (
    <Container>
      <style jsx>{`
        .hospital-header {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
          text-align: center;
        }
        

        
        .booking-options {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: nowrap;
        }
        
        .booking-option {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1.2rem 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
          flex: 1;
          min-width: 0;
        }
        
        .booking-option:hover {
          border-color: #007bff;
          box-shadow: 0 8px 25px rgba(0,123,255,0.15);
          transform: translateY(-5px);
        }
        
        .booking-option.active {
          border-color: #007bff;
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
          box-shadow: 0 8px 25px rgba(0,123,255,0.2);
          transform: translateY(-5px);
        }
        
        .option-icon {
          font-size: 2rem;
          color: #007bff;
          margin-bottom: 0.75rem;
          display: block;
          text-align: center;
          width: 100%;
        }
        
        .option-title {
          font-weight: bold;
          font-size: 0.95rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        

        
        .service-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .service-detail-option {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
        }
        
        .service-detail-option:hover {
          border-color: #007bff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.15);
        }
        
        .service-detail-option.active {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.2);
        }
        
        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .time-slot {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
          font-weight: 500;
        }
        
        .time-slot:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }
        
        .time-slot.active {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }
        
        .time-slot.unavailable {
          background: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
          border-color: #dee2e6;
        }
        
        .consultation-type-options .form-check {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1rem;
          margin: 0;
          flex: 1;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }
        
        .consultation-type-options .form-check:hover {
          border-color: #007bff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.15);
        }
        
        .consultation-type-options .form-check-input:checked + .form-check-label {
          color: #007bff;
        }
        
        .consultation-type-options .form-check-input:checked ~ * {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.2);
        }


        @media (max-width: 768px) {
          .booking-options {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .booking-option {
            padding: 1rem;
          }
          
          .option-title {
            font-size: 1rem;
          }
          

        }
        
        @media (max-width: 992px) and (min-width: 769px) {
          
          .service-detail-grid {
            grid-template-columns: 1fr;
          }
          
          .time-slots {
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          }
          

          
          .hospital-header {
            padding: 1.5rem;
          }
        }
      `}</style>

      {/* Hospital Header */}
      <div className="hospital-header">
        <FontAwesomeIcon icon={faHospital} size="3x" className="mb-3" />
        <h1>Đặt Lịch Khám & Điều Trị HIV</h1>
        <p className="mb-0">Hệ thống đặt lịch khám chữa bệnh HIV trực tuyến</p>
      </div>




        
      <div className="simple-form-container">
        <div className="form-header">
          <h2 className="simple-form-title">Đặt Lịch Khám & Điều Trị HIV</h2>
          <p className="form-subtitle">Vui lòng làm theo các bước để hoàn tất đặt lịch khám HIV</p>
        </div>
        
        <div className="form-progress">
          <div className={`progress-step ${formStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Chi Tiết Dịch Vụ HIV</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Loại Hình Khám</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Chọn Lịch Khám</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Thông Tin Cá Nhân</div>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          {/* Bước 1: Chọn chi tiết dịch vụ HIV */}
          {formStep === 1 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 1: Chọn loại dịch vụ HIV</h4>
              <div className="alert alert-info mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Dịch vụ: <strong>{getServiceTypeName(formData.registrationType)}</strong>
                      </div>

              <div className="service-detail-grid">
                      <div 
                  className={`service-detail-option ${formData.serviceDetail === 'hiv-testing' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, serviceDetail: 'hiv-testing'})}
                      >
                  <div className="mb-2">🧪</div>
                  <strong>Tư vấn và xét nghiệm HIV</strong>
                  <small className="d-block text-muted mt-1">Xét nghiệm sàng lọc, xét nghiệm khẳng định</small>
                      </div>
                      
                      <div 
                  className={`service-detail-option ${formData.serviceDetail === 'viral-load-monitoring' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, serviceDetail: 'viral-load-monitoring'})}
                      >
                  <div className="mb-2">📊</div>
                  <strong>Theo dõi tải lượng virus</strong>
                  <small className="d-block text-muted mt-1">Xét nghiệm định kỳ, đánh giá hiệu quả điều trị</small>
                      </div>

                      <div 
                  className={`service-detail-option ${formData.serviceDetail === 'routine-checkup' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, serviceDetail: 'routine-checkup'})}
                      >
                  <div className="mb-2">🩺</div>
                  <strong>Khám định kỳ</strong>
                  <small className="d-block text-muted mt-1">Theo dõi sức khỏe tổng quát</small>
                      </div>
                    </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faUserMd} className="label-icon" />
                  Chọn bác sĩ (tùy chọn)
                </label>
                <Form.Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Bác sĩ bất kỳ</option>
                  {doctorsData.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.position}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="form-submit">
                <Button variant="primary" type="submit" className="submit-button">
                  <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                  Tiếp Theo
                </Button>
              </div>
            </div>
          )}

          {/* Bước 2: Chọn loại hình khám */}
          {formStep === 2 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 2: Chọn loại hình khám</h4>
              <div className="alert alert-info mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Dịch vụ: <strong>{getServiceDetailName(formData.registrationType, formData.serviceDetail)}</strong>
              </div>

              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUserMd} className="me-1" />
                  Loại hình khám *
                </Form.Label>
                <div className="consultation-type-options">
                  <div className="d-flex gap-3">
                    <div 
                      className={`consultation-card ${formData.consultationType === 'direct' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, consultationType: 'direct'})}
                      style={{
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.consultationType === 'direct' ? '#f8f9ff' : 'white',
                        borderColor: formData.consultationType === 'direct' ? '#007bff' : '#e9ecef',
                        boxShadow: formData.consultationType === 'direct' ? '0 4px 15px rgba(0,123,255,0.2)' : 'none',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Form.Check
                        type="radio"
                        id="direct-consultation"
                        name="consultationType"
                        value="direct"
                        checked={formData.consultationType === 'direct'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <FontAwesomeIcon icon={faUser} size="2x" className="mb-3" style={{ color: '#007bff' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        Khám trực tiếp
                    </div>
                    </div>

                    <div 
                      className={`consultation-card ${formData.consultationType === 'anonymous' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, consultationType: 'anonymous'})}
                      style={{
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.consultationType === 'anonymous' ? '#f8f9ff' : 'white',
                        borderColor: formData.consultationType === 'anonymous' ? '#007bff' : '#e9ecef',
                        boxShadow: formData.consultationType === 'anonymous' ? '0 4px 15px rgba(0,123,255,0.2)' : 'none',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Form.Check
                        type="radio"
                        id="anonymous-consultation"
                        name="consultationType"
                        value="anonymous"
                        checked={formData.consultationType === 'anonymous'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <FontAwesomeIcon icon={faInfoCircle} size="2x" className="mb-3" style={{ color: '#007bff' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        Khám ẩn danh
                    </div>
                    </div>
                    </div>
                    </div>
                <small className="text-muted">
                  {formData.consultationType === 'anonymous' 
                    ? 'Chế độ ẩn danh: Thông tin cá nhân sẽ được mã hóa và bảo mật tuyệt đối'
                    : 'Chế độ trực tiếp: Thông tin sẽ được lưu trữ trong hệ thống để theo dõi quá trình điều trị'
                  }
                </small>
              </div>

              <div className="form-submit">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    className="flex-fill"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button variant="primary" type="submit" className="flex-fill">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                    Tiếp theo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bước 3: Chọn ngày và giờ khám */}
          {formStep === 3 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 3: Chọn ngày và giờ khám</h4>
              <div className="alert alert-info mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Dịch vụ: <strong>{getServiceDetailName(formData.registrationType, formData.serviceDetail)}</strong> - 
                Loại khám: <strong>{formData.consultationType === 'anonymous' ? 'Khám ẩn danh' : 'Khám trực tiếp'}</strong>
                {formData.doctor && (
                  <span> - Bác sĩ: <strong>{doctorsData.find(d => d.id === formData.doctor)?.name}</strong></span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} className="label-icon" />
                  Chọn ngày khám
                </label>
                <div className="date-input-wrapper">
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <small className="text-muted">Chọn ngày từ hôm nay trở đi</small>
              </div>

              {formData.date && (
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faClock} className="label-icon" />
                    Chọn giờ khám
                  </label>
                  <div className="time-slots">
                    {availableTimes.map((time, index) => (
                      <div
                        key={time}
                        className={`time-slot ${formData.time === time ? 'active' : ''} ${Math.random() > 0.8 ? 'unavailable' : ''}`}
                        onClick={() => {
                          if (Math.random() <= 0.8) { // Giả lập slot khả dụng
                            setFormData({...formData, time});
                          }
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                  <small className="text-muted">Chọn khung giờ phù hợp. Slot màu xám không khả dụng.</small>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCommentMedical} className="label-icon" />
                  Lý do khám bệnh (tùy chọn)
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Mô tả triệu chứng, lý do khám bệnh hoặc yêu cầu đặc biệt..."
                  name="healthIssues"
                  value={formData.healthIssues}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-submit">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    className="flex-fill"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button variant="primary" type="submit" className="flex-fill">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                    Tiếp theo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bước 4: Thông tin cá nhân */}
          {formStep === 4 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 4: Thông tin cá nhân</h4>
              <div className="alert alert-success mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                <strong>Thông tin đặt lịch:</strong><br/>
                <small>
                  • Dịch vụ: {getServiceDetailName(formData.registrationType, formData.serviceDetail)}<br/>
                  • Loại khám: {formData.consultationType === 'anonymous' ? 'Khám ẩn danh' : 'Khám trực tiếp'}<br/>
                  • Ngày khám: {formData.date ? new Date(formData.date).toLocaleDateString('vi-VN') : ''}<br/>
                  • Giờ khám: {formData.time}<br/>
                  {formData.doctor && `• Bác sĩ: ${doctorsData.find(d => d.id === formData.doctor)?.name}`}
                </small>
              </div>

              <div className="patient-info-notice mb-4">
                <div className="alert alert-primary">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <strong>Thông tin bệnh nhân</strong><br/>
                  <small>Vui lòng cung cấp thông tin chính xác để chúng tôi có thể liên lạc và xác nhận lịch hẹn với bạn.</small>
                </div>
              </div>

              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Họ và Tên *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ và tên đầy đủ"
                />
                <small className="text-muted">Họ tên như trong CMND/CCCD</small>
              </div>

              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <Form.Label>
                      <FontAwesomeIcon icon={faPhone} className="me-1" />
                      Số Điện Thoại *
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                    <small className="text-muted">Để xác nhận lịch hẹn và thông báo</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <Form.Label>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                      Ngày Sinh *
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </Col>
              </Row>

              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Số BHYT/Mã Bệnh Nhân (nếu có)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  placeholder="Nhập số BHYT hoặc mã bệnh nhân (nếu có)"
                />
                <small className="text-muted">Để tra cứu hồ sơ bệnh án (nếu đã từng khám)</small>
              </div>

              <div className="privacy-notice">
                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <strong>Cam kết bảo mật thông tin</strong><br/>
                  <small>
                    • Thông tin cá nhân được bảo mật theo quy định của Bộ Y tế<br/>
                    • Chỉ được sử dụng cho mục đích khám chữa bệnh<br/>
                    • Không chia sẻ với bên thứ ba khi chưa có sự đồng ý<br/>
                    • Bạn có quyền yêu cầu chỉnh sửa hoặc xóa thông tin
                  </small>
                </div>
              </div>

              <div className="form-submit">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    className="flex-fill"
                    style={{
                      borderColor: '#6c757d',
                      color: '#6c757d',
                      fontWeight: '500',
                      padding: '12px 20px',
                      borderRadius: '8px'
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-fill" 
                    style={{
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '8px'
                    }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Hoàn Tất Đặt Lịch
                  </Button>
                </div>
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
            <br />
            Đặt Lịch Thành Công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="alert alert-success">
            <h5 className="mb-3">Cảm ơn bạn đã đặt lịch khám!</h5>
            <p className="mb-2">
              <strong>Dịch vụ:</strong> {getServiceTypeName(formData.registrationType)}
            </p>
            {formData.serviceDetail && (
              <p className="mb-2">
                <strong>Chi tiết:</strong> {getServiceDetailName(formData.registrationType, formData.serviceDetail)}
              </p>
            )}
            {formData.date && (
              <p className="mb-2">
                <strong>Ngày khám:</strong> {new Date(formData.date).toLocaleDateString('vi-VN')}
                {formData.time && <span> - <strong>Giờ:</strong> {formData.time}</span>}
              </p>
            )}
            <p className="mb-0">
              <strong>Liên hệ:</strong> {formData.phone}
            </p>
          </div>

          <div className="alert alert-info">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            <strong>Thông báo quan trọng:</strong><br/>
            <small>
              • Lịch hẹn của bạn đang được xử lý<br/>
              • Chúng tôi sẽ gọi điện xác nhận trong vòng 24h<br/>
              • Vui lòng mang theo CMND/CCCD và thẻ BHYT (nếu có)<br/>
              • Đến trước giờ hẹn 30 phút để làm thủ tục
            </small>
          </div>

          <div className="contact-reminder">
            <p className="mb-1"><strong>Hotline hỗ trợ:</strong></p>
            <h4 className="text-primary mb-2">1900.888.866</h4>
            <small className="text-muted">
              Thời gian làm việc: T2-T6 (7:30-21:00) | T7-CN (7:30-16:30)
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="primary" 
            onClick={() => {
              setShowSuccessModal(false);
              // Reset form
              setFormData({
                serviceType: 'hiv-care',
                serviceDetail: '',
                doctor: '',
                date: '',
                time: '',
                healthIssues: '',
                customerId: '',
                phone: '',
                dob: '',
                name: '',
                registrationType: 'hiv-care',
                consultationType: 'direct'
              });
              setFormStep(1);
            }}
            className="px-4"
          >
            Đặt Lịch Mới
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentForm; 