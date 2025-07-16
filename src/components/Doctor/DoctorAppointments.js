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
  faUpload, faFilePdf, faEye, faEdit, faTrash, faPills, faSave, faInfoCircle, faVideo
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';
import ARVSelectionTool from './ARVSelectionTool';
import MedicineSelector from './MedicineSelector';
import MedicalReportModal from './MedicalReportModal';
import AppointmentDetailModal from '../common/AppointmentDetailModal';
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
  
  // State cho modal xác nhận
  const [showCreateReportConfirmModal, setShowCreateReportConfirmModal] = useState(false);
  const [showCompleteAppointmentConfirmModal, setShowCompleteAppointmentConfirmModal] = useState(false);
  const [showSaveReportConfirmModal, setShowSaveReportConfirmModal] = useState(false);
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
              const patientName = detailedAppt.alternativeName || appointment.alternativeName || `Bệnh nhân #${detailedAppt.userId || appointment.userId || appointment.id}`;
              
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
                detailsLoaded: true
              });
            } else {
              // Nếu không lấy được chi tiết, sử dụng dữ liệu cơ bản
              console.warn('Could not get details for appointment:', appointment.id, 'using basic data');
              
              // Mapping serviceId từ appointmentType
              let serviceId = appointment?.serviceId;
              
              const patientName = appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`;
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
            const patientName = appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`;
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
        newMedicines[index] = {
          ...newMedicines[index],
          [field]: value
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
    setMedicalReport(prevReport => {
      return {
        ...prevReport,
        medicalResultMedicines: [...(prevReport.medicalResultMedicines || []), newMedicine]
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
      // ============ TOKEN AND ROLE DEBUGGING ============
      console.log('=== COMPREHENSIVE TOKEN DEBUGGING ===');
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ Lỗi: Không tìm thấy token. Vui lòng đăng nhập lại.');
        return;
      }
      
      console.log('📋 Token found in localStorage:', token ? 'YES' : 'NO');
      console.log('📋 Token length:', token?.length || 0);
      console.log('📋 Token first 50 chars:', token?.substring(0, 50) + '...');
      
      let tokenPayload = null;
      let tokenDoctorId = null;
      let tokenRoles = null;
      let tokenAuthorities = null;
      
      try {
        tokenPayload = jwtDecode(token);
        console.log('🔍 Full JWT Token Payload:', JSON.stringify(tokenPayload, null, 2));
        
        // Extract doctor ID
        tokenDoctorId = tokenPayload?.sub || tokenPayload?.userId || tokenPayload?.id;
        console.log('👤 Doctor ID from token:', tokenDoctorId);
        
        // Extract roles/authorities in various possible formats
        tokenRoles = tokenPayload?.roles || tokenPayload?.role || [];
        tokenAuthorities = tokenPayload?.authorities || tokenPayload?.auth || [];
        
        console.log('🔑 Roles from token:', tokenRoles);
        console.log('🔑 Authorities from token:', tokenAuthorities);
        
        // Check for DOCTOR role in different formats
        const hasDocRoleInRoles = Array.isArray(tokenRoles) ? 
          tokenRoles.some(role => typeof role === 'string' ? role.includes('DOCTOR') : role?.authority?.includes('DOCTOR')) :
          (typeof tokenRoles === 'string' && tokenRoles.includes('DOCTOR'));
          
        const hasDocRoleInAuth = Array.isArray(tokenAuthorities) ?
          tokenAuthorities.some(auth => typeof auth === 'string' ? auth.includes('DOCTOR') : auth?.authority?.includes('DOCTOR')) :
          (typeof tokenAuthorities === 'string' && tokenAuthorities.includes('DOCTOR'));
        
        // Check other possible fields
        const hasDocInScopes = tokenPayload?.scope?.includes('DOCTOR') || tokenPayload?.scopes?.includes('DOCTOR');
        const hasDocInUserType = tokenPayload?.userType === 'DOCTOR' || tokenPayload?.user_type === 'DOCTOR';
        
        console.log('🎯 DOCTOR Role Detection:');
        console.log('- In roles array/string:', hasDocRoleInRoles);
        console.log('- In authorities array/string:', hasDocRoleInAuth);
        console.log('- In scope/scopes:', hasDocInScopes);
        console.log('- In userType/user_type:', hasDocInUserType);
        
        const hasDoctorRole = hasDocRoleInRoles || hasDocRoleInAuth || hasDocInScopes || hasDocInUserType;
        console.log('✅ Final DOCTOR role check:', hasDoctorRole);
        
        if (!hasDoctorRole) {
          console.error('❌ CRITICAL: Token does not contain DOCTOR role!');
          alert('❌ Lỗi phân quyền: Token không chứa quyền DOCTOR.\n\n' +
                'Chi tiết:\n' +
                `- User ID: ${tokenDoctorId}\n` +
                `- Roles: ${JSON.stringify(tokenRoles)}\n` +
                `- Authorities: ${JSON.stringify(tokenAuthorities)}\n\n` +
                'Vui lòng đăng nhập lại hoặc liên hệ admin để kiểm tra phân quyền.');
          return;
        }
        
        // Check token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        const tokenExp = tokenPayload?.exp;
        if (tokenExp && tokenExp < currentTime) {
          console.error('❌ CRITICAL: Token has expired!');
          console.log('Token exp:', new Date(tokenExp * 1000));
          console.log('Current time:', new Date(currentTime * 1000));
          alert('❌ Token đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }
        
        console.log('✅ Token is valid and contains DOCTOR role');
        
      } catch (tokenError) {
        console.error('❌ CRITICAL: Error decoding JWT token:', tokenError);
        alert('❌ Lỗi: Token không hợp lệ. Vui lòng đăng nhập lại.\n\nChi tiết lỗi: ' + tokenError.message);
        return;
      }
      
      if (!tokenDoctorId) {
        alert('❌ Lỗi: Không thể xác định ID bác sĩ từ token. Vui lòng đăng nhập lại.');
        return;
      }
      
      console.log('=== END TOKEN DEBUGGING ===');
      // ============ END TOKEN DEBUGGING ============

      // Validate required fields - chỉ validate các trường thực sự cần thiết
      // Theo cấu trúc database, chỉ doctor_id, id, user_id là not null
      // Các trường khác đều có thể null, nên không cần validate bắt buộc
      const requiredFields = {
        // Loại bỏ tất cả validation bắt buộc vì database cho phép null
        // Chỉ cần đảm bảo có ít nhất một số thông tin cơ bản
      };

      // Không validate bắt buộc nữa, cho phép lưu với dữ liệu rỗng
      // const missingFields = Object.entries(requiredFields)
      //   .filter(([_, value]) => !value || value.toString().trim() === '')
      //   .map(([key, _]) => key);

      // if (missingFields.length > 0) {
      //   alert(`Vui lòng điền đầy đủ các trường bắt buộc:\n${missingFields.join(', ')}`);
      //   return;
      // }

      // Validate medications
      if (medicalReport.medicalResultMedicines && medicalReport.medicalResultMedicines.length > 0) {
        for (let i = 0; i < medicalReport.medicalResultMedicines.length; i++) {
          const med = medicalReport.medicalResultMedicines[i];
          if (!med.medicineId || !med.medicineName || !med.dosage || !med.status) {
            alert(`Thuốc thứ ${i + 1}: Vui lòng chọn thuốc từ danh sách và điền đầy đủ liều lượng, trạng thái`);
            return;
          }
          // Ensure medicineId is from backend (not a fallback ID)
          if (med.medicineId.includes('new_med_') || med.medicineId.includes('fallback_med_')) {
            alert(`Thuốc thứ ${i + 1}: Vui lòng chọn thuốc từ danh sách có sẵn, không sử dụng ID tạm thời`);
            return;
          }
        }
      }

      console.log('Medical Result ID:', medicalReport.medicalResultId);
      console.log('Doctor trying to update:', tokenDoctorId);
        // Kiểm tra ownership trước khi update        // Kiểm tra ownership trước khi update
      console.log('=== DEBUG: Checking medical result ownership ===');
      let appointmentDoctorId = selectedAppointment?.doctorId;
      
      try {
        const appointmentResult = await appointmentAPI.getAppointmentById(selectedAppointment.id);
        console.log('Current appointment data:', appointmentResult.data);
        console.log('Appointment medicalResultId:', appointmentResult.data?.medicalResultId);
        console.log('Appointment doctorId from API:', appointmentResult.data?.doctorId);
        
        // Update appointment doctor ID if we got it from API
        if (appointmentResult.data?.doctorId) {
          appointmentDoctorId = appointmentResult.data.doctorId;
          console.log('Updated appointment doctor ID from API:', appointmentDoctorId);
        }
      } catch (ownershipError) {
        console.warn('Could not check appointment for ownership:', ownershipError);
      }
      
      console.log('=== OWNERSHIP ANALYSIS ===');
      console.log('Token doctor ID:', tokenDoctorId);
      console.log('Appointment doctor ID:', appointmentDoctorId);
      console.log('Doctor IDs match:', tokenDoctorId === appointmentDoctorId);
      
      // Check if doctor ownership matches
      if (appointmentDoctorId && tokenDoctorId !== appointmentDoctorId) {
        console.warn('⚠️ Doctor ownership mismatch detected!');
        const confirmProceed = window.confirm(
          `⚠️ Cảnh báo: Bạn đang cố gắng cập nhật báo cáo của bác sĩ khác.\n\n` +
          `Bác sĩ của appointment: ${appointmentDoctorId}\n` +
          `Bác sĩ hiện tại: ${tokenDoctorId}\n\n` +
          `Bạn có muốn tiếp tục không? (Có thể sẽ gặp lỗi 403)`
        );
        
        if (!confirmProceed) {
          console.log('User cancelled due to ownership mismatch');
          setShowSaveReportConfirmModal(false);
          return;
        }
      }      const updateData = {
        doctorId: getDoctorIdFromToken(), // Always use token doctor ID for ownership
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
        hdl: medicalReport.hdl ? parseInt(medicalReport.hdl) : null,        triglycerides: medicalReport.trigilycerides ? parseInt(medicalReport.trigilycerides) : null,
        patientProgressEvaluation: medicalReport.patientProgressEvaluation || null,
        plan: medicalReport.plan || null,
        recommendation: medicalReport.recommendation || null,        medicalResultMedicines: Array.isArray(medicalReport.medicalResultMedicines) && medicalReport.medicalResultMedicines.length > 0 ?
          medicalReport.medicalResultMedicines
            .filter(med => med && med.medicineName && med.dosage && med.medicineId)
            .map((med) => ({
              medicineId: parseInt(med.medicineId), // Ensure medicineId is integer
              medicineName: med.medicineName || '',
              dosage: med.dosage || '',
              status: med.status || 'Mới'
            })) : null, // Send null instead of empty array
        // ARV file handling - include the file object for upload
        arvFile: medicalReport.arvFile || null, // File object from ARV Selection Tool
        arvRegimenResultURL: medicalReport.arvRegimenResultURL || "",
        arvMetadata: medicalReport.arvMetadata || null // Include ARV metadata for later use
      };console.log('=== DEBUG: Trying to update existing report ===');
      console.log('Medical Result ID:', medicalReport.medicalResultId);      console.log('Doctor from token:', tokenDoctorId);
      console.log('Doctor in updateData:', updateData.doctorId);
      console.log('Appointment doctor ID:', selectedAppointment?.doctorId);
      console.log('Update Payload:', JSON.stringify(updateData, null, 2));      // Additional debug - check medicines format
      if (updateData.medicalResultMedicines && updateData.medicalResultMedicines.length > 0) {
        console.log('Medicines being sent:');
        updateData.medicalResultMedicines.forEach((med, index) => {
          console.log(`Medicine ${index + 1}:`, {
            medicineId: med.medicineId,
            type: typeof med.medicineId,
            medicineName: med.medicineName,
            dosage: med.dosage,
            status: med.status
          });
        });      } else {
        console.log('No medicines to send (null or empty)');
      }
        // Debug ARV file
      if (updateData.arvFile) {
        console.log('📎 ARV File being sent:', {
          name: updateData.arvFile.name,
          type: updateData.arvFile.type,
          size: updateData.arvFile.size,
          hasData: !!updateData.arvFile.data
        });
        
        // Validate ARV file before sending
        if (updateData.arvFile.type && !updateData.arvFile.type.includes('pdf')) {
          console.warn('⚠️ ARV file is not a PDF:', updateData.arvFile.type);
          const confirmNonPdf = window.confirm(
            '⚠️ Cảnh báo: File ARV không phải định dạng PDF.\n\n' +
            `Loại file: ${updateData.arvFile.type}\n` +
            'Hệ thống có thể không chấp nhận file này.\n\n' +
            'Bạn có muốn tiếp tục không?'
          );
          if (!confirmNonPdf) {
            console.log('User cancelled due to non-PDF ARV file');
            return;
          }
        }
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (updateData.arvFile.size > maxSize) {
          alert('❌ Lỗi: File ARV quá lớn. Kích thước tối đa: 10MB\n\n' +
                `Kích thước hiện tại: ${(updateData.arvFile.size / 1024 / 1024).toFixed(2)}MB`);
          return;
        }
        
      } else {
        console.log('📎 No ARV file to send');
      }
      
      const initialResult = await medicalResultAPI.updateMedicalResult(medicalReport.medicalResultId, updateData);
      
      console.log('=== DEBUG: API Response ===', initialResult);      if (initialResult.success) {
        console.log('=== SUCCESS: Medical report updated successfully ===');
        
        // Enhanced success message with ARV feedback
        let successMessage = '✅ Cập nhật báo cáo y tế thành công!\n\n📋 Tất cả thông tin đã được lưu đầy đủ.';
        
        if (updateData.arvFile) {
          successMessage += '\n\n📎 File ARV đã được tải lên và lưu trữ thành công.';
          console.log('📎 ARV file uploaded successfully with medical report update');
        }
        
        if (updateData.medicalResultMedicines && updateData.medicalResultMedicines.length > 0) {
          successMessage += `\n\n💊 Đã lưu ${updateData.medicalResultMedicines.length} loại thuốc.`;
        }
        
        // Đã có modal xác nhận, không cần alert nữa
        // alert(successMessage);
        
        if (selectedAppointment) {
          localStorage.removeItem(`appointment_${selectedAppointment.id}_progress`);
        }
        await loadDoctorAppointments();
        handleCloseReportModal();
        setShowSaveReportConfirmModal(false);
        return;
      }// Kiểm tra lỗi 403 với nhiều cách khác nhau
      const is403Error = initialResult.is403 === true ||
                        initialResult.error?.includes?.('403') ||
                        initialResult.message?.includes?.('403') ||
                        (initialResult.error && typeof initialResult.error === 'object' && 
                         (initialResult.error.status === 403 || initialResult.error.response?.status === 403)) ||
                        (initialResult.success === false && initialResult.message?.includes('403'));
        console.log('=== DEBUG: Checking 403 error ===');
      console.log('Full API result:', initialResult);
      console.log('Error object:', initialResult.error);
      console.log('Message:', initialResult.message);
      console.log('Success flag:', initialResult.success);
      console.log('Is 403 Error:', is403Error);      if (is403Error) {
        console.warn('=== 403 FORBIDDEN: Detailed analysis ===');
        console.log('Possible reasons:');        console.log('1) Doctor ownership mismatch:');
        console.log('   - Token doctor ID:', tokenDoctorId);
        console.log('   - Appointment doctor ID:', selectedAppointment?.doctorId);
        console.log('   - Update data doctor ID:', updateData.doctorId);
        console.log('2) Medicine ID format issues:');
        if (updateData.medicalResultMedicines) {
          updateData.medicalResultMedicines.forEach((med, i) => {
            console.log(`   - Medicine ${i+1}: ID=${med.medicineId} (${typeof med.medicineId})`);
          });
        }
        console.log('3) ARV file issue:', medicalReport.arvRegimenResultURL ? 'File present' : 'No file');
        console.log('Full error response:', initialResult);
        
        // Step 1: Try without medicines first (most common fix)
        const retryWithoutMedicines = window.confirm(
          'Lỗi 403: Không có quyền cập nhật báo cáo y tế.\n\n' +
          'Nguyên nhân có thể là:\n' +
          '• Báo cáo chưa được gán đúng bác sĩ\n' +
          '• Dữ liệu thuốc không hợp lệ\n' +
          '• Quyền truy cập bị hạn chế\n\n' +
          'Thử lưu báo cáo cơ bản trước (không bao gồm thuốc)?'
        );

        if (retryWithoutMedicines) {
          try {
            console.log('=== STEP 1: Attempting update without medicines ===');
            const simpleUpdateData = {
              ...updateData,
              medicalResultMedicines: null, // Remove medicines
              arvRegimenResultURL: "" // Remove ARV file
            };
            
            console.log('Simple update payload:', JSON.stringify(simpleUpdateData, null, 2));
            const retryResult = await medicalResultAPI.updateMedicalResult(medicalReport.medicalResultId, simpleUpdateData);
              if (retryResult.success) {
              console.log('=== SUCCESS: Simple update worked ===');
              
              // Check if we had ARV file that was excluded
              const hadARVFile = updateData.arvFile;
              let baseSuccessMessage = '✅ Đã lưu báo cáo y tế cơ bản thành công!\n\n' + 
                    'Lưu ý: Chưa bao gồm thông tin thuốc và file ARV.\n' + 
                    'Bạn có thể thêm thuốc sau bằng cách chỉnh sửa báo cáo.';
              
              if (hadARVFile) {
                const retryARV = window.confirm(
                  baseSuccessMessage + 
                  '\n\n📎 Bạn có file ARV đã tạo từ công cụ ARV.\n' +
                  'Bạn có muốn thử tải lên file ARV riêng biệt không?'
                );
                
                if (retryARV) {
                  try {
                    console.log('=== STEP 1B: Attempting ARV file upload separately ===');
                    const arvOnlyData = {
                      doctorId: getDoctorIdFromToken(),
                      arvFile: updateData.arvFile,
                      arvRegimenResultURL: updateData.arvRegimenResultURL
                    };
                    
                    const arvResult = await medicalResultAPI.updateMedicalResult(medicalReport.medicalResultId, arvOnlyData);
                    
                    if (arvResult.success) {
                      console.log('=== SUCCESS: ARV file uploaded separately ===');
                      // Đã có modal xác nhận, không cần alert
                      // alert('✅ Đã lưu báo cáo y tế và file ARV thành công!\n\n' +
                      //       '📋 Báo cáo cơ bản: ✅\n' +
                      //       '📎 File ARV: ✅\n' +
                      //       '💊 Thuốc: Cần thêm riêng sau này');
                    } else {
                      console.log('=== FAILED: ARV upload failed ===', arvResult);
                      // Đã có modal xác nhận, chỉ log lỗi
                      console.error('❌ Không thể tải file ARV:', arvResult.message || 'Lỗi không xác định');
                      // alert('✅ Báo cáo cơ bản đã lưu thành công!\n\n' +
                      //       '❌ Không thể tải file ARV: ' + (arvResult.message || 'Lỗi không xác định') + '\n\n' +
                      //       'Bạn có thể thử tải file ARV lại bằng cách chỉnh sửa báo cáo.');
                    }
                  } catch (arvError) {
                    console.error('=== ARV UPLOAD ERROR ===', arvError);
                    // Đã có modal xác nhận, chỉ log lỗi
                    console.error('❌ Lỗi khi tải file ARV:', arvError.message);
                    // alert('✅ Báo cáo cơ bản đã lưu thành công!\n\n' +
                    //       '❌ Lỗi khi tải file ARV: ' + arvError.message + '\n\n' +
                    //       'Bạn có thể thử tải file ARV lại bằng cách chỉnh sửa báo cáo.');
                  }
                } else {
                  // Đã có modal xác nhận, không cần alert
                  // alert(baseSuccessMessage);
                }
              } else {
                alert(baseSuccessMessage);
              }
              
              if (selectedAppointment) {
                localStorage.removeItem(`appointment_${selectedAppointment.id}_progress`);
              }
              await loadDoctorAppointments();
              handleCloseReportModal();
              return;
            } else {
              console.log('=== STEP 1 FAILED: Still getting error ===', retryResult);
            }
          } catch (retryError) {
            console.error('=== STEP 1 ERROR ===', retryError);
          }
        }
        
        // Step 2: Create new medical result if simple update also failed
        const confirmNewRecord = window.confirm(
          '❌ Vẫn không thể cập nhật báo cáo hiện tại.\n\n' +
          'Có thể báo cáo này đã bị khóa hoặc thuộc về bác sĩ khác.\n\n' +
          '🔄 Tạo báo cáo y tế mới cho lịch hẹn này?\n' +
          '(Dữ liệu hiện tại sẽ được chuyển sang báo cáo mới)'
        );        if (confirmNewRecord) {          try {
            console.log('=== STEP 2: Creating new medical result for appointment ===', selectedAppointment.id);
            
            // Try to create medical result with detailed logging
            let createResult = await medicalResultAPI.createMedicalResult(selectedAppointment.id);
            
            // If 404, try alternative endpoints
            if (!createResult.success && createResult.error && 
                (createResult.error.status === 404 || createResult.message?.includes('404'))) {
              
              console.log('=== STEP 2A: Primary endpoint failed with 404, trying alternatives ===');
              
              // Import api directly for alternative endpoints
              const { api } = await import('../../services/api');
              
              // Try alternative endpoint formats
              const alternativeEndpoints = [
                `/medical-result/create/${selectedAppointment.id}`,
                `/medical-result/createMedicalResult/${selectedAppointment.id}`,
                `/medicalresult/create/${selectedAppointment.id}`,
                `/api/medical-result/create-MedicalResult/${selectedAppointment.id}`
              ];
                for (const altEndpoint of alternativeEndpoints) {
                try {
                  console.log(`Trying alternative endpoint: ${altEndpoint}`);
                  const response = await api.post(altEndpoint, { doctorId: getDoctorIdFromToken() });
                  if (response.data) {
                    console.log(`✅ Alternative endpoint worked: ${altEndpoint}`);
                    createResult = {
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

            if (createResult.success && createResult.data?.id) {
              const newMedicalResultId = createResult.data.id;
              console.log('=== STEP 2: New medical result created with ID ===', newMedicalResultId);              // Try to update with simplified data first (no medicines, no ARV)
              const cleanUpdateData = {
                doctorId: getDoctorIdFromToken(), // Ensure we use the token doctor ID
                weight: updateData.weight,
                height: updateData.height,
                bmi: updateData.bmi,
                temperature: updateData.temperature,
                bloodPressure: updateData.bloodPressure,
                heartRate: updateData.heartRate,
                cd4Count: updateData.cd4Count,
                viralLoad: updateData.viralLoad,
                hemoglobin: updateData.hemoglobin,
                whiteBloodCell: updateData.whiteBloodCell,
                platelets: updateData.platelets,
                glucose: updateData.glucose,
                creatinine: updateData.creatinine,
                alt: updateData.alt,
                ast: updateData.ast,
                totalCholesterol: updateData.totalCholesterol,
                ldl: updateData.ldl,
                hdl: updateData.hdl,
                triglycerides: updateData.triglycerides,
                patientProgressEvaluation: updateData.patientProgressEvaluation,
                plan: updateData.plan,
                recommendation: updateData.recommendation,
                medicalResultMedicines: null, // Start without medicines
                arvRegimenResultURL: "" // Start without ARV file
              };

              console.log('=== STEP 2: Updating new medical result with clean data ===');
              console.log('Clean payload:', JSON.stringify(cleanUpdateData, null, 2));
              
              const finalResult = await medicalResultAPI.updateMedicalResult(newMedicalResultId, cleanUpdateData);

              if (finalResult.success) {
                console.log('=== SUCCESS: New medical result created and updated successfully ===');
                const hasSkippedData = (updateData.medicalResultMedicines && updateData.medicalResultMedicines.length > 0) || 
                                     (medicalReport.arvRegimenResultURL && medicalReport.arvRegimenResultURL !== "");
                
                let successMessage = '✅ Đã tạo và lưu báo cáo y tế mới thành công!';
                if (hasSkippedData) {
                  successMessage += '\n\n⚠️ Lưu ý: Chưa bao gồm thông tin thuốc và file ARV do vấn đề quyền truy cập.\nBạn có thể thêm sau bằng cách chỉnh sửa báo cáo.';
                }
                
                // Đã có modal xác nhận, không cần alert
                // alert(successMessage);
                if (selectedAppointment) {
                  localStorage.removeItem(`appointment_${selectedAppointment.id}_progress`);
                }
                await loadDoctorAppointments();
                handleCloseReportModal();
              } else {
                console.error('=== STEP 2 FAILED: Could not update the new medical result ===', finalResult);
                alert('❌ Tạo báo cáo mới thành công nhưng không thể cập nhật dữ liệu.\n\nLỗi: ' + (finalResult.message || 'Không rõ nguyên nhân.'));
              }
            } else {
              console.error('=== STEP 2 FAILED: Could not create a new medical result ===', createResult);
              alert('❌ Không thể tạo báo cáo mới.\n\nLỗi: ' + (createResult.message || 'Không rõ nguyên nhân.'));
            }
          } catch (workaroundError) {
            console.error('=== STEP 2 EXCEPTION: Caught error in fallback ===', workaroundError);
            alert('❌ Đã xảy ra lỗi không mong muốn trong khi tạo báo cáo mới.');
          }
        }
      } else {
        // Xử lý các lỗi khác không phải 403
        console.error('=== FAILED: API returned a non-403 error ===', initialResult);
        alert('Lỗi khi cập nhật báo cáo y tế: ' + (initialResult.message || 'Không rõ nguyên nhân.'));
      }
    } catch (error) {
      console.error('=== EXCEPTION: Caught error in performSaveReport ===', error);
      alert('Đã xảy ra lỗi không mong muốn khi lưu báo cáo y tế: ' + error.message);
    } finally {
      // Đóng modal xác nhận
      setShowSaveReportConfirmModal(false);
    }
  };  // Hàm tạo medical result cho appointment
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
                name: appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`,
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
                  medicineName: medicine.name || medicine.medicineName || '', // Map API 'name' to 'medicineName' for component
                  name: medicine.name || medicine.medicineName || '', // Keep both for backward compatibility
                  dosage: medicine.dosage || '',
                  status: medicine.status || 'Mới'
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
            name: appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`,
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
        patientName: pendingActionAppointment.alternativeName,
        currentStatus: pendingActionAppointment.status,
        originalStatus: pendingActionAppointment.originalStatus,
        hasmedicalResult: !!pendingActionAppointment.medicalResultId
      });

      console.log('=== DEBUG: Calling API to update appointment status ===');
      console.log('Appointment ID:', pendingActionAppointment.id);
      console.log('Target Status: COMPLETED');
      
      // Call API to update status to COMPLETED
      const result = await appointmentAPI.updateAppointmentStatus(pendingActionAppointment.id, 'COMPLETED');
      
      console.log('=== DEBUG: API Response ===', result);
      
      if (result.success) {
        console.log('✅ SUCCESS: Appointment status updated to COMPLETED');
        
        if (result.endpoint) {
          console.log('📡 Success endpoint:', result.endpoint);
        }
        
        // Reload appointments to update the status in UI
        console.log('🔄 Reloading appointments to update UI...');
        await loadDoctorAppointments();
        
      } else {
        console.error('❌ FAILED: API returned error');
        console.error('Error details:', result);
      }
    } catch (error) {
      console.error('=== EXCEPTION: Error in handleCompleteAppointment ===', error);
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
                                <strong>Bệnh nhân:</strong> {appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`}
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
                              {/* Hiển thị "chi tiết lịch hẹn" luôn có, "videoCall" chỉ cho bệnh nhân ẩn danh */}
                              <div className="d-flex align-items-center gap-2">
                                <Button
                                  variant="outline-secondary" 
                                  size="sm" 
                                  className={`action-btn ${appointment.isAnonymous === true ? 'flex-grow-1' : 'w-100'}`}
                                  onClick={() => handleShowAppointmentDetails(appointment)}
                                >
                                  <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                                  Chi tiết lịch hẹn
                                </Button>
                                
                                {/* Chỉ hiển thị Video Call cho bệnh nhân khám ẩn danh */}
                                {appointment.isAnonymous === true && (
                                  <>
                                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>|</span>
                                    
                                    <Button
                                      variant={canMakeVideoCall(appointment) ? "success" : "secondary"} 
                                      size="sm" 
                                      className="action-btn flex-grow-1"
                                      onClick={() => handleVideoCall(appointment)}
                                      disabled={!canMakeVideoCall(appointment)}
                                      title={!canMakeVideoCall(appointment) ? 
                                        "Video Call chỉ khả dụng trong khung giờ khám của ngày hôm nay" : 
                                        "Bắt đầu Video Call"}
                                    >
                                      <FontAwesomeIcon icon={faVideo} className="me-1" />
                                      Video Call
                                      {!canMakeVideoCall(appointment) && (
                                        <small className="d-block" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                                          (Chưa đến giờ)
                                        </small>
                                      )}
                                    </Button>
                                  </>
                                )}
                              </div>
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
                            {appointment.alternativeName || `Bệnh nhân #${appointment.userId || appointment.id}`}
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
                              onClick={() => handleShowMedicalReportModal(appointment)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                              Chỉnh sửa báo cáo y tế
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
                    <strong>👤 Bệnh nhân:</strong> {pendingActionAppointment.alternativeName || `Bệnh nhân #${pendingActionAppointment.userId}`}
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
                    <strong>👤 Bệnh nhân:</strong> {pendingActionAppointment.alternativeName || `Bệnh nhân #${pendingActionAppointment.userId}`}
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
                    <strong>👤 Bệnh nhân:</strong> {selectedAppointment.alternativeName || `Bệnh nhân #${selectedAppointment.userId}`}
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
                 {/* Video call now opens in new tab */}
      </Container>
    </div>
  );
};

export default DoctorAppointments;
