import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Modal, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
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
  faPrescriptionBottleAlt
} from '@fortawesome/free-solid-svg-icons';
import { appointmentAPI, medicalResultAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentDetailModal from '../common/AppointmentDetailModal';
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

  // Hàm xem chi tiết kết quả xét nghiệm
  const handleViewMedicalResult = async (medicalResultId) => {
    setLoadingMedicalResult(true);
    setShowMedicalResultModal(true);
    setMedicalResult(null);
    
    try {
      console.log('Loading medical result for ID:', medicalResultId);
      const result = await medicalResultAPI.getMedicalResult(medicalResultId);
      
      if (result.success) {
        console.log('Medical result loaded:', result.data);
        setMedicalResult(result.data);
      } else {
        console.error('Failed to load medical result:', result.message);
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
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="info" pill style={{ fontSize: '0.75rem' }}>
                            {getAppointmentTypeLabel(appointment.appointmentType)}
                          </Badge>
                          {appointment.medicalResultId && (
                            <Badge bg="success" pill style={{ fontSize: '0.65rem' }} title="Có kết quả xét nghiệm">
                              <FontAwesomeIcon icon={faFlask} size="sm" />
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td>
                        {canCancelAppointment(appointment) ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelClick(appointment)}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            <FontAwesomeIcon icon={faTimes} className="me-1" size="sm" />
                            Hủy
                          </Button>
                        ) : (
                          <div className="d-flex gap-1 flex-wrap">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetail(appointment)}
                              style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                            >
                              <FontAwesomeIcon icon={faEye} className="me-1" size="sm" />
                              Chi tiết
                            </Button>
                            {appointment.medicalResultId && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleViewMedicalResult(appointment.medicalResultId)}
                                style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                title="Xem kết quả xét nghiệm"
                              >
                                <FontAwesomeIcon icon={faFlask} className="me-1" size="sm" />
                                KQ XN
                              </Button>
                            )}
                          </div>
                        )}
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

      {/* Modal chi tiết lịch hẹn - sử dụng component chung */}
      <AppointmentDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        appointmentDetail={appointmentDetail}
        loading={loadingDetail}
        onViewMedicalResult={handleViewMedicalResult}
        formatDate={formatDate}
        formatTimeSlot={formatTimeSlot}
        getAppointmentTypeLabel={getAppointmentTypeLabel}
        getStatusBadge={getStatusBadge}
      />

      {/* Modal chi tiết lịch hẹn - sử dụng component chung */}
      <AppointmentDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        appointmentDetail={appointmentDetail}
        loading={loadingDetail}
        onViewMedicalResult={handleViewMedicalResult}
        formatDate={formatDate}
        formatTimeSlot={formatTimeSlot}
        getAppointmentTypeLabel={getAppointmentTypeLabel}
        getStatusBadge={getStatusBadge}
      />

      {/* Modal Kết quả xét nghiệm */}
      <Modal 
        show={showMedicalResultModal} 
        onHide={() => setShowMedicalResultModal(false)} 
        size="xl"
        centered
        scrollable
        dialogClassName="medical-result-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faFlask} className="me-2" />
            Xem kết quả xét nghiệm
            {medicalResult && (
              <div className="text-muted fs-6">
                Mã kết quả: {medicalResult.id}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3" style={{ paddingLeft: '5%' }}>
          {loadingMedicalResult ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="info" />
              <p className="mt-2 mb-0">Đang tải kết quả xét nghiệm...</p>
            </div>
          ) : medicalResult ? (
            <div className="medical-report-view">
              {/* Thông tin cơ bản bệnh nhân */}
              <Row className="mb-4">
                <Col md={12}>
                  <Card className="h-100">
                    <Card.Header className="bg-primary text-white py-2">
                      <FontAwesomeIcon icon={faUserMd} className="me-2" />
                      Thông tin bệnh nhân
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
                        <Col md={4}>
                          <div className="mb-3">
                            <label className="form-label">Nhịp tim (bpm)</label>
                            <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                              {medicalResult.heartRate || 'Chưa nhập'}
                            </div>
                          </div>
                        </Col>
                        <Col md={8}>
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
                </Col>
              </Row>

              {/* Xét nghiệm HIV */}
              <Card className="mb-3">
                <Card.Header className="bg-info text-white py-2">
                  <FontAwesomeIcon icon={faVial} className="me-2" />
                  Xét nghiệm HIV
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Chỉ số CD4 (tế bào/mm³)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.cd4Count || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Tải lượng virus (bản sao/mL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.viralLoad || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Huyết học */}
              <Card className="mb-3">
                <Card.Header className="bg-success text-white py-2">
                  <FontAwesomeIcon icon={faVial} className="me-2" />
                  Huyết học
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="mb-3">
                        <label className="form-label">Hemoglobin (g/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.hemoglobin || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label className="form-label">Bạch cầu (× 10³/μL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.whiteBloodCell || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label className="form-label">Tiểu cầu (× 10³/μL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.platelets || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Sinh hóa */}
              <Card className="mb-3">
                <Card.Header className="bg-warning text-dark py-2">
                  <FontAwesomeIcon icon={faVial} className="me-2" />
                  Sinh hóa
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">Đường huyết (mg/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.glucose || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">Creatinine (mg/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.creatinine || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">ALT (U/L)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.alt || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">AST (U/L)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.ast || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Chỉ số mỡ máu */}
              <Card className="mb-3">
                <Card.Header className="bg-secondary text-white py-2">
                  <FontAwesomeIcon icon={faVial} className="me-2" />
                  Chỉ số mỡ máu
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">Cholesterol toàn phần (mg/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.totalCholesterol || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">LDL (mg/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.ldl || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">HDL (mg/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.hdl || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <label className="form-label">Triglycerides (mg/dL)</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                          {medicalResult.triglycerides || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Phần ARV */}
              <Card className="mb-3">
                <Card.Header className="bg-danger text-white py-2">
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Kết quả ARV
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
              </Card>

              {/* Phần thuốc điều trị */}
              <Card className="mb-3">
                <Card.Header className="bg-success text-white py-2">
                  <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                  Thuốc điều trị
                </Card.Header>
                <Card.Body>
                  {medicalResult.medicalResultMedicines && medicalResult.medicalResultMedicines.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm mb-0">
                        <thead className="table-light">
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

              {/* Đánh giá tiến triển bệnh nhân */}
              <Card className="mb-3">
                <Card.Header className="bg-info text-white py-2">
                  <FontAwesomeIcon icon={faUserMd} className="me-2" /> 
                  Đánh giá của bác sĩ
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <label className="form-label">Đánh giá tiến triển bệnh nhân</label>
                    <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                      {medicalResult.patientProgressEvaluation || 'Chưa nhập'}
                    </div>
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Kế hoạch điều trị</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                          {medicalResult.plan || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <label className="form-label">Khuyến nghị</label>
                        <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                          {medicalResult.recommendation || 'Chưa nhập'}
                        </div>
                      </div>
                    </Col>
                  </Row>
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
          ) : (
            <Alert variant="danger">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Không thể tải kết quả xét nghiệm. Vui lòng thử lại.
            </Alert>
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