import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faUser, 
  faStethoscope, 
  faNotesMedical,
  faPhone,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';

const AppointmentDetailModal = ({ show, onHide, appointment, loading }) => {
  if (!appointment && !loading) {
    return null;
  }

  // Hàm mapping service ID thành tên dịch vụ
  const getServiceDisplay = (appointment) => {
    // Tìm serviceId từ nhiều trường khác nhau có thể có trong appointment
    let serviceId = appointment?.serviceId || 
                    appointment?.service?.id || 
                    appointment?.service?.serviceId;
    
    // Nếu không có serviceId, tạo từ appointmentType
    if (!serviceId && appointment?.appointmentType) {
      switch (appointment.appointmentType.toUpperCase()) {
        case 'INITIAL':
          serviceId = 1;
          break;
        case 'FOLLOW_UP':
          serviceId = 2;
          break;
        default:
          serviceId = 1;
          break;
      }
    }
    
    // Hardcode mapping - không gọi API
    switch (serviceId) {
      case 1:
      case '1':
        return 'Khám và xét nghiệm HIV';
      case 2:
      case '2':
        return 'Theo dõi tải lượng virus';
      default:
        // Fallback dựa trên appointmentType nếu vẫn không có serviceId
        if (appointment?.appointmentType) {
          switch (appointment.appointmentType.toLowerCase()) {
            case 'initial':
              return 'Khám và xét nghiệm HIV';
            case 'follow_up':
            case 'followup':
              return 'Theo dõi tải lượng virus';
            default:
              return appointment.appointmentType;
          }
        }
        return 'Dịch vụ khám bệnh';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Không có thông tin';
    return timeString;
  };

  const getStatusDisplay = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { text: 'Chờ duyệt', color: 'warning' };
      case 'ACCEPTED':
        return { text: 'Đã duyệt', color: 'success' };
      case 'COMPLETED':
        return { text: 'Đã hoàn thành', color: 'primary' };
      case 'DENIED':
        return { text: 'Từ chối', color: 'danger' };
      default:
        return { text: status || 'Không xác định', color: 'secondary' };
    }
  };

  const statusInfo = getStatusDisplay(appointment?.status);

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      className="appointment-detail-modal"
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          Chi tiết lịch hẹn
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải thông tin lịch hẹn...</p>
          </div>
        ) : appointment ? (
          <div className="appointment-details">
            {/* Thông tin cơ bản */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faIdCard} className="me-2" />
                    Mã lịch hẹn
                  </h6>
                  <p className="detail-value">{appointment.id || 'Không có'}</p>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">Trạng thái</h6>
                  <span className={`badge bg-${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </Col>
            </Row>

            {/* Thông tin thời gian */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    Ngày khám
                  </h6>
                  <p className="detail-value">
                    {formatDate(appointment.date || appointment.appointmentDate)}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    Giờ khám
                  </h6>
                  <p className="detail-value">
                    {formatTime(appointment.slotStartTime)} - {formatTime(appointment.slotEndTime)}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Thông tin bệnh nhân */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Tên bệnh nhân
                  </h6>
                  <p className="detail-value">
                    {appointment.alternativeName || appointment.userName || 'Không có thông tin'}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Số điện thoại
                  </h6>
                  <p className="detail-value">
                    {appointment.alternativePhoneNumber || 'Không có thông tin'}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Thông tin khám bệnh */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                    Loại khám
                  </h6>
                  <p className="detail-value">
                    {appointment.appointmentType || appointment.type || 'Không có thông tin'}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">Dịch vụ</h6>
                  <p className="detail-value">
                    {appointment.appointmentService || appointment.serviceName || getServiceDisplay(appointment)}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Thông tin bác sĩ và triệu chứng */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">Bác sĩ phụ trách</h6>
                  <p className="detail-value">
                    {appointment.doctorName || 'Không có thông tin'}
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-group">
                  <h6 className="detail-label">
                    <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
                    Triệu chứng
                  </h6>
                  <p className="detail-value">
                    {appointment.reason || 'Không có triệu chứng'}
                  </p>
                </div>
              </Col>
            </Row>

            {/* Ghi chú */}
            {appointment.notes && (
              <Row className="mb-4">
                <Col md={12}>
                  <div className="detail-group">
                    <h6 className="detail-label">Ghi chú</h6>
                    <p className="detail-value">
                      {appointment.notes || 'Chưa có ghi chú'}
                    </p>
                  </div>
                </Col>
              </Row>
            )}

            {/* Thông tin medical result và follow-up */}
            <Row className="mb-4">
              {appointment.medicalResultId && (
                <Col md={6}>
                  <div className="detail-group">
                    <h6 className="detail-label">Báo cáo y tế</h6>
                    <p className="detail-value">
                      <span className="badge bg-info">Đã có báo cáo y tế (ID: {appointment.medicalResultId})</span>
                    </p>
                  </div>
                </Col>
              )}
              {appointment.followUpAppointmentId && (
                <Col md={6}>
                  <div className="detail-group">
                    <h6 className="detail-label">Lịch hẹn tái khám</h6>
                    <p className="detail-value">
                      <span className="badge bg-warning">ID: {appointment.followUpAppointmentId}</span>
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div className="text-center p-4">
            <p>Không thể tải thông tin lịch hẹn</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentDetailModal;
