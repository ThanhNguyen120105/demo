import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Row, Col, Card, Form, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserMd, 
  faClock, 
  faFilter,
  faCheckCircle,
  faTimes,
  faHourglass,
  faInfoCircle,
  faFileAlt,
  faBan,
  faEye,
  faCalendarCheck,
  faHistory,
  faExclamationTriangle,
  faCalendarPlus,
  faChartLine,
  faClipboardList,
  faNotesMedical,
  faPills,
  faBell,
  faPhone,
  faEnvelope,
  faQuestionCircle,
  faClipboardCheck,
  faLaptopMedical,
  faHospital,
  faHeartbeat,
  faVial,
  faFileMedical,
  faStethoscope,
  faVirus
} from '@fortawesome/free-solid-svg-icons';
import './AppointmentHistory.css';

// Fake appointment data
const appointmentData = [
  {
    id: "APT-2023-10-01",
    date: "2023-10-01",
    time: "09:30 AM",
    doctor: "BS. Emma Johnson",
    specialty: "Chuyên Gia Điều Trị HIV",
    reason: "Khám định kỳ và đánh giá thuốc",
    status: "Đã hoàn thành",
    notes: "Kết quả xét nghiệm máu đã được xem xét. Thuốc đã được điều chỉnh. Cuộc hẹn tiếp theo được lên lịch trong 3 tháng.",
    reportId: "MR-2023-10-01-001"
  },
  {
    id: "APT-2023-11-15",
    date: "2023-11-15",
    time: "02:15 PM",
    doctor: "BS. Michael Chen",
    specialty: "Chuyên Gia Bệnh Truyền Nhiễm",
    reason: "Xét nghiệm tải lượng virus và tư vấn",
    status: "Đã hoàn thành",
    notes: "Tải lượng virus không phát hiện được. Tiếp tục phác đồ thuốc hiện tại.",
    reportId: "MR-2023-11-15-002"
  },
  {
    id: "APT-2024-01-10",
    date: "2024-01-10",
    time: "11:00 AM",
    doctor: "BS. Sarah Williams",
    specialty: "Bác Sĩ Đa Khoa",
    reason: "Triệu chứng hô hấp và theo dõi",
    status: "Đã chấp nhận",
    notes: "Kê đơn kháng sinh cho viêm phế quản. Lịch hẹn theo dõi đã được sắp xếp."
  },
  {
    id: "APT-2024-02-20",
    date: "2024-02-20",
    time: "03:45 PM",
    doctor: "BS. Emma Johnson",
    specialty: "Chuyên Gia Điều Trị HIV",
    reason: "Khám định kỳ hàng quý và đánh giá thuốc",
    status: "Đang chờ",
    notes: ""
  },
  {
    id: "APT-2024-03-05",
    date: "2024-03-05",
    time: "10:30 AM",
    doctor: "BS. James Parker",
    specialty: "Bác Sĩ Tâm Thần",
    reason: "Đánh giá sức khỏe tâm thần",
    status: "Đang chờ",
    notes: ""
  },
  {
    id: "APT-2023-12-12",
    date: "2023-12-12",
    time: "01:00 PM",
    doctor: "BS. Robert Wilson",
    specialty: "Chuyên Gia Dinh Dưỡng",
    reason: "Tư vấn chế độ ăn uống",
    status: "Đã từ chối",
    notes: "Bác sĩ không có mặt do trường hợp khẩn cấp. Bệnh nhân đã được thông báo qua email."
  }
];

