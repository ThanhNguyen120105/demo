import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faCalendarCheck, faUserMd,
  faClipboardList, faCog, faSignOutAlt, faUsers, faFileAlt,
  faCalendarAlt, faCheckCircle, faExclamationTriangle, faFilter,
  faChevronLeft, faChevronRight, faSearch, faPlus, faTimes, faCheck, faClock,
  faPhone, faVideo, faNotesMedical, faVial, faPrescriptionBottleAlt,
  faStethoscope, faUserFriends, faBaby, faSlidersH, faHeartbeat, 
  faUpload, faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';

// Appointment data (dummy data)
const appointments = [
  // May 1, 2025
  { id: 101, date: '2025-05-01', time: '09:00 AM', patient: 'John Smith', patientId: 'P1001', age: 45, 
    type: 'Check-up', status: 'completed', symptoms: 'Fever, fatigue', notes: 'CD4 count monitoring' },
  { id: 102, date: '2025-05-01', time: '10:30 AM', patient: 'Sarah Johnson', patientId: 'P1002', age: 38, 
    type: 'Follow-up', status: 'completed', symptoms: 'None', notes: 'Treatment response evaluation' },
  
  // May 5, 2025
  { id: 103, date: '2025-05-05', time: '08:45 AM', patient: 'Michael Brown', patientId: 'P1003', age: 52, 
    type: 'Lab Results', status: 'completed', symptoms: 'Weight loss', notes: 'CD4 count and viral load review' },
  { id: 104, date: '2025-05-05', time: '11:15 AM', patient: 'Emily Davis', patientId: 'P1004', age: 33, 
    type: 'Medication Review', status: 'pending', symptoms: 'Rash', notes: 'Possible medication side effects' },
  
  // May 7, 2025
  { id: 105, date: '2025-05-07', time: '09:30 AM', patient: 'Robert Wilson', patientId: 'P1005', age: 41, 
    type: 'Initial Consultation', status: 'completed', symptoms: 'Unexplained weight loss, night sweats', notes: 'New patient referral' },
  
  // May 8, 2025
  { id: 106, date: '2025-05-08', time: '02:00 PM', patient: 'Jennifer Lopez', patientId: 'P1006', age: 36, 
    type: 'Follow-up', status: 'completed', symptoms: 'None', notes: 'Treatment compliance check' },
  { id: 107, date: '2025-05-08', time: '03:30 PM', patient: 'David Miller', patientId: 'P1007', age: 49, 
    type: 'Counseling', status: 'completed', symptoms: 'Anxiety', notes: 'Mental health support' },
  
  // May 12, 2025
  { id: 108, date: '2025-05-12', time: '10:00 AM', patient: 'Jessica Taylor', patientId: 'P1008', age: 28, 
    type: 'Treatment Plan', status: 'completed', symptoms: 'None', notes: 'Treatment initiation' },
  
  // May 15, 2025
  { id: 109, date: '2025-05-15', time: '01:30 PM', patient: 'William Jones', patientId: 'P1009', age: 55, 
    type: 'Check-up', status: 'pending', symptoms: 'Persistent cough', notes: 'Evaluation for opportunistic infections' },
  { id: 110, date: '2025-05-15', time: '03:00 PM', patient: 'Daniel Garcia', patientId: 'P1010', age: 44, 
    type: 'Follow-up', status: 'completed', symptoms: 'Fatigue', notes: 'Treatment monitoring' },
  
  // May 19, 2025
  { id: 111, date: '2025-05-19', time: '09:00 AM', patient: 'Maria Rodriguez', patientId: 'P1011', age: 32, 
    type: 'Pregnancy Check', status: 'completed', symptoms: 'None', notes: 'HIV management during pregnancy' },
  { id: 112, date: '2025-05-19', time: '11:30 AM', patient: 'Thomas Anderson', patientId: 'P1012', age: 47, 
    type: 'Lab Results', status: 'completed', symptoms: 'None', notes: 'CD4 count improvement follow-up' },
  
  // May 21, 2025
  { id: 113, date: '2025-05-21', time: '02:30 PM', patient: 'Patricia Moore', patientId: 'P1013', age: 39, 
    type: 'Consultation', status: 'pending', symptoms: 'Headaches, vision problems', notes: 'Evaluate for neurological issues' },
  
  // May 22, 2025
  { id: 114, date: '2025-05-22', time: '10:15 AM', patient: 'James Williams', patientId: 'P1014', age: 51, 
    type: 'Treatment Adjustment', status: 'completed', symptoms: 'Nausea with current medication', notes: 'Consider alternative regimen' },
  { id: 115, date: '2025-05-22', time: '01:45 PM', patient: 'Linda Martinez', patientId: 'P1015', age: 34, 
    type: 'Follow-up', status: 'completed', symptoms: 'None', notes: 'Treatment response monitoring' },
  
  // May 26, 2025
  { id: 116, date: '2025-05-26', time: '09:30 AM', patient: 'Robert Thompson', patientId: 'P1016', age: 58, 
    type: 'Check-up', status: 'cancelled', symptoms: 'Fatigue, weight loss', notes: 'Comprehensive health assessment' },
  
  // May 28, 2025 (highlighted day in the image)
  { id: 117, date: '2025-05-28', time: '08:30 AM', patient: 'Elizabeth Martin', patientId: 'P1017', age: 42, 
    type: 'Lab Results', status: 'completed', symptoms: 'None', notes: 'Review CD4 and viral load results' },
  { id: 118, date: '2025-05-28', time: '10:00 AM', patient: 'Charles Wilson', patientId: 'P1018', age: 37, 
    type: 'Treatment Plan', status: 'completed', symptoms: 'None', notes: 'Treatment initiation discussion' },
  { id: 119, date: '2025-05-28', time: '11:30 AM', patient: 'Susan Garcia', patientId: 'P1019', age: 29, 
    type: 'Counseling', status: 'completed', symptoms: 'Anxiety, depression', notes: 'Mental health support and treatment adherence' },
  { id: 120, date: '2025-05-28', time: '02:00 PM', patient: 'Joseph Martinez', patientId: 'P1020', age: 46, 
    type: 'Follow-up', status: 'pending', symptoms: 'Mild rash on arms', notes: 'Evaluate medication side effects' },
  
  // May 29, 2025
  { id: 121, date: '2025-05-29', time: '09:15 AM', patient: 'Margaret Robinson', patientId: 'P1021', age: 53, 
    type: 'Medication Review', status: 'completed', symptoms: 'Dizziness', notes: 'Adjust medication dosage' },
  { id: 122, date: '2025-05-29', time: '11:45 AM', patient: 'Richard Clark', patientId: 'P1022', age: 40, 
    type: 'Check-up', status: 'completed', symptoms: 'None', notes: 'Regular monitoring' },
];

