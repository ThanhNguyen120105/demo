import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faCalendarCheck, faUserPlus, faUserMd, 
  faClipboardList, faCog, faSignOutAlt, faUsers, faFileAlt,
  faCalendarAlt, faCheckCircle, faExclamationTriangle,
  faClock, faPhone, faVideo, faPrescriptionBottleAlt, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';
import AppointmentDetailModal from '../common/AppointmentDetailModal';
import { appointmentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const DoctorDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State cho lịch hẹn từ API
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho Modal Chi tiết lịch hẹn
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDetail, setAppointmentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Mapping functions
  const getAppointmentTypeDisplay = (type) => {
    switch (type) {
      case 'INITIAL':
        return 'Khám lần đầu';
      case 'FOLLOW_UP':
        return 'Tái khám';
      default:
        return type || 'Không xác định';
    }
  };
  const getServiceDisplay = (serviceId) => {
    switch (serviceId) {
      case 1:
        return 'Khám và tư vấn';
      case 2:
        return 'Theo dõi tải lượng virus';
      default:
        return `Dịch vụ ${serviceId}` || 'Không xác định';
    }
  };


  // Lấy lịch hẹn từ API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching appointments for doctor...');
      const result = await appointmentAPI.getAcceptedAppointmentsForDoctor();
      
      console.log('API result:', result);
      
      if (result.success) {
        const appointmentsData = result.data || [];
        console.log('Appointments data:', appointmentsData);
        
        // Fetch chi tiết cho từng appointment để lấy thông tin bệnh nhân
        const detailedAppointments = await Promise.all(
          appointmentsData.map(async (appointment) => {
            try {
              const detailResult = await appointmentAPI.getAppointmentById(appointment.id);
              if (detailResult.success && detailResult.data) {
                return {
                  ...appointment,
                  patientName: detailResult.data.patientName || detailResult.data.customerName || detailResult.data.alternativeName,
                  patientInfo: detailResult.data.patientInfo || detailResult.data.customer,
                  reason: detailResult.data.reason,
                  note: detailResult.data.note,
                  serviceId: detailResult.data.serviceId
                };
              }
              return appointment;
            } catch (error) {
              console.error('Error fetching appointment detail for ID:', appointment.id, error);
              return appointment;
            }
          })
        );
        
        console.log('Detailed appointments:', detailedAppointments);
        setAppointments(detailedAppointments);
      } else {
        console.error('Failed to fetch appointments:', result.message);
        setError(result.message || 'Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Đã xảy ra lỗi khi tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Lọc lịch hẹn hôm nay
  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(appointment => {
      if (appointment.appointmentDate) {
        const appointmentDate = new Date(appointment.appointmentDate).toDateString();
        return appointmentDate === today;
      }
      return false;
    });
  };

  // Thống kê tổng quan
  const getStats = () => {
    const todayAppointments = getTodayAppointments();
    const completedToday = todayAppointments.filter(apt => 
      apt.status === 'COMPLETED'
    ).length;
    const incompleteTotal = appointments.filter(apt => 
      apt.status === 'ACCEPTED'
    ).length;

    return [
      { title: 'Tổng số lịch hẹn', value: appointments.length.toString(), icon: faUsers, color: '#4CAF50' },
      { title: 'Lịch hẹn hôm nay', value: todayAppointments.length.toString(), icon: faCalendarAlt, color: '#2196F3' },
      { title: 'Hoàn thành hôm nay', value: completedToday.toString(), icon: faCheckCircle, color: '#9C27B0' },
      { title: 'Chưa hoàn thành', value: incompleteTotal.toString(), icon: faExclamationTriangle, color: '#FF9800' }
    ];
  };
  // Xử lý hiển thị modal chi tiết lịch hẹn
  const handleShowDetailModal = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
    setDetailLoading(true);
    
    try {
      // Lấy chi tiết appointment từ API
      const result = await appointmentAPI.getAppointmentById(appointment.id);
      if (result.success && result.data) {
        setAppointmentDetail(result.data);
      } else {
        console.error('Failed to fetch appointment detail:', result.message);
        setAppointmentDetail(null);
      }
    } catch (error) {
      console.error('Error fetching appointment detail:', error);
      setAppointmentDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };
  
  // Đóng modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    // Delay việc reset state để tránh hiển thị lỗi khi modal đang đóng
    setTimeout(() => {
      setSelectedAppointment(null);
      setAppointmentDetail(null);
      setDetailLoading(false);
    }, 200);
  };

  // Helper functions cho modal
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return 'Chưa xác định';
    return `${startTime} - ${endTime}`;
  };

  const getAppointmentTypeLabel = (type) => {
    return getAppointmentTypeDisplay(type);
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Badge bg="warning" className="small-badge">Chờ duyệt</Badge>;
      case 'ACCEPTED':
        return <Badge bg="success" className="small-badge">Đã duyệt</Badge>;
      case 'COMPLETED':
        return <Badge bg="primary" className="small-badge">Đã hoàn thành</Badge>;
      case 'DENIED':
        return <Badge bg="danger" className="small-badge">Từ chối</Badge>;
      default:
        return <Badge bg="secondary" className="small-badge">{status || 'Không xác định'}</Badge>;
    }
  };

  const stats = getStats();

  return (
    <div className="doctor-dashboard">
      <Container fluid>
        <Row>
          {/* Use the shared sidebar */}
          <DoctorSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            appointmentsCount={8}
          />
          
          {/* Main Content */}
          <Col md={9} lg={10} className="main-content">            <div className="content-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Tổng quan</h2>
                </div>
                <Button 
                  variant="outline-primary" 
                  onClick={fetchAppointments}
                  disabled={loading}
                  size="sm"
                >
                  <FontAwesomeIcon icon={faRefresh} className={loading ? 'fa-spin' : ''} />
                  {loading ? ' Đang tải...' : ' Làm mới'}
                </Button>
              </div>
            </div>
            
            {/* Loading và Error States */}
            {loading && (
              <div className="text-center my-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </Spinner>
                <p className="mt-2">Đang tải danh sách lịch hẹn...</p>
              </div>
            )}
            
            {error && (
              <Alert variant="danger" className="mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {error}
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ms-2"
                  onClick={fetchAppointments}
                >
                  Thử lại
                </Button>
              </Alert>
            )}
            
            {/* Stats Cards */}
            <Row className="stats-row">
              {stats.map((stat, index) => (
                <Col md={6} lg={3} key={index}>
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                        <FontAwesomeIcon icon={stat.icon} />
                      </div>
                      <h3 className="stat-value">{stat.value}</h3>
                      <p className="stat-title">{stat.title}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* Today's Appointments */}
            {!loading && !error && (
              <Row className="appointments-row">
                <Col>
                  <Card className="appointments-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h5>Lịch hẹn hôm nay ({getTodayAppointments().length})</h5>
                      <div>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          Xem theo tuần
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          Xem tất cả
                        </Button>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {getTodayAppointments().length > 0 ? (
                        <div className="table-responsive">
                          <table className="table appointment-table">
                            <thead>
                              <tr>
                                <th>Giờ khám</th>
                                <th>Bệnh nhân</th>
                                <th>Chi tiết</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTodayAppointments().map(appointment => {
                                return (
                                  <tr key={appointment.id}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faClock} className="me-2 text-muted" />
                                        <span className="fw-bold">
                                          {appointment.slotStartTime && appointment.slotEndTime 
                                            ? `${appointment.slotStartTime} - ${appointment.slotEndTime}`
                                            : 'Chưa xác định'}
                                        </span>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="fw-bold">
                                        {appointment.patientName || 'Thông tin bệnh nhân chưa có'}
                                      </span>
                                    </td>
                                    <td>
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleShowDetailModal(appointment)}
                                      >
                                        <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                                        Xem chi tiết lịch hẹn
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="text-muted mb-3" />
                          <p className="text-muted">Không có lịch hẹn nào trong hôm nay</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
              {/* Weekly Schedule Preview */}
            {!loading && !error && appointments.length > 0 && (
              <Row className="mt-4">
                <Col>
                  <Card className="appointments-card">
                    <Card.Header>
                      <h5>Tất cả lịch hẹn ({appointments.length})</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="table-responsive">
                        <table className="table appointment-table">
                          <thead>
                            <tr>
                              <th>Ngày</th>
                              <th>Giờ khám</th>
                              <th>Bệnh nhân</th>
                              <th>Chi tiết</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.slice(0, 10).map((appointment) => {
                              return (
                                <tr key={appointment.id}>
                                  <td className="fw-bold">
                                    {appointment.appointmentDate ? 
                                      new Date(appointment.appointmentDate).toLocaleDateString('vi-VN') : 
                                      'Chưa xác định'
                                    }
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <FontAwesomeIcon icon={faClock} className="me-2 text-muted" />
                                      <span className="fw-bold">
                                        {appointment.slotStartTime && appointment.slotEndTime 
                                          ? `${appointment.slotStartTime} - ${appointment.slotEndTime}`
                                          : 'Chưa xác định'}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="fw-bold">
                                      {appointment.patientName || 'Thông tin bệnh nhân chưa có'}
                                    </span>
                                  </td>
                                  <td>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      onClick={() => handleShowDetailModal(appointment)}
                                    >
                                      <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                                      Xem chi tiết lịch hẹn
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {appointments.length > 10 && (
                        <div className="text-center p-3">
                          <small className="text-muted">
                            Hiển thị 10 lịch hẹn đầu tiên. Tổng cộng: {appointments.length} lịch hẹn
                          </small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
            
            {/* Appointment Detail Modal */}
            {showDetailModal && (
              <AppointmentDetailModal
                show={showDetailModal}
                onHide={handleCloseDetailModal}
                appointmentDetail={appointmentDetail}
                loading={detailLoading}
                formatDate={formatDate}
                formatTimeSlot={formatTimeSlot}
                getAppointmentTypeLabel={getAppointmentTypeLabel}
                getStatusBadge={getStatusBadge}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorDashboard;