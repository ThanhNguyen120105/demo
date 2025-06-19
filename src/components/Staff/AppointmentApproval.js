import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faUserMd, 
  faPhone, 
  faCheck,
  faTimes,
  faEye,
  faClock,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { appointmentAPI } from '../../services/api';
import './Staff.css';

const AppointmentApproval = () => {  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' hoặc 'all'  // Load appointments
  useEffect(() => {
    console.log('AppointmentApproval useEffect - checking auth...');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current token:', token ? 'Token exists' : 'No token');
    console.log('Current user:', user);
    console.log('User role:', user.role);
    console.log('Current viewMode:', viewMode);
    
    // Clear appointments trước khi load mới
    setAppointments([]);
    setError('');
    
    if (viewMode === 'pending') {
      console.log('Loading pending appointments...');
      loadPendingAppointments();
    } else {
      console.log('Loading all appointments...');
      loadAllAppointments();
    }  }, [viewMode]);
  const loadPendingAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting to load pending appointments...');
      
      // Sử dụng getAllAppointments và filter PENDING ở frontend
      const result = await appointmentAPI.getAllAppointments();
      
      console.log('All appointments result:', result);
      
      if (result.success) {        // Filter chỉ lấy appointments có status PENDING
        const pendingAppointments = (result.data || []).filter(appointment => {
          const status = appointment.status?.toUpperCase();
          return status === 'PENDING';
        });
        
        console.log('Filtered pending appointments:', pendingAppointments);
        console.log('Number of pending appointments:', pendingAppointments.length);
        
        // Debug: Log first appointment to see structure
        if (pendingAppointments.length > 0) {
          console.log('First pending appointment structure:', pendingAppointments[0]);
          console.log('User data in first pending appointment:', pendingAppointments[0].user);
          console.log('All pending appointment fields:', Object.keys(pendingAppointments[0]));
          console.log('Doctor name:', pendingAppointments[0].doctorName);
          console.log('Patient name:', pendingAppointments[0].patientName);
          console.log('User name:', pendingAppointments[0].userName);
          console.log('Alternative name:', pendingAppointments[0].alternativeName);
          console.log('Status:', pendingAppointments[0].status);
        }
        
        setAppointments(pendingAppointments);
        
        // Load chi tiết cho mỗi appointment để lấy thông tin bệnh nhân
        pendingAppointments.forEach(async (appointment) => {
          try {
            const detailResult = await appointmentAPI.getAppointmentById(appointment.id);
            if (detailResult.success) {
              // Cập nhật appointment với thông tin chi tiết
              setAppointments(prevAppointments => 
                prevAppointments.map(appt => 
                  appt.id === appointment.id 
                    ? { 
                        ...appt, 
                        ...detailResult.data,
                        detailsLoaded: true 
                      }
                    : appt
                )
              );
            }
          } catch (error) {
            console.error('Error loading detail for appointment:', appointment.id, error);
          }
        });
      } else {
        console.error('Failed to load appointments:', result.message);
        setError(result.message || 'Không thể tải danh sách lịch hẹn');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading pending appointments:', error);
      setError('Đã xảy ra lỗi khi tải danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  const loadAllAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await appointmentAPI.getAllAppointments();
      
      if (result.success) {        console.log('Loaded all appointments:', result.data);
        // Debug: Log first appointment to see structure
        if (result.data && result.data.length > 0) {
          console.log('First appointment structure:', result.data[0]);
          console.log('User data in first appointment:', result.data[0].user);
          console.log('All appointment fields:', Object.keys(result.data[0]));
          console.log('Doctor name:', result.data[0].doctorName);
          console.log('Patient name:', result.data[0].patientName);
          console.log('User name:', result.data[0].userName);
          console.log('Alternative name:', result.data[0].alternativeName);
          console.log('Alternative phone:', result.data[0].alternativePhoneNumber);
          console.log('Appointment service:', result.data[0].appointmentService);
          console.log('Slot start time:', result.data[0].slotStartTime);
          console.log('Slot end time:', result.data[0].slotEndTime);
          console.log('Customer ID:', result.data[0].customerId);
          console.log('User ID:', result.data[0].userId);        }
        setAppointments(result.data || []);
        
        // Load chi tiết cho mỗi appointment để lấy thông tin bệnh nhân
        (result.data || []).forEach(async (appointment) => {
          try {
            const detailResult = await appointmentAPI.getAppointmentById(appointment.id);
            if (detailResult.success) {
              // Cập nhật appointment với thông tin chi tiết
              setAppointments(prevAppointments => 
                prevAppointments.map(appt => 
                  appt.id === appointment.id 
                    ? { 
                        ...appt, 
                        ...detailResult.data,
                        detailsLoaded: true 
                      }
                    : appt
                )
              );
            }
          } catch (error) {
            console.error('Error loading detail for appointment:', appointment.id, error);
          }
        });
      } else {
        setError(result.message || 'Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('Error loading all appointments:', error);
      setError('Đã xảy ra lỗi khi tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };
  const handleViewDetails = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
    setDetailLoading(true);
    setAppointmentDetails(null);
    
    try {
      console.log('Loading appointment details for ID:', appointment.id);
      const result = await appointmentAPI.getAppointmentById(appointment.id);
      
      if (result.success) {
        console.log('Loaded appointment details:', result.data);
        setAppointmentDetails(result.data);
      } else {
        console.error('Failed to load appointment details:', result.message);
        setError(result.message || 'Không thể tải chi tiết lịch hẹn');
      }
    } catch (error) {
      console.error('Error loading appointment details:', error);
      setError('Đã xảy ra lỗi khi tải chi tiết lịch hẹn');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = (appointment) => {
    setSelectedAppointment(appointment);
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const handleReject = (appointment) => {
    setSelectedAppointment(appointment);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedAppointment) return;
    
    try {      setActionLoading(true);
        const approvalData = {
        status: 'ACCEPTED', // Sử dụng status ACCEPTED
        notes: approvalNotes,
        approvedAt: new Date().toISOString()
      };
      
      const result = await appointmentAPI.updateAppointment(selectedAppointment.id, approvalData);
        if (result.success) {
        // Reload appointments based on current view mode
        if (viewMode === 'pending') {
          await loadPendingAppointments();
        } else {
          await loadAllAppointments();
        }
        setShowApprovalModal(false);
        setSelectedAppointment(null);
        setApprovalNotes('');
      } else {
        setError(result.message || 'Không thể duyệt lịch hẹn');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
      setError('Đã xảy ra lỗi khi duyệt lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmRejection = async () => {
    if (!selectedAppointment || !rejectionReason.trim()) {
      setError('Vui lòng nhập lý do từ chối');
      return;
    }
    
    try {      setActionLoading(true);
        const rejectionData = {
        status: 'DENIED', // Sử dụng status DENIED
        reason: rejectionReason,
        rejectedAt: new Date().toISOString()
      };
      
      const result = await appointmentAPI.updateAppointment(selectedAppointment.id, rejectionData);
        if (result.success) {
        // Reload appointments based on current view mode
        if (viewMode === 'pending') {
          await loadPendingAppointments();
        } else {
          await loadAllAppointments();
        }
        setShowRejectionModal(false);
        setSelectedAppointment(null);
        setRejectionReason('');
      } else {
        setError(result.message || 'Không thể từ chối lịch hẹn');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      setError('Đã xảy ra lỗi khi từ chối lịch hẹn');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Assuming timeString is in format like "slot1", "slot2", etc.
    const timeSlots = {
      'slot1': '7:00-9:15',
      'slot2': '9:30-11:45', 
      'slot3': '12:30-14:45',
      'slot4': '15:00-17:15'
    };
    return timeSlots[timeString] || timeString;
  };  const getStatusBadge = (appointment) => {
    const status = appointment.status?.toUpperCase() || 'PENDING';
    
    switch (status) {
      case 'ACCEPTED':
        return <Badge bg="success">Đã duyệt</Badge>;
      case 'DENIED':
        return <Badge bg="danger">Từ chối</Badge>;
      case 'COMPLETED':
        return <Badge bg="info">Hoàn thành</Badge>;
      case 'PENDING':
      default:
        return <Badge bg="warning">Chờ duyệt</Badge>;
    }
  };

  const canProcessAppointment = (appointment) => {
    const status = appointment.status?.toUpperCase() || 'PENDING';
    return status === 'PENDING';
  };
  return (
    <Container fluid className="appointment-approval py-4">
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <Row className="align-items-center">
                <Col>
                  <h4 className="mb-0">
                    <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                    {viewMode === 'pending' ? 'Duyệt Lịch Hẹn Chờ' : 'Tất Cả Lịch Hẹn'}
                  </h4>
                </Col>
                <Col xs="auto">
                  <div className="btn-group" role="group">
                    <Button
                      variant={viewMode === 'pending' ? 'light' : 'outline-light'}
                      size="sm"
                      onClick={() => setViewMode('pending')}
                    >
                      <FontAwesomeIcon icon={faClock} className="me-1" />
                      Chờ duyệt
                    </Button>
                    <Button
                      variant={viewMode === 'all' ? 'light' : 'outline-light'}
                      size="sm"
                      onClick={() => setViewMode('all')}
                    >
                      <FontAwesomeIcon icon={faCalendarCheck} className="me-1" />
                      Tất cả
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {error}
                </Alert>
              )}
              
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status" className="me-2" />
                  <span>Đang tải danh sách lịch hẹn...</span>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faCalendarCheck} size="3x" className="text-muted mb-3" />
                  <h5 className="text-muted">Không có lịch hẹn nào cần duyệt</h5>
                  <p className="text-muted">Tất cả lịch hẹn đã được xử lý hoặc chưa có yêu cầu mới.</p>
                </div>
              ) : (
                <Row>
                  {appointments.map((appointment) => (
                    <Col lg={6} xl={4} key={appointment.id} className="mb-4">
                      <Card className="h-100 shadow-sm border-0">                        <Card.Header className="bg-light">
                          <div className="d-flex justify-content-between align-items-center">                            <h6 className="mb-0">
                              <FontAwesomeIcon icon={faUserMd} className="me-2 text-primary" />
                              {appointment.detailsLoaded ? 
                                (appointment.userName || appointment.alternativeName || `Lịch hẹn #${appointment.id}`) :
                                `Lịch hẹn #${appointment.id}`
                              }
                            </h6>
                            {getStatusBadge(appointment)}
                          </div>
                        </Card.Header>                        <Card.Body>
                          <div className="mb-3">
                            <small className="text-muted d-block">
                              <FontAwesomeIcon icon={faPhone} className="me-1" />
                              {appointment.detailsLoaded ? 
                                (appointment.alternativePhoneNumber || 'N/A') :
                                'Đang tải...'
                              }
                            </small>
                            <small className="text-muted d-block">
                              <FontAwesomeIcon icon={faCalendarCheck} className="me-1" />
                              {formatDate(appointment.appointmentDate)} - {appointment.slotStartTime}:00-{appointment.slotEndTime}:00
                            </small>
                            {appointment.doctorName && (
                              <small className="text-muted d-block">
                                <FontAwesomeIcon icon={faUserMd} className="me-1" />
                                Bác sĩ: {appointment.doctorName}
                              </small>
                            )}
                          </div>
                        </Card.Body><Card.Footer className="bg-white border-top-0">
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetails(appointment)}
                              className="flex-fill"
                            >
                              <FontAwesomeIcon icon={faEye} className="me-1" />
                              Chi tiết
                            </Button>
                            {viewMode === 'pending' && canProcessAppointment(appointment) && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleApprove(appointment)}
                                  className="flex-fill"
                                >
                                  <FontAwesomeIcon icon={faCheck} className="me-1" />
                                  Duyệt
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleReject(appointment)}
                                  className="flex-fill"
                                >
                                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                                  Từ chối
                                </Button>
                              </>
                            )}
                          </div>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faEye} className="me-2" />
            Chi tiết lịch hẹn
          </Modal.Title>
        </Modal.Header>        <Modal.Body>
          {detailLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" className="me-2" />
              <span>Đang tải chi tiết lịch hẹn...</span>
            </div>          ) : appointmentDetails ? (
            <Row>
              <Col md={6}>
                <h6 className="text-primary">Thông tin bệnh nhân</h6>
                <p><strong>Họ tên:</strong> {appointmentDetails.userName || appointmentDetails.alternativeName || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> {appointmentDetails.alternativePhoneNumber || 'N/A'}</p>
                <p><strong>Email:</strong> {appointmentDetails.email || 'N/A'}</p>
                {appointmentDetails.id && (
                  <p><strong>Mã lịch hẹn:</strong> {appointmentDetails.id}</p>
                )}
              </Col>
              <Col md={6}>
                <h6 className="text-primary">Thông tin lịch hẹn</h6>
                <p><strong>Ngày khám:</strong> {formatDate(appointmentDetails.appointmentDate)}</p>
                <p><strong>Giờ khám:</strong> {appointmentDetails.slotStartTime} - {appointmentDetails.slotEndTime}</p>
                <p><strong>Dịch vụ:</strong> {appointmentDetails.appointmentService || 'N/A'}</p>
                <p><strong>Loại khám:</strong> {appointmentDetails.appointmentType === 'INITIAL' ? 'Khám ban đầu' : 'Tái khám'}</p>
                <p><strong>Trạng thái:</strong> {getStatusBadge(appointmentDetails)}</p>
                {appointmentDetails.doctorName && (
                  <p><strong>Bác sĩ:</strong> {appointmentDetails.doctorName}</p>
                )}
              </Col>
              {appointmentDetails.reason && (
                <Col xs={12}>
                  <h6 className="text-primary">Lý do khám bệnh</h6>
                  <p>{appointmentDetails.reason}</p>
                </Col>
              )}
              {appointmentDetails.notes && (
                <Col xs={12}>
                  <h6 className="text-primary">Ghi chú</h6>
                  <p>{appointmentDetails.notes}</p>
                </Col>
              )}
              {appointmentDetails.followUpAppointmentId && (
                <Col xs={12}>
                  <h6 className="text-primary">Lịch hẹn liên quan</h6>
                  <p>ID: {appointmentDetails.followUpAppointmentId}</p>
                </Col>
              )}
            </Row>
          ) : selectedAppointment && (
            <Row>
              <Col md={6}>
                <h6 className="text-primary">Thông tin bệnh nhân</h6>
                <p><strong>Họ tên:</strong> {selectedAppointment.user?.fullName || selectedAppointment.patientInfo?.fullName || selectedAppointment.patientName || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> {selectedAppointment.user?.phoneNumber || selectedAppointment.patientInfo?.phoneNumber || selectedAppointment.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedAppointment.user?.email || selectedAppointment.patientInfo?.email || 'N/A'}</p>
                {selectedAppointment.patientInfo?.customerId && (
                  <p><strong>Mã BHYT:</strong> {selectedAppointment.patientInfo.customerId}</p>
                )}
              </Col>
              <Col md={6}>
                <h6 className="text-primary">Thông tin lịch hẹn</h6>
                <p><strong>Ngày khám:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
                <p><strong>Giờ khám:</strong> {formatTime(selectedAppointment.appointmentTime)}</p>
                <p><strong>Dịch vụ:</strong> {selectedAppointment.serviceDetail || selectedAppointment.serviceType || 'N/A'}</p>
                <p><strong>Loại khám:</strong> {selectedAppointment.consultationType === 'anonymous' ? 'Khám ẩn danh' : 'Khám trực tiếp'}</p>
                <p><strong>Trạng thái:</strong> {getStatusBadge(selectedAppointment)}</p>
                {selectedAppointment.doctorName && (
                  <p><strong>Bác sĩ:</strong> {selectedAppointment.doctorName}</p>
                )}
              </Col>
              {selectedAppointment.healthIssues && (
                <Col xs={12}>
                  <h6 className="text-primary">Lý do khám bệnh</h6>
                  <p>{selectedAppointment.healthIssues}</p>
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowDetailModal(false);
            setAppointmentDetails(null);
            setSelectedAppointment(null);
          }}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Approval Modal */}
      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
            Duyệt lịch hẹn
          </Modal.Title>
        </Modal.Header>        <Modal.Body>
          {selectedAppointment && (
            <>
              <p>Bạn có chắc chắn muốn <strong>DUYỆT</strong> lịch hẹn của <strong>{selectedAppointment.user?.fullName || selectedAppointment.patientInfo?.fullName || selectedAppointment.patientName}</strong>?</p>
              <p className="text-muted small">Lịch hẹn sẽ chuyển từ trạng thái PENDING sang ACCEPTED.</p>
              <Form.Group>
                <Form.Label>Ghi chú (tùy chọn)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Nhập ghi chú cho việc duyệt lịch hẹn..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApprovalModal(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button variant="success" onClick={confirmApproval} disabled={actionLoading}>
            {actionLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="me-2" />
                Xác nhận duyệt
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal show={showRejectionModal} onHide={() => setShowRejectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faTimes} className="me-2 text-danger" />
            Từ chối lịch hẹn
          </Modal.Title>
        </Modal.Header>        <Modal.Body>          {selectedAppointment && (
            <>
              <p>Bạn có chắc chắn muốn <strong>TỪ CHỐI</strong> lịch hẹn của <strong>{selectedAppointment.user?.fullName || selectedAppointment.patientInfo?.fullName || selectedAppointment.patientName}</strong>?</p>
              <p className="text-muted small">Lịch hẹn sẽ chuyển từ trạng thái PENDING sang DENIED.</p>
              <Form.Group>
                <Form.Label>Lý do từ chối <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối lịch hẹn..."
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectionModal(false)} disabled={actionLoading}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmRejection} disabled={actionLoading || !rejectionReason.trim()}>
            {actionLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Xác nhận từ chối
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentApproval;
