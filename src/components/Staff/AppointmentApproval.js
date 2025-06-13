import React, { useState, useEffect } from 'react';
import './Staff.css';

const AppointmentApproval = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@email.com',
      doctorName: 'BS. Trần Thị B',
      appointmentDate: '2024-01-15',
      appointmentTime: '09:00',
      reason: 'Tư vấn về HIV/AIDS',
      status: 'pending',
      requestDate: '2024-01-10',
      notes: 'Bệnh nhân cần tư vấn khẩn cấp về kết quả xét nghiệm'
    },
    {
      id: 2,
      patientName: 'Trần Thị C',
      phone: '0987654321',
      email: 'tranthic@email.com',
      doctorName: 'BS. Lê Văn D',
      appointmentDate: '2024-01-16',
      appointmentTime: '14:30',
      reason: 'Khám định kỳ',
      status: 'pending',
      requestDate: '2024-01-11',
      notes: 'Tái khám theo lịch hẹn'
    },
    {
      id: 3,
      patientName: 'Phạm Văn E',
      phone: '0456789123',
      email: 'phamvane@email.com',
      doctorName: 'BS. Nguyễn Thị F',
      appointmentDate: '2024-01-17',
      appointmentTime: '10:15',
      reason: 'Tư vấn sức khỏe tình dục',
      status: 'pending',
      requestDate: '2024-01-12',
      notes: 'Bệnh nhân có triệu chứng cần tư vấn'
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleApprove = (appointmentId) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'approved' }
          : apt
      )
    );
    setShowModal(false);
  };

  const handleReject = (appointmentId, reason) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'rejected', rejectionReason: reason }
          : apt
      )
    );
    setShowModal(false);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'badge-warning', text: 'Chờ duyệt' },
      approved: { class: 'badge-success', text: 'Đã duyệt' },
      rejected: { class: 'badge-danger', text: 'Từ chối' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  return (
    <div className="appointment-approval">
      <div className="content-header">
        <h2>Duyệt đơn đặt lịch</h2>
        <p>Quản lý và duyệt các yêu cầu đặt lịch khám của bệnh nhân</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tất cả ({appointments.length})
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Chờ duyệt ({appointments.filter(a => a.status === 'pending').length})
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          Đã duyệt ({appointments.filter(a => a.status === 'approved').length})
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Từ chối ({appointments.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {/* Appointments Table */}
      <div className="appointments-table">
        <table className="table">
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Bác sĩ</th>
              <th>Ngày khám</th>
              <th>Giờ</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => (
              <tr key={appointment.id}>
                <td>
                  <div className="patient-info">
                    <strong>{appointment.patientName}</strong>
                    <small>{appointment.phone}</small>
                  </div>
                </td>
                <td>{appointment.doctorName}</td>
                <td>{new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</td>
                <td>{appointment.appointmentTime}</td>
                <td>{appointment.reason}</td>
                <td>{getStatusBadge(appointment.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(appointment.id)}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(appointment.id, 'Lịch không phù hợp')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for appointment details */}
      {showModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chi tiết đơn đặt lịch</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Bệnh nhân:</label>
                  <span>{selectedAppointment.patientName}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại:</label>
                  <span>{selectedAppointment.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedAppointment.email}</span>
                </div>
                <div className="detail-item">
                  <label>Bác sĩ:</label>
                  <span>{selectedAppointment.doctorName}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày khám:</label>
                  <span>{new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="detail-item">
                  <label>Giờ khám:</label>
                  <span>{selectedAppointment.appointmentTime}</span>
                </div>
                <div className="detail-item">
                  <label>Lý do khám:</label>
                  <span>{selectedAppointment.reason}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày yêu cầu:</label>
                  <span>{new Date(selectedAppointment.requestDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Ghi chú:</label>
                  <span>{selectedAppointment.notes}</span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái:</label>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
              </div>
            </div>
            {selectedAppointment.status === 'pending' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedAppointment.id)}
                >
                  <i className="fas fa-check"></i> Duyệt
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedAppointment.id, 'Từ chối')}
                >
                  <i className="fas fa-times"></i> Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentApproval; 