// Appointment types with icons for better visualization
const appointmentTypeIcons = {
  'Check-up': faStethoscope,
  'Follow-up': faCalendarCheck,
  'Lab Results': faVial,
  'Initial Consultation': faUserMd,
  'Treatment Plan': faNotesMedical,
  'Medication Review': faPrescriptionBottleAlt,
  'Counseling': faUserFriends,
  'Pregnancy Check': faBaby,
  'Treatment Adjustment': faSlidersH,
  'Consultation': faClipboardList
};

// Generate calendar days
const generateCalendarDays = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  let days = [];
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: '', date: null });
  }
  
  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const appts = appointments.filter(a => a.date === dateStr);
    
    days.push({
      day,
      date: dateStr,
      appointments: appts,
      hasAppointments: appts.length > 0
    });
  }
  
  return days;
};

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025); // Set to 2025
  const [selectedDate, setSelectedDate] = useState('2025-05-28'); // Default to May 28, 2025
  const [todayDate, setTodayDate] = useState('2025-05-28'); // Simulating today as May 28, 2025
  
  // State để quản lý medical report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicalReport, setMedicalReport] = useState({
    patientInfo: {},
    visitDate: '',
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
    medications: [],
    assessment: '',
    plan: '',
    recommendations: ['', '', '', ''],
    arvResultFile: null,
    doctorInfo: {
      name: 'Dr. John Doe',
      specialty: 'HIV Treatment Specialist',
      signature: 'J. Doe, MD',
      date: ''
    }
  });
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = generateCalendarDays(currentYear, currentMonth);
  const selectedDateAppointments = appointments.filter(a => a.date === selectedDate);
  
  // Navigation handlers
  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const goToToday = () => {
    setSelectedDate('2025-05-28'); // Simulated "today" date
    setCurrentMonth(4); // May
    setCurrentYear(2025);
  };
  
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Hiển thị modal với medical report
  const handleShowReportModal = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Khởi tạo medical report cho appointment đã chọn
    let initialReport;
    
    // Nếu appointment đã hoàn thành, thêm dữ liệu giả
    if (appointment.status === 'completed') {
      initialReport = {
        patientInfo: {
          name: appointment.patient,
          dob: "1985-06-12",
          gender: "Male",
          patientId: appointment.patientId
        },
        visitDate: appointment.date,
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
        assessment: generateAssessment(appointment),
        plan: 'Continue current antiretroviral therapy. Follow up in 3 months with repeat CD4 count and viral load. Encourage adherence to medication regimen and safe sex practices.',
        recommendations: [
          'Maintain healthy diet and regular exercise',
          'Avoid alcohol consumption',
          'Return for follow-up appointment in 3 months',
          'Call immediately if experiencing any concerning symptoms'
        ],
        arvResultFile: {
          name: `ARV_Report_${appointment.patientId}.pdf`,
          size: '1.2 MB',
          date: appointment.date
        },
        doctorInfo: {
          name: 'Dr. John Doe',
          specialty: 'HIV Treatment Specialist',
          signature: 'J. Doe, MD',
          date: appointment.date
        }
      };
    } else {
      // Nếu appointment có trạng thái pending, khởi tạo với form trống
      initialReport = {
        patientInfo: {
          name: appointment.patient,
          dob: "1985-06-12", // Giả định
          gender: "Male", // Giả định
          patientId: appointment.patientId
        },
        visitDate: appointment.date,
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
          date: new Date().toISOString().split('T')[0]
        }
      };
    }
    
    setMedicalReport(initialReport);
    setShowReportModal(true);
  };
  
  // Helper function để tạo nội dung đánh giá dựa trên loại appointment
  const generateAssessment = (appointment) => {
    const assessments = {
      'Check-up': 'Patient is clinically stable. CD4 count has improved from previous visit. Viral load remains undetectable. No significant side effects from current antiretroviral regimen. Patient reports good medication adherence.',
      'Follow-up': 'Patient continues to do well on current antiretroviral therapy. All laboratory values are within normal limits. Patient reports no new symptoms or concerns.',
      'Lab Results': 'CD4 count and viral load show excellent treatment response. Patient has maintained viral suppression for over 12 months. No signs of treatment failure or drug resistance.',
      'Treatment Plan': 'Patient has successfully initiated antiretroviral therapy. Tolerating medications well with minimal side effects. Initial laboratory response is favorable.',
      'Medication Review': 'Current medication regimen is effective with no significant adverse effects. Patient understands the importance of adherence and reports taking medications as prescribed.',
      'Consultation': 'Comprehensive evaluation completed. Patient has controlled HIV infection with current regimen. No opportunistic infections or HIV-related complications identified.'
    };
    
    return assessments[appointment.type] || 'Patient is clinically stable with good virologic and immunologic response to current antiretroviral therapy.';
  };
  
  // Đóng modal 
  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedAppointment(null);
  };
  
  // Cập nhật giá trị trong medical report
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
  
  // Lưu medical report
  const handleSaveReport = () => {
    // Ở đây có thể xử lý việc lưu report vào cơ sở dữ liệu
    console.log('Saving medical report:', medicalReport);
    
    // Cập nhật status của appointment thành completed
    const updatedAppointments = appointments.map(apt => {
      if (apt.id === selectedAppointment.id) {
        return {...apt, status: 'completed'};
      }
      return apt;
    });
    
    // Đóng modal sau khi lưu
    handleCloseReportModal();
  };
  
  return (
    <div className="doctor-dashboard">
      <Container fluid>
        <Row>
          {/* Use the shared sidebar component */}
          <DoctorSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            appointmentsCount={appointments.length}
          />
          
          {/* Main Content */}
          <Col md={9} lg={10} className="main-content">
            <div className="content-header">
              <h2>Appointments</h2>
              <p>Manage your patient appointments</p>
            </div>
            
            {/* Calendar View */}
            <Row>
              <Col lg={8}>
                <Card className="calendar-card mb-4">
                  <Card.Header className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Button variant="light" onClick={previousMonth} className="calendar-nav-btn">
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </Button>
                      <h5 className="mb-0 mx-3">{monthNames[currentMonth]} {currentYear}</h5>
                      <Button variant="light" onClick={nextMonth} className="calendar-nav-btn">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </Button>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div className="calendar">
                      <div className="calendar-header">
                        <div className="weekday">Chủ Nhật</div>
                        <div className="weekday">Thứ 2</div>
                        <div className="weekday">Thứ 3</div>
                        <div className="weekday">Thứ 4</div>
                        <div className="weekday">Thứ 5</div>
                        <div className="weekday">Thứ 6</div>
                        <div className="weekday">Thứ 7</div>
                      </div>
                      <div className="calendar-grid">
                        {days.map((day, index) => (
                          <div 
                            key={index} 
                            className={`calendar-day ${day.date === selectedDate ? 'selected' : ''} ${day.date === '2025-05-28' ? 'today' : ''} ${day.hasAppointments ? 'has-appointments' : ''} ${!day.date ? 'empty' : ''}`}
                            onClick={() => day.date && setSelectedDate(day.date)}
                          >
                            {day.day && (
                              <>
                                <div className="day-number">{day.day}</div>
                                {day.hasAppointments && (
                                  <div className="appointment-indicators">
                                    {day.appointments.slice(0, 3).map((appt, i) => (
                                      <div key={i} className={`appointment-dot status-${appt.status}`}></div>
                                    ))}
                                    {day.appointments.length > 3 && (
                                      <div className="appointment-more">+{day.appointments.length - 3}</div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              {/* Daily Schedule */}
              <Col lg={4}>
                <Card className="daily-schedule-card">
                  <Card.Header>
                    <h5 className="mb-0">
                      Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {selectedDateAppointments.length > 0 ? (
                      <div className="appointment-list">
                        {selectedDateAppointments.map(appointment => (
                          <div 
                            key={appointment.id} 
                            className={`appointment-item status-${appointment.status}`}
                          >
                            <div className="appointment-time">
                              <FontAwesomeIcon icon={faClock} className="me-2" />
                              {appointment.time}
                            </div>
                            <div className="appointment-details">
                              <div className="appointment-patient">
                                {appointment.patient}
                                {appointment.patientId && appointment.age && (
                                  <small className="text-muted ms-2">(ID: {appointment.patientId}, Age: {appointment.age})</small>
                                )}
                              </div>
                              <div className="appointment-type">{appointment.type}</div>
                              {appointment.symptoms && (
                                <div className="appointment-symptoms">
                                  <small>Symptoms: {appointment.symptoms}</small>
                                </div>
                              )}
                              {appointment.notes && (
                                <div className="appointment-notes">
                                  <small className="text-muted">Notes: {appointment.notes}</small>
                                </div>
                              )}
                            </div>
                            <div className="appointment-status">
                              <Badge bg={
                                appointment.status === 'completed' ? 'success' : 
                                appointment.status === 'pending' ? 'warning' : 'danger'
                              }>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="examination-form mt-3">
                              <h6 className="form-label">Examination Results</h6>
                              <Form>
                                <Form.Group className="mb-2">
                                  <Form.Control as="textarea" rows={2} placeholder="Clinical observations" />
                                </Form.Group>
                                <Row>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Control type="text" placeholder="CD4 Count" />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Control type="text" placeholder="Viral Load" />
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Form.Group className="mb-2">
                                  <Form.Control as="textarea" rows={2} placeholder="Treatment recommendations" />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                  <Button variant="primary" size="sm">
                                    Save to Medical Record
                                  </Button>
                                </div>
                              </Form>
                            </div>
                            
                            <div className="appointment-actions mt-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="action-btn me-1"
                                onClick={() => handleShowReportModal(appointment)}
                              >
                                <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                                Details
                              </Button>
                              <Button variant="outline-success" size="sm" className="action-btn me-1">
                                <FontAwesomeIcon icon={faPhone} />
                              </Button>
                              <Button variant="outline-info" size="sm" className="action-btn">
                                <FontAwesomeIcon icon={faVideo} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-appointments">
                        <div className="text-center p-4">
                          <FontAwesomeIcon icon={faCalendarAlt} className="no-appointments-icon" />
                          <p>No appointments scheduled for this day</p>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            {/* Recent Appointments */}
            <Card className="mt-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Appointments</h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table appointment-table">
                    <thead>
                      <tr>
                        <th>Ngày và giờ</th>
                        <th>Bệnh nhân</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.slice(0, 5).map(appointment => (
                        <tr key={appointment.id}>
                          <td>{new Date(appointment.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} at {appointment.time}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <span>{appointment.patient}</span>
                              <small className="text-muted">ID: {appointment.patientId}</small>
                            </div>
                          </td>
                          <td>
                            <Badge bg={
                              appointment.status === 'completed' ? 'success' : 
                              appointment.status === 'pending' ? 'warning' : 'danger'
                            }>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
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
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
            
            {/* Appointment Detail Modal */}
            <MedicalReportModal
              show={showReportModal}
              onHide={handleCloseReportModal}
              report={medicalReport}
              onChange={handleReportChange}
              onSave={handleSaveReport}
              appointment={selectedAppointment}
              readOnly={selectedAppointment?.status === 'completed'}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Medical Report Modal Component
const MedicalReportModal = ({ show, onHide, report, onChange, onSave, appointment, readOnly }) => {
  // Thêm một medicine vào danh sách
  const handleAddMedicine = () => {
    const newMedications = [...report.medications, {
      name: '',
      dosage: '',
      frequency: '',
      status: 'New'
    }];
    onChange('medications', newMedications);
  };

  // Xóa một medicine khỏi danh sách
  const handleRemoveMedicine = (index) => {
    const newMedications = [...report.medications];
    newMedications.splice(index, 1);
    onChange('medications', newMedications);
  };

  // Cập nhật thông tin medicine
  const handleMedicineChange = (index, field, value) => {
    const newMedications = [...report.medications];
    newMedications[index][field] = value;
    onChange('medications', newMedications);
  };

  // Cập nhật khuyến nghị
  const handleRecommendationChange = (index, value) => {
    const newRecommendations = [...report.recommendations];
    newRecommendations[index] = value;
    onChange('recommendations', newRecommendations);
  };

  // Xử lý upload file từ ARV Selection Tool
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange('arvResultFile', file);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {readOnly ? 'View Medical Report' : 'Create Medical Report'}
          <div className="text-muted fs-6">
            {appointment?.patient} - {appointment?.date} {appointment?.time}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <div className="medical-report-form">
          {/* Patient Information Section */}
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white py-2">
              <FontAwesomeIcon icon={faUserMd} className="me-2" />
              Patient Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient ID</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.patientId || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Patient Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.name || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.dob || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.gender || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Vital Signs Section */}
          <Card className="mb-3">
            <Card.Header className="bg-info text-white py-2">
              <FontAwesomeIcon icon={faHeartbeat} className="me-2" />
              Vital Signs
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 75 kg" 
                      value={report.vitalSigns.weight || ''}
                      onChange={(e) => onChange('vitalSigns.weight', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Height</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 175 cm" 
                      value={report.vitalSigns.height || ''}
                      onChange={(e) => onChange('vitalSigns.height', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>BMI</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 24.5" 
                      value={report.vitalSigns.bmi || ''}
                      onChange={(e) => onChange('vitalSigns.bmi', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Temperature</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 36.8°C" 
                      value={report.vitalSigns.temperature || ''}
                      onChange={(e) => onChange('vitalSigns.temperature', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Blood Pressure</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 120/80 mmHg" 
                      value={report.vitalSigns.bloodPressure || ''}
                      onChange={(e) => onChange('vitalSigns.bloodPressure', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Heart Rate</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 72 bpm" 
                      value={report.vitalSigns.heartRate || ''}
                      onChange={(e) => onChange('vitalSigns.heartRate', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Lab Results Section */}
          <Card className="mb-3">
            <Card.Header className="bg-warning text-dark py-2">
              <FontAwesomeIcon icon={faVial} className="me-2" />
              Lab Results
            </Card.Header>
            <Card.Body>
              <h6 className="mb-3">HIV Specific</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CD4 Count</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 650 cells/mm³" 
                      value={report.labResults.cd4Count || ''}
                      onChange={(e) => onChange('labResults.cd4Count', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Viral Load</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., < 20 copies/mL" 
                      value={report.labResults.viralLoad || ''}
                      onChange={(e) => onChange('labResults.viralLoad', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Hematology</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hemoglobin</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 14.2 g/dL" 
                      value={report.labResults.hematology.hgb || ''}
                      onChange={(e) => onChange('labResults.hematology.hgb', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>WBC</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 5.6 × 10³/μL" 
                      value={report.labResults.hematology.wbc || ''}
                      onChange={(e) => onChange('labResults.hematology.wbc', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Platelets</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 235 × 10³/μL" 
                      value={report.labResults.hematology.platelets || ''}
                      onChange={(e) => onChange('labResults.hematology.platelets', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Chemistry</h6>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Glucose</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 95 mg/dL" 
                      value={report.labResults.chemistry.glucose || ''}
                      onChange={(e) => onChange('labResults.chemistry.glucose', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Creatinine</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 0.9 mg/dL" 
                      value={report.labResults.chemistry.creatinine || ''}
                      onChange={(e) => onChange('labResults.chemistry.creatinine', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>ALT</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 25 U/L" 
                      value={report.labResults.chemistry.alt || ''}
                      onChange={(e) => onChange('labResults.chemistry.alt', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>AST</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 28 U/L" 
                      value={report.labResults.chemistry.ast || ''}
                      onChange={(e) => onChange('labResults.chemistry.ast', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Lipid Panel</h6>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Cholesterol</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 185 mg/dL" 
                      value={report.labResults.lipidPanel.totalCholesterol || ''}
                      onChange={(e) => onChange('labResults.lipidPanel.totalCholesterol', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>LDL</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 110 mg/dL" 
                      value={report.labResults.lipidPanel.ldl || ''}
                      onChange={(e) => onChange('labResults.lipidPanel.ldl', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>HDL</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 45 mg/dL" 
                      value={report.labResults.lipidPanel.hdl || ''}
                      onChange={(e) => onChange('labResults.lipidPanel.hdl', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Triglycerides</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g., 150 mg/dL" 
                      value={report.labResults.lipidPanel.triglycerides || ''}
                      onChange={(e) => onChange('labResults.lipidPanel.triglycerides', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ARV Selection Tool Results Upload */}
          <Card className="mb-3">
            <Card.Header className="bg-danger text-white py-2">
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              ARV Selection Tool Results
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Upload ARV Selection Tool Report (PDF)</Form.Label>
                {!readOnly ? (
                  <Form.Control 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={readOnly}
                  />
                ) : report.arvResultFile ? (
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                    <span>{report.arvResultFile.name}</span>
                    <Button variant="link" size="sm" className="ms-2">
                      View
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted mb-0">No ARV Report uploaded</p>
                )}
                <Form.Text className="text-muted">
                  Upload the generated PDF report from ARV Selection Tool for this patient
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Medications Section */}
          <Card className="mb-3">
            <Card.Header className="bg-success text-white py-2">
              <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
              Medications
            </Card.Header>
            <Card.Body>
              {report.medications.map((medication, index) => (
                <Row key={index} className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g., Biktarvy" 
                        value={medication.name || ''}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Dosage</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g., 1 tablet" 
                        value={medication.dosage || ''}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Frequency</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g., Once daily" 
                        value={medication.frequency || ''}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select 
                        value={medication.status || 'New'}
                        onChange={(e) => handleMedicineChange(index, 'status', e.target.value)}
                        disabled={readOnly}
                      >
                        <option value="New">New</option>
                        <option value="Continued">Continued</option>
                        <option value="Changed">Changed</option>
                        <option value="Discontinued">Discontinued</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {!readOnly && (
                    <Col md={1} className="d-flex align-items-end">
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleRemoveMedicine(index)}
                        className="mb-2"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </Col>
                  )}
                </Row>
              ))}
              
              {!readOnly && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleAddMedicine}
                  className="mt-2"
                >
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Add Medication
                </Button>
              )}
            </Card.Body>
          </Card>

          {/* Assessment & Plan */}
          <Card className="mb-3">
            <Card.Header className="bg-secondary text-white py-2">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Assessment & Plan
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Assessment</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Enter patient assessment" 
                  value={report.assessment || ''}
                  onChange={(e) => onChange('assessment', e.target.value)}
                  readOnly={readOnly}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Plan</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Enter treatment plan" 
                  value={report.plan || ''}
                  onChange={(e) => onChange('plan', e.target.value)}
                  readOnly={readOnly}
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Recommendations</Form.Label>
                {report.recommendations.map((rec, index) => (
                  <Form.Control 
                    key={index}
                    type="text" 
                    className="mb-2"
                    placeholder={`Recommendation ${index + 1}`} 
                    value={rec || ''}
                    onChange={(e) => handleRecommendationChange(index, e.target.value)}
                    readOnly={readOnly}
                  />
                ))}
              </Form.Group>
            </Card.Body>
          </Card>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {!readOnly && (
          <Button variant="primary" onClick={onSave}>
            Save Medical Report
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export { MedicalReportModal };
export default DoctorAppointments; 