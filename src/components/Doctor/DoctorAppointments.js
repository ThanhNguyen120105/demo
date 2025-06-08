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
  faUpload, faFilePdf, faEye, faEdit, faTrash
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';
import ARVSelectionTool from './ARVSelectionTool';

// Dữ liệu lịch hẹn mẫu
const initialAppointments = [
  // May 1, 2025
  { id: 101, date: '2025-05-01', time: '09:00 AM', patient: 'John Smith', patientId: 'P1001', age: 45, 
    type: 'Khám định kỳ', status: 'completed', symptoms: 'Sốt, mệt mỏi', notes: 'Theo dõi chỉ số CD4' },
  { id: 102, date: '2025-05-01', time: '10:30 AM', patient: 'Sarah Johnson', patientId: 'P1002', age: 38, 
    type: 'Tái khám', status: 'completed', symptoms: 'Không có', notes: 'Đánh giá đáp ứng điều trị' },
  { id: 103, date: '2025-05-05', time: '08:45 AM', patient: 'Michael Brown', patientId: 'P1003', age: 52, 
    type: 'Kết quả xét nghiệm', status: 'completed', symptoms: 'Sụt cân', notes: 'Xem xét chỉ số CD4 và tải lượng virus' },
  { id: 104, date: '2025-05-05', time: '11:15 AM', patient: 'Emily Davis', patientId: 'P1004', age: 33, 
    type: 'Đánh giá thuốc', status: 'pending', symptoms: 'Phát ban', notes: 'Có thể do tác dụng phụ của thuốc' },
  { id: 105, date: '2025-05-07', time: '09:30 AM', patient: 'Robert Wilson', patientId: 'P1005', age: 41, 
    type: 'Tư vấn ban đầu', status: 'completed', symptoms: 'Sụt cân không rõ nguyên nhân, đổ mồ hôi đêm', notes: 'Bệnh nhân mới được giới thiệu' },
  { id: 106, date: '2025-05-08', time: '02:00 PM', patient: 'Jennifer Lopez', patientId: 'P1006', age: 36, 
    type: 'Tái khám', status: 'completed', symptoms: 'Không có', notes: 'Kiểm tra điều trị' },
  { id: 107, date: '2025-05-08', time: '03:30 PM', patient: 'David Miller', patientId: 'P1007', age: 49, 
    type: 'Tư vấn', status: 'completed', symptoms: 'Lo âu, trầm cảm', notes: 'Hỗ trợ sức khỏe tâm thần' },
  { id: 108, date: '2025-05-12', time: '10:00 AM', patient: 'Jessica Taylor', patientId: 'P1008', age: 28, 
    type: 'Kế hoạch điều trị', status: 'completed', symptoms: 'Không có', notes: 'Bắt đầu điều trị' },
  { id: 109, date: '2025-05-15', time: '01:30 PM', patient: 'William Jones', patientId: 'P1009', age: 55, 
    type: 'Khám định kỳ', status: 'pending', symptoms: 'Ho dai dẳng', notes: 'Đánh giá nhiễm trùng cơ hội' },
  { id: 110, date: '2025-05-15', time: '03:00 PM', patient: 'Daniel Garcia', patientId: 'P1010', age: 44, 
    type: 'Tái khám', status: 'completed', symptoms: 'Mệt mỏi', notes: 'Theo dõi điều trị' },
  { id: 111, date: '2025-05-19', time: '09:00 AM', patient: 'Maria Rodriguez', patientId: 'P1011', age: 32, 
    type: 'Khám thai', status: 'pending', symptoms: 'Không có', notes: 'Quản lý HIV trong thời kỳ mang thai' },
  { id: 112, date: '2025-05-19', time: '11:30 AM', patient: 'Thomas Anderson', patientId: 'P1012', age: 47, 
    type: 'Kết quả xét nghiệm', status: 'pending', symptoms: 'Không có', notes: 'Theo dõi cải thiện chỉ số CD4' },
  { id: 113, date: '2025-05-21', time: '02:30 PM', patient: 'Patricia Moore', patientId: 'P1013', age: 39, 
    type: 'Tư vấn', status: 'pending', symptoms: 'Đau đầu, vấn đề về thị lực', notes: 'Đánh giá các vấn đề thần kinh' },
  { id: 114, date: '2025-05-22', time: '10:15 AM', patient: 'James Williams', patientId: 'P1014', age: 51, 
    type: 'Điều chỉnh điều trị', status: 'pending', symptoms: 'Buồn nôn với thuốc hiện tại', notes: 'Xem xét phác đồ thay thế' },
  { id: 115, date: '2025-05-22', time: '01:45 PM', patient: 'Linda Martinez', patientId: 'P1015', age: 34, 
    type: 'Tái khám', status: 'pending', symptoms: 'Không có', notes: 'Theo dõi đáp ứng điều trị' }
];

// Biểu tượng cho các loại lịch hẹn để hiển thị tốt hơn
const appointmentTypeIcons = {
  'Khám định kỳ': faStethoscope,
  'Tái khám': faCalendarCheck,
  'Kết quả xét nghiệm': faVial,
  'Tư vấn ban đầu': faUserMd,
  'Kế hoạch điều trị': faNotesMedical,
  'Đánh giá thuốc': faPrescriptionBottleAlt,
  'Tư vấn': faUserFriends,
  'Khám thai': faBaby,
  'Điều chỉnh điều trị': faSlidersH,
  'Tư vấn': faClipboardList
};

// Tạo các ngày trong lịch
const generateCalendarDays = (year, month, appointments) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  let days = [];
  
  // Thêm ô trống cho các ngày trước ngày đầu tiên của tháng
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: '', date: null });
  }
  
  // Thêm các ngày trong tháng
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
  const [currentMonth, setCurrentMonth] = useState(4);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState('2025-05-28');
  const [todayDate, setTodayDate] = useState('2025-05-28');
  const [appointments, setAppointments] = useState(initialAppointments);
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
      specialty: 'Chuyên gia điều trị HIV',
      signature: 'J. Doe, MD',
      date: ''
    }
  });
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [showARVTool, setShowARVTool] = useState(false);
  const [selectedAppointmentForARV, setSelectedAppointmentForARV] = useState(null);
  
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  const days = generateCalendarDays(currentYear, currentMonth, appointments);
  const selectedDateAppointments = appointments.filter(a => a.date === selectedDate);
  
  // Xử lý điều hướng
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
    setSelectedDate('2025-05-28'); // Ngày "hôm nay" giả định
    setCurrentMonth(4); // Tháng 5
    setCurrentYear(2025);
  };
  
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Modify handleViewPdf to use base64 data
  const handleViewPdf = (pdfFile) => {
    if (pdfFile && pdfFile.data) {
      setCurrentPdfUrl(pdfFile.data);
      setShowPdfViewer(true);
    }
  };

  // Modify handleClosePdfViewer to not revoke URL
  const handleClosePdfViewer = () => {
    setCurrentPdfUrl(null);
    setShowPdfViewer(false);
  };

  // Add function to save form progress
  const handleSaveFormProgress = (report) => {
    if (selectedAppointment) {
      localStorage.setItem(`appointment_${selectedAppointment.id}_progress`, JSON.stringify(report));
    }
  };

  // Add function to load form progress
  const handleLoadFormProgress = (appointment) => {
    const savedProgress = localStorage.getItem(`appointment_${appointment.id}_progress`);
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        // Ensure recommendations is an array
        if (!Array.isArray(parsedProgress.recommendations)) {
          parsedProgress.recommendations = ['', '', '', ''];
        }
        return parsedProgress;
      } catch (error) {
        console.error('Error parsing saved progress:', error);
        return null;
      }
    }
    return null;
  };

  // Add back handleReportChange function
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

  // Modify existing handleShowReportModal
  const handleShowReportModal = (appointment) => {
    setSelectedAppointment(appointment);
    
    // Try to load saved progress first
    const savedProgress = handleLoadFormProgress(appointment);
    if (savedProgress) {
      setMedicalReport(savedProgress);
    } else {
      // If no saved progress, initialize with default values
      let initialReport;
      if (appointment.status === 'completed') {
        initialReport = {
          patientInfo: {
            name: appointment.patient,
            dob: "1985-06-12",
            gender: "Nam",
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
            cd4Count: `${Math.floor(Math.random() * 300) + 400} tế bào/mm³`,
            viralLoad: 'Không phát hiện (<20 bản sao/mL)',
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
              dosage: '1 viên',
              frequency: 'Ngày 1 lần',
              status: 'Tiếp tục'
            },
            {
              name: 'Đa vitamin',
              dosage: '1 viên',
              frequency: 'Ngày 1 lần',
              status: 'Mới'
            }
          ],
          assessment: generateAssessment(appointment),
          plan: 'Tiếp tục liệu pháp kháng virus hiện tại. Tái khám sau 3 tháng với xét nghiệm CD4 và tải lượng virus. Khuyến khích thực hành tình dục an toàn.',
          recommendations: [
            'Duy trì chế độ ăn uống lành mạnh và tập thể dục thường xuyên',
            'Tránh uống rượu bia',
            'Quay lại tái khám sau 3 tháng',
            'Gọi ngay nếu có bất kỳ triệu chứng đáng lo ngại nào'
          ],
          arvResultFile: {
            name: `Báo_cáo_ARV_${appointment.patientId}.pdf`,
            size: '1.2 MB',
            date: appointment.date
          },
          doctorInfo: {
            name: 'Dr. John Doe',
            specialty: 'Chuyên gia điều trị HIV',
            signature: 'J. Doe, MD',
            date: appointment.date
          }
        };
      } else {
        initialReport = {
          patientInfo: {
            name: appointment.patient,
            dob: "1985-06-12",
            gender: "Nam",
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
              status: 'Mới'
            }
          ],
          assessment: '',
          plan: '',
          recommendations: ['', '', '', ''],
          arvResultFile: null,
          doctorInfo: {
            name: 'Dr. John Doe',
            specialty: 'Chuyên gia điều trị HIV',
            signature: 'J. Doe, MD',
            date: new Date().toISOString().split('T')[0]
          }
        };
      }
      setMedicalReport(initialReport);
    }
    
    setShowReportModal(true);
  };
  
  // Hàm trợ giúp để tạo nội dung đánh giá dựa trên loại lịch hẹn
  const generateAssessment = (appointment) => {
    const assessments = {
      'Khám định kỳ': 'Bệnh nhân ổn định về mặt lâm sàng. Chỉ số CD4 đã cải thiện so với lần khám trước. Tải lượng virus vẫn không phát hiện được. Không có tác dụng phụ đáng kể từ phác đồ kháng virus hiện tại. Bệnh nhân báo cáo tuân thủ tốt với thuốc.',
      'Tái khám': 'Bệnh nhân tiếp tục phản ứng tốt với liệu pháp kháng virus hiện tại. Tất cả các giá trị xét nghiệm đều trong giới hạn bình thường. Bệnh nhân không báo cáo triệu chứng hay lo ngại mới.',
      'Kết quả xét nghiệm': 'Chỉ số CD4 và tải lượng virus cho thấy đáp ứng điều trị rất tốt. Bệnh nhân đã duy trì ức chế virus hơn 12 tháng. Không có dấu hiệu thất bại điều trị hoặc kháng thuốc.',
      'Kế hoạch điều trị': 'Bệnh nhân đã bắt đầu liệu pháp kháng virus thành công. Dung nạp thuốc tốt với tác dụng phụ tối thiểu. Đáp ứng xét nghiệm ban đầu khả quan.',
      'Đánh giá thuốc': 'Phác đồ thuốc hiện tại có hiệu quả mà không có tác dụng phụ đáng kể. Bệnh nhân hiểu tầm quan trọng của việc tuân thủ và báo cáo đã uống thuốc theo chỉ định.',
      'Tư vấn': 'Đã hoàn thành đánh giá toàn diện. Bệnh nhân có nhiễm HIV được kiểm soát với phác đồ hiện tại. Không phát hiện nhiễm trùng cơ hội hoặc biến chứng liên quan đến HIV.'
    };
    
    return assessments[appointment.type] || 'Bệnh nhân ổn định về mặt lâm sàng với đáp ứng virus học và miễn dịch tốt đối với liệu pháp kháng virus hiện tại.';
  };
  
  // Modify existing handleCloseReportModal
  const handleCloseReportModal = () => {
    handleSaveFormProgress(medicalReport);
    setShowReportModal(false);
    setSelectedAppointment(null);
  };
  
  // Modify existing handleSaveReport
  const handleSaveReport = () => {
    // Ở đây có thể xử lý việc lưu báo cáo vào cơ sở dữ liệu
    console.log('Đang lưu báo cáo y tế:', medicalReport);
    
    // Cập nhật trạng thái của lịch hẹn thành đã hoàn thành
    const updatedAppointments = appointments.map(apt => {
      if (apt.id === selectedAppointment.id) {
        return {...apt, status: 'completed'};
      }
      return apt;
    });
    
    // Clear saved progress after successful save
    if (selectedAppointment) {
      localStorage.removeItem(`appointment_${selectedAppointment.id}_progress`);
    }
    
    handleCloseReportModal();
  };

  // Hàm chuyển trạng thái lịch hẹn từ đang chờ sang hoàn thành
  const handleCompleteAppointment = (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    // Kiểm tra xem đã có đánh giá và thuốc chưa
    const hasAssessment = medicalReport.assessment && medicalReport.assessment.trim() !== '';
    const hasMedications = medicalReport.medications && medicalReport.medications.length > 0 && 
                          medicalReport.medications.some(med => med.name.trim() !== '');

    if (!hasAssessment || !hasMedications) {
      alert('Vui lòng thêm đánh giá và thuốc trước khi hoàn thành lịch hẹn');
      return;
    }

    setAppointments(prevAppointments => {
      const updatedAppointments = prevAppointments.map(apt => {
        if (apt.id === appointmentId) {
          return { ...apt, status: 'completed' };
        }
        return apt;
      });
      return updatedAppointments;
    });
  };

  // Lọc lịch hẹn đã hoàn thành cho ngày được chọn
  const getCompletedAppointmentsForDate = (date) => {
    return appointments.filter(apt => apt.date === date && apt.status === 'completed');
  };

  // Modify to only get pending appointments for the selected date
  const getPendingAppointmentsForDate = (date) => {
    return appointments.filter(apt => apt.date === date && apt.status === 'pending');
  };

  // Add back ARV tool related functions
  const handleOpenARVTool = (appointment) => {
    setSelectedAppointmentForARV(appointment);
    setShowARVTool(true);
  };

  const handleCloseARVTool = () => {
    setShowARVTool(false);
    setSelectedAppointmentForARV(null);
  };

  const handleARVResult = (result) => {
    if (selectedAppointmentForARV) {
      setMedicalReport(prev => ({
        ...prev,
        arvResultFile: result
      }));
    }
    handleCloseARVTool();
  };

  return (
    <div className="doctor-dashboard">
      <Container fluid>
        <Row>
          <DoctorSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            appointmentsCount={appointments.length}
          />
          
          <Col md={9} lg={10} className="main-content">
            <div className="content-header">
              <h2>Lịch hẹn</h2>
              <p>Quản lý lịch hẹn bệnh nhân</p>
            </div>
            
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
                      Hôm nay
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
              
              <Col lg={4}>
                <Card className="daily-schedule-card">
                  <Card.Header>
                    <h5 className="mb-0">
                      Lịch hẹn ngày {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {getPendingAppointmentsForDate(selectedDate).length > 0 ? (
                      <div className="appointment-list">
                        {getPendingAppointmentsForDate(selectedDate).map(appointment => (
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
                                  <small className="text-muted ms-2">(ID: {appointment.patientId}, Tuổi: {appointment.age})</small>
                                )}
                              </div>
                              <div className="appointment-type">{appointment.type}</div>
                              {appointment.symptoms && (
                                <div className="appointment-symptoms">
                                  <small>Triệu chứng: {appointment.symptoms}</small>
                                </div>
                              )}
                              {appointment.notes && (
                                <div className="appointment-notes">
                                  <small className="text-muted">Ghi chú: {appointment.notes}</small>
                                </div>
                              )}
                            </div>
                            <div className="appointment-status">
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="action-btn"
                                onClick={() => handleCompleteAppointment(appointment.id)}
                              >
                                <FontAwesomeIcon icon={faCheck} className="me-1" />
                                Hoàn thành
                              </Button>
                            </div>
                            
                            <div className="examination-form mt-3">
                              <h6 className="form-label">Kết quả khám</h6>
                              <Form>
                                <Form.Group className="mb-2">
                                  <Form.Control as="textarea" rows={2} placeholder="Quan sát lâm sàng" />
                                </Form.Group>
                                <Row>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Control type="text" placeholder="Chỉ số CD4" />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Control type="text" placeholder="Tải lượng virus" />
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Form.Group className="mb-2">
                                  <Form.Control as="textarea" rows={2} placeholder="Khuyến nghị điều trị" />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                  <Button variant="primary" size="sm">
                                    Lưu vào hồ sơ y tế
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
                                Chi tiết
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
                          <p>Không có lịch hẹn nào trong ngày này</p>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Card className="mt-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lịch hẹn đã hoàn thành hôm nay</h5>
                <Button variant="outline-primary" size="sm">
                  Xem tất cả
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table appointment-table">
                    <thead>
                      <tr>
                        <th>Ngày và giờ</th>
                        <th>Bệnh nhân</th>
                        <th>Loại khám</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCompletedAppointmentsForDate(selectedDate).map(appointment => (
                        <tr key={appointment.id}>
                          <td>{appointment.time}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <span>{appointment.patient}</span>
                              <small className="text-muted">ID: {appointment.patientId}</small>
                            </div>
                          </td>
                          <td>{appointment.type}</td>
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
            
            <MedicalReportModal
              show={showReportModal}
              onHide={handleCloseReportModal}
              report={medicalReport}
              onChange={handleReportChange}
              onSave={handleSaveReport}
              appointment={selectedAppointment}
              readOnly={selectedAppointment?.status === 'completed'}
              onOpenARVTool={handleOpenARVTool}
              onViewPdf={handleViewPdf}
            />
          </Col>
        </Row>
      </Container>

      {/* Add back ARV Tool Modal */}
      <Modal 
        show={showARVTool} 
        onHide={handleCloseARVTool} 
        size="xl" 
        centered
        fullscreen
        className="arv-tool-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Công cụ lựa chọn ARV
            {selectedAppointmentForARV && (
              <div className="text-muted fs-6">
                Bệnh nhân: {selectedAppointmentForARV.patient} - {selectedAppointmentForARV.date} {selectedAppointmentForARV.time}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <ARVSelectionTool 
            onSelect={handleARVResult}
            appointment={selectedAppointmentForARV}
          />
        </Modal.Body>
      </Modal>

      {/* Keep PDF Viewer Modal */}
      <Modal 
        show={showPdfViewer} 
        onHide={handleClosePdfViewer}
        size="xl"
        centered
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Xem Báo Cáo ARV</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {currentPdfUrl && (
            <iframe
              src={`${currentPdfUrl}#toolbar=0&navpanes=0`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="PDF Viewer"
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Modify MedicalReportModal component to include ARV tool functionality
const MedicalReportModal = ({ show, onHide, report, onChange, onSave, appointment, readOnly, onOpenARVTool, onViewPdf }) => {
  // Add data validation
  const validateReport = (report) => {
    // Ensure recommendations is always an array
    if (!Array.isArray(report.recommendations)) {
      report.recommendations = ['', '', '', ''];
    }
    return report;
  };

  // Validate report when component mounts or report changes
  useEffect(() => {
    if (report) {
      validateReport(report);
    }
  }, [report]);

  // Add function to handle recommendation changes
  const handleRecommendationChange = (index, value) => {
    const newRecommendations = [...(report.recommendations || ['', '', '', ''])];
    newRecommendations[index] = value;
    onChange('recommendations', newRecommendations);
  };

  // Thêm một thuốc vào danh sách
  const handleAddMedicine = () => {
    const newMedications = [...report.medications, {
      name: '',
      dosage: '',
      frequency: '',
      status: 'Mới'
    }];
    onChange('medications', newMedications);
  };

  // Xóa một thuốc khỏi danh sách
  const handleRemoveMedicine = (index) => {
    const newMedications = [...report.medications];
    newMedications.splice(index, 1);
    onChange('medications', newMedications);
  };

  // Cập nhật thông tin thuốc
  const handleMedicineChange = (index, field, value) => {
    const newMedications = [...report.medications];
    newMedications[index][field] = value;
    onChange('medications', newMedications);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {readOnly ? 'Xem báo cáo y tế' : 'Tạo báo cáo y tế'}
          <div className="text-muted fs-6">
            {appointment?.patient} - {appointment?.date} {appointment?.time}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 py-3">
        <div className="medical-report-form">
          {/* Phần thông tin bệnh nhân */}
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white py-2">
              <FontAwesomeIcon icon={faUserMd} className="me-2" />
              Thông tin bệnh nhân
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID bệnh nhân</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.patientId || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên bệnh nhân</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.name || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.dob || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giới tính</Form.Label>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Chỉ số CD4</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 650 tế bào/mm³" 
                      value={report.labResults.cd4Count || ''}
                      onChange={(e) => onChange('labResults.cd4Count', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tải lượng virus</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: < 20 bản sao/mL" 
                      value={report.labResults.viralLoad || ''}
                      onChange={(e) => onChange('labResults.viralLoad', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Huyết học</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hemoglobin</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 14.2 g/dL" 
                      value={report.labResults.hematology.hgb || ''}
                      onChange={(e) => onChange('labResults.hematology.hgb', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bạch cầu</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 5.6 × 10³/μL" 
                      value={report.labResults.hematology.wbc || ''}
                      onChange={(e) => onChange('labResults.hematology.wbc', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiểu cầu</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 235 × 10³/μL" 
                      value={report.labResults.hematology.platelets || ''}
                      onChange={(e) => onChange('labResults.hematology.platelets', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Sinh hóa</h6>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Đường huyết</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 95 mg/dL" 
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
                      placeholder="vd: 0.9 mg/dL" 
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
                      placeholder="vd: 25 U/L" 
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
                      placeholder="vd: 28 U/L" 
                      value={report.labResults.chemistry.ast || ''}
                      onChange={(e) => onChange('labResults.chemistry.ast', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Chỉ số mỡ máu</h6>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cholesterol toàn phần</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 185 mg/dL" 
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
                      placeholder="vd: 110 mg/dL" 
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
                      placeholder="vd: 45 mg/dL" 
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
                      placeholder="vd: 150 mg/dL" 
                      value={report.labResults.lipidPanel.triglycerides || ''}
                      onChange={(e) => onChange('labResults.lipidPanel.triglycerides', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Công cụ lựa chọn ARV */}
          <Card className="mb-3">
            <Card.Header className="bg-danger text-white py-2">
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              Công cụ lựa chọn ARV
            </Card.Header>
            <Card.Body>
              {!report.arvResultFile ? (
                <Button 
                  variant="outline-primary" 
                  onClick={() => onOpenARVTool(appointment)}
                  className="mb-3"
                >
                  <FontAwesomeIcon icon={faSlidersH} className="me-2" />
                  Mở công cụ lựa chọn ARV
                </Button>
              ) : (
                <div className="arv-file-management">
                  <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                    <span className="me-3">{report.arvResultFile.name}</span>
                    <div className="btn-group">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => onViewPdf(report.arvResultFile)}
                      >
                        <FontAwesomeIcon icon={faEye} className="me-1" />
                        Xem
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Bạn có chắc muốn xóa báo cáo ARV này?')) {
                            onChange('arvResultFile', null);
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Phần thuốc */}
          <Card className="mb-3">
            <Card.Header className="bg-success text-white py-2">
              <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
              Thuốc
            </Card.Header>
            <Card.Body>
              {report.medications.map((medication, index) => (
                <Row key={index} className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Tên thuốc</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="vd: Biktarvy" 
                        value={medication.name || ''}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Liều lượng</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="vd: 1 viên" 
                        value={medication.dosage || ''}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Tần suất</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="vd: Ngày 1 lần" 
                        value={medication.frequency || ''}
                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        readOnly={readOnly}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Trạng thái</Form.Label>
                      <Form.Select 
                        value={medication.status || 'Mới'}
                        onChange={(e) => handleMedicineChange(index, 'status', e.target.value)}
                        disabled={readOnly}
                      >
                        <option value="Mới">Mới</option>
                        <option value="Tiếp tục">Tiếp tục</option>
                        <option value="Đã thay đổi">Đã thay đổi</option>
                        <option value="Đã ngừng">Đã ngừng</option>
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
                  Thêm thuốc
                </Button>
              )}
            </Card.Body>
          </Card>

          {/* Đánh giá & kế hoạch */}
          <Card className="mb-3">
            <Card.Header className="bg-secondary text-white py-2">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Đánh giá & Kế hoạch
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Đánh giá</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Nhập đánh giá bệnh nhân" 
                  value={report.assessment || ''}
                  onChange={(e) => onChange('assessment', e.target.value)}
                  readOnly={readOnly}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Kế hoạch</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Nhập kế hoạch điều trị" 
                  value={report.plan || ''}
                  onChange={(e) => onChange('plan', e.target.value)}
                  readOnly={readOnly}
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Khuyến nghị</Form.Label>
                {(report.recommendations || ['', '', '', '']).map((rec, index) => (
                  <Form.Control 
                    key={index}
                    type="text" 
                    className="mb-2"
                    placeholder={`Khuyến nghị ${index + 1}`} 
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
          Đóng
        </Button>
        {!readOnly && (
          <Button variant="primary" onClick={onSave}>
            Lưu báo cáo y tế
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export { MedicalReportModal };
export default DoctorAppointments;