// Fake medical report data
const medicalReports = {
  "MR-2023-10-01-001": {
    patientInfo: {
      name: "Nguyễn Văn A",
      dob: "1985-06-12",
      gender: "Nam",
      patientId: "HIV-PT-10054"
    },
    visitDate: "2023-10-01",
    vitalSigns: {
      weight: "78 kg",
      height: "175 cm",
      bmi: "25.5",
      temperature: "36.7°C",
      bloodPressure: "124/82 mmHg",
      heartRate: "72 bpm",
      respiratoryRate: "16 nhịp thở/phút"
    },
    labResults: {
      cd4Count: "650 tế bào/mm³",
      cd4Percentage: "29%",
      viralLoad: "< 20 bản sao/mL (Không phát hiện)",
      hematology: {
        hgb: "14.2 g/dL",
        hct: "42%",
        wbc: "5.6 × 10³/μL",
        platelets: "235 × 10³/μL"
      },
      chemistry: {
        glucose: "92 mg/dL",
        bun: "14 mg/dL",
        creatinine: "0.9 mg/dL",
        egfr: "> 90 mL/min/1.73m²",
        alt: "24 U/L",
        ast: "22 U/L"
      },
      lipidPanel: {
        totalCholesterol: "185 mg/dL",
        ldl: "110 mg/dL",
        hdl: "45 mg/dL",
        triglycerides: "150 mg/dL"
      }
    },
    medications: [
      {
        name: "Biktarvy",
        dosage: "1 viên",
        frequency: "Một lần mỗi ngày",
        status: "Tiếp tục"
      },
      {
        name: "Vitamin tổng hợp",
        dosage: "1 viên",
        frequency: "Một lần mỗi ngày",
        status: "Tiếp tục"
      }
    ],
    assessment: "Bệnh nhân ổn định về mặt lâm sàng với tải lượng virus không phát hiện được. Thuốc được dung nạp tốt không có tác dụng phụ đáng kể nào được báo cáo. Số lượng CD4 đã cải thiện kể từ lần thăm khám trước.",
    plan: "Tiếp tục liệu pháp kháng retrovirus hiện tại. Theo dõi chức năng thận do creatinine tăng nhẹ. Theo dõi trong 3 tháng để làm xét nghiệm thường xuyên. Tư vấn cho bệnh nhân về tầm quan trọng của việc tuân thủ thuốc.",
    recommendations: [
      "Duy trì tuân thủ thuốc tốt",
      "Tập thể dục thường xuyên (30 phút, 5 ngày/tuần)",
      "Chế độ ăn uống cân bằng với đủ lượng protein",
      "Giảm tiêu thụ rượu bia",
      "Lên lịch khám nha khoa"
    ],
    doctorInfo: {
      name: "BS. Emma Johnson",
      specialty: "Chuyên Gia Điều Trị HIV",
      signature: "E. Johnson, MD",
      date: "2023-10-01"
    }
  },
  "MR-2023-11-15-002": {
    patientInfo: {
      name: "Nguyễn Văn A",
      dob: "1985-06-12",
      gender: "Nam",
      patientId: "HIV-PT-10054"
    },
    visitDate: "2023-11-15",
    vitalSigns: {
      weight: "77.5 kg",
      height: "175 cm",
      bmi: "25.3",
      temperature: "36.5°C",
      bloodPressure: "120/80 mmHg",
      heartRate: "70 bpm",
      respiratoryRate: "14 nhịp thở/phút"
    },
    labResults: {
      cd4Count: "685 tế bào/mm³",
      cd4Percentage: "30%",
      viralLoad: "< 20 bản sao/mL (Không phát hiện)",
      hematology: {
        hgb: "14.5 g/dL",
        hct: "43%",
        wbc: "5.8 × 10³/μL",
        platelets: "240 × 10³/μL"
      },
      chemistry: {
        glucose: "90 mg/dL",
        bun: "15 mg/dL",
        creatinine: "0.88 mg/dL",
        egfr: "> 90 mL/min/1.73m²",
        alt: "22 U/L",
        ast: "21 U/L"
      },
      lipidPanel: {
        totalCholesterol: "180 mg/dL",
        ldl: "105 mg/dL",
        hdl: "48 mg/dL",
        triglycerides: "140 mg/dL"
      }
    },
    medications: [
      {
        name: "Biktarvy",
        dosage: "1 viên",
        frequency: "Một lần mỗi ngày",
        status: "Tiếp tục"
      },
      {
        name: "Vitamin tổng hợp",
        dosage: "1 viên",
        frequency: "Một lần mỗi ngày",
        status: "Tiếp tục"
      }
    ],
    assessment: "Bệnh nhân tiếp tục phản ứng tốt với phác đồ hiện tại. Tải lượng virus vẫn không phát hiện được. Số lượng CD4 đã cho thấy sự cải thiện thêm. Không có báo cáo về tác dụng phụ từ thuốc.",
    plan: "Duy trì liệu pháp kháng retrovirus hiện tại. Bảng theo dõi chuyển hóa và hồ sơ lipid đều trong giới hạn bình thường. Tiếp tục theo dõi mỗi 3-4 tháng. Đã thảo luận về tầm quan trọng của việc tiêm phòng cúm.",
    recommendations: [
      "Tiếp tục tuân thủ thuốc tốt",
      "Tiêm phòng cúm hàng năm",
      "Tiếp tục thói quen tập thể dục thường xuyên",
      "Xem xét chương trình cai thuốc lá (hiện tại: 3-5 điếu/ngày)",
      "Lên lịch khám mắt"
    ],
    doctorInfo: {
      name: "BS. Michael Chen",
      specialty: "Chuyên Gia Bệnh Truyền Nhiễm",
      signature: "M. Chen, MD",
      date: "2023-11-15"
    }
  }
};

