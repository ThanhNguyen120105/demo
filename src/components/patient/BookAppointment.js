import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  Modal,
  Alert,
  ListGroup
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faCalendarAlt, 
  faClock,
  faUser,
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { mockDoctors } from '../../data/mockDoctorData';
import { mockPatientData } from '../../data/mockPatientData';
import { formatDate, formatTime } from '../../utils/dateUtils';

const BookAppointment = ({ onAppointmentBooked }) => {
  // State cho các bước đặt lịch
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // State cho form đặt lịch
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentType: 'direct', // 'direct' hoặc 'anonymous'
    date: '',
    time: '',
    reason: '',
    // Thông tin cá nhân sẽ được điền tự động từ mockPatientData
    patientInfo: mockPatientData.profile
  });

  // State cho validation
  const [errors, setErrors] = useState({});

  // Các hàm xử lý sự kiện
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Chọn bác sĩ và loại khám
        if (!formData.doctorId) {
          newErrors.doctorId = 'Vui lòng chọn bác sĩ';
        }
        if (!formData.appointmentType) {
          newErrors.appointmentType = 'Vui lòng chọn loại khám';
        }
        break;
      
      case 2: // Chọn ngày giờ
        if (!formData.date) {
          newErrors.date = 'Vui lòng chọn ngày';
        }
        if (!formData.time) {
          newErrors.time = 'Vui lòng chọn giờ';
        }
        break;
      
      case 3: // Nhập lý do
        if (!formData.reason) {
          newErrors.reason = 'Vui lòng nhập lý do khám';
        }
        break;
      
      case 4: // Thông tin cá nhân
        if (!formData.patientInfo.fullName) {
          newErrors.fullName = 'Vui lòng nhập họ tên';
        }
        if (!formData.patientInfo.phone) {
          newErrors.phone = 'Vui lòng nhập số điện thoại';
        }
        break;
      
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Tạo lịch hẹn mới
      const newAppointment = {
        id: Date.now(), // Tạm thời dùng timestamp làm id
        date: formData.date,
        time: formData.time,
        doctorId: formData.doctorId,
        doctorName: mockDoctors.find(d => d.id === parseInt(formData.doctorId))?.fullName,
        type: formData.appointmentType === 'direct' ? 'Khám trực tiếp' : 'Khám ẩn danh',
        reason: formData.reason,
        status: 'upcoming',
        patientInfo: formData.patientInfo
      };

      // Gọi callback để cập nhật danh sách lịch hẹn
      onAppointmentBooked(newAppointment);
      
      // Hiển thị modal thành công
      setShowSuccessModal(true);
    }
  };

  // Render các bước đặt lịch
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4 className="mb-4">
              <FontAwesomeIcon icon={faUserMd} className="me-2" />
              Chọn bác sĩ và loại khám
            </h4>
            
            <Form.Group className="mb-4">
              <Form.Label>Bác sĩ</Form.Label>
              <Form.Select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                isInvalid={!!errors.doctorId}
              >
                <option value="">Chọn bác sĩ...</option>
                {mockDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.title} {doctor.fullName} - {doctor.specialization}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.doctorId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Loại khám</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="direct"
                  name="appointmentType"
                  value="direct"
                  label="Khám trực tiếp"
                  checked={formData.appointmentType === 'direct'}
                  onChange={handleInputChange}
                  isInvalid={!!errors.appointmentType}
                />
                <Form.Check
                  type="radio"
                  id="anonymous"
                  name="appointmentType"
                  value="anonymous"
                  label="Khám ẩn danh"
                  checked={formData.appointmentType === 'anonymous'}
                  onChange={handleInputChange}
                  isInvalid={!!errors.appointmentType}
                />
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.appointmentType}
              </Form.Control.Feedback>
            </Form.Group>
          </>
        );

      case 2:
        return (
          <>
            <h4 className="mb-4">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              Chọn ngày và giờ khám
            </h4>
            
            <Form.Group className="mb-4">
              <Form.Label>Ngày khám</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={formatDate(new Date())}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Giờ khám</Form.Label>
              <Form.Select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                isInvalid={!!errors.time}
              >
                <option value="">Chọn giờ...</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.time}
              </Form.Control.Feedback>
            </Form.Group>
          </>
        );

      case 3:
        return (
          <>
            <h4 className="mb-4">
              <FontAwesomeIcon icon={faClock} className="me-2" />
              Lý do khám
            </h4>
            
            <Form.Group className="mb-4">
              <Form.Label>Lý do khám</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Vui lòng mô tả lý do khám của bạn..."
                isInvalid={!!errors.reason}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reason}
              </Form.Control.Feedback>
            </Form.Group>
          </>
        );

      case 4:
        return (
          <>
            <h4 className="mb-4">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Thông tin cá nhân
            </h4>
            
            <Alert variant="info" className="mb-4">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              Thông tin cá nhân đã được điền sẵn từ hồ sơ của bạn. Bạn có thể chỉnh sửa nếu cần.
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="patientInfo.fullName"
                value={formData.patientInfo.fullName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patientInfo: {
                    ...prev.patientInfo,
                    fullName: e.target.value
                  }
                }))}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="tel"
                name="patientInfo.phone"
                value={formData.patientInfo.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patientInfo: {
                    ...prev.patientInfo,
                    phone: e.target.value
                  }
                }))}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="patientInfo.email"
                value={formData.patientInfo.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  patientInfo: {
                    ...prev.patientInfo,
                    email: e.target.value
                  }
                }))}
              />
            </Form.Group>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="book-appointment">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Đặt lịch hẹn khám</h3>
        </Card.Header>
        <Card.Body>
          {/* Hiển thị tiến trình */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`step-indicator ${stepNumber <= step ? 'active' : ''}`}
                >
                  <div className="step-number">{stepNumber}</div>
                  <div className="step-label">
                    {stepNumber === 1 && 'Chọn bác sĩ'}
                    {stepNumber === 2 && 'Chọn ngày giờ'}
                    {stepNumber === 3 && 'Lý do khám'}
                    {stepNumber === 4 && 'Thông tin cá nhân'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form đặt lịch */}
          <Form>
            {renderStep()}

            {/* Nút điều hướng */}
            <div className="d-flex justify-content-between mt-4">
              {step > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  Quay lại
                </Button>
              )}
              {step < 4 ? (
                <Button variant="primary" onClick={handleNext}>
                  Tiếp tục
                </Button>
              ) : (
                <Button variant="success" onClick={handleSubmit}>
                  Hoàn tất đặt lịch
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal thông báo đặt lịch thành công */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
            Đặt lịch thành công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">
            <p>Lịch hẹn của bạn đã được đặt thành công!</p>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Bác sĩ:</strong> {mockDoctors.find(d => d.id === parseInt(formData.doctorId))?.fullName}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Ngày khám:</strong> {formatDate(formData.date)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Giờ khám:</strong> {formData.time}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Loại khám:</strong> {formData.appointmentType === 'direct' ? 'Khám trực tiếp' : 'Khám ẩn danh'}
              </ListGroup.Item>
            </ListGroup>
          </Alert>
          <Alert variant="warning">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Vui lòng đến đúng giờ hẹn. Nếu cần hủy lịch, vui lòng thông báo trước ít nhất 24 giờ.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment; 