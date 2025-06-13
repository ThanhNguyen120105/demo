import React, { useState } from 'react';
import { Card, Table, Button, Modal, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatTime } from '../../utils/dateUtils';

const AppointmentHistory = ({ appointments, onCancelAppointment }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointment) {
      await onCancelAppointment(selectedAppointment.id);
      setShowCancelModal(false);
      setSelectedAppointment(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'upcoming': 'primary',
      'completed': 'success',
      'cancelled': 'danger'
    };
    const labels = {
      'upcoming': 'Sắp tới',
      'completed': 'Đã hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const canCancelAppointment = (appointment) => {
    // Chỉ cho phép hủy các lịch hẹn sắp tới
    return appointment.status === 'upcoming';
  };

  return (
    <div className="appointment-history">
      <Card>
        <Card.Header className="bg-primary text-white">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          Lịch hẹn của bạn
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Bác sĩ</th>
                <th>Loại khám</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{formatTime(appointment.time)}</td>
                  <td>{appointment.doctorName}</td>
                  <td>{appointment.type}</td>
                  <td>{getStatusBadge(appointment.status)}</td>
                  <td>
                    {canCancelAppointment(appointment) && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelClick(appointment)}
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-1" />
                        Hủy
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
            Xác nhận hủy lịch hẹn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>Bạn có chắc chắn muốn hủy lịch hẹn sau?</p>
              <div className="appointment-details">
                <p><strong>Ngày:</strong> {formatDate(selectedAppointment.date)}</p>
                <p><strong>Giờ:</strong> {formatTime(selectedAppointment.time)}</p>
                <p><strong>Bác sĩ:</strong> {selectedAppointment.doctorName}</p>
                <p><strong>Loại khám:</strong> {selectedAppointment.type}</p>
              </div>
              <p className="text-danger">
                <small>
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                  Lưu ý: Việc hủy lịch hẹn có thể ảnh hưởng đến quá trình điều trị của bạn.
                </small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentHistory; 