// Upcoming appointments for side panel
const upcomingAppointments = appointmentData
  .filter(app => app.status === 'Pending' || app.status === 'Accepted')
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 3);

// Health metrics data for chart
const healthMetrics = [
  { month: 'Aug', value: 280 },
  { month: 'Sep', value: 200 },
  { month: 'Oct', value: 160 },
  { month: 'Nov', value: 140 },
  { month: 'Dec', value: 120 },
  { month: 'Jan', value: 110 }
];

const AppointmentHistory = () => {
  const [filter, setFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [animatedItems, setAnimatedItems] = useState([]);
  const [showMedicalReport, setShowMedicalReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  useEffect(() => {
    // Animate items one by one for a staggered effect
    const timer = setTimeout(() => {
      const itemIds = appointmentData.map(app => app.id);
      let count = 0;
      const interval = setInterval(() => {
        if (count < itemIds.length) {
          setAnimatedItems(prev => [...prev, itemIds[count]]);
          count++;
        } else {
          clearInterval(interval);
        }
      }, 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredAppointments = filter === 'All' 
    ? appointmentData 
    : appointmentData.filter(appointment => appointment.status === filter);
  
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };
  
  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };
  
  const handleViewMedicalReport = (reportId) => {
    setSelectedReport(medicalReports[reportId]);
    setShowMedicalReport(true);
  };
  
  const handleCloseReport = () => {
    setShowMedicalReport(false);
    setSelectedReport(null);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed':
        return <Badge bg="success" className="status-badge"><FontAwesomeIcon icon={faCheckCircle} className="status-icon" /> Completed</Badge>;
      case 'Accepted':
        return <Badge bg="primary" className="status-badge"><FontAwesomeIcon icon={faCalendarCheck} className="status-icon" /> Accepted</Badge>;
      case 'Pending':
        return <Badge bg="warning" text="dark" className="status-badge"><FontAwesomeIcon icon={faHourglass} className="status-icon" /> Pending</Badge>;
      case 'Denied':
        return <Badge bg="danger" className="status-badge"><FontAwesomeIcon icon={faBan} className="status-icon" /> Denied</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <div className="status-icon-wrapper completed"><FontAwesomeIcon icon={faCheckCircle} /></div>;
      case 'Accepted':
        return <div className="status-icon-wrapper accepted"><FontAwesomeIcon icon={faCalendarCheck} /></div>;
      case 'Pending':
        return <div className="status-icon-wrapper pending"><FontAwesomeIcon icon={faHourglass} /></div>;
      case 'Denied':
        return <div className="status-icon-wrapper denied"><FontAwesomeIcon icon={faBan} /></div>;
      default:
        return null;
    }
  };
  
  return (
    <div className="appointment-history-page">
      <div className="page-header-banner">
        <Container>
          <div className="header-content">
            <div className="header-icon">
              <FontAwesomeIcon icon={faHistory} />
            </div>
            <div>
              <h1 className="page-title">Appointment History</h1>
              <p className="page-description">View and manage all your past and upcoming appointments</p>
            </div>
          </div>
        </Container>
      </div>
      
      <Container fluid className="appointment-page-container">
        <Row>
          {/* Main Content - Wider */}
          <Col lg={8} md={12} className="main-content-col">
            <div className="appointment-history-container">
              {showMedicalReport && selectedReport ? (
                <div className="medical-report animated fadeIn">
                  <Card className="report-card">
                    <Card.Header className="d-flex justify-content-between align-items-center report-header">
                      <div className="d-flex align-items-center">
                        <div className="clinic-logo">
                          <img src="data:image/png;base64,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" alt="HIV Treatment Center" className="clinic-logo-img" />
                        </div>
                        <div>
                          <h3 className="mb-0">Medical Report</h3>
                          <span className="report-subtitle">Comprehensive HIV Treatment Record</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline-light" 
                        size="sm" 
                        onClick={handleCloseReport}
                        className="close-btn"
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-1" /> Close
                      </Button>
                    </Card.Header>
                    <Card.Body className="report-body">
                      <div className="report-section patient-info">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faUserMd} className="section-icon" />
                          Patient Information
                        </h4>
                        <Row>
                          <Col md={3}>
                            <div className="info-item">
                              <label>Patient ID</label>
                              <p>{selectedReport.patientInfo.patientId}</p>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="info-item">
                              <label>Patient Name</label>
                              <p>{selectedReport.patientInfo.name}</p>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="info-item">
                              <label>Date of Birth</label>
                              <p>{selectedReport.patientInfo.dob}</p>
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="info-item">
                              <label>Gender</label>
                              <p>{selectedReport.patientInfo.gender}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      
                      <div className="report-section vital-signs">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faHeartbeat} className="section-icon" /> Vital Signs
                        </h4>
                        <Row>
                          <Col md={2}>
                            <div className="info-item">
                              <label>Weight</label>
                              <p>{selectedReport.vitalSigns.weight}</p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="info-item">
                              <label>Height</label>
                              <p>{selectedReport.vitalSigns.height}</p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="info-item">
                              <label>BMI</label>
                              <p>{selectedReport.vitalSigns.bmi}</p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="info-item">
                              <label>Temperature</label>
                              <p>{selectedReport.vitalSigns.temperature}</p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="info-item">
                              <label>Blood Pressure</label>
                              <p>{selectedReport.vitalSigns.bloodPressure}</p>
                            </div>
                          </Col>
                          <Col md={2}>
                            <div className="info-item">
                              <label>Heart Rate</label>
                              <p>{selectedReport.vitalSigns.heartRate}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      
                      <div className="report-section lab-results">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faVial} className="section-icon" /> Lab Results
                        </h4>
                        
                        <div className="hiv-specific">
                          <h5 className="subsection-title">
                            <FontAwesomeIcon icon={faVirus} className="me-2" /> HIV Specific
                          </h5>
                          <Row>
                            <Col md={6}>
                              <div className="info-item">
                                <label>CD4 Count</label>
                                <p>{selectedReport.labResults.cd4Count}</p>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="info-item">
                                <label>Viral Load</label>
                                <p className="viral-load-value">{selectedReport.labResults.viralLoad}</p>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        
                        <div className="general-labs mt-4">
                          <h5 className="subsection-title">General Labs</h5>
                          <Row>
                            <Col md={6}>
                              <div className="lab-group">
                                <h6>Hematology</h6>
                                <div className="lab-item">
                                  <span className="lab-name">Hemoglobin:</span>
                                  <span className="lab-value">{selectedReport.labResults.hematology.hgb}</span>
                                </div>
                                <div className="lab-item">
                                  <span className="lab-name">WBC:</span>
                                  <span className="lab-value">{selectedReport.labResults.hematology.wbc}</span>
                                </div>
                                <div className="lab-item">
                                  <span className="lab-name">Platelets:</span>
                                  <span className="lab-value">{selectedReport.labResults.hematology.platelets}</span>
                                </div>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="lab-group">
                                <h6>Chemistry</h6>
                                <div className="lab-item">
                                  <span className="lab-name">Glucose:</span>
                                  <span className="lab-value">{selectedReport.labResults.chemistry.glucose}</span>
                                </div>
                                <div className="lab-item">
                                  <span className="lab-name">Creatinine:</span>
                                  <span className="lab-value">{selectedReport.labResults.chemistry.creatinine}</span>
                                </div>
                                <div className="lab-item">
                                  <span className="lab-name">ALT:</span>
                                  <span className="lab-value">{selectedReport.labResults.chemistry.alt}</span>
                                </div>
                                <div className="lab-item">
                                  <span className="lab-name">AST:</span>
                                  <span className="lab-value">{selectedReport.labResults.chemistry.ast}</span>
                                </div>
                              </div>
                            </Col>
                          </Row>
                          
                          <div className="lipid-panel mt-3">
                            <h6>Lipid Panel</h6>
                            <Row>
                              <Col md={3}>
                                <div className="lab-item">
                                  <span className="lab-name">Total Cholesterol:</span>
                                  <span className="lab-value">{selectedReport.labResults.lipidPanel.totalCholesterol}</span>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="lab-item">
                                  <span className="lab-name">LDL:</span>
                                  <span className="lab-value">{selectedReport.labResults.lipidPanel.ldl}</span>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="lab-item">
                                  <span className="lab-name">HDL:</span>
                                  <span className="lab-value">{selectedReport.labResults.lipidPanel.hdl}</span>
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="lab-item">
                                  <span className="lab-name">Triglycerides:</span>
                                  <span className="lab-value">{selectedReport.labResults.lipidPanel.triglycerides}</span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                      
                      <div className="report-section medications">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faPills} className="section-icon" /> Medications
                        </h4>
                        <Table className="medication-table">
                          <thead>
                            <tr>
                              <th>Medication</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedReport.medications.map((med, index) => (
                              <tr key={index}>
                                <td>{med.name}</td>
                                <td>{med.dosage}</td>
                                <td>{med.frequency}</td>
                                <td>
                                  <Badge 
                                    bg={med.status === "Continued" ? "success" : 
                                      med.status === "New" ? "primary" : 
                                      med.status === "Adjusted" ? "warning" : "danger"}
                                  >
                                    {med.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      
                      <div className="report-section assessment">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faStethoscope} className="section-icon" /> Assessment
                        </h4>
                        <p>{selectedReport.assessment}</p>
                      </div>
                      
                      <div className="report-section plan">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faNotesMedical} className="section-icon" /> Plan
                        </h4>
                        <p>{selectedReport.plan}</p>
                      </div>
                      
                      <div className="report-section recommendations">
                        <h4 className="section-title">
                          <FontAwesomeIcon icon={faClipboardCheck} className="section-icon" /> Recommendations
                        </h4>
                        <ul className="recommendation-list">
                          {selectedReport.recommendations.map((rec, index) => (
                            <li key={index} className="recommendation-item">{rec}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="report-footer">
                        <div className="doctor-info">
                          <div className="doctor-name">{selectedReport.doctorInfo.name}</div>
                          <div className="doctor-specialty">{selectedReport.doctorInfo.specialty}</div>
                          <div className="doctor-signature">{selectedReport.doctorInfo.signature}</div>
                          <div className="signature-date">Date: {selectedReport.doctorInfo.date}</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  <Button 
                    variant="link" 
                    className="back-to-list mt-3" 
                    onClick={handleCloseReport}
                  >
                    ← Back to Appointment Details
                  </Button>
                </div>
              ) : selectedAppointment ? (
                <div className="appointment-details animated fadeIn">
                  <Row>
                    <Col md={12}>
                      <Card className="details-card">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                          <h3 className="mb-0">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            Appointment Details
                          </h3>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={handleCloseDetails}
                            className="close-btn"
                          >
                            <FontAwesomeIcon icon={faTimes} className="me-1" /> Close
                          </Button>
                        </Card.Header>
                        <Card.Body>
                          <div className="status-indicator">
                            {getStatusIcon(selectedAppointment.status)}
                          </div>
                          <Row>
                            <Col md={6}>
                              <div className="detail-group">
                                <h5>Appointment ID</h5>
                                <p>{selectedAppointment.id}</p>
                              </div>
                              <div className="detail-group">
                                <h5>Date & Time</h5>
                                <p>
                                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                                  {selectedAppointment.date} at {selectedAppointment.time}
                                </p>
                              </div>
                              <div className="detail-group">
                                <h5>Status</h5>
                                <p>{getStatusBadge(selectedAppointment.status)}</p>
                              </div>
                              <div className="detail-group">
                                <h5>Reason for Visit</h5>
                                <p>{selectedAppointment.reason}</p>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="detail-group">
                                <h5>Doctor</h5>
                                <p>
                                  <FontAwesomeIcon icon={faUserMd} className="me-2 text-primary" />
                                  {selectedAppointment.doctor}
                                </p>
                              </div>
                              <div className="detail-group">
                                <h5>Specialty</h5>
                                <p>{selectedAppointment.specialty}</p>
                              </div>
                              <div className="detail-group">
                                <h5>Notes</h5>
                                <p>{selectedAppointment.notes || "No notes available"}</p>
                              </div>
                            </Col>
                          </Row>
                          <div className="appointment-actions mt-3">
                            {selectedAppointment.status === 'Pending' && (
                              <>
                                <Button variant="outline-danger" className="action-btn">
                                  <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel Appointment
                                </Button>
                                <Button variant="outline-primary" className="action-btn">
                                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Reschedule
                                </Button>
                              </>
                            )}
                            {selectedAppointment.status === 'Completed' && selectedAppointment.reportId && (
                              <Button 
                                variant="primary" 
                                className="action-btn"
                                onClick={() => handleViewMedicalReport(selectedAppointment.reportId)}
                              >
                                <FontAwesomeIcon icon={faFileAlt} className="me-1" /> View Medical Report
                              </Button>
                            )}
                            {selectedAppointment.status === 'Denied' && (
                              <Button variant="outline-primary" className="action-btn">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Request New Appointment
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Button 
                    variant="link" 
                    className="back-to-list mt-3" 
                    onClick={handleCloseDetails}
                  >
                    ← Back to Appointment List
                  </Button>
                </div>
              ) : (
                <>
                  <div className="status-summary">
                    <Row>
                      <Col xs={6} md={3}>
                        <div className="status-card pending">
                          <div className="status-card-icon">
                            <FontAwesomeIcon icon={faHourglass} />
                          </div>
                          <div className="status-card-content">
                            <h3>
                              {appointmentData.filter(a => a.status === 'Pending').length}
                            </h3>
                            <p>Pending</p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} md={3}>
                        <div className="status-card accepted">
                          <div className="status-card-icon">
                            <FontAwesomeIcon icon={faCalendarCheck} />
                          </div>
                          <div className="status-card-content">
                            <h3>
                              {appointmentData.filter(a => a.status === 'Accepted').length}
                            </h3>
                            <p>Accepted</p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} md={3}>
                        <div className="status-card completed">
                          <div className="status-card-icon">
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </div>
                          <div className="status-card-content">
                            <h3>
                              {appointmentData.filter(a => a.status === 'Completed').length}
                            </h3>
                            <p>Completed</p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} md={3}>
                        <div className="status-card denied">
                          <div className="status-card-icon">
                            <FontAwesomeIcon icon={faBan} />
                          </div>
                          <div className="status-card-content">
                            <h3>
                              {appointmentData.filter(a => a.status === 'Denied').length}
                            </h3>
                            <p>Denied</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="filter-bar mb-4">
                    <Row className="align-items-center">
                      <Col xs={12} md={6}>
                        <h5 className="mb-0 mt-2">
                          <FontAwesomeIcon icon={faFilter} className="me-2" />
                          Filter by Status:
                        </h5>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Select 
                          value={filter} 
                          onChange={(e) => setFilter(e.target.value)}
                          className="status-filter"
                        >
                          <option value="All">All Appointments</option>
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Completed">Completed</option>
                          <option value="Denied">Denied</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="table-responsive appointment-table">
                    <Table hover className="custom-table">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Doctor</th>
                          <th>Reason</th>
                          <th>Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAppointments.map((appointment) => (
                          <tr 
                            key={appointment.id} 
                            className={`status-${appointment.status.toLowerCase()} ${animatedItems.includes(appointment.id) ? 'animated fadeInUp' : ''}`}
                          >
                            <td>
                              <div className="appointment-date">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2 calendar-icon" />
                                <div>
                                  <div className="date">{appointment.date}</div>
                                  <div className="time">{appointment.time}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="doctor-info">
                                <FontAwesomeIcon icon={faUserMd} className="me-2 doctor-icon" />
                                <div>
                                  <div className="doctor-name">{appointment.doctor}</div>
                                  <div className="doctor-specialty">{appointment.specialty}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="reason-text">{appointment.reason}</div>
                            </td>
                            <td>{getStatusBadge(appointment.status)}</td>
                            <td className="text-center">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                className="view-details-btn"
                                onClick={() => handleViewDetails(appointment)}
                              >
                                <FontAwesomeIcon icon={faEye} className="me-1" /> View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  {filteredAppointments.length === 0 && (
                    <div className="no-appointments">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="no-data-icon" />
                      <p>No appointments found with the selected filter.</p>
                      <Button variant="outline-primary" onClick={() => setFilter('All')}>
                        View All Appointments
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>
          
          {/* Right Sidebar - Properly positioned */}
          <Col lg={4} md={12} className="sidebar-col d-none d-lg-block">
            <div className="sidebar right-sidebar">
              <div className="sidebar-box upcoming-box">
                <h4 className="sidebar-title">
                  <FontAwesomeIcon icon={faCalendarCheck} className="sidebar-icon" />
                  Upcoming Appointments
                </h4>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={`upcoming-appointment status-${appointment.status.toLowerCase()}`}
                    >
                      <div className="upcoming-date">
                        <div className="calendar-wrapper">
                          <div className="calendar-month">
                            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="calendar-day">
                            {new Date(appointment.date).getDate()}
                          </div>
                        </div>
                      </div>
                      <div className="upcoming-details">
                        <div className="upcoming-time">
                          <FontAwesomeIcon icon={faClock} /> {appointment.time}
                        </div>
                        <div className="upcoming-doctor">
                          <FontAwesomeIcon icon={faUserMd} /> {appointment.doctor}
                        </div>
                        <div className="upcoming-status">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-upcoming">
                    <p>No upcoming appointments</p>
                  </div>
                )}
                <Button variant="outline-primary" className="w-100 mt-3">
                  <FontAwesomeIcon icon={faCalendarPlus} className="me-1" /> Schedule New
                </Button>
              </div>

              <div className="sidebar-box faq-box">
                <h4 className="sidebar-title">
                  <FontAwesomeIcon icon={faQuestionCircle} className="sidebar-icon" />
                  FAQ
                </h4>
                <div className="faq-item">
                  <div className="faq-question">How do I reschedule an appointment?</div>
                  <div className="faq-answer">
                    You can reschedule by clicking the "View Details" button and selecting "Reschedule" option.
                  </div>
                </div>
                <div className="faq-item">
                  <div className="faq-question">What if I need to cancel?</div>
                  <div className="faq-answer">
                    Please cancel at least 24 hours in advance to avoid cancellation fees.
                  </div>
                </div>
                <Button variant="link" className="btn-sm faq-link">View All FAQs</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentHistory; 