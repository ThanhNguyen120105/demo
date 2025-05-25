import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faCalendarCheck, faUserPlus, faUserMd, 
  faClipboardList, faCog, faSignOutAlt, faUsers, faFileAlt,
  faCalendarAlt, faCheckCircle, faExclamationTriangle,
  faClock, faPhone, faVideo, faPrescriptionBottleAlt
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';
import { MedicalReportModal } from './DoctorAppointments';

// Enhanced dummy data for dashboard
const todayAppointments = [
  { id: 1, time: '09:00 AM', patient: 'John Smith', status: 'completed', symptoms: 'Fever, Cough' },
  { id: 2, time: '10:30 AM', patient: 'Sarah Johnson', status: 'completed', symptoms: 'Medication review' },
  { id: 3, time: '11:45 AM', patient: 'Michael Brown', status: 'pending', symptoms: 'Weight loss, Fatigue' },
  { id: 4, time: '02:15 PM', patient: 'Emily Davis', status: 'completed', symptoms: 'CD4 count review' },
  { id: 5, time: '03:30 PM', patient: 'Robert Wilson', status: 'cancelled', symptoms: 'Treatment adjustment' }
];

// Appointments for different days
const weeklyAppointments = {
  monday: [
    { id: 6, time: '08:30 AM', patient: 'James Williams', status: 'completed' },
    { id: 7, time: '11:00 AM', patient: 'Patricia Moore', status: 'completed' },
    { id: 8, time: '01:45 PM', patient: 'Thomas Taylor', status: 'completed' }
  ],
  tuesday: [
    { id: 9, time: '09:15 AM', patient: 'Jennifer Anderson', status: 'completed' },
    { id: 10, time: '10:45 AM', patient: 'Charles Jackson', status: 'pending' },
    { id: 11, time: '02:30 PM', patient: 'Mary White', status: 'completed' },
    { id: 12, time: '04:00 PM', patient: 'Daniel Harris', status: 'completed' }
  ],
  wednesday: [
    { id: 13, time: '10:00 AM', patient: 'Elizabeth Martin', status: 'completed' },
    { id: 14, time: '01:30 PM', patient: 'David Thompson', status: 'cancelled' }
  ],
  thursday: [
    { id: 15, time: '09:30 AM', patient: 'Susan Garcia', status: 'completed' },
    { id: 16, time: '11:15 AM', patient: 'Joseph Martinez', status: 'completed' },
    { id: 17, time: '03:00 PM', patient: 'Margaret Robinson', status: 'pending' }
  ],
  friday: [
    { id: 18, time: '08:45 AM', patient: 'Richard Clark', status: 'completed' },
    { id: 19, time: '12:00 PM', patient: 'Nancy Lewis', status: 'completed' },
    { id: 20, time: '02:45 PM', patient: 'Christopher Lee', status: 'completed' },
    { id: 21, time: '04:15 PM', patient: 'Karen Walker', status: 'pending' }
  ]
};

const DoctorDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State cho Modal Báo cáo Y tế
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicalReport, setMedicalReport] = useState(null);
  
  // Thống kê tổng quan
  const stats = [
    { title: 'Tổng số bệnh nhân', value: '1,248', icon: faUsers, color: '#4CAF50' },
    { title: 'Lịch hẹn hôm nay', value: '8', icon: faCalendarAlt, color: '#2196F3' },
    { title: 'Hoàn thành hôm nay', value: '5', icon: faCheckCircle, color: '#9C27B0' },
    { title: 'Đang chờ xử lý', value: '3', icon: faExclamationTriangle, color: '#FF9800' }
  ];

  // Type counts for current month (actual values for chart)
  const appointmentTypes = [
    { type: 'Tư vấn đầu tiên', count: 45, color: '#4CAF50' },
    { type: 'Tái khám', count: 60, color: '#2196F3' },
    { type: 'Kết quả xét nghiệm', count: 35, color: '#FF9800' },
    { type: 'Đánh giá điều trị', count: 25, color: '#9C27B0' }
  ];
  
  // Xử lý hiển thị modal medical report
  const handleShowReportModal = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Khởi tạo giá trị mẫu cho appointment đã hoàn thành
    let initialReport;
    if (appointment.status === 'completed') {
      initialReport = {
        patientInfo: {
          name: appointment.patient,
          dob: "1985-06-12",
          gender: "Male",
          patientId: `P${1000 + appointment.id}`
        },
        visitDate: "2025-05-28",
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
        plan: 'Continue current antiretroviral therapy. Follow up in 3 months with repeat CD4 count and viral load. Encourage adherence to medication regimen and safe sex practices.',
        recommendations: [
          'Maintain healthy diet and regular exercise',
          'Avoid alcohol consumption',
          'Return for follow-up appointment in 3 months',
          'Call immediately if experiencing any concerning symptoms'
        ],
        arvResultFile: {
          name: `ARV_Report_P${1000 + appointment.id}.pdf`,
          size: '1.2 MB',
          date: "2025-05-28"
        },
        doctorInfo: {
          name: 'Dr. John Doe',
          specialty: 'HIV Treatment Specialist',
          signature: 'J. Doe, MD',
          date: "2025-05-28"
        }
      };
    } else {
      // Dữ liệu rỗng cho appointment chưa hoàn thành
      initialReport = {
        patientInfo: {
          name: appointment.patient,
          dob: "1985-06-12",
          gender: "Male",
          patientId: `P${1000 + appointment.id}`
        },
        visitDate: "2025-05-28",
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
            frequency: '',
            status: 'New'
          }
        ],
        assessment: '',
        plan: '',
        recommendations: ['', '', '', ''],
        arvResultFile: null,
        doctorInfo: {
          name: 'Dr. John Doe',
          specialty: 'HIV Treatment Specialist',
          signature: 'J. Doe, MD',
          date: "2025-05-28"
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
  };

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
          <Col md={9} lg={10} className="main-content">
            <div className="content-header">
              <h2>Tổng quan</h2>
              <p>Chào mừng trở lại, Dr. John Doe</p>
            </div>
            
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
                          <div className="pie-slice slice1"></div>
                          <div className="pie-slice slice2"></div>
                          <div className="pie-slice slice3"></div>
                          <div className="pie-slice slice4"></div>
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
            <Row className="appointments-row">
              <Col>
                <Card className="appointments-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5>Lịch hẹn hôm nay</h5>
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
                    <div className="table-responsive">
                      <table className="table appointment-table">
                        <thead>
                          <tr>
                            <th>Thời gian</th>
                            <th>Bệnh nhân</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayAppointments.map(appointment => (
                            <tr key={appointment.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <FontAwesomeIcon icon={faClock} className="me-2 text-muted" />
                                  {appointment.time}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <span className="fw-bold">{appointment.patient}</span>
                                  <small className="text-muted">{appointment.symptoms}</small>
                                </div>
                              </td>
                              <td>
                                <Badge bg={
                                  appointment.status === 'completed' ? 'success' : 
                                  appointment.status === 'pending' ? 'warning' : 'danger'
                                }>
                                  {appointment.status === 'completed' ? 'Hoàn thành' : 
                                  appointment.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
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
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Weekly Schedule Preview */}
            <Row className="mt-4">
              <Col>
                <Card className="appointments-card">
                  <Card.Header>
                    <h5>Lịch trình tuần</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <table className="table appointment-table">
                        <thead>
                          <tr>
                            <th>Ngày</th>
                            <th>Lịch hẹn</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Thứ Hai</td>
                            <td>
                              <div className="d-flex flex-column">
                                {weeklyAppointments.monday.map((apt, idx) => (
                                  <small key={idx} className="mb-1">{apt.time} - {apt.patient}</small>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Badge bg="success">{weeklyAppointments.monday.length} Đã lên lịch</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Thứ Ba</td>
                            <td>
                              <div className="d-flex flex-column">
                                {weeklyAppointments.tuesday.map((apt, idx) => (
                                  <small key={idx} className="mb-1">{apt.time} - {apt.patient}</small>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Badge bg="success">{weeklyAppointments.tuesday.length} Đã lên lịch</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Thứ Tư</td>
                            <td>
                              <div className="d-flex flex-column">
                                {weeklyAppointments.wednesday.map((apt, idx) => (
                                  <small key={idx} className="mb-1">{apt.time} - {apt.patient}</small>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Badge bg="success">{weeklyAppointments.wednesday.length} Đã lên lịch</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Thứ Năm</td>
                            <td>
                              <div className="d-flex flex-column">
                                {weeklyAppointments.thursday.map((apt, idx) => (
                                  <small key={idx} className="mb-1">{apt.time} - {apt.patient}</small>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Badge bg="success">{weeklyAppointments.thursday.length} Đã lên lịch</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Thứ Sáu</td>
                            <td>
                              <div className="d-flex flex-column">
                                {weeklyAppointments.friday.map((apt, idx) => (
                                  <small key={idx} className="mb-1">{apt.time} - {apt.patient}</small>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Badge bg="success">{weeklyAppointments.friday.length} Đã lên lịch</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Medical Report Modal */}
            {showReportModal && selectedAppointment && medicalReport && (
              <MedicalReportModal
                show={showReportModal}
                onHide={handleCloseReportModal}
                report={medicalReport}
                onChange={handleReportChange}
                onSave={handleSaveReport}
                appointment={selectedAppointment}
                readOnly={selectedAppointment.status === 'completed'}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DoctorDashboard;