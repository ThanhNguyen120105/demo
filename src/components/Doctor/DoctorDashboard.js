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
import MedicalReportModal from './MedicalReportModal';
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
  
  // State cho Modal Báo cáo Y tế
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null);

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

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'ACCEPTED':
      case 'COMPLETED':
        return { text: 'Hoàn thành', variant: 'success' };
      case 'PENDING':
        return { text: 'Đang chờ', variant: 'warning' };
      case 'CANCELLED':
        return { text: 'Đã hủy', variant: 'danger' };
      default:
        return { text: status || 'Không xác định', variant: 'secondary' };
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
        setAppointments(appointmentsData);
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
      apt.status === 'COMPLETED' || apt.status === 'ACCEPTED'
    ).length;
    const pendingToday = todayAppointments.filter(apt => 
      apt.status === 'PENDING'
    ).length;

    return [
      { title: 'Tổng số lịch hẹn', value: appointments.length.toString(), icon: faUsers, color: '#4CAF50' },
      { title: 'Lịch hẹn hôm nay', value: todayAppointments.length.toString(), icon: faCalendarAlt, color: '#2196F3' },
      { title: 'Hoàn thành hôm nay', value: completedToday.toString(), icon: faCheckCircle, color: '#9C27B0' },
      { title: 'Đang chờ xử lý', value: pendingToday.toString(), icon: faExclamationTriangle, color: '#FF9800' }
    ];
  };
  // Xử lý hiển thị modal medical report
  const handleShowReportModal = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Khởi tạo giá trị mẫu cho appointment đã hoàn thành
    let initialReport;
    if (appointment.status === 'COMPLETED' || appointment.status === 'ACCEPTED') {
      initialReport = {
        patientInfo: {
          name: appointment.alternativeName || appointment.customerName || 'Không có tên',
          dob: "1985-06-12",
          gender: "Male",
          patientId: `P${appointment.id || '000'}`
        },
        visitDate: appointment.appointmentDate || new Date().toISOString().split('T')[0],
        appointmentType: getAppointmentTypeDisplay(appointment.type),
        service: getServiceDisplay(appointment.serviceId),
        reason: appointment.reason || 'Không có thông tin',
        note: appointment.note || 'Không có ghi chú',
        vitalSigns: {
          weight: '72 kg',
          height: '175 cm',
          bmi: '23.5',
          temperature: '36.7°C',
          bloodPressure: '120/80 mmHg',
          heartRate: '72 bpm'
        },
        labResults: {
          cd4Count: `${Math.floor(Math.random() * 300) + 400} cells/mm³`,
          viralLoad: 'Undetectable (<20 copies/mL)',
          hematology: {
            hgb: '14.2 g/dL',
            wbc: '5.8 × 10³/μL',
            platelets: '230 × 10³/μL'
          },
          chemistry: {
            glucose: '92 mg/dL',
            creatinine: '0.9 mg/dL',
            alt: '28 U/L',
            ast: '26 U/L'
          },
          lipidPanel: {
            totalCholesterol: '180 mg/dL',
            ldl: '105 mg/dL',
            hdl: '48 mg/dL',
            triglycerides: '130 mg/dL'
          }
        },
        medications: [
          {
            name: 'Biktarvy',
            dosage: '1 tablet',
            frequency: 'Once daily',
            status: 'Continued'
          },
          {
            name: 'Multivitamin',
            dosage: '1 tablet',
            frequency: 'Once daily',
            status: 'New'
          }
        ],
        assessment: 'Patient is clinically stable with good virologic and immunologic response to current antiretroviral therapy.',
        plan: 'Continue current antiretroviral therapy. Follow up in 3 months with repeat CD4 count and viral load. Encourage safe sex practices.',
        recommendations: [
          'Maintain healthy diet and regular exercise',
          'Avoid alcohol consumption',
          'Return for follow-up appointment in 3 months',
          'Call immediately if experiencing any concerning symptoms'
        ],
        arvResultFile: {
          name: `ARV_Report_P${appointment.id || '000'}.pdf`,
          size: '1.2 MB',
          date: appointment.appointmentDate || new Date().toISOString().split('T')[0]
        },
        doctorInfo: {
          name: user?.fullName || user?.name || 'Dr. John Doe',
          specialty: 'HIV Treatment Specialist',
          signature: user?.fullName || 'J. Doe, MD',
          date: appointment.appointmentDate || new Date().toISOString().split('T')[0]
        }
      };
    } else {
      // Dữ liệu rỗng cho appointment chưa hoàn thành
      initialReport = {
        patientInfo: {
          name: appointment.alternativeName || appointment.customerName || 'Không có tên',
          dob: "1985-06-12",
          gender: "Male",
          patientId: `P${appointment.id || '000'}`
        },
        visitDate: appointment.appointmentDate || new Date().toISOString().split('T')[0],
        appointmentType: getAppointmentTypeDisplay(appointment.type),
        service: getServiceDisplay(appointment.serviceId),
        reason: appointment.reason || '',
        note: appointment.note || '',
        vitalSigns: {
          weight: '',
          height: '',
          bmi: '',
          temperature: '',
          bloodPressure: '',
          heartRate: ''
        },
        labResults: {
          cd4Count: '',
          viralLoad: '',
          hematology: {
            hgb: '',
            wbc: '',
            platelets: ''
          },
          chemistry: {
            glucose: '',
            creatinine: '',
            alt: '',
            ast: ''
          },
          lipidPanel: {
            totalCholesterol: '',
            ldl: '',
            hdl: '',
            triglycerides: ''
          }
        },
        medications: [
          {
            name: '',
            dosage: '',
            frequency: '',            status: 'New'
          }
        ],
        assessment: '',
        plan: '',
        recommendations: ['', '', '', ''],
        arvResultFile: null,
        doctorInfo: {
          name: user?.fullName || user?.name || 'Dr. John Doe',
          specialty: 'HIV Treatment Specialist',
          signature: user?.fullName || 'J. Doe, MD',
          date: appointment.appointmentDate || new Date().toISOString().split('T')[0]
        }
      };
    }
    
    setMedicalReport(initialReport);
    setShowReportModal(true);
  };
  
  // Đóng modal
  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedAppointment(null);
  };
  
  // Xử lý cập nhật report
  const handleReportChange = (field, value) => {
    setMedicalReport(prevReport => {
      // Xử lý các trường lồng nhau (nested fields)
      if (field.includes('.')) {
        const fields = field.split('.');
        let newReport = {...prevReport};
        let current = newReport;
        
        for (let i = 0; i < fields.length - 1; i++) {
          current = current[fields[i]];
        }
        
        current[fields[fields.length - 1]] = value;
        return newReport;
      }
      
      // Xử lý trường đơn
      return {
        ...prevReport,
        [field]: value
      };
    });
  };
    // Lưu report
  const handleSaveReport = () => {
    // Cập nhật status của appointment thành completed
    console.log('Lưu báo cáo y tế:', medicalReport);
    
    // Đóng modal sau khi lưu
    handleCloseReportModal();
    
    // Reload dữ liệu
    fetchAppointments();
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
                  <p>Chào mừng trở lại, {user?.fullName || user?.name || 'Bác sĩ'}</p>
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
            
            {/* Charts Row */}
            <Row className="charts-row">
              <Col lg={8}>
                <Card className="chart-card">
                  <Card.Header>
                    <h5>Lượt khám bệnh (Theo tháng)</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="chart-area">
                      {/* Placeholder for chart - in a real app, use a charting library here */}
                      <div className="chart-placeholder">
                        <div className="chart-y-axis">
                          <div className="y-axis-tick">100</div>
                          <div className="y-axis-tick">80</div>
                          <div className="y-axis-tick">60</div>
                          <div className="y-axis-tick">40</div>
                          <div className="y-axis-tick">20</div>
                          <div className="y-axis-tick">0</div>
                        </div>
                        <div className="chart-grid">
                          <div className="horizontal-grid-line" style={{ bottom: '20%' }}></div>
                          <div className="horizontal-grid-line" style={{ bottom: '40%' }}></div>
                          <div className="horizontal-grid-line" style={{ bottom: '60%' }}></div>
                          <div className="horizontal-grid-line" style={{ bottom: '80%' }}></div>
                          <div className="horizontal-grid-line" style={{ bottom: '100%' }}></div>
                        </div>
                        <div className="chart-bars">
                          <div className="chart-bar" style={{ height: '60%' }}>
                            <div className="chart-value">60</div>
                            <span>T1</span>
                          </div>
                          <div className="chart-bar" style={{ height: '75%' }}>
                            <div className="chart-value">75</div>
                            <span>T2</span>
                          </div>
                          <div className="chart-bar" style={{ height: '45%' }}>
                            <div className="chart-value">45</div>
                            <span>T3</span>
                          </div>
                          <div className="chart-bar" style={{ height: '80%' }}>
                            <div className="chart-value">80</div>
                            <span>T4</span>
                          </div>
                          <div className="chart-bar" style={{ height: '65%' }}>
                            <div className="chart-value">65</div>
                            <span>T5</span>
                          </div>
                          <div className="chart-bar" style={{ height: '90%' }}>
                            <div className="chart-value">90</div>
                            <span>T6</span>
                          </div>
                          <div className="chart-bar accent" style={{ height: '85%' }}>
                            <div className="chart-value">85</div>
                            <span>T7</span>
                          </div>
                          <div className="chart-bar" style={{ height: '70%' }}>
                            <div className="chart-value">70</div>
                            <span>T8</span>
                          </div>
                          <div className="chart-bar" style={{ height: '75%' }}>
                            <div className="chart-value">75</div>
                            <span>T9</span>
                          </div>
                          <div className="chart-bar" style={{ height: '60%' }}>
                            <div className="chart-value">60</div>
                            <span>T10</span>
                          </div>
                          <div className="chart-bar" style={{ height: '50%' }}>
                            <div className="chart-value">50</div>
                            <span>T11</span>
                          </div>
                          <div className="chart-bar" style={{ height: '65%' }}>
                            <div className="chart-value">65</div>
                            <span>T12</span>
                          </div>
                        </div>
                        <div className="x-axis"></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="chart-card">
                  <Card.Header>
                    <h5>Phân bố bệnh nhân</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="chart-area">
                      {/* Placeholder for pie chart */}
                      <div className="pie-chart-placeholder">
                        <div className="pie-chart">
                          {/* Pie chart now uses conic-gradient */}
                        </div>
                        <div className="pie-legend">
                          <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: '#4CAF50' }}></span>
                            <span>Bệnh nhân mới (25%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: '#2196F3' }}></span>
                            <span>Tái khám (40%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: '#FFC107' }}></span>
                            <span>Kiểm tra định kỳ (20%)</span>
                          </div>
                          <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: '#9C27B0' }}></span>
                            <span>Khẩn cấp (15%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
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
                                <th>Thời gian</th>
                                <th>Bệnh nhân</th>
                                <th>Loại khám</th>
                                <th>Dịch vụ</th>
                                <th>Triệu chứng</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                              </tr>
                            </thead>
                            <tbody>
                              {getTodayAppointments().map(appointment => {
                                const statusInfo = getStatusDisplay(appointment.status);
                                return (
                                  <tr key={appointment.id}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <FontAwesomeIcon icon={faClock} className="me-2 text-muted" />
                                        {appointment.slotTime || 'Chưa xác định'}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <span className="fw-bold">
                                          {appointment.alternativeName || appointment.customerName || 'Không có tên'}
                                        </span>
                                        <small className="text-muted">ID: {appointment.id}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <Badge bg="info" className="me-1">
                                        {getAppointmentTypeDisplay(appointment.type)}
                                      </Badge>
                                    </td>
                                    <td>
                                      <small className="text-muted">
                                        {getServiceDisplay(appointment.serviceId)}
                                      </small>
                                    </td>
                                    <td>
                                      <small>
                                        {appointment.reason || 'Không có thông tin'}
                                      </small>
                                    </td>
                                    <td>
                                      <small>
                                        {appointment.note || 'Không có ghi chú'}
                                      </small>
                                    </td>
                                    <td>
                                      <Badge bg={statusInfo.variant}>
                                        {statusInfo.text}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleShowReportModal(appointment)}
                                      >
                                        <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                                        Chi tiết
                                      </Button>
                                      <Button variant="outline-success" size="sm" className="me-2">
                                        <FontAwesomeIcon icon={faPhone} />
                                      </Button>
                                      <Button variant="outline-info" size="sm">
                                        <FontAwesomeIcon icon={faVideo} />
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
                              <th>Thời gian</th>
                              <th>Bệnh nhân</th>
                              <th>Loại khám</th>
                              <th>Dịch vụ</th>
                              <th>Triệu chứng</th>
                              <th>Ghi chú</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.slice(0, 10).map((appointment) => {
                              const statusInfo = getStatusDisplay(appointment.status);
                              return (
                                <tr key={appointment.id}>
                                  <td className="fw-bold">
                                    {appointment.appointmentDate ? 
                                      new Date(appointment.appointmentDate).toLocaleDateString('vi-VN') : 
                                      'Chưa xác định'
                                    }
                                  </td>
                                  <td>
                                    <small>{appointment.slotTime || 'Chưa xác định'}</small>
                                  </td>
                                  <td>
                                    <div className="d-flex flex-column">
                                      <span className="fw-bold">
                                        {appointment.alternativeName || appointment.customerName || 'Không có tên'}
                                      </span>
                                      <small className="text-muted">ID: {appointment.id}</small>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge bg="info" className="me-1">
                                      {getAppointmentTypeDisplay(appointment.type)}
                                    </Badge>
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      {getServiceDisplay(appointment.serviceId)}
                                    </small>
                                  </td>
                                  <td>
                                    <small>
                                      {appointment.reason || 'Không có thông tin'}
                                    </small>
                                  </td>
                                  <td>
                                    <small>
                                      {appointment.note || 'Không có ghi chú'}
                                    </small>
                                  </td>
                                  <td>
                                    <Badge bg={statusInfo.variant}>
                                      {statusInfo.text}
                                    </Badge>
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
            
            {/* Medical Report Modal */}
            {showReportModal && selectedAppointment && medicalReport && (
              <MedicalReportModal
                show={showReportModal}
                onHide={handleCloseReportModal}
                report={medicalReport}
                onChange={handleReportChange}                onSave={handleSaveReport}
                appointment={selectedAppointment}
                readOnly={selectedAppointment.status === 'COMPLETED' || selectedAppointment.status === 'ACCEPTED'}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorDashboard;