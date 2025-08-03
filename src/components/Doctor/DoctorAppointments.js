import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faCalendarCheck, faUserMd,
  faClipboardList, faCog, faSignOutAlt, faUsers, faFileAlt,
  faCalendarAlt, faCheckCircle, faExclamationTriangle, faFilter,
  faChevronLeft, faChevronRight, faSearch, faPlus, faTimes, faCheck, faClock,
  faNotesMedical, faVial, faPrescriptionBottleAlt,
  faStethoscope, faUserFriends, faBaby, faSlidersH, faHeartbeat, 
  faUpload, faFilePdf, faEye, faEdit, faTrash, faPills, faSave, faInfoCircle, faVideo,
  faComments, faDownload
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';
import ARVSelectionTool from './ARVSelectionTool';
import MedicineSelector from './MedicineSelector';
import MedicalReportModal from './MedicalReportModal';
import AppointmentDetailModal from './AppointmentDetailModal';
import { useServiceData } from '../../hooks/useServiceData';
// import VideoCall from '../VideoCall/videoCall'; // No longer needed
import { appointmentAPI, userAPI, medicalResultAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

// Initial state for medical report
const initialMedicalReportState = {
  medicalResultId: '',
  doctorId: '',
  userId: '',
  appointmentId: '',
  patientInfo: {
    name: '',
    customerId: ''
  },
  weight: '',
  height: '',
  bmi: '',
  temperature: '',
  bloodPressure: '',
  heartRate: '',
  cd4Count: '',
  viralLoad: '',
  hemoglobin: '',
  whiteBloodCell: '',
  platelets: '',
  glucose: '',
  creatinine: '',
  alt: '',
  ast: '',
  totalCholesterol: '',
  ldl: '',  hdl: '',
  trigilycerides: '',
  patientProgressEvaluation: '',
  plan: '',
  recommendation: '',
  arvRegimenResultURL: '',
  arvFile: null, // For storing ARV PDF file object
  medicalResultMedicines: [],
  visitDate: ''
};

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
    // Tạo dateStr theo format YYYY-MM-DD để tránh lỗi timezone
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Filter appointments for this date - bao gồm cả ACCEPTED và COMPLETED
    const dayAppointments = appointments.filter(a => {
      const matchesDate = a.date === dateStr || a.appointmentDate === dateStr;
      const isAcceptedOrCompleted = 
        a.status === 'accepted' || a.status === 'ACCEPTED' ||
        a.status === 'completed' || a.status === 'COMPLETED';
      return matchesDate && isAcceptedOrCompleted;
    });
    
    // Phân loại appointments theo trạng thái
    const acceptedAppts = dayAppointments.filter(a => 
      a.status === 'accepted' || a.status === 'ACCEPTED'
    );
    const completedAppts = dayAppointments.filter(a => 
      a.status === 'completed' || a.status === 'COMPLETED'
    );
    
    days.push({
      day,
      date: dateStr,
      appointments: dayAppointments,
      acceptedAppointments: acceptedAppts,
      completedAppointments: completedAppts,
      hasAppointments: dayAppointments.length > 0
    });
  }
  
  return days;
};

// Hàm mapping service ID thành tên dịch vụ (được thay thế bằng API)
const getServiceDisplay = (appointment, getServiceNameById) => {
  // Ưu tiên tên service có sẵn
  if (appointment?.appointmentService) {
    return appointment.appointmentService;
  }

  // Tìm serviceId từ nhiều trường khác nhau có thể có trong appointment
  let serviceId = appointment?.serviceId || 
                  appointment?.service?.id || 
                  appointment?.service?.serviceId;
  
  // Sử dụng API data thay vì hardcode
  if (serviceId && getServiceNameById) {
    return getServiceNameById(serviceId);
  }
  
  // Fallback cuối cùng
  return appointment?.appointmentType || 'Dịch vụ không xác định';
};

// Hàm mapping appointment type thành tiếng Việt
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

const DoctorAppointments = () => {
  const { user } = useAuth();
  const { getServiceNameById, loading: servicesLoading } = useServiceData();
  const [activeTab, setActiveTab] = useState('appointments');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicalReport, setMedicalReport] = useState(initialMedicalReportState);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [showMedicineSelector, setShowMedicineSelector] = useState(false);
  
  // State cho AppointmentDetailModal
  const [showAppointmentDetailModal, setShowAppointmentDetailModal] = useState(false);
  const [appointmentDetailData, setAppointmentDetailData] = useState(null);
  
  // Video call states - No longer needed
  // const [showVideoCall, setShowVideoCall] = useState(false);
  // const [videoCallAppointment, setVideoCallAppointment] = useState(null);
  const [loadingAppointmentDetail, setLoadingAppointmentDetail] = useState(false);
  
  // Video Call Log states
  const [showVideoCallLogModal, setShowVideoCallLogModal] = useState(false);
  const [videoCallLogData, setVideoCallLogData] = useState(null);
  const [loadingVideoCallLog, setLoadingVideoCallLog] = useState(false);
  
  // State cho modal xác nhận
  const [showCreateReportConfirmModal, setShowCreateReportConfirmModal] = useState(false);
  const [showCompleteAppointmentConfirmModal, setShowCompleteAppointmentConfirmModal] = useState(false);
  const [showSaveReportConfirmModal, setShowSaveReportConfirmModal] = useState(false);
  const [showNoLogModal, setShowNoLogModal] = useState(false);
  const [pendingActionAppointment, setPendingActionAppointment] = useState(null);
    // Load appointments từ API khi component mount
  useEffect(() => {
    loadDoctorAppointments();
  }, []); // Không phụ thuộc vào user nữa  // Load lịch hẹn của bác sĩ từ API
  const loadDoctorAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Lấy user từ AuthContext hoặc localStorage
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Loading doctor appointments for user:', currentUser);
      
      // Gọi API getAcceptedAppointmentsForDoctor (dành cho doctor)
      const result = await appointmentAPI.getAcceptedAppointmentsForDoctor();
      
      if (result.success) {
        // Lấy chi tiết từng appointment để có đầy đủ thông tin
        const appointmentList = result.data || [];
        const detailedAppointments = [];
        
        // Load chi tiết từng appointment
        for (const appointment of appointmentList) {
          try {
            const detailResult = await appointmentAPI.getAppointmentById(appointment.id);
            
            if (detailResult.success && detailResult.data) {
              const detailedAppt = detailResult.data;
              
              // Mapping serviceId từ appointmentType nếu không có serviceId
              let serviceId = detailedAppt?.serviceId || appointment?.serviceId;
              
              // Tên bệnh nhân từ alternativeName (ưu tiên từ chi tiết), fallback về ID
              const patientName = formatPatientName(detailedAppt);
              
              // Tên dịch vụ từ appointmentService (ưu tiên từ chi tiết)
              const serviceName = detailedAppt.appointmentService || getServiceDisplay({ serviceId, appointmentType: detailedAppt.appointmentType }, getServiceNameById);
              
              // Debug các trường quan trọng - chỉ trong dev mode
              if (process.env.NODE_ENV === 'development') {
                console.log(`Final appointment details:`, {
                  serviceId,
                  serviceName,
                  alternativeName: detailedAppt.alternativeName,
                  userId: detailedAppt.userId,
                  reason: detailedAppt.reason,
                  note: detailedAppt.notes || detailedAppt.note,
                  appointmentType: detailedAppt.appointmentType,
                  slotStartTime: detailedAppt.slotStartTime,
                  slotEndTime: detailedAppt.slotEndTime,
                  appointmentService: detailedAppt.appointmentService,
                  consultationType: detailedAppt.consultationType // Thêm log cho consultationType
                });
              }
              
              detailedAppointments.push({
                ...detailedAppt, // Giữ nguyên TẤT CẢ các field từ API chi tiết
                // Convert format để compatible với component hiện tại
                date: detailedAppt.appointmentDate || appointment.appointmentDate,
                type: detailedAppt.appointmentType || appointment.appointmentType || 'Khám bệnh',
                status: (detailedAppt.status || appointment.status).toLowerCase(),
                originalStatus: detailedAppt.status || appointment.status,
                symptoms: detailedAppt.reason || appointment.reason || 'Không có triệu chứng',
                notes: detailedAppt.notes || detailedAppt.note || appointment.notes || appointment.note || 'Chưa có ghi chú',
                // Sử dụng dữ liệu từ API chi tiết
                alternativeName: patientName,
                serviceName: serviceName, // Tên dịch vụ đã được xác định
                reason: detailedAppt.reason || appointment.reason,
                note: detailedAppt.notes || detailedAppt.note || appointment.notes || appointment.note,
                serviceId: serviceId,
                service: detailedAppt.service || appointment.service,
                appointmentType: detailedAppt.appointmentType || appointment.appointmentType,
                userId: detailedAppt.userId || appointment.userId,
                appointmentService: detailedAppt.appointmentService, // Tên dịch vụ từ API
                consultationType: detailedAppt.consultationType || appointment.consultationType, // Thêm consultationType
                isAnonymous: detailedAppt.isAnonymous !== undefined ? detailedAppt.isAnonymous : appointment.isAnonymous, // Đảm bảo isAnonymous được giữ nguyên
                isOnline: detailedAppt.isOnline !== undefined ? detailedAppt.isOnline : appointment.isOnline, // Đảm bảo isOnline được giữ nguyên
                detailsLoaded: true
              });
            } else {
              // Nếu không lấy được chi tiết, sử dụng dữ liệu cơ bản
              console.warn('Could not get details for appointment:', appointment.id, 'using basic data');
              
              // Mapping serviceId từ appointmentType
              let serviceId = appointment?.serviceId;
              
              const patientName = formatPatientName(appointment);
              const serviceName = getServiceDisplay({ serviceId, appointmentType: appointment.appointmentType }, getServiceNameById);
              
              detailedAppointments.push({
                ...appointment,
                date: appointment.appointmentDate,
                type: appointment.appointmentType || 'Khám bệnh',
                status: appointment.status.toLowerCase(),
                originalStatus: appointment.status,
                symptoms: appointment.reason || 'Không có triệu chứng',
                notes: appointment.notes || appointment.note || 'Chưa có ghi chú',
                alternativeName: patientName,
                serviceName: serviceName,
                reason: appointment.reason,
                note: appointment.notes || appointment.note,
                serviceId: serviceId,
                service: appointment.service,
                appointmentType: appointment.appointmentType,
                userId: appointment.userId,
                consultationType: appointment.consultationType, // Thêm consultationType
                isAnonymous: appointment.isAnonymous, // Giữ nguyên isAnonymous từ API
                detailsLoaded: false
              });
            }
          } catch (detailError) {
            console.error('Error getting appointment details:', detailError);
            // Nếu lỗi, vẫn thêm appointment với dữ liệu cơ bản
                          const patientName = formatPatientName(appointment);
            let serviceId = appointment?.serviceId;
            const serviceName = getServiceDisplay({ serviceId, appointmentType: appointment.appointmentType }, getServiceNameById);
            
            detailedAppointments.push({
              ...appointment,
              date: appointment.appointmentDate,
              type: appointment.appointmentType || 'Khám bệnh',
              status: appointment.status.toLowerCase(),
              originalStatus: appointment.status,
              symptoms: appointment.reason || 'Không có triệu chứng',
              notes: appointment.notes || appointment.note || 'Chưa có ghi chú',
              alternativeName: patientName,
              serviceName: serviceName,
              reason: appointment.reason,
              note: appointment.notes || appointment.note,
              serviceId: serviceId,
              service: appointment.service,
              appointmentType: appointment.appointmentType,
              userId: appointment.userId,
              consultationType: appointment.consultationType, // Thêm consultationType
              isAnonymous: appointment.isAnonymous, // Giữ nguyên isAnonymous từ API
              detailsLoaded: false
            });
          }
        }
        
        setAppointments(detailedAppointments);
        console.log('Final detailed appointments:', detailedAppointments);
        
      } else {
        console.error('Failed to load appointments:', result.message);
        setError(result.message || 'Không thể tải danh sách lịch hẹn');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading doctor appointments:', error);
      setError('Đã xảy ra lỗi khi tải danh sách lịch hẹn');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  
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
  // Add back handleReportChange function with BMI auto-calculation
  const handleReportChange = (field, value) => {
    console.log(`🔄 Report field change: ${field} =`, value);
    
    // Special handling for ARV file from ARV Selection Tool
    if (field === 'arvResultFile' && value) {
      console.log('📎 ARV File received:', {
        name: value.name,
        type: value.type,
        size: value.size,
        hasData: !!value.data,
        hasMetadata: !!value.arvMetadata
      });
      
      setMedicalReport(prevReport => ({
        ...prevReport,
        arvFile: value, // Store the file object for API upload
        arvRegimenResultURL: value.name || 'arv-selection-result.pdf', // Store filename for display
        arvMetadata: value.arvMetadata || null // Store ARV metadata for later PDF recreation
      }));
      return;
    }
    
    setMedicalReport(prevReport => {
      let newReport = {...prevReport};
      
      // Xử lý các trường lồng nhau (nested fields)
      if (field.includes('.')) {
        const fields = field.split('.');
        let current = newReport;
        
        for (let i = 0; i < fields.length - 1; i++) {
          current = current[fields[i]];
        }
        
        current[fields[fields.length - 1]] = value;
      } else {
        // Xử lý trường đơn
        newReport[field] = value;
      }
      
      // Auto-calculate BMI when weight or height changes
      if (field === 'weight' || field === 'height') {
        const weight = parseFloat(field === 'weight' ? value : newReport.weight);
        const height = parseFloat(field === 'height' ? value : newReport.height);
        
        if (weight > 0 && height > 0) {
          // Convert height from cm to meters and calculate BMI
          const heightInMeters = height / 100;
          const bmi = weight / (heightInMeters * heightInMeters);
          newReport.bmi = bmi.toFixed(1); // Round to 1 decimal place
          console.log(`🧮 Auto-calculated BMI: ${newReport.bmi} (weight: ${weight}kg, height: ${height}cm)`);
        } else if (field === 'weight' && (!value || value === '')) {
          // Clear BMI if weight is cleared
          newReport.bmi = '';
        } else if (field === 'height' && (!value || value === '')) {
          // Clear BMI if height is cleared
          newReport.bmi = '';
        }
      }
      
      return newReport;
    });
  };
  // Hàm xử lý thay đổi thông tin thuốc
  const handleMedicineChange = (index, field, value) => {
    setMedicalReport(prevReport => {
      const newMedicines = [...(prevReport.medicalResultMedicines || [])];
      if (newMedicines[index]) {
        let processedValue = value;
        if(field === 'amount'){
          processedValue = value ? parseInt(value) : 0; // Chuyển đổi sang số nguyên
        }
        newMedicines[index] = {
          ...newMedicines[index],
          [field]: processedValue
        };
      }
      return {
        ...prevReport,
        medicalResultMedicines: newMedicines
      };
    });
  };

  // Hàm thêm thuốc mới từ MedicineSelector
  const handleAddMedicine = (newMedicine) => {
      const formattedMedicine = {
        medicineId: newMedicine.medicineId || '',
        name: newMedicine.name || '',
        dosage: newMedicine.dosage || '',
        amount: newMedicine.amount || 0,
        note: newMedicine.note || ''
      }
    setMedicalReport(prevReport => {

      return {
        ...prevReport,
        medicalResultMedicines: [...(prevReport.medicalResultMedicines || []), formattedMedicine]
      };
    });
  };

  // Hàm xóa thuốc
  const handleRemoveMedicine = (index) => {
    setMedicalReport(prevReport => {
      const newMedicines = [...(prevReport.medicalResultMedicines || [])];
      newMedicines.splice(index, 1);
      return {
        ...prevReport,
        medicalResultMedicines: newMedicines
      };
    });
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
    setShowReportModal(false);
    setSelectedAppointment(null);
    setMedicalReport(initialMedicalReportState);
  };

  const handleViewPdf = (pdfFile) => {
    if (pdfFile && pdfFile.data) {
      const byteCharacters = atob(pdfFile.data);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url);
    }
  };  // Helper function to get doctor ID from token
  const getDoctorIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const tokenPayload = jwtDecode(token);
      return tokenPayload?.sub || tokenPayload?.userId || tokenPayload?.id;
    } catch (error) {
      console.error('Error extracting doctorId from token:', error);
      return null;
    }
  };

  // Debug function to test token independently
  const testTokenAndRole = () => {
    console.log('=== INDEPENDENT TOKEN TEST ===');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found');
      alert('❌ Không tìm thấy token trong localStorage');
      return;
    }
    
    try {
      const payload = jwtDecode(token);
      console.log('🔍 Token Payload:', JSON.stringify(payload, null, 2));
      
      // Check all possible role fields
      const roleFields = {
        roles: payload.roles,
        authorities: payload.authorities,
        role: payload.role,
        auth: payload.auth,
        scopes: payload.scopes,
        scope: payload.scope,
        userType: payload.userType,
        user_type: payload.user_type,
        userRole: payload.userRole,
        user_role: payload.user_role
      };
      
      console.log('🔑 All possible role fields:', roleFields);
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      const exp = payload.exp;
      const isExpired = exp && exp < now;
      
      console.log('⏰ Expiration check:', {
        exp: exp ? new Date(exp * 1000) : 'N/A',
        now: new Date(now * 1000),
        isExpired
      });
      
      // Display results
      alert(`🔍 Token Debug Results:\n\n` +
            `User ID: ${payload.sub || payload.userId || payload.id || 'N/A'}\n` +
            `Expired: ${isExpired ? 'YES' : 'NO'}\n\n` +
            `Role Fields:\n${JSON.stringify(roleFields, null, 2)}\n\n` +
            `Full Payload:\n${JSON.stringify(payload, null, 2)}`);
            
    } catch (error) {
      console.error('❌ Token decode error:', error);
      alert('❌ Lỗi decode token: ' + error.message);
    }
  };

  const handleSaveReport = async () => {
    // Hiển thị modal xác nhận thay vì thực hiện lưu ngay lập tức
    setShowSaveReportConfirmModal(true);
  };

  // Hàm thực hiện lưu báo cáo y tế sau khi xác nhận
const performSaveReport = async () => {
  try {
    // Validate medications
    if (medicalReport.medicalResultMedicines && medicalReport.medicalResultMedicines.length > 0) {
      for (let i = 0; i < medicalReport.medicalResultMedicines.length; i++) {
        const med = medicalReport.medicalResultMedicines[i];
        if (!med.medicineId || !med.name || !med.dosage) {
          alert(`Thuốc thứ ${i + 1}: Vui lòng chọn thuốc từ danh sách và điền đầy đủ liều lượng`);
          return;
        }
        if (med.medicineId.includes('new_med_') || med.medicineId.includes('fallback_med_')) {
          alert(`Thuốc thứ ${i + 1}: Vui lòng chọn thuốc từ danh sách`);
          return;
        }
        if (med.amount && (isNaN(med.amount) || med.amount <= 0)) {
          alert(`Thuốc thứ ${i + 1}: Vui lòng nhập số lượng hợp lệ`);
          return;
        }
      }
    }

    const updateData = {
      doctorId: getDoctorIdFromToken(),
      weight: medicalReport.weight ? parseFloat(medicalReport.weight) : null,
      height: medicalReport.height ? parseFloat(medicalReport.height) : null,
      bmi: medicalReport.bmi ? parseFloat(medicalReport.bmi) : null,
      temperature: medicalReport.temperature ? parseFloat(medicalReport.temperature) : null,
      bloodPressure: medicalReport.bloodPressure || null,
      heartRate: medicalReport.heartRate ? parseInt(medicalReport.heartRate) : null,
      cd4Count: medicalReport.cd4Count ? parseInt(medicalReport.cd4Count) : null,
      viralLoad: medicalReport.viralLoad || null,
      hemoglobin: medicalReport.hemoglobin ? parseFloat(medicalReport.hemoglobin) : null,
      whiteBloodCell: medicalReport.whiteBloodCell ? parseFloat(medicalReport.whiteBloodCell) : null,
      platelets: medicalReport.platelets ? parseInt(medicalReport.platelets) : null,
      glucose: medicalReport.glucose ? parseInt(medicalReport.glucose) : null,
      creatinine: medicalReport.creatinine ? parseFloat(medicalReport.creatinine) : null,
      alt: medicalReport.alt ? parseInt(medicalReport.alt) : null,
      ast: medicalReport.ast ? parseInt(medicalReport.ast) : null,
      totalCholesterol: medicalReport.totalCholesterol ? parseInt(medicalReport.totalCholesterol) : null,
      ldl: medicalReport.ldl ? parseInt(medicalReport.ldl) : null,
      hdl: medicalReport.hdl ? parseInt(medicalReport.hdl) : null,
      triglycerides: medicalReport.trigilycerides ? parseInt(medicalReport.trigilycerides) : null,
      patientProgressEvaluation: medicalReport.patientProgressEvaluation || null,
      plan: medicalReport.plan || null,
      recommendation: medicalReport.recommendation || null,
      medicalResultMedicines: Array.isArray(medicalReport.medicalResultMedicines) && medicalReport.medicalResultMedicines.length > 0 ?
        medicalReport.medicalResultMedicines
          .filter(med => med && med.name && med.dosage && med.medicineId)
          .map((med) => ({
            medicineId: med.medicineId,
            name: med.name || '',
            dosage: med.dosage || '',
            amount: med.amount ? parseInt(med.amount) : 0,
            note: med.note || '',
          })) : null,
      arvFile: medicalReport.arvFile || null,
      arvRegimenResultURL: medicalReport.arvRegimenResultURL || "",
      arvMetadata: medicalReport.arvMetadata || null
    };

    const result = await medicalResultAPI.updateMedicalResult(medicalReport.medicalResultId, updateData);
    
    if (result.success) {
      if (selectedAppointment) {
        localStorage.removeItem(`appointment_${selectedAppointment.id}_progress`);
      }
      await loadDoctorAppointments();
      handleCloseReportModal();
      setShowSaveReportConfirmModal(false);
    } else {
      // Backend sẽ trả về lỗi cụ thể (403, 400, etc.)
      alert('❌ ' + (result.message || 'Không thể cập nhật báo cáo y tế'));
    }
  } catch (error) {
    alert('❌ Đã xảy ra lỗi: ' + error.message);
  } finally {
    setShowSaveReportConfirmModal(false);
  }
};


  const handleCreateMedicalResult = async (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setPendingActionAppointment(appointment);
    setShowCreateReportConfirmModal(true);
  };

  // Hàm thực hiện tạo báo cáo y tế sau khi xác nhận
  const performCreateMedicalResult = async () => {
    if (!pendingActionAppointment) return;
    
    try {
      console.log('Creating medical result for appointment:', pendingActionAppointment.id);
      
      // Get doctor ID from token to ensure proper ownership
      const tokenDoctorId = getDoctorIdFromToken();
      if (!tokenDoctorId) {
        console.error('Cannot determine doctor ID from token');
        return;
      }

      console.log('Creating medical result with doctor ID:', tokenDoctorId);
      
      let result = await medicalResultAPI.createMedicalResult(pendingActionAppointment.id);
      
      // If primary creation failed with 404, try alternative endpoints
      if (!result.success && result.message?.includes('404')) {
        console.log('Primary creation failed, trying alternative endpoints...');
        
        // Import api directly for alternative endpoints
        const { api } = await import('../../services/api');
        
        const alternativeEndpoints = [
          `/medical-result/create/${pendingActionAppointment.id}`,
          `/medical-result/createMedicalResult/${pendingActionAppointment.id}`,
          `/medicalresult/create/${pendingActionAppointment.id}`,
          `/api/medical-result/create-MedicalResult/${pendingActionAppointment.id}`
        ];
          for (const altEndpoint of alternativeEndpoints) {
          try {
            console.log(`Trying alternative endpoint: ${altEndpoint}`);
            const response = await api.post(altEndpoint, { doctorId: getDoctorIdFromToken() });
            if (response.data) {
              console.log(`✅ Alternative endpoint worked: ${altEndpoint}`);
              result = {
                success: true,
                data: response.data.data || response.data,
                message: 'Tạo báo cáo y tế thành công với endpoint thay thế'
              };
              break;
            }
          } catch (altError) {
            console.log(`❌ Alternative endpoint failed: ${altEndpoint}`, altError.response?.status);
          }
        }
      }
      
      if (result.success) {
        // Reload appointments để cập nhật medicalResultId
        await loadDoctorAppointments();
        console.log('✅ Medical result created successfully');
      } else {
        console.error('All creation attempts failed:', result);
      }
    } catch (error) {
      console.error('Error creating medical result:', error);
    } finally {
      setShowCreateReportConfirmModal(false);
      setPendingActionAppointment(null);
    }
  };
  // Hàm hiển thị modal nhập báo cáo y tế
  const handleShowMedicalReportModal = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      
      // Lấy lại thông tin appointment để có medicalResultId mới nhất
      const appointmentResult = await appointmentAPI.getAppointmentById(appointment.id);
        if (appointmentResult.success && appointmentResult.data.medicalResultId) {
        const medicalResultId = appointmentResult.data.medicalResultId;
        console.log('Loading medical result:', medicalResultId);
        
        // Try to load existing medical result data
        console.log('=== DEBUG: Attempting to load existing medical result data ===');
        try {
          const existingMedicalResult = await medicalResultAPI.getMedicalResult(medicalResultId);
          
          if (existingMedicalResult.success && existingMedicalResult.data) {
            console.log('✅ Successfully loaded existing medical result:', existingMedicalResult.data);
            
            // Log medicines data for debugging
            if (existingMedicalResult.data.medicalResultMedicines && existingMedicalResult.data.medicalResultMedicines.length > 0) {
              console.log('📋 Medicines from API:', existingMedicalResult.data.medicalResultMedicines);
            }
            
            // Map API response to form structure
            const loadedReport = {
              medicalResultId: existingMedicalResult.data.id,
              doctorId: getDoctorIdFromToken(),
              userId: appointment.userId,
              appointmentId: appointment.id,
              patientInfo: {
                name: formatPatientName(appointment),
                customerId: appointment.userId || appointment.id
              },
              visitDate: appointment.date,
              appointmentInfo: {
                time: `${appointment.slotStartTime || '00:00'} - ${appointment.slotEndTime || '00:00'}`,
                type: getAppointmentTypeDisplay(appointment.appointmentType || appointment.type),
                service: appointment.serviceName || appointment.appointmentService || getServiceDisplay(appointment, getServiceNameById),
                symptoms: appointment.reason || appointment.symptoms || 'Không có triệu chứng',
                notes: appointment.notes || appointment.note || 'Chưa có ghi chú'
              },
              // Map medical data from API response
              weight: existingMedicalResult.data.weight || '',
              height: existingMedicalResult.data.height || '',
              bmi: existingMedicalResult.data.bmi || '',
              temperature: existingMedicalResult.data.temperature || '',
              bloodPressure: existingMedicalResult.data.bloodPressure || '',
              heartRate: existingMedicalResult.data.heartRate || '',
              cd4Count: existingMedicalResult.data.cd4Count || '',
              viralLoad: existingMedicalResult.data.viralLoad || '',
              hemoglobin: existingMedicalResult.data.hemoglobin || '',
              whiteBloodCell: existingMedicalResult.data.whiteBloodCell || '',
              platelets: existingMedicalResult.data.platelets || '',
              glucose: existingMedicalResult.data.glucose || '',
              creatinine: existingMedicalResult.data.creatinine || '',
              alt: existingMedicalResult.data.alt || '',
              ast: existingMedicalResult.data.ast || '',
              totalCholesterol: existingMedicalResult.data.totalCholesterol || '',
              ldl: existingMedicalResult.data.ldl || '',
              hdl: existingMedicalResult.data.hdl || '',              trigilycerides: existingMedicalResult.data.triglycerides || '', // Note: API uses 'triglycerides' not 'trigilycerides'
              patientProgressEvaluation: existingMedicalResult.data.patientProgressEvaluation || '',
              plan: existingMedicalResult.data.plan || '',              recommendation: existingMedicalResult.data.recommendation || '',
              // Properly map medicines with all required fields
              medicalResultMedicines: (existingMedicalResult.data.medicalResultMedicines || []).map(medicine => {
                const mappedMedicine = {
                  medicineId: medicine.medicineId || medicine.id || '',
                  name: medicine.name || '',
                  dosage: medicine.dosage || '',
                  amount: medicine.amount || 0,
                  note: medicine.note || '',
                };
                console.log('🔄 Mapping medicine:', medicine, '→', mappedMedicine);
                return mappedMedicine;
              }),
              // ARV file handling - URL from database, but no file object for existing data
              arvRegimenResultURL: existingMedicalResult.data.arvRegimenResultURL || null,
              arvFile: null, // No file object for existing data, only URL reference
              arvMetadata: existingMedicalResult.data.arvMetadata || null // Load ARV metadata if available
            };
            console.log('📋 Populated medical report with existing data:', loadedReport);
            console.log('💊 Final medicines array:', loadedReport.medicalResultMedicines);
            setMedicalReport(loadedReport);
            setShowReportModal(true);
            return; // Exit early since we successfully loaded existing data
          }
        } catch (loadError) {
          console.warn('⚠️ Could not load existing medical result, will create empty form:', loadError);
          // Continue to create empty form below
        }
        
        // Fallback: Initialize empty form if loading existing data failed
        console.log('=== DEBUG: Initializing empty medical report form for doctor ===');
        const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
        
        // Lấy doctorId từ JWT token
        let doctorId = '';
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const tokenPayload = jwtDecode(token);
            doctorId = tokenPayload.sub; // Lấy user ID từ JWT token
            console.log('Doctor ID from JWT token:', doctorId);
          } catch (error) {
            console.error('Error extracting doctorId from token:', error);
          }
        }
        
        // Fallback nếu không lấy được từ token
        if (!doctorId) {
          doctorId = appointment.doctorId || currentUser?.id || '';
        }
        
        console.log('Doctor ID sources:');
        console.log('- From JWT token:', token ? doctorId : 'no token');
        console.log('- From appointment:', appointment.doctorId);
        console.log('- From current user:', currentUser?.id);
        console.log('- Final doctor ID:', doctorId);
        
        const emptyReport = {
          medicalResultId: medicalResultId,
          doctorId: doctorId,
          userId: appointment.userId || appointment.id,
          appointmentId: appointment.id,
          patientInfo: {
                            name: formatPatientName(appointment),
            customerId: appointment.userId || appointment.id
          },
          visitDate: appointment.date,
          
          // Vital Signs - khởi tạo trống, doctor sẽ điền
          weight: '', height: '', bmi: '', temperature: '', bloodPressure: '', heartRate: '',
          
          // Lab Results - khởi tạo trống, doctor sẽ điền
          cd4Count: '', viralLoad: '', hemoglobin: '', whiteBloodCell: '', platelets: '',
          glucose: '', creatinine: '', alt: '', ast: '', totalCholesterol: '', ldl: '', hdl: '', trigilycerides: '',
            // Medical Assessment & Plan - khởi tạo trống, doctor sẽ điền
          patientProgressEvaluation: '', plan: '', recommendation: '', 
          
          // ARV Result - khởi tạo trống
          arvRegimenResultURL: '',
          arvFile: null, // No ARV file initially
          
          // Medications - empty by default, doctor will add via MedicineSelector
          medicalResultMedicines: [],
          
          doctorInfo: {
            name: 'Dr. John Doe', 
            specialty: 'Chuyên gia điều trị HIV',
            signature: 'J. Doe, MD', 
            date: appointment.date
          }
        };
        
        setMedicalReport(emptyReport);
        
        setShowReportModal(true);
      } else {
        alert('Không tìm thấy báo cáo y tế cho lịch hẹn này');
      }
    } catch (error) {
      console.error('Error showing medical report modal:', error);
      alert('Đã xảy ra lỗi khi mở báo cáo y tế');
    }
  };
  // Hàm hiển thị chi tiết lịch hẹn bằng API getAppointmentById
  const handleShowAppointmentDetails = async (appointment) => {
    try {
      setLoadingAppointmentDetail(true);
      setShowAppointmentDetailModal(true);
      
      // Gọi API để lấy chi tiết lịch hẹn
      const response = await appointmentAPI.getAppointmentById(appointment.id);
      setAppointmentDetailData(response.data);
      
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setAppointmentDetailData(null);
      alert('Không thể tải thông tin chi tiết lịch hẹn');
    } finally {
      setLoadingAppointmentDetail(false);
    }
  };  // Hàm chuyển trạng thái lịch hẹn từ ACCEPTED sang COMPLETED
  const handleCompleteAppointment = async (appointmentId) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    setPendingActionAppointment(appointment);
    setShowCompleteAppointmentConfirmModal(true);
  };

  // Hàm thực hiện hoàn thành lịch hẹn sau khi xác nhận
  const performCompleteAppointment = async () => {
    if (!pendingActionAppointment) return;
    
    try {
      console.log('=== DEBUG: Starting appointment completion ===');
      
      console.log('📋 Appointment found:', {
        id: pendingActionAppointment.id,
                        patientName: formatPatientName(pendingActionAppointment),
        currentStatus: pendingActionAppointment.status,
        originalStatus: pendingActionAppointment.originalStatus,
        hasmedicalResult: !!pendingActionAppointment.medicalResultId
      });

      // � Get existing video call log URL if already uploaded
      let videoCallLogURL = null;
      
      if (pendingActionAppointment.isOnline === true) {
        console.log('📹 Online appointment - checking for uploaded log URL...');
        
        // Check if log was already uploaded via "Tải Log" button
        const metadataKey = `video_call_log_metadata_${pendingActionAppointment.id}`;
        const logMetadata = localStorage.getItem(metadataKey);
        
        if (logMetadata) {
          try {
            const metadata = JSON.parse(logMetadata);
            videoCallLogURL = metadata.logFileUrl;
            console.log('✅ Found existing log URL:', videoCallLogURL);
          } catch (parseError) {
            console.warn('⚠️ Failed to parse log metadata:', parseError);
          }
        } else {
          console.log('ℹ️ No uploaded log found');
        }
      }

      console.log('=== DEBUG: Calling API to update appointment status ===');
      console.log('Appointment ID:', pendingActionAppointment.id);
      console.log('Target Status: COMPLETED');
      console.log('Video Call Log URL:', videoCallLogURL || 'None');
      
      // Call API to update status to COMPLETED with optional log URL
      const result = await appointmentAPI.updateAppointmentStatus(
        pendingActionAppointment.id, 
        'COMPLETED',
        videoCallLogURL // Thêm log URL vào request
      );
      
      console.log('=== DEBUG: API Response ===', result);
      
      if (result.success) {
        console.log('✅ SUCCESS: Appointment status updated to COMPLETED');
        
        if (result.endpoint) {
          console.log('📡 Success endpoint:', result.endpoint);
        }
        
        if (videoCallLogURL) {
          console.log('📹 Video call log URL included in completion');
          
          alert(
            `✅ Hoàn thành lịch hẹn thành công!\n\n` +
            `📹 Log cuộc gọi video đã được đính kèm.\n` +
            `🔗 URL: ${videoCallLogURL}\n\n` +
            `Lịch hẹn đã chuyển sang trạng thái COMPLETED.`
          );
        } else {
          // No log URL (either not anonymous or no log uploaded)
          alert(
            `✅ Hoàn thành lịch hẹn thành công!\n\n` +
            `Lịch hẹn đã chuyển sang trạng thái COMPLETED.`
          );
        }
        
        // Reload appointments to update the status in UI
        console.log('🔄 Reloading appointments to update UI...');
        await loadDoctorAppointments();
        
      } else {
        console.error('❌ FAILED: API returned error');
        console.error('Error details:', result);
        
        alert('❌ Không thể hoàn thành lịch hẹn: ' + (result.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('=== EXCEPTION: Error in performCompleteAppointment ===', error);
      alert('❌ Đã xảy ra lỗi khi hoàn thành lịch hẹn: ' + error.message);
    } finally {
      setShowCompleteAppointmentConfirmModal(false);
      setPendingActionAppointment(null);
    }
  };
  // Lọc lịch hẹn đã hoàn thành cho ngày được chọn
  const getCompletedAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const matchesDate = apt.date === date || apt.appointmentDate === date;
      const isCompleted = apt.status === 'completed' || apt.status === 'COMPLETED';
      return matchesDate && isCompleted;
    });
  };  // Get accepted appointments for the selected date (doctor chỉ xem appointments đã được duyệt)
  const getPendingAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const matchesDate = apt.date === date || apt.appointmentDate === date;
      const isAccepted = apt.status === 'accepted' || apt.status === 'ACCEPTED';
      return matchesDate && isAccepted;
    });
  };

  // Get all appointments (ACCEPTED + COMPLETED) for the selected date
  const getAllAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const matchesDate = apt.date === date || apt.appointmentDate === date;
      const isAcceptedOrCompleted = 
        apt.status === 'accepted' || apt.status === 'ACCEPTED' ||
        apt.status === 'completed' || apt.status === 'COMPLETED';
      return matchesDate && isAcceptedOrCompleted;
    });
  };

  // Debug function to test appointment endpoints
  const testAppointmentEndpoints = async (appointmentId) => {
    console.log('=== TESTING ALL APPOINTMENT ENDPOINTS ===');
    
    if (!appointmentId) {
      const firstAppointment = appointments.find(apt => apt.id);
      appointmentId = firstAppointment?.id;
      
      if (!appointmentId) {
        alert('Không có appointment nào để test. Vui lòng tải lại danh sách appointments.');
        return;
      }
    }
    
    console.log('Testing with appointment ID:', appointmentId);
    
    // Test getting appointment details first
    try {
      console.log('📋 Testing: GET appointment details...');
      const detailResult = await appointmentAPI.getAppointmentById(appointmentId);
      console.log('✅ GET appointment details - Success:', detailResult.success);
      console.log('📋 Current appointment data:', detailResult.data);
    } catch (error) {
      console.error('❌ GET appointment details - Failed:', error);
    }
    
    // Test update status with different endpoints
    const testStatuses = ['COMPLETED', 'ACCEPTED', 'PENDING'];
    
    for (const status of testStatuses) {
      console.log(`\n🔄 Testing status update to: ${status}`);
      try {
        const result = await appointmentAPI.updateAppointmentStatus(appointmentId, status);
        console.log(`✅ Status update to ${status} - Success:`, result.success);
        if (result.success && result.endpoint) {
          console.log(`📡 Working endpoint: ${result.endpoint}`);
          alert(`✅ Success! Working endpoint found:\n${result.endpoint}\n\nStatus updated to: ${status}`);
          return; // Stop testing once we find a working endpoint
        }
      } catch (error) {
        console.error(`❌ Status update to ${status} - Failed:`, error);
      }
    }
    
    alert('❌ All endpoint tests failed. Check console for details.');
  };

  // Utility functions for AppointmentDetailModal
  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTimeSlot = (startTime, endTime) => {
    if (!startTime && !endTime) return 'Không có thông tin';
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    return startTime || endTime || 'Không có thông tin';
  };

  const getAppointmentTypeLabel = (type) => {
    switch (type?.toUpperCase()) {
      case 'INITIAL':
        return 'Khám lần đầu';
      case 'FOLLOW_UP':
        return 'Tái khám';
      default:
        return type || 'Không xác định';
    }
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

  // Helper function để format tên bệnh nhân với thông tin ẩn danh
  const formatPatientName = (appointment) => {
    if (!appointment) return 'Không xác định';
    const name = appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`;
    return name;
  };

  // Hàm xử lý video call
  const handleVideoCall = (appointment) => {
    // Kiểm tra xem có thể thực hiện video call không
    if (!canMakeVideoCall(appointment)) {
      alert('Video Call chỉ có thể thực hiện trong khung giờ khám của ngày hôm nay.\n\nVui lòng thử lại trong khoảng thời gian từ ' + 
            appointment.slotStartTime + ' đến ' + appointment.slotEndTime + '.');
      return;
    }

    console.log('Starting video call for appointment:', appointment);
    // Open video call in new tab
    const videoCallUrl = `/video-call/${appointment.id}/doctor`;
    window.open(videoCallUrl, '_blank', 'width=1200,height=800');
  };

  // Hàm xử lý xem video call log
  const handleViewVideoCallLog = async (appointment) => {
    setLoadingVideoCallLog(true);
    setShowVideoCallLogModal(true);
    
    try {
      // Kiểm tra xem có log file cho appointment này không
      console.log('Loading video call log for appointment:', appointment.id);
      
      // Thử load từ localStorage trước (fallback)
      const localStorageLog = localStorage.getItem(`video_call_log_${appointment.id}`);
      
      if (localStorageLog) {
        try {
          const logData = JSON.parse(localStorageLog);
          
          // Format log data để hiển thị - tính thời gian đúng theo yêu cầu
          const formattedLogData = {
            appointmentId: appointment.id,
            patientName: formatPatientName(appointment),
            doctorName: 'Bác sĩ khám',
            startTime: calculateRealStartTime(logData),
            endTime: calculateRealEndTime(logData),
            duration: calculateRealDuration(logData),
            chatMessages: logData.chatMessages || [],
            connectionEvents: logData.connectionEvents || [],
            qualityMetrics: logData.qualityMetrics || {},
            logFileUrl: null // Chưa có URL từ server
          };
          
          setVideoCallLogData(formattedLogData);
          console.log('✅ Video call log loaded from localStorage');
          return;
        } catch (parseError) {
          console.error('Failed to parse localStorage log:', parseError);
        }
      }
      
      // Nếu không có log trong localStorage, tạo thông báo
      setVideoCallLogData(null);
      console.log('ℹ️ No video call log found for this appointment');
      
    } catch (error) {
      console.error('Failed to load video call log:', error);
      setVideoCallLogData(null);
    } finally {
      setLoadingVideoCallLog(false);
    }
  };

  // Helper function để tính thời gian bắt đầu thực tế (khi cả hai cùng tham gia)
  const calculateRealStartTime = (logData) => {
    const doctorJoined = logData.participants?.doctor?.joined;
    const patientJoined = logData.participants?.patient?.joined;
    
    if (doctorJoined && patientJoined) {
      // Thời gian bắt đầu là thời điểm người cuối cùng tham gia
      const doctorTime = new Date(doctorJoined).getTime();
      const patientTime = new Date(patientJoined).getTime();
      return new Date(Math.max(doctorTime, patientTime)).toISOString();
    }
    
    return logData.callStatus?.startTime || 'Không xác định';
  };

  // Helper function để tính thời gian kết thúc thực tế (người cuối cùng rời đi)
  const calculateRealEndTime = (logData) => {
    const doctorLeft = logData.participants?.doctor?.left;
    const patientLeft = logData.participants?.patient?.left;
    
    // Nếu có thông tin về thời gian rời đi
    if (doctorLeft || patientLeft) {
      const times = [];
      if (doctorLeft) times.push(new Date(doctorLeft).getTime());
      if (patientLeft) times.push(new Date(patientLeft).getTime());
      
      // Thời gian kết thúc là thời điểm người cuối cùng rời đi
      return new Date(Math.max(...times)).toISOString();
    }
    
    return logData.callStatus?.endTime || 'Không xác định';
  };

  // Helper function để tính thời lượng thực tế
  const calculateRealDuration = (logData) => {
    const startTime = calculateRealStartTime(logData);
    const endTime = calculateRealEndTime(logData);
    
    if (startTime === 'Không xác định' || endTime === 'Không xác định') {
      return 'Không xác định';
    }
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Không xác định';
      }
      
      const durationMs = end - start;
      
      if (durationMs <= 0) return 'Không xác định';
      
      const totalSeconds = Math.floor(durationMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      if (minutes > 0) {
        return `${minutes} phút ${seconds} giây`;
      } else {
        return `${seconds} giây`;
      }
    } catch (error) {
      console.error('Error calculating real duration:', error);
      return 'Không xác định';
    }
  };

  // Helper function để tính thời lượng
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'Không xác định';
    
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const duration = (end - start) / (1000 * 60); // minutes
    
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours} giờ ${minutes} phút`;
    }
    return `${duration} phút`;
  };

  // Hàm upload video call log từ localStorage lên Supabase
  const handleUploadVideoCallLog = async (appointment) => {
    try {
      const logKey = `video_call_log_${appointment.id}`;
      const localStorageLog = localStorage.getItem(logKey);
      
      if (!localStorageLog) {
        // Hiển thị modal thân thiện thay vì alert
        setShowNoLogModal(true);
        setSelectedAppointment(appointment);
        return;
      }

      // Confirm before upload
      const confirmUpload = window.confirm(
        `📤 Tải log cuộc gọi video lên Supabase Storage?\n\n` +
        `📋 Lịch hẹn: ${formatPatientName(appointment)}\n` +
        `📅 Ngày: ${appointment.appointmentDate}\n\n` +
        `Log sẽ được lưu vĩnh viễn trên server.`
      );

      if (!confirmUpload) return;

      // Parse log data
      const logData = JSON.parse(localStorageLog);
      
      // Create log file content
      const logContent = {
        ...logData,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.id || 'doctor',
        version: '1.0'
      };

      // Create blob file
      const logFileName = `appointment_${appointment.id}_video_call_log.json`;
      const logBlob = new Blob([JSON.stringify(logContent, null, 2)], {
        type: 'application/json'
      });

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', logBlob, logFileName);
      formData.append('filePath', 'videoCallLog');
      formData.append('bucketName', 'document');

      // Get auth token
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📤 Uploading video call log to Supabase...');

      // Call upload API (sử dụng full URL tới backend)
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Video call log uploaded successfully:', result);

        // Save metadata to localStorage
        const metadataKey = `video_call_log_metadata_${appointment.id}`;
        const metadata = {
          appointmentId: appointment.id,
          uploadedAt: new Date().toISOString(),
          logFileUrl: result.data || result.url || result.fileUrl, // Thêm result.data để lấy URL từ response
          fileName: logFileName
        };
        localStorage.setItem(metadataKey, JSON.stringify(metadata));

        alert(
          `✅ Tải log thành công!\n\n` +
          `📁 File: ${logFileName}\n` +
          `🔗 URL: ${result.data || result.url || result.fileUrl || 'Đã lưu'}\n\n` + // Thêm result.data
          `Log đã được lưu vĩnh viễn trong Supabase Storage.`
        );
      } else {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

    } catch (error) {
      console.error('❌ Failed to upload video call log:', error);
      alert(
        `❌ Tải log thất bại!\n\n` +
        `Lỗi: ${error.message}\n\n` +
        `Vui lòng thử lại sau hoặc liên hệ admin.`
      );
    }
  };

  // Hàm kiểm tra xem có thể thực hiện Video Call hay không
  const canMakeVideoCall = (appointment) => {
    if (!appointment || !appointment.appointmentDate || !appointment.slotStartTime || !appointment.slotEndTime) {
      return false;
    }

    const now = new Date();
    const currentDate = now.toDateString();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Chuyển thời gian hiện tại thành phút

    // Kiểm tra ngày, tháng, năm khớp với ngày hiện tại
    const appointmentDate = new Date(appointment.appointmentDate);
    const appointmentDateString = appointmentDate.toDateString();
    
    if (currentDate !== appointmentDateString) {
      return false;
    }

    // Chuyển đổi slotStartTime và slotEndTime thành phút
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const slotStart = parseTime(appointment.slotStartTime);
    const slotEnd = parseTime(appointment.slotEndTime);

    // Kiểm tra thời gian hiện tại có nằm trong khoảng slot không
    return currentTime >= slotStart && currentTime <= slotEnd;
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
          
          <Col md={9} lg={10} className="main-content">            <div className="content-header">
              <h2>Lịch hẹn</h2>
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
                                    {/* Hiển thị dấu chấm vàng cho accepted appointments */}
                                    {day.acceptedAppointments.slice(0, 3).map((appt, i) => (
                                      <div key={`accepted-${i}`} className="appointment-dot status-accepted"></div>
                                    ))}
                                    {/* Hiển thị dấu chấm xanh cho completed appointments */}
                                    {day.completedAppointments.slice(0, 3 - day.acceptedAppointments.length).map((appt, i) => (
                                      <div key={`completed-${i}`} className="appointment-dot status-completed"></div>
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
                      Lịch hẹn chưa hoàn thành {new Date(selectedDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
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
                            <div className="appointment-details">
                              <div className="appointment-info-line">
                                <strong>Giờ khám:</strong> {`${appointment.slotStartTime || '00:00'} - ${appointment.slotEndTime || '00:00'}`}
                              </div>                              <div className="appointment-info-line">
                                <strong>Bệnh nhân:</strong> {formatPatientName(appointment)}{appointment.isAnonymous ? ' (ẩn danh)' : ''}
                              </div>
                              <div className="appointment-info-line">
                                <strong>Loại khám:</strong> {getAppointmentTypeDisplay(appointment.appointmentType || appointment.type)}
                              </div>
                              <div className="appointment-info-line">
                                <strong>Triệu chứng:</strong> {appointment.reason || appointment.symptoms || 'Không có triệu chứng'}
                              </div>
                              <div className="appointment-info-line">
                                <strong>Ghi chú:</strong> {appointment.notes || appointment.note || 'Chưa có ghi chú'}
                              </div>
                              <div className="appointment-info-line">
                                <strong>Dịch vụ:</strong> {appointment.serviceName || appointment.appointmentService || getServiceDisplay(appointment, getServiceNameById)}
                              </div>
                            </div>
                            <div className="appointment-status">
                              {!appointment.medicalResultId ? (
                                // Chưa có medical result → hiển thị nút "Tạo báo cáo y tế"
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="action-btn me-2"
                                  onClick={() => handleCreateMedicalResult(appointment.id)}
                                >
                                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                                  Tạo báo cáo y tế
                                </Button>
                              ) : (
                                // Đã có medical result → hiển thị nút "Nhập báo cáo y tế"
                                <Button 
                                  variant="outline-info" 
                                  size="sm" 
                                  className="action-btn me-2"
                                  onClick={() => handleShowMedicalReportModal(appointment)}
                                >
                                  <FontAwesomeIcon icon={faEdit} className="me-1" />
                                  Nhập báo cáo y tế
                                </Button>
                              )}
                              
                              {/* Nút hoàn thành - chỉ hiển thị khi đã có medical result */}
                              {appointment.medicalResultId && (
                                <Button 
                                  variant="outline-success" 
                                  size="sm" 
                                  className="action-btn"
                                  onClick={() => handleCompleteAppointment(appointment.id)}
                                >
                                  <FontAwesomeIcon icon={faCheck} className="me-1" />
                                  Hoàn thành
                                </Button>                              )}
                            </div>
                            
                            <div className="appointment-actions mt-2">
                              {/* Hàng 1: Chi tiết lịch hẹn và Khám trực tuyến */}
                              <div className="action-row">
                                <Button
                                  variant="outline-secondary" 
                                  size="sm" 
                                  className="action-btn"
                                  onClick={() => handleShowAppointmentDetails(appointment)}
                                >
                                  <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                                  Chi tiết lịch hẹn
                                </Button>
                                
                                {/* Chỉ hiển thị Khám trực tuyến cho bệnh nhân khám trực tuyến */}
                                {appointment.isOnline === true ? (
                                  <Button
                                    variant={canMakeVideoCall(appointment) ? "success" : "secondary"} 
                                    size="sm" 
                                    className="action-btn"
                                    onClick={() => handleVideoCall(appointment)}
                                    disabled={!canMakeVideoCall(appointment)}
                                    title={!canMakeVideoCall(appointment) ? 
                                      "Khám trực tuyến chỉ khả dụng trong khung giờ khám của ngày hôm nay" : 
                                      "Bắt đầu khám trực tuyến"}
                                  >
                                    <FontAwesomeIcon icon={faVideo} className="me-1" />
                                    Khám trực tuyến
                                    {!canMakeVideoCall(appointment) && (
                                      <small className="d-block" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                                        (Chưa đến giờ)
                                      </small>
                                    )}
                                  </Button>
                                ) : (
                                  <div className="action-btn"></div> // Placeholder để giữ layout
                                )}
                              </div>
                              
                              {/* Hàng 2: Nhật ký cuộc gọi và Tải nhật ký cuộc gọi - chỉ cho bệnh nhân khám trực tuyến */}
                              {appointment.isOnline === true && (
                                <div className="action-row">
                                  <Button
                                    variant="outline-info" 
                                    size="sm" 
                                    className="action-btn"
                                    onClick={() => handleViewVideoCallLog(appointment)}
                                    title="Xem nhật ký cuộc gọi video"
                                  >
                                    <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                                    Nhật ký cuộc gọi
                                  </Button>
                                  
                                  <Button
                                    variant="warning" 
                                    size="sm" 
                                    className="action-btn"
                                    onClick={() => handleUploadVideoCallLog(appointment)}
                                    title="Tải nhật ký cuộc gọi lên Supabase Storage"
                                  >
                                    <FontAwesomeIcon icon={faUpload} className="me-1" />
                                    Tải nhật ký cuộc gọi
                                  </Button>
                                </div>
                              )}
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
              <Card.Header>
                <h5 className="mb-0">Lịch hẹn đã hoàn thành {new Date(selectedDate).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}</h5>
              </Card.Header>
              <Card.Body className="p-0">                <div className="table-responsive">
                  <table className="table appointment-table">
                    <thead>
                      <tr>
                        <th>Giờ khám</th>
                        <th>Bệnh nhân</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCompletedAppointmentsForDate(selectedDate).map(appointment => (
                        <tr key={appointment.id}>
                          <td>{`${appointment.slotStartTime || '00:00'} - ${appointment.slotEndTime || '00:00'}`}</td>
                          <td>
                            {formatPatientName(appointment)}{appointment.isAnonymous ? ' (ẩn danh)' : ''}
                          </td>
                          <td>
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              className="me-2"
                              onClick={() => handleShowAppointmentDetails(appointment)}
                            >
                              <FontAwesomeIcon icon={faEye} className="me-1" />
                              Xem lịch hẹn
                            </Button>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              className="me-2"
                              onClick={() => handleShowMedicalReportModal(appointment)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                              Chỉnh sửa báo cáo y tế
                            </Button>
                            {/* Hiển thị nút Nhật ký cuộc gọi cho bệnh nhân khám trực tuyến */}
                            {appointment.isOnline === true && (
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => handleViewVideoCallLog(appointment)}
                                title="Xem nhật ký cuộc gọi video"
                              >
                                <FontAwesomeIcon icon={faFileAlt} className="me-1" />
                                Nhật ký cuộc gọi
                              </Button>
                            )}
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
        {/* Medical Report Modal */}
        <MedicalReportModal 
          show={showReportModal}
          onHide={handleCloseReportModal}
          report={medicalReport}
          onChange={handleReportChange}
          onSave={handleSaveReport}
          appointment={selectedAppointment}
          readOnly={false}
          onViewPdf={handleViewPdf}
          onShowMedicineSelector={() => setShowMedicineSelector(true)}
          onMedicineChange={handleMedicineChange}
          onAddMedicine={handleAddMedicine}
          onRemoveMedicine={handleRemoveMedicine}
        />

        {/* Medicine Selector Modal */}
        <MedicineSelector
          show={showMedicineSelector}
          onHide={() => setShowMedicineSelector(false)}
          medicines={medicalReport.medicalResultMedicines || []}
          onMedicineChange={handleMedicineChange}
          onAddMedicine={handleAddMedicine}
          onRemoveMedicine={handleRemoveMedicine}
          readOnly={false}
        />

        {/* Appointment Detail Modal */}
        <AppointmentDetailModal
          show={showAppointmentDetailModal}
          onHide={() => {
            setShowAppointmentDetailModal(false);
            // Delay việc reset state để tránh hiển thị lỗi khi modal đang đóng
            setTimeout(() => {
              setAppointmentDetailData(null);
              setLoadingAppointmentDetail(false);
            }, 200);
          }}
          appointmentDetail={appointmentDetailData}
          loading={loadingAppointmentDetail}
          onViewMedicalResult={null} // Doctor không cần xem medical result trong modal này
          formatDate={formatDate}
          formatTimeSlot={formatTimeSlot}
          getAppointmentTypeLabel={getAppointmentTypeLabel}
          getStatusBadge={getStatusBadge}
        />

        {/* Modal xác nhận tạo báo cáo y tế */}
        <Modal 
          show={showCreateReportConfirmModal} 
          onHide={() => {
            setShowCreateReportConfirmModal(false);
            setPendingActionAppointment(null);
          }} 
          centered
          className="confirmation-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faNotesMedical} className="text-primary me-2" />
              Xác nhận tạo báo cáo y tế
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {pendingActionAppointment && (
              <div>
                <p className="mb-3">Bạn có chắc chắn muốn tạo báo cáo y tế cho lịch hẹn này?</p>
                <div className="appointment-info p-3 bg-light rounded">
                  <div className="mb-2">
                    <strong>👤 Bệnh nhân:</strong> {formatPatientName(pendingActionAppointment)}{pendingActionAppointment.isAnonymous ? ' (ẩn danh)' : ''}
                  </div>
                  <div className="mb-2">
                    <strong>📅 Ngày khám:</strong> {pendingActionAppointment.date}
                  </div>
                  <div className="mb-2">
                    <strong>⏰ Giờ khám:</strong> {pendingActionAppointment.slotStartTime} - {pendingActionAppointment.slotEndTime}
                  </div>
                  <div>
                    <strong>🏥 Dịch vụ:</strong> {pendingActionAppointment.serviceName || pendingActionAppointment.appointmentService || 'N/A'}
                  </div>
                </div>
                <div className="alert alert-info mt-3 mb-0">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Sau khi tạo thành công, bạn có thể nhập thông tin chi tiết vào báo cáo.
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowCreateReportConfirmModal(false);
                setPendingActionAppointment(null);
              }}
            >
              Hủy
            </Button>
            <Button 
              variant="primary" 
              onClick={performCreateMedicalResult}
            >
              <FontAwesomeIcon icon={faNotesMedical} className="me-1" />
              Xác nhận tạo
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận hoàn thành lịch hẹn */}
        <Modal 
          show={showCompleteAppointmentConfirmModal} 
          onHide={() => {
            setShowCompleteAppointmentConfirmModal(false);
            setPendingActionAppointment(null);
          }} 
          centered
          className="confirmation-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
              Xác nhận hoàn thành lịch hẹn
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {pendingActionAppointment && (
              <div>
                <p className="mb-3">Bạn có chắc chắn muốn hoàn thành lịch hẹn này?</p>
                <div className="appointment-info p-3 bg-light rounded">
                  <div className="mb-2">
                    <strong>👤 Bệnh nhân:</strong> {formatPatientName(pendingActionAppointment)}{pendingActionAppointment.isAnonymous ? ' (ẩn danh)' : ''}
                  </div>
                  <div className="mb-2">
                    <strong>📅 Ngày khám:</strong> {pendingActionAppointment.date}
                  </div>
                  <div className="mb-2">
                    <strong>⏰ Giờ khám:</strong> {pendingActionAppointment.slotStartTime} - {pendingActionAppointment.slotEndTime}
                  </div>
                  <div className="mb-2">
                    <strong>🏥 Dịch vụ:</strong> {pendingActionAppointment.serviceName || pendingActionAppointment.appointmentService || 'N/A'}
                  </div>
                  <div>
                    <strong>📋 Báo cáo y tế:</strong> 
                    {pendingActionAppointment.medicalResultId ? (
                      <span className="text-success"> ✅ Đã có</span>
                    ) : (
                      <span className="text-warning"> ⚠️ Chưa có</span>
                    )}
                  </div>
                </div>
                
                {!pendingActionAppointment.medicalResultId && (
                  <div className="alert alert-warning mt-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    <strong>Cảnh báo:</strong> Lịch hẹn này chưa có báo cáo y tế. Thông thường bạn nên tạo báo cáo y tế trước khi hoàn thành lịch hẹn.
                  </div>
                )}
                
                {/* Hiển thị thông báo về video call log cho bệnh nhân khám trực tuyến */}
                {pendingActionAppointment.isOnline === true && (
                  <div className="alert alert-info mt-3">
                    <FontAwesomeIcon icon={faVideo} className="me-2" />
                    <strong>Video Call Log:</strong> Nếu có log cuộc gọi video, hệ thống sẽ tự động tải lên Supabase Storage và đính kèm vào lịch hẹn khi hoàn thành.
                  </div>
                )}

              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowCompleteAppointmentConfirmModal(false);
                setPendingActionAppointment(null);
              }}
            >
              Hủy
            </Button>
            <Button 
              variant="success" 
              onClick={performCompleteAppointment}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
              Xác nhận hoàn thành
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận lưu báo cáo y tế */}
        <Modal 
          show={showSaveReportConfirmModal} 
          onHide={() => setShowSaveReportConfirmModal(false)} 
          centered
          className="confirmation-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faSave} className="text-success me-2" />
              Xác nhận lưu báo cáo y tế
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <p className="mb-3">Bạn có chắc chắn muốn lưu báo cáo y tế này?</p>
                <div className="appointment-info p-3 bg-light rounded">
                  <div className="mb-2">
                    <strong>👤 Bệnh nhân:</strong> {formatPatientName(selectedAppointment)}{selectedAppointment.isAnonymous ? ' (ẩn danh)' : ''}
                  </div>
                  <div className="mb-2">
                    <strong>📅 Ngày khám:</strong> {selectedAppointment.date}
                  </div>
                  <div className="mb-2">
                    <strong>⏰ Giờ khám:</strong> {selectedAppointment.slotStartTime} - {selectedAppointment.slotEndTime}
                  </div>
                  <div>
                    <strong>🏥 Dịch vụ:</strong> {selectedAppointment.serviceName || selectedAppointment.appointmentService || 'N/A'}
                  </div>
                </div>
                
                {/* Hiển thị thông tin báo cáo sẽ được lưu */}
                <div className="alert alert-info mt-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  <strong>Thông tin báo cáo:</strong>
                  <ul className="mb-0 mt-2">
                    <li>✅ Các chỉ số sinh hiệu và xét nghiệm</li>
                    <li>✅ Đánh giá tiến triển bệnh nhân</li>
                    <li>✅ Kế hoạch điều trị và khuyến nghị</li>
                    {medicalReport.medicalResultMedicines && medicalReport.medicalResultMedicines.length > 0 && (
                      <li>✅ Danh sách thuốc ({medicalReport.medicalResultMedicines.length} loại)</li>
                    )}
                    {medicalReport.arvFile && (
                      <li>✅ Báo cáo ARV đính kèm</li>
                    )}
                  </ul>
                </div>
                
                <div className="alert alert-warning mt-3 mb-0">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  Vui lòng kiểm tra kỹ thông tin trước khi lưu. Báo cáo sẽ được cập nhật vào hệ thống.
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowSaveReportConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="success" 
              onClick={performSaveReport}
            >
              <FontAwesomeIcon icon={faSave} className="me-1" />
              Xác nhận lưu
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Video Call Log Modal */}
        <Modal 
          show={showVideoCallLogModal} 
          onHide={() => {
            setShowVideoCallLogModal(false);
            setVideoCallLogData(null);
          }} 
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faFileAlt} className="text-info me-2" />
              Nhật ký cuộc gọi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingVideoCallLog ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-2">Đang tải log cuộc gọi...</p>
              </div>
            ) : videoCallLogData ? (
              <div>
                {/* Thông tin cuộc gọi */}
                <div className="call-info-section mb-4">
                  <h6 className="text-primary mb-3">
                    <FontAwesomeIcon icon={faVideo} className="me-2" />
                    Thông tin cuộc gọi
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Bệnh nhân:</strong> {videoCallLogData.patientName}</p>
                      <p><strong>Bác sĩ:</strong> {videoCallLogData.doctorName}</p>
                      <p><strong>Appointment ID:</strong> {videoCallLogData.appointmentId}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Thời gian bắt đầu:</strong> {
                        videoCallLogData.startTime === 'Không xác định' ? 
                        'Chưa có dữ liệu' : 
                        new Date(videoCallLogData.startTime).toLocaleString('vi-VN')
                      }</p>
                      <p><strong>Thời gian kết thúc:</strong> {
                        videoCallLogData.endTime === 'Không xác định' ? 
                        'Chưa có dữ liệu' : 
                        new Date(videoCallLogData.endTime).toLocaleString('vi-VN')
                      }</p>
                      <p><strong>Thời lượng:</strong> {videoCallLogData.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="chat-log-section">
                  <h6 className="text-primary mb-3">
                    <FontAwesomeIcon icon={faComments} className="me-2" />
                    Nội dung trò chuyện
                  </h6>
                  <div className="chat-log-container" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '5px', padding: '15px' }}>
                    {videoCallLogData.chatMessages && videoCallLogData.chatMessages.length > 0 ? (
                      videoCallLogData.chatMessages.map((msg, index) => (
                        <div key={index} className={`chat-message mb-2 ${msg.sender === 'doctor' ? 'text-end' : 'text-start'}`}>
                          <div className={`chat-bubble d-inline-block px-3 py-2 rounded ${msg.sender === 'doctor' ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '70%' }}>
                            <div className="message-text">{msg.message}</div>
                            <small className={`message-time d-block mt-1 ${msg.sender === 'doctor' ? 'text-light' : 'text-muted'}`}>
                              {new Date(msg.timestamp).toLocaleString('vi-VN')} - {msg.senderName || (msg.sender === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân')}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted">
                        <FontAwesomeIcon icon={faComments} size="2x" className="mb-2" />
                        <p>Không có tin nhắn nào trong cuộc gọi này</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download log file */}
                {videoCallLogData.logFileUrl && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline-primary" 
                      href={videoCallLogData.logFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="me-2" />
                      Tải xuống file log chi tiết
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-4">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="text-warning mb-3" />
                <h6>Không tìm thấy log cuộc gọi</h6>
                <p className="text-muted">
                  Log cuộc gọi video chưa được tạo hoặc đã bị xóa.
                  <br />
                  Vui lòng thực hiện cuộc gọi video để tạo log.
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowVideoCallLogModal(false);
                setVideoCallLogData(null);
              }}
            >
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal thông báo không tìm thấy log */}
        <Modal 
          show={showNoLogModal} 
          onHide={() => setShowNoLogModal(false)} 
          centered
          className="no-log-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-2" />
              Không tìm thấy nhật ký cuộc gọi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div className="text-center">
                <div className="mb-3">
                  <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-muted mb-3" />
                  <h5>Chưa có nhật ký cuộc gọi</h5>
                  <p className="text-muted">
                    Vui lòng thực hiện cuộc gọi video trước khi tải nhật ký.
                  </p>
                </div>
                
                <div className="alert alert-info">
                  <div className="d-flex align-items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2 mt-1" />
                    <div>
                      <strong>Hướng dẫn:</strong>
                      <ul className="mb-0 mt-2">
                        <li>Nhấn nút "Khám trực tuyến" để bắt đầu cuộc gọi</li>
                        <li>Thực hiện cuộc gọi video với bệnh nhân</li>
                        <li>Sau khi kết thúc, nhật ký sẽ được lưu tự động</li>
                        <li>Quay lại nhấn "Tải nhật ký cuộc gọi" để cập nhật nhật ký cuộc gọi</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowNoLogModal(false)}
            >
              Đóng
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowNoLogModal(false);
                if (selectedAppointment) {
                  handleVideoCall(selectedAppointment);
                }
              }}
            >
              <FontAwesomeIcon icon={faVideo} className="me-2" />
              Bắt đầu cuộc gọi
            </Button>
          </Modal.Footer>
        </Modal>

                 {/* Video call now opens in new tab */}
      </Container>
    </div>
  );
};

export default DoctorAppointments;
