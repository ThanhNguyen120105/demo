import React, { useState, useEffect } from 'react';
import './StaffDoctorManagement.css';

const StaffDoctorManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'calendar', 'doctors'
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAssignment: 0,
    activeDoctors: 0
  });

  // Mock data for doctors
  const doctors = [
    {
      id: 'dr1',
      name: 'Dr. Trần Thị Bình',
      specialty: 'Tim mạch',
      avatar: '/api/placeholder/100/100',
      schedule: 'T2-T6: 8:00-17:00',
      totalPatients: 45,
      todayAppointments: 8,
      status: 'active'
    },
    {
      id: 'dr2', 
      name: 'Dr. Phạm Văn Đức',
      specialty: 'Nội khoa',
      avatar: '/api/placeholder/100/100',
      schedule: 'T2-T7: 7:30-16:30',
      totalPatients: 52,
      todayAppointments: 12,
      status: 'active'
    },
    {
      id: 'dr3',
      name: 'Dr. Nguyễn Thị Hoa',
      specialty: 'Da liễu',
      avatar: '/api/placeholder/100/100',
      schedule: 'T3-T7: 9:00-18:00',
      totalPatients: 38,
      todayAppointments: 6,
      status: 'active'
    },
    {
      id: 'dr4',
      name: 'Dr. Lý Văn Nam',
      specialty: 'Nhi khoa',
      avatar: '/api/placeholder/100/100',
      schedule: 'T2-T6: 8:30-17:30',
      totalPatients: 41,
      todayAppointments: 9,
      status: 'busy'
    }
  ];

  // Mock data for appointments
  const mockAppointments = [
    {
      id: 1,
      patientName: 'Nguyễn Văn An',
      patientEmail: 'an.nguyen@email.com',
      patientPhone: '0901234567',
      serviceType: 'hiv-test',
      doctorId: 'dr1',
      doctorName: 'Dr. Trần Thị Bình',
      appointmentDate: '2024-01-25',
      appointmentTime: '09:00',
      status: 'confirmed',
      priority: 'normal',
      reason: 'Khám định kỳ tim mạch',
      notes: 'Bệnh nhân có tiền sử cao huyết áp',
      createdAt: '2024-01-20T10:30:00'
    },
    {
      id: 2,
      patientName: 'Lê Thị Cẩm',
      patientEmail: 'cam.le@email.com',
      patientPhone: '0987654321',
      serviceType: 'treatment-program',
      doctorId: '',
      doctorName: '',
      appointmentDate: '2024-01-26',
      appointmentTime: '14:30',
      status: 'pending_assignment',
      priority: 'high',
      reason: 'Đau bụng, khó tiêu',
      notes: 'Cần làm xét nghiệm máu',
      createdAt: '2024-01-21T15:45:00'
    },
    {
      id: 3,
      patientName: 'Hoàng Minh Đức',
      patientEmail: 'duc.hoang@email.com',
      patientPhone: '0912345678',
      serviceType: 'prevention-service',
      doctorId: 'dr3',
      doctorName: 'Dr. Nguyễn Thị Hoa',
      appointmentDate: '2024-01-24',
      appointmentTime: '10:15',
      status: 'completed',
      priority: 'normal',
      reason: 'Viêm da cơ địa',
      notes: 'Đã khám xong, kê toa thuốc',
      createdAt: '2024-01-19T09:20:00'
    },
    {
      id: 4,
      patientName: 'Võ Thị Hạnh',
      patientEmail: 'hanh.vo@email.com',
      patientPhone: '0923456789',
      serviceType: 'counseling',
      doctorId: 'dr4',
      doctorName: 'Dr. Lý Văn Nam',
      appointmentDate: '2024-01-27',
      appointmentTime: '16:00',
      status: 'confirmed',
      priority: 'low',
      reason: 'Khám sức khỏe định kỳ cho trẻ',
      notes: 'Trẻ 5 tuổi, cần tư vấn dinh dưỡng',
      createdAt: '2024-01-22T11:15:00'
    },
    {
      id: 5,
      patientName: 'Đặng Văn Khôi',
      patientEmail: 'khoi.dang@email.com',
      patientPhone: '0934567890',
      serviceType: 'hiv-test',
      doctorId: '',
      doctorName: '',
      appointmentDate: '2024-01-28',
      appointmentTime: '11:30',
      status: 'pending_assignment',
      priority: 'high',
      reason: 'Kiểm tra kết quả xét nghiệm',
      notes: 'Bệnh nhân đã làm xét nghiệm tuần trước',
      createdAt: '2024-01-23T14:20:00'
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
    calculateStats(mockAppointments);
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [selectedDoctor, selectedDate, selectedStatus, appointments]);

  const calculateStats = (appointmentList) => {
    const today = new Date().toISOString().split('T')[0];
    const stats = {
      totalAppointments: appointmentList.length,
      todayAppointments: appointmentList.filter(apt => apt.appointmentDate === today).length,
      pendingAssignment: appointmentList.filter(apt => apt.status === 'pending_assignment').length,
      activeDoctors: doctors.filter(dr => dr.status === 'active').length
    };
    setStats(stats);
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(apt => apt.doctorId === selectedDoctor);
    }

    if (selectedDate) {
      filtered = filtered.filter(apt => apt.appointmentDate === selectedDate);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    setFilteredAppointments(filtered);
  };

  const assignDoctorToAppointment = (appointmentId, doctorId) => {
    const doctor = doctors.find(dr => dr.id === doctorId);
    const updatedAppointments = appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          doctorId: doctorId,
          doctorName: doctor.name,
          status: 'confirmed'
        };
      }
      return apt;
    });
    
    setAppointments(updatedAppointments);
    calculateStats(updatedAppointments);
    setShowAssignModal(false);
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updatedAppointments);
    calculateStats(updatedAppointments);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_assignment: { icon: 'fas fa-user-clock', class: 'badge-warning', text: 'Chờ phân công' },
      confirmed: { icon: 'fas fa-check-circle', class: 'badge-primary', text: 'Đã xác nhận' },
      completed: { icon: 'fas fa-check-double', class: 'badge-success', text: 'Hoàn thành' },
      cancelled: { icon: 'fas fa-times-circle', class: 'badge-danger', text: 'Hủy bỏ' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        <i className={`${config.icon} status-icon`}></i>
        {config.text}
      </span>
    );
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('vi-VN');
  };

  const getDoctorWorkload = (doctorId) => {
    const doctorAppointments = appointments.filter(apt => 
      apt.doctorId === doctorId && apt.appointmentDate === new Date().toISOString().split('T')[0]
    );
    return doctorAppointments.length;
  };

  return (
    <div className="staff-doctor-management">
      {/* Header */}
      <div className="page-header-banner">
        <div className="container">
          <div className="header-content">
            <div className="header-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div>
              <h1 className="page-title">Quản lý Bác sĩ & Lịch hẹn</h1>
              <p className="page-description">
                Phân công và quản lý lịch hẹn cho các bác sĩ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="management-container">
          {/* Statistics Dashboard */}
          <div className="stats-dashboard">
            <div className="row">
              <div className="col-md-3">
                <div className="stat-card total">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.totalAppointments}</h3>
                    <p>Tổng Lịch hẹn</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card today">
                  <div className="stat-icon">
                    <i className="fas fa-calendar-day"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.todayAppointments}</h3>
                    <p>Hôm nay</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card pending">
                  <div className="stat-icon">
                    <i className="fas fa-user-clock"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.pendingAssignment}</h3>
                    <p>Chờ phân công</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="stat-card doctors">
                  <div className="stat-icon">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stats.activeDoctors}</h3>
                    <p>Bác sĩ hoạt động</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <div className="toggle-buttons">
              <button
                className={`toggle-btn ${currentView === 'list' ? 'active' : ''}`}
                onClick={() => setCurrentView('list')}
              >
                <i className="fas fa-list"></i> Danh sách
              </button>
              <button
                className={`toggle-btn ${currentView === 'doctors' ? 'active' : ''}`}
                onClick={() => setCurrentView('doctors')}
              >
                <i className="fas fa-users"></i> Bác sĩ
              </button>
              <button
                className={`toggle-btn ${currentView === 'calendar' ? 'active' : ''}`}
                onClick={() => setCurrentView('calendar')}
              >
                <i className="fas fa-calendar"></i> Lịch
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="row">
              <div className="col-md-3">
                <div className="filter-group">
                  <label>Bác sĩ</label>
                  <select
                    className="form-control"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                  >
                    <option value="all">Tất cả bác sĩ</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                    <option value="">Chưa phân công</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="filter-group">
                  <label>Ngày</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="filter-group">
                  <label>Trạng thái</label>
                  <select
                    className="form-control"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="pending_assignment">Chờ phân công</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Hủy bỏ</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="filter-group">
                  <label>&nbsp;</label>
                  <button 
                    className="btn btn-secondary btn-block"
                    onClick={() => {
                      setSelectedDoctor('all');
                      setSelectedDate('');
                      setSelectedStatus('all');
                    }}
                  >
                    <i className="fas fa-refresh"></i> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Views */}
          {currentView === 'list' && (
            <div className="appointments-list-view">
              <div className="list-header">
                <h4>
                  <i className="fas fa-clipboard-list"></i>
                  Danh sách lịch hẹn ({filteredAppointments.length})
                </h4>
              </div>
              
              <div className="appointments-grid">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className={`appointment-card status-${appointment.status}`}>
                    <div className="card-header">
                      <div className="patient-info">
                        <h5>{appointment.patientName}</h5>
                        <span className="service-type">
                          {getServiceTypeName(appointment.serviceType)}
                        </span>
                      </div>
                      <div className="appointment-actions">
                        {appointment.status === 'pending_assignment' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowAssignModal(true);
                            }}
                          >
                            <i className="fas fa-user-plus"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetails(true);
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="appointment-time">
                        <i className="fas fa-calendar"></i>
                        {formatDate(appointment.appointmentDate)} - {appointment.appointmentTime}
                      </div>
                      
                      <div className="doctor-assignment">
                        {appointment.doctorName ? (
                          <div className="assigned-doctor">
                            <i className="fas fa-user-md"></i>
                            {appointment.doctorName}
                          </div>
                        ) : (
                          <div className="unassigned">
                            <i className="fas fa-exclamation-triangle"></i>
                            Chưa phân công bác sĩ
                          </div>
                        )}
                      </div>
                      
                      <div className="card-footer">
                        <div className="status-priority">
                          {getStatusBadge(appointment.status)}
                        
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'doctors' && (
            <div className="doctors-view">
              <div className="doctors-header">
                <h4>
                  <i className="fas fa-users"></i>
                  Danh sách bác sĩ ({doctors.length})
                </h4>
              </div>
              
              <div className="doctors-grid">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className={`doctor-card status-${doctor.status}`}>
                    <div className="doctor-avatar">
                      <img src={doctor.avatar} alt={doctor.name} />
                      <div className={`status-indicator ${doctor.status}`}></div>
                    </div>
                    
                    <div className="doctor-info">
                      <h5>{doctor.name}</h5>
                      <p className="specialty">{doctor.specialty}</p>
                      <p className="schedule">
                        <i className="fas fa-clock"></i>
                        {doctor.schedule}
                      </p>
                    </div>
                    
                    <div className="doctor-stats">
                      <div className="stat-item">
                        <span className="number">{doctor.todayAppointments}</span>
                        <span className="label">Hôm nay</span>
                      </div>
                      <div className="stat-item">
                        <span className="number">{doctor.totalPatients}</span>
                        <span className="label">Tổng BN</span>
                      </div>
                    </div>
                    
                    <div className="doctor-actions">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        Xem lịch hẹn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="calendar-view">
              <div className="calendar-header">
                <h4>
                  <i className="fas fa-calendar"></i>
                  Lịch hẹn theo tuần
                </h4>
              </div>
              
              <div className="weekly-calendar">
                <div className="calendar-grid">
                  {/* Simple calendar implementation */}
                  <div className="calendar-placeholder">
                    <i className="fas fa-calendar-alt"></i>
                    <p>Chế độ xem lịch sẽ được phát triển thêm</p>
                    <p>Hiện tại sử dụng chế độ xem danh sách</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedAppointment && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-plus"></i>
                  Phân công bác sĩ
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAssignModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="assignment-info">
                  <h6>Thông tin lịch hẹn:</h6>
                  <p><strong>Bệnh nhân:</strong> {selectedAppointment.patientName}</p>
                  <p><strong>Dịch vụ:</strong> {getServiceTypeName(selectedAppointment.serviceType)}</p>
                  <p><strong>Thời gian:</strong> {formatDate(selectedAppointment.appointmentDate)} - {selectedAppointment.appointmentTime}</p>
                </div>
                
                <div className="doctor-selection">
                  <h6>Chọn bác sĩ:</h6>
                  <div className="doctors-list">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="doctor-option">
                        <div className="doctor-basic-info">
                          <img src={doctor.avatar} alt={doctor.name} className="doctor-mini-avatar" />
                          <div className="doctor-details">
                            <strong>{doctor.name}</strong>
                            <span>{doctor.specialty}</span>
                          </div>
                        </div>
                        <div className="doctor-workload">
                          <span className="workload-count">{getDoctorWorkload(doctor.id)}</span>
                          <span className="workload-label">hôm nay</span>
                        </div>
                        <button
                          className={`btn btn-sm ${doctor.status === 'active' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => assignDoctorToAppointment(selectedAppointment.id, doctor.id)}
                          disabled={doctor.status !== 'active'}
                        >
                          {doctor.status === 'active' ? 'Phân công' : 'Bận'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedAppointment && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-info-circle"></i>
                  Chi tiết lịch hẹn #{selectedAppointment.id}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowDetails(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="appointment-details">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="detail-section">
                        <h6><i className="fas fa-user"></i> Thông tin bệnh nhân</h6>
                        <div className="detail-item">
                          <label>Họ và tên:</label>
                          <span>{selectedAppointment.patientName}</span>
                        </div>
                        <div className="detail-item">
                          <label>Email:</label>
                          <span>{selectedAppointment.patientEmail}</span>
                        </div>
                        <div className="detail-item">
                          <label>Số điện thoại:</label>
                          <span>{selectedAppointment.patientPhone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-section">
                        <h6><i className="fas fa-user-md"></i> Thông tin bác sĩ</h6>
                        {selectedAppointment.doctorName ? (
                          <>
                            <div className="detail-item">
                              <label>Bác sĩ:</label>
                              <span>{selectedAppointment.doctorName}</span>
                            </div>
                            <div className="detail-item">
                              <label>Chuyên khoa:</label>
                              <span>{doctors.find(dr => dr.id === selectedAppointment.doctorId)?.specialty}</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-warning">
                            <i className="fas fa-exclamation-triangle"></i>
                            Chưa phân công bác sĩ
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="detail-section">
                        <h6><i className="fas fa-calendar"></i> Thời gian hẹn</h6>
                        <div className="detail-item">
                          <label>Ngày:</label>
                          <span>{formatDate(selectedAppointment.appointmentDate)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Giờ:</label>
                          <span>{selectedAppointment.appointmentTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-section">
                        <h6><i className="fas fa-info"></i> Trạng thái & Dịch vụ</h6>
                        <div className="detail-item">
                          <label>Trạng thái:</label>
                          <span>{getStatusBadge(selectedAppointment.status)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Dịch vụ:</label>
                          <span>{getServiceTypeName(selectedAppointment.serviceType)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section mt-3">
                    <h6><i className="fas fa-stethoscope"></i> Lý do khám</h6>
                    <p className="reason-detail">{selectedAppointment.reason}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h6><i className="fas fa-notes-medical"></i> Ghi chú</h6>
                    <p className="notes-detail">{selectedAppointment.notes}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="status-actions">
                  {selectedAppointment.status === 'pending_assignment' && (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setShowDetails(false);
                        setShowAssignModal(true);
                      }}
                    >
                      <i className="fas fa-user-plus"></i> Phân công bác sĩ
                    </button>
                  )}
                  
                  {selectedAppointment.status === 'confirmed' && (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'completed');
                        setShowDetails(false);
                      }}
                    >
                      <i className="fas fa-check-double"></i> Hoàn thành
                    </button>
                  )}
                </div>
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {(showDetails || showAssignModal) && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default StaffDoctorManagement; 