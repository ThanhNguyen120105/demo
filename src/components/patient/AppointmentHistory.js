import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Badge, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faTimes, 
  faExclamationTriangle, 
  faClock,
  faUserMd,
  faStethoscope,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { appointmentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './AppointmentHistory.css';

const AppointmentHistory = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Load appointments khi component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading appointments for user:', user?.id);
      const result = await appointmentAPI.getAppointmentsByUserId();
      
      if (result.success) {
        console.log('Appointments loaded:', result.data);
        
        // Sắp xếp appointments theo ngày mới nhất trên cùng, nếu cùng ngày thì theo slot
        const sortedAppointments = (result.data || []).sort((a, b) => {
          // Parse ngày appointment
          const dateA = new Date(a.appointmentDate);
          const dateB = new Date(b.appointmentDate);
          
          // So sánh ngày trước (ngày mới nhất trước)
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime(); // Ngày mới nhất trước
          }
          
          // Nếu cùng ngày, sắp xếp theo slot index (slot nhỏ trước)
          const slotA = parseInt(a.slotIndex) || 0;
          const slotB = parseInt(b.slotIndex) || 0;
          return slotA - slotB;
        });
        
        console.log('Sorted appointments (newest first):', sortedAppointments);
        setAppointments(sortedAppointments);
      } else {
        console.error('Failed to load appointments:', result);
        setError(result.message || 'Không thể tải danh sách lịch hẹn');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('Đã xảy ra lỗi khi tải danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      // TODO: Implement cancel appointment API when available
      // await appointmentAPI.cancelAppointment(selectedAppointment.id);
      setShowCancelModal(false);
      setSelectedAppointment(null);
      // loadAppointments(); // Reload after cancel
    }
  };

  // Map trạng thái từ backend thành badge
  const getStatusBadge = (status) => {    const statusConfig = {
      'PENDING': { variant: 'warning', label: 'Chờ duyệt', icon: faClock },
      'ACCEPTED': { variant: 'success', label: 'Đã duyệt', icon: faUserMd },
      'DENIED': { variant: 'danger', label: 'Từ chối', icon: faTimes },
      'COMPLETED': { variant: 'primary', label: 'Hoàn thành', icon: faStethoscope }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', label: status, icon: faExclamationTriangle };
      return (      <Badge bg={config.variant} className="d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
        <FontAwesomeIcon icon={config.icon} size="sm" />
        {config.label}
      </Badge>
    );
  };

  // Kiểm tra có thể hủy appointment không (chỉ PENDING)
  const canCancelAppointment = (appointment) => {
    return appointment.status === 'PENDING';
  };

  // Format appointment type
  const getAppointmentTypeLabel = (type) => {
    const types = {
      'INITIAL': 'Khám lần đầu',
      'FOLLOW_UP': 'Tái khám'
    };
    return types[type] || type;
  };
  // Format date với thêm thông tin về thứ tự
  const formatDate = (dateString) => {
    try {      const date = new Date(dateString);
      
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {      return dateString;
    }
  };

  // Format time slot - bỏ hiển thị slot index
  const formatTimeSlot = (startTime, endTime) => {
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="appointment-history">
      <Card>
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            Lịch sử Lịch hẹn
          </div>          <Button 
            variant="light" 
            size="sm" 
            onClick={loadAppointments}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faRefresh} className={loading ? 'fa-spin' : ''} />
          </Button>        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0">Đang tải danh sách lịch hẹn...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="mb-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-2"
                onClick={loadAppointments}
              >
                Thử lại
              </Button>
            </Alert>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="text-muted mb-3" />
              <h5 className="text-muted">Chưa có lịch hẹn nào</h5>
              <p className="text-muted">Bạn chưa đặt lịch hẹn nào. Hãy đặt lịch khám để được chăm sóc sức khỏe!</p>
            </div>
          ) : (            <div className="table-responsive">
              <Table striped bordered hover size="sm" style={{ fontSize: '0.9rem' }}>
                <thead className="table-light" style={{ fontSize: '0.85rem' }}><tr>                    <th style={{ width: '25%' }}>Ngày khám</th>
                    <th style={{ width: '15%' }}>Giờ khám</th>
                    <th style={{ width: '20%' }}>Bác sĩ</th>
                    <th style={{ width: '15%' }}>Loại khám</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '10%' }}>Thao tác</th>
                  </tr>
                </thead>                <tbody>
                  {appointments.map((appointment, index) => {
                    // Kiểm tra xem có phải ngày mới so với appointment trước đó không
                    const prevAppointment = index > 0 ? appointments[index - 1] : null;
                    const isNewDate = !prevAppointment || 
                      new Date(appointment.appointmentDate).toDateString() !== 
                      new Date(prevAppointment.appointmentDate).toDateString();
                    
                    return (
                      <tr 
                        key={appointment.id}
                        className={isNewDate && index > 0 ? 'border-top-3' : ''}
                        style={isNewDate && index > 0 ? { borderTop: '3px solid #e9ecef' } : {}}
                      >                        <td>
                          <div className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                            {formatDate(appointment.appointmentDate)}
                          </div>
                        </td>                      <td>
                        <div className="d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                          <FontAwesomeIcon icon={faClock} className="me-1 text-primary" size="sm" />
                          <span className="text-nowrap">
                            {formatTimeSlot(
                              appointment.slotStartTime, 
                              appointment.slotEndTime
                            )}
                          </span>
                        </div>
                      </td>                      <td>
                        <div className="d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                          <FontAwesomeIcon icon={faUserMd} className="me-1 text-success" size="sm" />
                          <span className="fw-medium text-nowrap">{appointment.doctorName}</span>
                        </div>
                      </td>                      <td>
                        <Badge bg="info" pill style={{ fontSize: '0.75rem' }}>
                          {getAppointmentTypeLabel(appointment.appointmentType)}
                        </Badge>
                      </td>
                      <td>
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td>
                        {canCancelAppointment(appointment) ? (                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelClick(appointment)}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            <FontAwesomeIcon icon={faTimes} className="me-1" size="sm" />
                            Hủy
                          </Button>
                        ) : (
                          <span className="text-muted">—</span>                        )}
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
            Xác nhận hủy lịch hẹn
          </Modal.Title>
        </Modal.Header>        <Modal.Body>
          {selectedAppointment && (
            <div>
              <p><strong>Bạn có chắc chắn muốn hủy lịch hẹn này?</strong></p>
              <div className="bg-light p-3 rounded">
                <p className="mb-1">
                  <strong>Ngày:</strong> {formatDate(selectedAppointment.appointmentDate)}
                </p>                <p className="mb-1">
                  <strong>Giờ:</strong> {formatTimeSlot(
                    selectedAppointment.slotStartTime,
                    selectedAppointment.slotEndTime
                  )}
                </p>
                <p className="mb-0">
                  <strong>Bác sĩ:</strong> {selectedAppointment.doctorName}
                </p>
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                  Lưu ý: Hành động này không thể hoàn tác.
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentHistory; 