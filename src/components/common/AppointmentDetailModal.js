import React from 'react';
import { Modal, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCalendarAlt, 
  faUserMd, 
  faStethoscope,
  faExclamationTriangle,
  faFileMedical,
  faFlask
} from '@fortawesome/free-solid-svg-icons';

/**
 * Modal chung để hiển thị chi tiết lịch hẹn
 * Có thể sử dụng cho cả CUSTOMER và DOCTOR
 */
const AppointmentDetailModal = ({ 
  show, 
  onHide, 
  appointmentDetail, 
  loading,
  onViewMedicalResult,
  formatDate,
  formatTimeSlot,
  getAppointmentTypeLabel,
  getStatusBadge
}) => {
  
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
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      className="appointment-detail-modal"
      dialogClassName="modal-90w"
      contentClassName="appointment-detail-modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
          Chi tiết lịch hẹn
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Đang tải chi tiết lịch hẹn...</p>
          </div>
        ) : appointmentDetail ? (
          <div>
            {/* Thông tin cơ bản */}
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 className="text-primary mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Thông tin lịch hẹn
                </h6>
                <div className="bg-light p-3 rounded">
                  <p className="mb-2">
                    <strong>Mã lịch hẹn:</strong> 
                    <span className="text-muted ms-2">{appointmentDetail.id}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Ngày khám:</strong> 
                    <span className="ms-2">{formatDate(appointmentDetail.appointmentDate)}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Giờ khám:</strong> 
                    <span className="ms-2">
                      {formatTimeSlot(appointmentDetail.slotStartTime, appointmentDetail.slotEndTime)}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Loại khám:</strong> 
                    <Badge bg="info" className="ms-2 small-badge">
                      {getAppointmentTypeLabel(appointmentDetail.appointmentType)}
                    </Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Dịch vụ:</strong> 
                    <span className="ms-2">{appointmentDetail.appointmentService || getServiceDisplay(appointmentDetail)}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Hình thức khám:</strong> 
                    <Badge 
                      bg={appointmentDetail.isAnonymous === true ? 'warning' : 'primary'} 
                      className="ms-2 small-badge"
                    >
                      {appointmentDetail.isAnonymous === true ? 'Khám ẩn danh' : 'Khám trực tiếp'}
                    </Badge>
                  </p>
                  <p className="mb-0">
                    <strong>Trạng thái:</strong> 
                    <span className="ms-2">{getStatusBadge(appointmentDetail.status)}</span>
                  </p>
                </div>
              </div>
              
              <div className="col-md-6">
                <h6 className="text-success mb-2">
                  <FontAwesomeIcon icon={faUserMd} className="me-2" />
                  Thông tin bác sĩ
                </h6>
                <div className="bg-light p-3 rounded">
                  <p className="mb-2">
                    <strong>Tên bác sĩ:</strong> 
                    <span className="ms-2">{appointmentDetail.doctorName}</span>
                  </p>
                  {appointmentDetail.doctorSpecialty && (
                    <p className="mb-2">
                      <strong>Chuyên khoa:</strong> 
                      <span className="ms-2">{appointmentDetail.doctorSpecialty}</span>
                    </p>
                  )}
                  {appointmentDetail.doctorPhone && (
                    <p className="mb-0">
                      <strong>Điện thoại:</strong> 
                      <span className="ms-2">{appointmentDetail.doctorPhone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Thông tin bệnh nhân */}
            {(appointmentDetail.alternativeName || appointmentDetail.alternativePhoneNumber || appointmentDetail.reason) && (
              <div className="mb-3">
                <h6 className="text-warning mb-2">
                  <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                  Thông tin khám bệnh
                </h6>
                <div className="bg-light p-3 rounded">
                  {appointmentDetail.alternativeName && (
                    <p className="mb-2">
                      <strong>Tên người khám:</strong> 
                      <span className="ms-2">{appointmentDetail.alternativeName}</span>
                    </p>
                  )}
                  {appointmentDetail.alternativePhoneNumber && (
                    <p className="mb-2">
                      <strong>Số điện thoại:</strong> 
                      <span className="ms-2">{appointmentDetail.alternativePhoneNumber}</span>
                    </p>
                  )}
                  {appointmentDetail.reason && (
                    <p className="mb-0">
                      <strong>Lý do khám:</strong> 
                      <span className="ms-2">{appointmentDetail.reason}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ghi chú bổ sung */}
            {appointmentDetail.notes && (
              <div className="mb-3">
                <h6 className="text-secondary mb-2">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  Ghi chú
                </h6>
                <div className="bg-light p-3 rounded">
                  <p className="mb-0">{appointmentDetail.notes}</p>
                </div>
              </div>
            )}

            {/* Kết quả xét nghiệm (nếu có) */}
            {appointmentDetail.medicalResultId && onViewMedicalResult && (
              <div className="mb-3">
                <h6 className="text-info mb-2">
                  <FontAwesomeIcon icon={faFileMedical} className="me-2" />
                  Kết quả xét nghiệm
                </h6>
                <div className="bg-light p-3 rounded text-center">
                  <p className="mb-2">
                    <small className="text-muted">Mã kết quả: {appointmentDetail.medicalResultId}</small>
                  </p>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => onViewMedicalResult(appointmentDetail.medicalResultId)}
                  >
                    <FontAwesomeIcon icon={faFlask} className="me-2" />
                    Xem chi tiết kết quả xét nghiệm
                  </Button>
                </div>
              </div>
            )}

            {/* Lịch hẹn follow-up (nếu có) */}
            {appointmentDetail.followUpAppointmentId && (
              <div className="mb-3">
                <h6 className="text-info mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Lịch hẹn tái khám
                </h6>
                <div className="bg-light p-3 rounded">
                  <p className="mb-0">
                    <strong>Mã lịch hẹn tái khám:</strong> 
                    <span className="ms-2 text-primary">{appointmentDetail.followUpAppointmentId}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Thông tin thời gian */}
            <div className="row">
              {appointmentDetail.createdAt && (
                <div className="col-md-6">
                  <small className="text-muted">
                    <strong>Thời gian đặt:</strong> {' '}
                    {new Date(appointmentDetail.createdAt).toLocaleString('vi-VN')}
                  </small>
                </div>
              )}
              {appointmentDetail.updatedAt && (
                <div className="col-md-6">
                  <small className="text-muted">
                    <strong>Cập nhật lần cuối:</strong> {' '}
                    {new Date(appointmentDetail.updatedAt).toLocaleString('vi-VN')}
                  </small>
                </div>
              )}
            </div>
          </div>
        ) : !loading && !appointmentDetail ? (
          <Alert variant="danger">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.
          </Alert>
        ) : null}
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
