import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Modal, Badge, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faTimes, 
  faExclamationTriangle, 
  faClock,
  faUserMd,
  faStethoscope,
  faRefresh,
  faEye,
  faFlask,
  faFileMedical,
  faVial,
  faFilePdf,
  faPrescriptionBottleAlt,
  faUser,
  faPhone,
  faBirthdayCake,
  faVenusMars
} from '@fortawesome/free-solid-svg-icons';
import { appointmentAPI, medicalResultAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './AppointmentHistory.css';

const AppointmentHistory = () => {
  const { user } = useAuth();  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showMedicalResultModal, setShowMedicalResultModal] = useState(false);
  const [medicalResult, setMedicalResult] = useState(null);
  const [loadingMedicalResult, setLoadingMedicalResult] = useState(false);
  const [currentMedicalResultId, setCurrentMedicalResultId] = useState(null);

  // Force modal width sau khi render
  useEffect(() => {
    if (showDetailModal) {
      // Delay để đảm bảo modal đã render xong
      setTimeout(() => {
        const modalDialog = document.querySelector('.modal-70vw');
        if (modalDialog) {
          modalDialog.style.maxWidth = '70vw';
          modalDialog.style.width = '70vw';
          modalDialog.style.minWidth = '900px';
          modalDialog.style.margin = '1.75rem auto';
          console.log('✅ Modal width set to 70vw via JavaScript');
        }
        
        const modalContent = document.querySelector('.modal-content-70vw');
        if (modalContent) {
          modalContent.style.width = '100%';
          modalContent.style.maxWidth = '100%';
          console.log('✅ Modal content width set to 100% via JavaScript');
        }
      }, 100);
    }
  }, [showDetailModal]);

  const loadAppointments = useCallback(async () => {
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
  }, [user?.id]);

  // Load appointments khi component mount
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);
  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  // Hàm xem chi tiết lịch hẹn
  const handleViewDetail = async (appointment) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    setAppointmentDetail(null);
    
    try {
      console.log('Loading appointment detail for ID:', appointment.id);
      const result = await appointmentAPI.getAppointmentById(appointment.id);
      
      if (result.success) {
        console.log('Appointment detail loaded:', result.data);
        setAppointmentDetail(result.data);
      } else {
        console.error('Failed to load appointment detail:', result.message);
        setAppointmentDetail(null);
      }
    } catch (error) {
      console.error('Error loading appointment detail:', error);
      setAppointmentDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

    // Hàm xem kết quả xét nghiệm - chỉ từ cột "Kết quả XN"
  const handleViewMedicalResult = async (medicalResultId) => {
    console.log('🔍 Opening medical result modal for ID:', medicalResultId);
    setLoadingMedicalResult(true);
    setShowMedicalResultModal(true);
    setMedicalResult(null);
    setCurrentMedicalResultId(medicalResultId);
    
    // Nếu không có medicalResultId, hiển thị thông báo
    if (!medicalResultId) {
      console.log('⚠️ No medicalResultId provided');
      setLoadingMedicalResult(false);
      return;
    }
    
    try {
      console.log('Loading medical result for ID:', medicalResultId);
      const result = await medicalResultAPI.getMedicalResult(medicalResultId);
      
      if (result.success) {
        console.log('✅ Medical result loaded successfully:', result.data);
        console.log('🔍 Data structure:', result.data ? Object.keys(result.data) : 'No data');
        console.log('🔍 Data content:', JSON.stringify(result.data, null, 2));
        setMedicalResult(result.data);
      } else {
        console.error('❌ Failed to load medical result:', result.message);
        console.error('❌ Error details:', result.error);
        console.error('❌ Status:', result.status);
        setMedicalResult(null);
      }
    } catch (error) {
      console.error('Error loading medical result:', error);
      setMedicalResult(null);
    } finally {
      setLoadingMedicalResult(false);
    }
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
          ) : (            <div className="d-flex justify-content-center" style={{ padding: '0 15px' }}>
              <div style={{ width: '90%', maxWidth: '1200px' }}>
                <div className="table-responsive">
                  <Table striped bordered hover size="sm" style={{ fontSize: '1rem', margin: '0 auto', width: '100%' }}>
                    <thead className="table-light" style={{ fontSize: '0.95rem' }}>
                      <tr style={{ height: '50px' }}>
                        <th style={{ width: '22%', padding: '12px 15px', verticalAlign: 'middle' }}>Ngày khám</th>
                        <th style={{ width: '13%', padding: '12px 15px', verticalAlign: 'middle' }}>Giờ khám</th>
                        <th style={{ width: '18%', padding: '12px 15px', verticalAlign: 'middle' }}>Bác sĩ</th>
                        <th style={{ width: '13%', padding: '12px 15px', verticalAlign: 'middle' }}>Loại khám</th>
                        <th style={{ width: '13%', padding: '12px 15px', verticalAlign: 'middle' }}>Trạng thái</th>
                        <th style={{ width: '21%', padding: '12px 15px', verticalAlign: 'middle' }}>Chi tiết</th>
                      </tr>
                    </thead>                    <tbody>
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
                            style={{
                              ...(isNewDate && index > 0 ? { borderTop: '3px solid #e9ecef' } : {}),
                              height: '60px'
                            }}
                          >                            <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                              <div className="fw-bold text-primary" style={{ fontSize: '1rem' }}>
                                {formatDate(appointment.appointmentDate)}
                              </div>
                            </td>                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            <div className="d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                              <FontAwesomeIcon icon={faClock} className="me-2 text-primary" size="sm" />
                              <span className="text-nowrap">
                                {formatTimeSlot(
                                  appointment.slotStartTime, 
                                  appointment.slotEndTime
                                )}
                              </span>
                            </div>
                          </td>                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            <div className="d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                              <FontAwesomeIcon icon={faUserMd} className="me-2 text-success" size="sm" />
                              <span className="fw-medium text-nowrap">{appointment.doctorName}</span>
                            </div>
                          </td>                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            <div className="d-flex align-items-center gap-2">
                              <Badge bg="info" pill style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                {getAppointmentTypeLabel(appointment.appointmentType)}
                              </Badge>
                              {appointment.medicalResultId && (
                                <Badge bg="success" pill style={{ fontSize: '0.7rem', padding: '4px 8px' }} title="Có kết quả xét nghiệm">
                                  <FontAwesomeIcon icon={faFlask} size="sm" />
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            {getStatusBadge(appointment.status)}
                          </td>
                          <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                              {(appointment.status === 'ACCEPTED' || appointment.status === 'COMPLETED') ? (
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewDetail(appointment)}
                                  style={{ fontSize: '0.8rem', padding: '8px 16px', minWidth: '120px' }}
                                >
                                  <FontAwesomeIcon icon={faEye} className="me-2" size="sm" />
                                  Xem chi tiết
                                </Button>
                              ) : (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleCancelClick(appointment)}
                                  style={{ fontSize: '0.8rem', padding: '8px 16px', minWidth: '120px' }}
                                >
                                  <FontAwesomeIcon icon={faTimes} className="me-2" size="sm" />
                                  Hủy đơn
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
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

      {/* Modal chi tiết lịch hẹn */}
      <Modal 
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered 
        size="xl"
        className="appointment-detail-modal-new"
        backdrop={false}
        dialogClassName="modal-70vw"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh'
        }}
        contentClassName="modal-content-70vw"
      >
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title>
            <FontAwesomeIcon icon={faEye} className="text-info me-2" />
            Chi tiết lịch hẹn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body 
          className="p-0"
          style={{
            width: '100%',
            minHeight: '70vh',
            maxHeight: '80vh'
          }}
        >
          {loadingDetail ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0">Đang tải chi tiết lịch hẹn...</p>
            </div>
          ) : appointmentDetail ? (
            <div 
              className="appointment-detail-grid"
              style={{
                width: '100%',
                height: '100%',
                minHeight: '70vh'
              }}
            >
              {/* Ô 1: Thông tin lịch hẹn (lớn bên trái) */}
              <div className="appointment-info-card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Thông tin lịch hẹn
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <FontAwesomeIcon icon={faCalendarAlt} className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Ngày khám</span>
                      <span className="info-value">{formatDate(appointmentDetail.appointmentDate)}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FontAwesomeIcon icon={faClock} className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Giờ khám</span>
                      <span className="info-value">
                        {formatTimeSlot(appointmentDetail.slotStartTime, appointmentDetail.slotEndTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FontAwesomeIcon icon={faUserMd} className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Tên Bác sĩ</span>
                      <span className="info-value">{appointmentDetail.doctorName}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FontAwesomeIcon icon={faStethoscope} className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Loại khám</span>
                      <Badge bg="info" className="ms-1">
                        {getAppointmentTypeLabel(appointmentDetail.appointmentType)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Trạng thái</span>
                      <span className="info-value">{getStatusBadge(appointmentDetail.status)}</span>
                    </div>
                  </div>

                  {appointmentDetail.reason && (
                    <div className="info-item">
                      <FontAwesomeIcon icon={faFileMedical} className="info-icon" />
                      <div className="info-content">
                        <span className="info-label">Lý do khám</span>
                        <span className="info-value">{appointmentDetail.reason}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ô 2: Thông tin khám bệnh (nhỏ trên bên phải) */}
              <div className="patient-info-card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Thông tin Khám bệnh
                </div>
                <div className="card-content">
                  {appointmentDetail.alternativeName && (
                    <div className="info-item-small">
                      <FontAwesomeIcon icon={faUser} className="info-icon-small" />
                      <div className="info-content-small">
                        <span className="info-label-small">Tên người khám</span>
                        <span className="info-value-small">{appointmentDetail.alternativeName}</span>
                      </div>
                    </div>
                  )}
                  
                  {appointmentDetail.alternativePhoneNumber && (
                    <div className="info-item-small">
                      <FontAwesomeIcon icon={faPhone} className="info-icon-small" />
                      <div className="info-content-small">
                        <span className="info-label-small">Số điện thoại</span>
                        <span className="info-value-small">{appointmentDetail.alternativePhoneNumber}</span>
                      </div>
                    </div>
                  )}
                  
                  {appointmentDetail.birthdate && (
                    <div className="info-item-small">
                      <FontAwesomeIcon icon={faBirthdayCake} className="info-icon-small" />
                      <div className="info-content-small">
                        <span className="info-label-small">Ngày sinh</span>
                        <span className="info-value-small">{formatDate(appointmentDetail.birthdate)}</span>
                      </div>
                    </div>
                  )}
                  
                  {appointmentDetail.gender && (
                    <div className="info-item-small">
                      <FontAwesomeIcon icon={faVenusMars} className="info-icon-small" />
                      <div className="info-content-small">
                        <span className="info-label-small">Giới tính</span>
                        <span className="info-value-small">
                          {appointmentDetail.gender === 'MALE' ? 'Nam' : 'Nữ'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ô 3: Xem kết quả xét nghiệm (giữa bên phải) */}
              <div className="medical-result-card">
                <div className="card-header">
                  <FontAwesomeIcon icon={faFlask} className="me-2" />
                  Kết quả xét nghiệm
                </div>
                <div className="card-content">
                  {appointmentDetail.medicalResultId ? (
                    <div className="text-center">
                  
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setShowDetailModal(false);
                          handleViewMedicalResult(appointmentDetail.medicalResultId);
                        }}
                        className="w-100"
                      >
                        <FontAwesomeIcon icon={faFlask} className="me-2" />
                        Xem Kết quả xét nghiệm
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted">
                      <p className="mb-0 small">Chưa có kết quả xét nghiệm</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ô 4: Nút đóng (nhỏ dưới bên phải) */}
              <div className="close-button-card">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowDetailModal(false)}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faTimes} className="me-2" />
                  Đóng
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <Alert variant="danger">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.
              </Alert>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Kết quả xét nghiệm */}
      <Modal 
        show={showMedicalResultModal} 
        onHide={() => {
          setShowMedicalResultModal(false);
          setMedicalResult(null);
          setCurrentMedicalResultId(null);
        }} 
        centered
        scrollable
        backdrop="static"
        keyboard={false}
        dialogClassName="medical-result-modal-80"
      >
        <Modal.Header 
          closeButton 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '1.5rem 2rem',
            borderRadius: '0.5rem 0.5rem 0 0'
          }}
        >
          <Modal.Title 
            style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              margin: 0
            }}
          >
            <div 
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                padding: '12px',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon icon={faFlask} style={{ fontSize: '1.2rem' }} />
              </div>
                         <div>
               <div style={{ fontSize: '1.5rem', marginBottom: '2px' }}>
                 Kết quả Xét nghiệm
               </div>
               <div style={{ 
                 fontSize: '0.9rem', 
                 opacity: 0.9, 
                 fontWeight: '400',
                 letterSpacing: '0.5px'
               }}>
                 Báo cáo chi tiết sức khỏe & Kết quả xét nghiệm
               </div>
             </div>
          </Modal.Title>
        </Modal.Header>
                          <Modal.Body className="px-4 py-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loadingMedicalResult ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="info" />
              <p className="mt-2 mb-0">Đang tải kết quả xét nghiệm...</p>
            </div>
           ) : !medicalResult ? (
             <div className="text-center py-5">
               <FontAwesomeIcon icon={faFlask} size="3x" className="text-muted mb-3" />
               <h5 className="text-muted mb-2">Chưa có kết quả xét nghiệm</h5>
                                <p className="text-muted">
                   {currentMedicalResultId 
                     ? 'Không thể tải kết quả xét nghiệm. Vui lòng thử lại sau hoặc liên hệ bác sĩ.'
                     : 'Kết quả xét nghiệm chưa được cập nhật cho lịch hẹn này. Vui lòng liên hệ với bác sĩ để biết thêm chi tiết.'
                   }
                 </p>
                 {currentMedicalResultId && (
                   <Button 
                     variant="outline-info" 
                     size="sm" 
                     onClick={() => handleViewMedicalResult(currentMedicalResultId)}
                     className="mt-2"
                   >
                     <FontAwesomeIcon icon={faRefresh} className="me-1" />
                     Thử lại
                   </Button>
                 )}
             </div>
                      ) : (
             <div className="medical-report-form">
              {/* Thông tin cơ bản bệnh nhân */}
               <Card className="mb-3">
                    <Card.Header className="bg-primary text-white py-2">
                      <FontAwesomeIcon icon={faUserMd} className="me-2" />
                   Thông tin cơ bản
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          <div className="mb-3">
                            <label className="form-label">Cân nặng (kg)</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.weight || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="mb-3">
                            <label className="form-label">Chiều cao (cm)</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.height || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="mb-3">
                            <label className="form-label">BMI</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.bmi || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="mb-3">
                            <label className="form-label">Nhiệt độ (°C)</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.temperature || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                     <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label">Nhịp tim (bpm)</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.heartRate || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                     <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label">Huyết áp (mmHg)</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.bloodPressure || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

               {/* Phần kết quả xét nghiệm */}
              <Card className="mb-3">
                 <Card.Header className="bg-warning text-dark py-2">
                  <FontAwesomeIcon icon={faVial} className="me-2" />
                   Kết quả xét nghiệm
                </Card.Header>
                <Card.Body>
                   <h6 className="mb-3">Xét nghiệm HIV</h6>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                         <label className="form-label">Chỉ số CD4</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.cd4Count ? `${medicalResult.cd4Count} tế bào/mm³` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                         <label className="form-label">Tải lượng virus</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.viralLoad ? `${medicalResult.viralLoad} bản sao/mL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>

                   <h6 className="mb-3 mt-4">Huyết học</h6>
                  <Row>
                    <Col md={4}>
                      <div className="mb-3">
                         <label className="form-label">Hemoglobin</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.hemoglobin ? `${medicalResult.hemoglobin} g/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                         <label className="form-label">Bạch cầu</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.whiteBloodCell ? `${medicalResult.whiteBloodCell} × 10³/μL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                         <label className="form-label">Tiểu cầu</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.platelets ? `${medicalResult.platelets} × 10³/μL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>

                   <h6 className="mb-3 mt-4">Sinh hóa</h6>
                  <Row>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">Đường huyết</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.glucose ? `${medicalResult.glucose} mg/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">Creatinine</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.creatinine ? `${medicalResult.creatinine} mg/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">ALT</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.alt ? `${medicalResult.alt} U/L` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">AST</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.ast ? `${medicalResult.ast} U/L` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>

                   <h6 className="mb-3 mt-4">Chỉ số mỡ máu</h6>
                  <Row>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">Cholesterol toàn phần</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.totalCholesterol ? `${medicalResult.totalCholesterol} mg/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">LDL</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.ldl ? `${medicalResult.ldl} mg/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">HDL</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.hdl ? `${medicalResult.hdl} mg/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                         <label className="form-label">Triglycerides</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                           {medicalResult.triglycerides ? `${medicalResult.triglycerides} mg/dL` : 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

               {/* Phần ARV (chỉ xem) */}
              <Card className="mb-3">
                <Card.Header className="bg-danger text-white py-2">
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Kết quả ARV
                </Card.Header>
                <Card.Body>
<<<<<<< HEAD
                  {(medicalResult.arvResults?.fileName || medicalResult.arvRegimenResultURL) ? (
                    <div 
                      className="card border-0"
                      style={{
                        background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                        borderRadius: '12px'
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div 
                              className="me-3"
                              style={{
                                backgroundColor: '#f44336',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <FontAwesomeIcon icon={faFilePdf} className="text-white" size="lg" />
                            </div>
                            <div>
                              <h6 className="mb-1 text-danger fw-bold">
                                <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                                Báo cáo ARV có sẵn
                              </h6>
                              <p className="mb-0 text-muted small">
                                Nhấn "Xem kết quả" để mở báo cáo PDF
                              </p>
                              {(medicalResult.arvResults?.recommendations || medicalResult.arvRecommendations) && (
                                <p className="mb-0 mt-2 small text-dark">
                                  <strong>Khuyến nghị:</strong> {medicalResult.arvResults?.recommendations || medicalResult.arvRecommendations}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const pdfUrl = medicalResult.arvResults?.fileName || medicalResult.arvRegimenResultURL;
                              if (pdfUrl) {
                                window.open(pdfUrl, '_blank');
                              }
                            }}
                            style={{
                              borderRadius: '25px',
                              padding: '8px 20px',
                              fontWeight: '500',
                              boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)'
                            }}
                          >
                            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                            Xem kết quả
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="card border-0"
                      style={{
                        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                        borderRadius: '12px'
                      }}
                    >
                      <div className="card-body p-4 text-center">
                        <div 
                          className="mb-3"
                          style={{
                            backgroundColor: '#e0e0e0',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}
                        >
                          <FontAwesomeIcon icon={faFilePdf} className="text-muted" size="lg" />
                        </div>
                        <h6 className="text-muted mb-2">Chưa có báo cáo ARV</h6>
                        <p className="text-muted small mb-0">
                          Báo cáo ARV sẽ được cập nhật sau khi hoàn tất phân tích
                        </p>
                      </div>
                    </div>
                  )}
=======
<<<<<<< HEAD
                  <div className="mb-3">
                    <label className="form-label">Báo cáo ARV</label>
                    {(medicalResult.arvResults?.fileName || medicalResult.arvRegimenResultURL) ? (
                      <div className="d-flex align-items-center gap-3">
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa', flex: 1 }}>
                          {medicalResult.arvResults?.fileName || 'Báo cáo ARV'}
                        </div>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => {
                            const pdfUrl = medicalResult.arvResults?.fileUrl || medicalResult.arvRegimenResultURL;
                            if (pdfUrl) {
                              window.open(pdfUrl, '_blank');
                            }
                          }}
                          title="Xem báo cáo ARV"
                        >
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          Xem
                        </Button>
                      </div>
                    ) : (
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        Chưa nhập
                      </div>
                    )}
                  </div>
                  {medicalResult.arvResults?.recommendations && (
                    <div className="mb-3">
                      <label className="form-label">Khuyến nghị ARV</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                        {medicalResult.arvResults.recommendations}
                      </div>
                    </div>
                  )}
=======
                   <div className="bg-light p-3 rounded">
                     <p className="mb-0">
                       <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                       <strong>Báo cáo ARV:</strong> {medicalResult.arvResults?.fileName || medicalResult.arvRegimenResultURL || 'Chưa có báo cáo'}
                     </p>
                     {(medicalResult.arvResults?.recommendations || medicalResult.arvRecommendations) && (
                       <p className="mb-0 mt-2">
                         <strong>Khuyến nghị:</strong> {medicalResult.arvResults?.recommendations || medicalResult.arvRecommendations}
                       </p>
                     )}
                   </div>
>>>>>>> a4d4a3af3b94c0b4c19c2fe5f7cbec73a06c89eb
>>>>>>> 4c6674ed5c0b773c7835a8c9bd46d77a3ccca378
                </Card.Body>
              </Card>

               {/* Phần thuốc (chỉ xem) */}
              <Card className="mb-3">
                <Card.Header className="bg-success text-white py-2">
                  <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                  Thuốc điều trị
                </Card.Header>
                <Card.Body>
                  {medicalResult.medicalResultMedicines && medicalResult.medicalResultMedicines.length > 0 ? (
                    <div className="table-responsive">
                       <table className="table table-striped mb-0">
                         <thead>
                          <tr>
                            <th>Tên thuốc</th>
                            <th>Liều lượng</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicalResult.medicalResultMedicines.map((med, index) => (
                            <tr key={index}>
                              <td>{med.medicineName || med.name || 'Chưa nhập'}</td>
                              <td>{med.dosage || 'Chưa nhập'}</td>
                              <td>
                                <Badge 
                                  bg={
                                    med.status === 'Mới' ? 'primary' :
                                    med.status === 'Tiếp tục' ? 'success' :
                                    med.status === 'Đã thay đổi' ? 'warning' :
                                    med.status === 'Đã ngừng' ? 'danger' : 'secondary'
                                  }
                                >
                                  {med.status || 'Chưa nhập'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-3 text-muted">
                      Chưa có thông tin thuốc điều trị
                    </div>
                  )}
                </Card.Body>
              </Card>

               {/* Đánh giá của bác sĩ */}
              <Card className="mb-3">
                <Card.Header className="bg-info text-white py-2">
                  <FontAwesomeIcon icon={faUserMd} className="me-2" /> 
                  Đánh giá của bác sĩ
                </Card.Header>
                <Card.Body>
                    <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                     {medicalResult.patientProgressEvaluation || 'Chưa có đánh giá'}
                    </div>
                   {(medicalResult.plan || medicalResult.recommendation) && (
                     <Row className="mt-3">
                       {medicalResult.plan && (
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Kế hoạch điều trị</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                               {medicalResult.plan}
                        </div>
                      </div>
                    </Col>
                       )}
                       {medicalResult.recommendation && (
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Khuyến nghị</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                               {medicalResult.recommendation}
                        </div>
                      </div>
                    </Col>
                       )}
                  </Row>
                   )}
                </Card.Body>
              </Card>

              {/* Thông tin thời gian */}
              <Card>
                <Card.Header className="bg-secondary text-white py-2">
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Thông tin thời gian
                </Card.Header>
                <Card.Body>
                  <Row>
                    {medicalResult.createdAt && (
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label">Thời gian tạo</label>
                          <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                            {new Date(medicalResult.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </Col>
                    )}
                    {medicalResult.updatedAt && (
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label">Cập nhật lần cuối</label>
                          <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                            {new Date(medicalResult.updatedAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMedicalResultModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AppointmentHistory;