import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUserMd, 
  faClock, 
  faCommentMedical, 
  faCheckCircle,
  faHeartbeat,
  faUser,
  faEnvelope,
  faPhone,
  faArrowRight,
  faArrowLeft,
  faStethoscope,
  faVial,
  faSyringe,
  faHospital,
  faMapMarkerAlt,
  faInfoCircle,
  faExclamationTriangle,
  faVenusMars,
  faCreditCard,
  faMoneyBillWave,
  faSpinner,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import './AppointmentForm.css';
import { useLocation } from 'react-router-dom';
import BackButton from '../common/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI, slotAPI, doctorAPI, serviceAPI } from '../../services/api';

const AppointmentForm = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);  const [formData, setFormData] = useState({
    serviceType: 'hiv-care',
    serviceDetail: '',
    serviceId: null, // ID thực của service (1 hoặc 2)
    doctor: '',
    date: '',
    time: '',
    healthIssues: '',
    notes: '', // Trường ghi chú riêng biệt
    customerId: '',
    phone: '',
    dob: '',
    name: '',
    gender: '',
    registrationType: 'hiv-care',
    isOnline: false, // false: khám trực tiếp, true: khám trực tuyến
    isAnonymous: false, // false: hiển thị thông tin, true: ẩn thông tin cá nhân
    // Payment fields
    paymentMethod: 'vnpay', // Chỉ hỗ trợ VNPay
    paymentAmount: 0, // Số tiền thanh toán
    paymentStatus: 'pending' // 'pending' | 'processing' | 'completed' | 'failed'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAvailableSlots, setLoadingAvailableSlots] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // useState hook để lưu trữ array of objects chứa thông tin slot thời gian từ database
  const [availableTimes, setAvailableTimes] = useState([]);
  // useState hook để lưu trữ array of objects chứa thông tin bác sĩ từ database
  const [availableDoctors, setAvailableDoctors] = useState([]);
  // useState hook để lưu trữ array of objects chứa thông tin services từ database
  const [availableServices, setAvailableServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // useEffect hook để kiểm tra và set doctor từ location state khi component mount
  useEffect(() => {
    // Sử dụng optional chaining (?.) để tránh lỗi nếu location.state null/undefined
    if (location.state?.selectedDoctor) {
      // Cập nhật formData bằng spread operator và callback function để tránh stale closure
      setFormData(prev => ({
        ...prev, // Giữ lại các giá trị cũ
        doctor: location.state.selectedDoctor // Ghi đè giá trị doctor
      }));
    }
  }, [location]); // Dependency array chỉ chứa location để re-run khi location thay đổi

  // useEffect để auto-fill thông tin user khi component mount
  useEffect(() => {
    console.log('=== DETAILED AUTO-FILL DEBUG ===');
    console.log('⚡ Auto-fill effect triggered');
    
    // Kiểm tra localStorage
    console.log('📦 Checking localStorage...');
    const savedRegistrationInfo = localStorage.getItem('registrationInfo');
    const savedUser = localStorage.getItem('user');
    console.log('- registrationInfo in localStorage:', savedRegistrationInfo);
    console.log('- user in localStorage:', savedUser);
    
    // Lấy thông tin từ registrationInfo backup (nếu có)
    let registrationData = {};
    if (savedRegistrationInfo) {
      try {
        registrationData = JSON.parse(savedRegistrationInfo);
        console.log('✅ Found backup registration info:', registrationData);
      } catch (e) {
        console.warn('❌ Failed to parse backup registration info:', e);
      }
    } else {
      console.log('ℹ️ No backup registration info found');
    }
    
    // Kiểm tra user object
    console.log('👤 Checking user object...');
    if (user) {
      console.log('✅ User object exists:', user);
      console.log('📋 User properties:', Object.keys(user));
      
      // Log từng property riêng biệt
      console.log('🔍 Individual user properties:');
      console.log('  - user.fullName:', user.fullName);
      console.log('  - user.name:', user.name);
      console.log('  - user.phoneNumber:', user.phoneNumber);
      console.log('  - user.phone:', user.phone);
      console.log('  - user.gender:', user.gender);
      console.log('  - user.birthdate:', user.birthdate);
      console.log('  - user.dob:', user.dob);
      
      // Extract thông tin từ user object với fallback từ registrationData
      const nameToFill = user.fullName || user.name || user.displayName || registrationData.fullName || '';
      const phoneToFill = user.phoneNumber || user.phone || user.telephone || registrationData.phoneNumber || '';
      
      // Gender mapping: JWT trả về MALE/FEMALE, form cần MALE/FEMALE
      let genderToFill = user.gender || user.sex || registrationData.gender || '';
      // Đảm bảo gender format đúng
      if (genderToFill && typeof genderToFill === 'string') {
        genderToFill = genderToFill.toUpperCase(); // Chuyển về uppercase
      }
      
      // Birthdate format: JWT có thể trả về nhiều format khác nhau
      let dobToFill = user.birthdate || user.dob || user.dateOfBirth || user.birthday || registrationData.birthdate || '';
      // Đảm bảo format date đúng cho input type="date" (YYYY-MM-DD)
      if (dobToFill) {
        try {
          // Nếu là Date object, convert về string
          if (dobToFill instanceof Date) {
            dobToFill = dobToFill.toISOString().split('T')[0];
          } else if (typeof dobToFill === 'string') {
            // Nếu là string, parse và format lại
            const date = new Date(dobToFill);
            if (!isNaN(date.getTime())) {
              dobToFill = date.toISOString().split('T')[0];
            } else {
              // Nếu parse failed, reset về empty
              dobToFill = '';
            }
          }
        } catch (e) {
          console.warn('Failed to parse birthdate:', dobToFill, e);
          dobToFill = '';
        }
      }
      
      console.log('🎯 Final extracted values:');
      console.log('  - Name:', nameToFill, '(source: user or backup)');
      console.log('  - Phone:', phoneToFill, '(source: user or backup)');
      console.log('  - Gender:', genderToFill, '(source: user or backup)');
      console.log('  - DOB:', dobToFill, '(source: user or backup)');
      
      setFormData(prev => {
        const newData = {
          ...prev,
          name: nameToFill,
          phone: phoneToFill,
          gender: genderToFill,
          dob: dobToFill
        };
        console.log('📝 FormData UPDATE:');
        console.log('  BEFORE:', {
          name: prev.name,
          phone: prev.phone,
          gender: prev.gender,
          dob: prev.dob
        });
        console.log('  AFTER:', {
          name: newData.name,
          phone: newData.phone,
          gender: newData.gender,
          dob: newData.dob
        });
        return newData;
      });
      
      // Xóa backup info sau khi đã sử dụng
      if (savedRegistrationInfo && (registrationData.fullName || registrationData.phoneNumber || registrationData.gender || registrationData.birthdate)) {
        localStorage.removeItem('registrationInfo');
        console.log('🧹 Cleaned up backup registration info after use');
      }
    } else if (Object.keys(registrationData).length > 0) {
      // Nếu không có user nhưng có registrationData
      console.log('⚠️ No user object, using backup registration info:', registrationData);
      
      setFormData(prev => ({
        ...prev,
        name: registrationData.fullName || '',
        phone: registrationData.phoneNumber || '',
        gender: registrationData.gender || '',
        dob: registrationData.birthdate || ''
      }));
    } else {
      console.log('❌ No user object or backup registration info available for auto-fill');
    }
    
    console.log('=== END AUTO-FILL DEBUG ===');
  }, [user]); // Dependency array chứa user để re-run khi user thay đổi  // useEffect để load doctors từ database
  useEffect(() => {
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      try {
        console.log('Loading doctors from database...');
        const result = await doctorAPI.getAllDoctors();
        
        if (result.success && result.data) {
          console.log('Doctors loaded successfully:', result.data);
          
          // Transform doctors data từ backend format thành format component cần
          const transformedDoctors = result.data.map(doctor => ({
            id: doctor.id || doctor.doctorId,
            name: doctor.name || doctor.fullName || doctor.doctorName,
            specialty: doctor.specialty || doctor.specialization || 'Bác sĩ HIV',
            title: doctor.title || 'Bác sĩ',
            experience: doctor.experience || doctor.yearsOfExperience || '5+ năm',
            available: doctor.available !== false, // Default true nếu không có field available
            image: doctor.image || doctor.avatar || '/images/default-doctor.jpg'
          }));
          
          setAvailableDoctors(transformedDoctors);          console.log('Transformed doctors:', transformedDoctors);
        } else {
          console.warn('Failed to load doctors or no data:', result);
          // Không dùng fallback - để thấy lỗi thực tế
          setAvailableDoctors([]);
        }
      } catch (error) {
        console.error('Error loading doctors:', error);
        // Không dùng fallback - để thấy lỗi thực tế
        setAvailableDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []); // Chỉ chạy một lần khi component mount

  // useEffect để load services từ database
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      try {
        console.log('Loading services from database...');
        const result = await serviceAPI.getAllServiceEntity();
        
        if (result.success && result.data) {
          console.log('Services loaded successfully:', result.data);
          setAvailableServices(result.data);
        } else {
          console.warn('Failed to load services or no data:', result);
          setAvailableServices([]);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setAvailableServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []); // Chỉ chạy một lần khi component mount// Event handler để xử lý thay đổi input/select values
  const handleInputChange = (e) => {
    // Destructuring assignment để lấy name và value từ event target
    const { name, value } = e.target;
    
    // Validation riêng cho số điện thoại
    if (name === 'phone') {
      // Chỉ cho phép nhập số và giới hạn 10 số
      const phoneValue = value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
      if (phoneValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: phoneValue
        });
      }
      return;
    }
    
    // Cập nhật formData
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Reset slot khi đổi bác sĩ hoặc ngày, và load lại slots
    if (name === 'doctor' || name === 'date') {
      // Reset time khi đổi bác sĩ hoặc ngày
      setFormData(prev => ({
        ...prev,
        [name]: value,
        time: '' // Reset time selection
      }));
      
      // Load available slots nếu có đủ doctorId và date
      const doctorId = name === 'doctor' ? value : formData.doctor;
      const selectedDate = name === 'date' ? value : formData.date;
      
      if (doctorId && selectedDate) {
        loadAvailableSlots(doctorId, selectedDate);
      } else {
        setAvailableTimes([]); // Clear slots nếu thiếu thông tin
      }
    }
  };

  // Function validation số điện thoại
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Chính xác 10 số
    return phoneRegex.test(phone);
  };

  // Function để load available slots theo doctorId và date
  const loadAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) {
      console.log('Missing doctorId or date, clearing slots');
      setAvailableTimes([]);
      return;
    }

    setLoadingAvailableSlots(true);
    console.log('Loading available slots for doctor:', doctorId, 'date:', date);
    
    try {
      const result = await slotAPI.getAvailableSlotsByDoctorAndDate(doctorId, date);
      
      if (result.success && result.data) {
        console.log('Available slots loaded:', result.data);
          // Transform slots data từ backend format thành format component cần
        const transformedSlots = result.data.map(slot => {
          console.log('Processing slot from API:', slot);
          
          return {
            id: slot.id || slot.slotId,
            label: `Slot ${slot.slot_index || slot.slotIndex || 'N/A'}`,
            time: `${slot.slot_start_time || slot.startTime || 'N/A'} - ${slot.slot_end_time || slot.endTime || 'N/A'}`,
            slotIndex: slot.slot_index || slot.slotIndex,
            startTime: slot.slot_start_time || slot.startTime,
            endTime: slot.slot_end_time || slot.endTime,
            available: true // Chỉ slot trống mới được trả về từ API
          };        });
        
        // Sort slots theo slot_index
        const sortedSlots = transformedSlots.sort((a, b) => {
          const indexA = parseInt(a.slotIndex) || 0;
          const indexB = parseInt(b.slotIndex) || 0;
          return indexA - indexB;
        });
        
        setAvailableTimes(sortedSlots);
        console.log('Transformed available slots:', sortedSlots);
      } else {
        console.warn('No available slots found or API failed:', result);
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingAvailableSlots(false);
    }
  };

  // Form submit handler với validation logic cho từng step
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn default form submission behavior
      // Switch case logic dựa trên current step để validate và navigate
    if (formStep === 1) {
      // Validation: kiểm tra serviceDetail có được chọn không
      if (!formData.serviceDetail || !formData.serviceId) {
        alert('Vui lòng chọn chi tiết dịch vụ');
        return; // Early return để dừng execution
      }
      setFormStep(2); // Navigate to next step
    } else if (formStep === 2) {
      // Validation: kiểm tra isOnline có được set chưa (có thể true hoặc false)
      if (formData.isOnline === undefined || formData.isOnline === null) {
        alert('Vui lòng chọn hình thức khám');
        return;
      }
      setFormStep(3);    } else if (formStep === 3) {
      // Validation: kiểm tra bác sĩ được chọn trước
      if (!formData.doctor) {
        alert('Vui lòng chọn bác sĩ ở bước 1');
        return;
      }
      
      // Validation: kiểm tra cả date và time bằng logical OR
      if (!formData.date || !formData.time) {
        alert('Vui lòng chọn ngày và giờ khám');
        return;
      }
      setFormStep(4);} else if (formStep === 4) {
      // Final validation cho bước 4: kiểm tra các required fields
      if (!formData.name || !formData.phone || !formData.dob || !formData.gender) {
        alert('Vui lòng điền đầy đủ họ tên, số điện thoại, ngày sinh và giới tính');
        return;
      }
      
      // Validation số điện thoại
      if (!validatePhoneNumber(formData.phone)) {
        alert('Số điện thoại phải có đúng 10 số (ví dụ: 0912345678)');
        return;
      }
      
      // Tính toán payment amount từ service đã chọn
      const selectedService = availableServices.find(service => service.id === formData.serviceId);
      const servicePrice = selectedService?.price || 200000; // Default price
      const serviceFee = Math.round(servicePrice * 0.05); // 5% service fee
      const totalAmount = servicePrice + serviceFee;
      
      setFormData(prev => ({
        ...prev,
        paymentAmount: totalAmount
      }));
      
      setFormStep(5); // Chuyển sang bước thanh toán
    } else if (formStep === 5) {
      // Validation cho bước thanh toán - VNPay đã được set mặc định
      // Gửi appointment đến backend
      handleCreateAppointment();
    }
  };

  // Handler để navigate về step trước đó
  const handlePreviousStep = () => {
    // Guard clause: chỉ cho phép quay lại nếu không phải step đầu tiên
    if (formStep > 1) {
      setFormStep(formStep - 1); // Decrement step counter
    }
  };
  // Handler để tạo appointment mới
  const handleCreateAppointment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Validate required fields trước khi gửi
      if (!user?.id) {
        setErrorMessage('Lỗi: Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      if (!formData.serviceId) {
        setErrorMessage('Lỗi: Không có thông tin dịch vụ. Vui lòng chọn lại dịch vụ.');
        return;
      }
      
      if (!formData.time) {
        setErrorMessage('Lỗi: Không có thông tin slot. Vui lòng chọn lại giờ khám.');
        return;
      }      // Chuẩn bị dữ liệu appointment theo schema backend yêu cầu
      const appointmentData = {
        appointmentDate: formData.date,
        reason: formData.healthIssues || '', // Lý do khám bệnh
        alternativeName: formData.name,
        alternativePhoneNumber: formData.phone,
        birthdate: formData.dob,
        gender: formData.gender,
        notes: formData.healthIssues || '',
        doctorId: formData.doctor || null, // Giữ nguyên string UUID, không parseInt
        serviceId: formData.serviceId, // Service ID thực từ user chọn (string theo API mới)
        isAnonymous: formData.isAnonymous, // true nếu tick vào checkbox ẩn danh
        isOnline: formData.isOnline, // true nếu chọn khám trực tuyến, false nếu chọn khám trực tiếp
        slotEntityId: formData.time // Giữ nguyên slotId từ database (có thể là string)
      };
        console.log('Creating appointment with schema-compliant data:', appointmentData);
      console.log('Current user:', user);
      console.log('Service ID:', formData.serviceId, 'Type:', typeof formData.serviceId);
      console.log('Slot ID:', formData.time, 'Type:', typeof formData.time);
      console.log('Doctor ID:', formData.doctor, 'Type:', typeof formData.doctor);
      console.log('=== DEBUG: Online/Anonymous values ===');
      console.log('FormData isOnline:', formData.isOnline, 'Type:', typeof formData.isOnline);
      console.log('FormData isAnonymous:', formData.isAnonymous, 'Type:', typeof formData.isAnonymous);
      console.log('API isOnline field:', appointmentData.isOnline, 'Type:', typeof appointmentData.isOnline);
      console.log('API isAnonymous field:', appointmentData.isAnonymous, 'Type:', typeof appointmentData.isAnonymous);
      
      // Strict validation - không dùng fallback
      if (!appointmentData.serviceId) {
        throw new Error('Service ID không hợp lệ');
      }
      if (!appointmentData.slotEntityId) {
        throw new Error('Slot ID không hợp lệ');
      }
      
      // Gọi API tạo appointment
      const result = await appointmentAPI.createAppointment(appointmentData);
      
      if (result.success) {
        // Thành công - hiển thị modal
        setShowSuccessModal(true);
        console.log('Appointment created successfully:', result.data);
      } else {
        // Thất bại - hiển thị lỗi
        setErrorMessage(result.message || 'Đã xảy ra lỗi khi đặt lịch hẹn');
        console.error('Failed to create appointment:', result);
        console.error('Response data:', result.data);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrorMessage(`Đã xảy ra lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceTypeName = (value) => {
    return 'Khám & Điều trị HIV';
  };

  const getServiceDetailName = (type, value) => {
    // Tìm service trong danh sách availableServices theo serviceDetail hoặc serviceId
    const selectedService = availableServices.find(service => 
      service.name === formData.serviceDetail || service.id === formData.serviceId
    );
    
    return selectedService ? selectedService.name : value;
  };

  // Helper function để tìm và format thông tin slot đã chọn
  const getSelectedSlotInfo = () => {
    const selectedSlot = availableTimes.find(slot => slot.id === formData.time);
    if (!selectedSlot) return '';
    return `${selectedSlot.label} (${selectedSlot.time})`;
  };

  // Helper functions cho thanh toán
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'vnpay': return faCreditCard;
      default: return faCreditCard;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'vnpay': return 'Thanh toán qua VNPay';
      default: return 'Thanh toán qua VNPay';
    }
  };

  const handlePaymentLater = () => {
    // Với chỉ có VNPay, không có tùy chọn thanh toán sau
    alert('Vui lòng hoàn tất thanh toán qua VNPay để tiếp tục.');
  };

  const handlePaymentNow = async () => {
    setIsProcessingPayment(true);
    try {
      // Simulate VNPay payment processing
      console.log('Processing VNPay payment...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds for VNPay processing
      
      setFormData(prev => ({
        ...prev,
        paymentStatus: 'completed'
      }));
      
      console.log('VNPay payment completed successfully');
      handleCreateAppointment();
    } catch (error) {
      console.error('VNPay payment error:', error);
      setFormData(prev => ({
        ...prev,
        paymentStatus: 'failed'
      }));
      alert('Có lỗi xảy ra trong quá trình thanh toán VNPay. Vui lòng thử lại.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Container>
      <style jsx>{`
        .hospital-header {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .booking-options {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: nowrap;
        }
        
        .booking-option {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1.2rem 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
          flex: 1;
          min-width: 0;
        }
        
        .booking-option:hover {
          border-color: #007bff;
          box-shadow: 0 8px 25px rgba(0,123,255,0.15);
          transform: translateY(-5px);
        }
        
        .booking-option.active {
          border-color: #007bff;
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
          box-shadow: 0 8px 25px rgba(0,123,255,0.2);
          transform: translateY(-5px);
        }
        
        .option-icon {
          font-size: 2rem;
          color: #007bff;
          margin-bottom: 0.75rem;
          display: block;
          text-align: center;
          width: 100%;
        }
        
        .option-title {
          font-weight: bold;
          font-size: 0.95rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        
        .service-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .service-detail-option {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
        }
        
        .service-detail-option:hover {
          border-color: #007bff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.15);
        }        .service-detail-option.active {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.2);
        }
        
        .service-price {
          margin-top: 0.5rem;
        }
        
        .service-price .badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.375rem 0.75rem;
        }
        
        .col-span-full {
          grid-column: 1 / -1;
        }
        
        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .time-slot {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          text-align: center;
          font-weight: 500;
        }
        
        .time-slot:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }
          .time-slot.active {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }
        
        .slot-label {
          font-weight: bold;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .slot-time {
          font-size: 0.8rem;
          opacity: 0.8;
        }
          .time-slot.active .slot-time {
          opacity: 1;
        }
          .slot-status {
          font-size: 0.7rem;
          color: #dc3545;
          font-weight: bold;
          margin-top: 0.25rem;
        }
        
        .slot-info {
          font-size: 0.7rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }
        
        .consultation-type-options .form-check {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 1rem;
          margin: 0;
          flex: 1;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }
        
        .consultation-type-options .form-check:hover {
          border-color: #007bff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.15);
        }
        
        .consultation-type-options .form-check-input:checked + .form-check-label {
          color: #007bff;
        }
        
        .consultation-type-options .form-check-input:checked ~ * {
          border-color: #007bff;
          background: #f8f9ff;
          box-shadow: 0 4px 15px rgba(0,123,255,0.2);
        }

        @media (max-width: 768px) {
          .booking-options {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .booking-option {
            padding: 1rem;
          }
          
          .option-title {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 992px) and (min-width: 769px) {
          .service-detail-grid {
            grid-template-columns: 1fr;
          }
          
          .time-slots {
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          }
          
          .hospital-header {
            padding: 1.5rem;
          }
        }
      `}</style>

      {/* Hospital Header */}
      <div className="hospital-header">
        <FontAwesomeIcon icon={faHospital} size="3x" className="mb-3" />
        <h1>Đặt Lịch Khám & Điều Trị HIV</h1>
        <p className="mb-0">Hệ thống đặt lịch khám chữa bệnh HIV trực tuyến</p>
      </div>

      <div className="simple-form-container">
        <div className="form-header">
          <h2 className="simple-form-title">Đặt Lịch Khám & Điều Trị HIV</h2>
          <p className="form-subtitle">Vui lòng làm theo các bước để hoàn tất đặt lịch khám HIV</p>
        </div>
        
        <div className="form-progress">
          <div className={`progress-step ${formStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Chi Tiết Dịch Vụ HIV</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Loại Hình Khám</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Chọn Lịch Khám</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Thông Tin Cá Nhân</div>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${formStep >= 5 ? 'active' : ''}`}>
            <div className="step-number">5</div>
            <div className="step-label">Thanh Toán</div>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          {/* Bước 1: Chọn chi tiết dịch vụ HIV */}
          {formStep === 1 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 1: Chọn dịch vụ HIV</h4>

              <div className="service-detail-grid">
                {loadingServices ? (
                  <div className="text-center py-4 col-span-full">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Đang tải danh sách dịch vụ...</span>
                  </div>
                ) : availableServices.length > 0 ? (
                  availableServices.map((service) => (
                    <div 
                      key={service.id}
                      className={`service-detail-option ${formData.serviceId === service.id ? 'active' : ''}`}
                      onClick={() => setFormData({
                        ...formData, 
                        serviceDetail: service.name, 
                        serviceId: service.id
                      })}
                    >
                      <div className="mb-2">
                        {service.id === "1" ? "🧪" : service.id === "2" ? "📊" : "🏥"}
                      </div>
                      <strong>{service.name}</strong>
                      <small className="d-block text-muted mt-1">{service.description}</small>
                      {service.price && (
                        <div className="service-price mt-2">
                          <span className="badge bg-primary">
                            {typeof service.price === 'number' 
                              ? service.price.toLocaleString('vi-VN') + ' VNĐ'
                              : service.price
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3 col-span-full">
                    <div className="alert alert-warning">
                      Không có dịch vụ nào khả dụng
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faUserMd} className="label-icon" />
                  Chọn bác sĩ (tùy chọn)
                </label>
                {loadingDoctors ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Đang tải danh sách bác sĩ...</span>
                  </div>
                ) : (
                  <Form.Select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="" disabled>Hãy chọn bác sĩ</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </div>

              <div className="form-submit">
                <Button variant="primary" type="submit" className="submit-button">
                  <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                  Tiếp Theo
                </Button>
              </div>
            </div>
          )}

          {/* Bước 2: Chọn loại hình khám */}
          {formStep === 2 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 2: Chọn hình thức khám</h4>

              {/* Chọn hình thức khám: Trực tiếp hoặc Trực tuyến */}
              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUserMd} className="me-1" />
                  Hình thức khám *
                </Form.Label>
                <div className="consultation-type-options">
                  <div className="d-flex gap-3">
                    <div 
                      className={`consultation-card ${formData.isOnline === false ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, isOnline: false})}
                      style={{
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.isOnline === false ? '#f8f9ff' : 'white',
                        borderColor: formData.isOnline === false ? '#007bff' : '#e9ecef',
                        boxShadow: formData.isOnline === false ? '0 4px 15px rgba(0,123,255,0.2)' : 'none',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} size="2x" className="mb-3" style={{ color: '#007bff' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        Khám trực tiếp
                      </div>
                      <small className="d-block text-muted mt-1">
                        Đến trực tiếp tại bệnh viện
                      </small>
                    </div>

                    <div 
                      className={`consultation-card ${formData.isOnline === true ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, isOnline: true})}
                      style={{
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.isOnline === true ? '#f8f9ff' : 'white',
                        borderColor: formData.isOnline === true ? '#007bff' : '#e9ecef',
                        boxShadow: formData.isOnline === true ? '0 4px 15px rgba(0,123,255,0.2)' : 'none',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      <FontAwesomeIcon icon={faStethoscope} size="2x" className="mb-3" style={{ color: '#007bff' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        Khám trực tuyến
                      </div>
                      <small className="d-block text-muted mt-1">
                        Khám qua video call
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkbox Khám ẩn danh */}
              <div className="form-group mt-4">
                <div 
                  className="anonymous-checkbox-wrapper"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    background: formData.isAnonymous ? '#fff8e1' : 'white',
                    borderColor: formData.isAnonymous ? '#ff9800' : '#e9ecef',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    id="anonymous-checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                    label={
                      <div style={{ marginLeft: '8px' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                          <FontAwesomeIcon icon={faInfoCircle} className="me-2" style={{ color: '#ff9800' }} />
                          Khám ẩn danh
                        </div>
                        <small className="text-muted d-block mt-1">
                          Thông tin cá nhân sẽ được mã hóa và bảo mật tuyệt đối. Chỉ hiển thị mã bệnh nhân và email.
                        </small>
                      </div>
                    }
                    style={{ 
                      fontSize: '1.2rem',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>



              <div className="form-submit">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    className="flex-fill"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button variant="primary" type="submit" className="flex-fill">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                    Tiếp theo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bước 3: Chọn ngày và giờ khám */}
          {formStep === 3 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 3: Chọn ngày và giờ khám</h4>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} className="label-icon" />
                  Chọn ngày khám
                </label>
                <div className="date-input-wrapper">
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <small className="text-muted">Chọn ngày từ hôm nay trở đi</small>
              </div>              {formData.date && (
                <div className="form-group">                  <label className="form-label">
                    <FontAwesomeIcon icon={faClock} className="label-icon" />
                    Chọn giờ khám
                  </label>
                  
                  {/* Hiển thị thông báo cần chọn bác sĩ trước */}
                  {!formData.doctor ? (
                    <div className="alert alert-warning">
                      <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                      Vui lòng chọn bác sĩ ở bước 1 để xem khung giờ trống
                    </div>
                  ) : loadingAvailableSlots ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" role="status" className="me-2">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      <span>Đang kiểm tra khung giờ trống cho bác sĩ...</span>
                    </div>
                  ) : (
                    <div className="time-slots">
                      {/* Array.map() để render các time slot từ availableTimes state (dữ liệu thực từ database) */}
                      {availableTimes.length > 0 ? (                        availableTimes.map((slot) => (
                          <div
                            key={slot.id} // React key prop để optimize re-rendering
                            // Template literal để combine multiple class names với conditional logic
                            className={`time-slot ${formData.time === slot.id ? 'active' : ''}`}
                            // Arrow function trong onClick để handle slot selection
                            onClick={() => {
                              // Chỉ slot trống mới được chọn
                              setFormData({...formData, time: slot.id});
                              console.log('Selected available slot:', slot.id, 'with index:', slot.slotIndex);
                            }}
                          >
                            {/* JSX expression để hiển thị slot properties từ database */}
                            <div className="slot-label">{slot.label}</div>
                            <div className="slot-time">{slot.time}</div>
                            <div className="slot-info text-success">
                              <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                              Còn trống
                            </div>
                          </div>
                        ))
                      ) : (                        <div className="text-center py-3">
                          <div className="alert alert-warning mb-0">
                            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                            Không có khung giờ trống cho ngày này
                            <br />
                            <small>Vui lòng chọn ngày khác hoặc liên hệ hotline để được hỗ trợ</small>
                          </div>
                        </div>
                      )}
                    </div>
                  )}                  <small className="text-muted">
                    {!formData.doctor 
                      ? 'Chọn bác sĩ để xem khung giờ trống'
                      : loadingAvailableSlots 
                        ? 'Đang kiểm tra tình trạng slot...' 
                        : availableTimes.length > 0 
                          ? 'Chỉ hiển thị khung giờ còn trống.'
                          : 'Không có khung giờ trống cho ngày này.'
                    }
                  </small>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCommentMedical} className="label-icon" />
                  Lý do khám bệnh (tùy chọn)
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Mô tả triệu chứng, lý do khám bệnh hoặc yêu cầu đặc biệt..."
                  name="healthIssues"
                  value={formData.healthIssues}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faInfoCircle} className="label-icon" />
                  Ghi chú (tùy chọn)
                </label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ghi chú thêm về cuộc hẹn (ví dụ: yêu cầu đặc biệt, thông tin hỗ trợ...)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-submit">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    className="flex-fill"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button variant="primary" type="submit" className="flex-fill">
                    <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                    Tiếp theo
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bước 4: Thông tin cá nhân */}
          {formStep === 4 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 4: Thông tin cá nhân</h4>
              
              {/* Conditional rendering: chỉ hiển thị khi tất cả required fields có giá trị */}
              {/* Logical AND (&&) operator để check multiple conditions */}
              {formData.serviceDetail && (formData.isOnline !== undefined && formData.isOnline !== null) && formData.date && formData.time && (
                <div className="mb-4">
                  <Row>
                    <Col md={6}>
                      <Form.Label className="text-success fw-bold">
                        <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                        Dịch vụ đã chọn:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // Function call với parameters để get display name
                        value={getServiceDetailName(formData.registrationType, formData.serviceDetail)}
                        readOnly // HTML attribute để prevent editing
                        className="mb-2"
                        // Inline style object với CSS properties
                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="text-success fw-bold">
                        <FontAwesomeIcon icon={faUserMd} className="me-2" />
                        Hình thức khám đã chọn:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // Hiển thị hình thức khám và trạng thái ẩn danh
                        value={`${formData.isOnline ? 'Khám trực tuyến' : 'Khám trực tiếp'}${formData.isAnonymous ? ' (Ẩn danh)' : ''}`}
                        readOnly
                        className="mb-2"
                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Label className="text-success fw-bold">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Ngày khám đã chọn:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // Date constructor + toLocaleDateString() method để format date
                        value={new Date(formData.date).toLocaleDateString('vi-VN')}
                        readOnly
                        className="mb-2"
                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="text-success fw-bold">
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        Giờ khám đã chọn:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // Template literal + Array.find() method + optional chaining để get slot info
                        value={getSelectedSlotInfo()}
                        readOnly
                        className="mb-2"
                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                      />
                    </Col>
                  </Row>

                  {formData.doctor && (
                    <Row>
                      <Col md={6}>
                        <Form.Label className="text-success fw-bold">
                          <FontAwesomeIcon icon={faUserMd} className="me-2" />
                          Bác sĩ đã chọn:
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={availableDoctors.find(d => d.id === formData.doctor)?.name}
                          readOnly
                          className="mb-2"
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </Col>
                      <Col md={6}></Col>
                    </Row>
                  )}

                  {formData.healthIssues && (
                    <Row>
                      <Col md={12}>
                        <Form.Label className="text-success fw-bold">
                          <FontAwesomeIcon icon={faCommentMedical} className="me-2" />
                          Lý do khám đã nhập:
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={formData.healthIssues}
                          readOnly
                          className="mb-2"
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </Col>
                    </Row>
                  )}

                  {formData.notes && (
                    <Row>
                      <Col md={12}>
                        <Form.Label className="text-success fw-bold">
                          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                          Ghi chú đã nhập:
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={formData.notes}
                          readOnly
                          className="mb-2"
                          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                      </Col>
                    </Row>
                  )}
                </div>
              )}

              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Họ và Tên *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder={formData.isAnonymous ? "Nhập tên/biệt danh để bảo mật" : "Nhập họ và tên đầy đủ"}
                  readOnly={!formData.isAnonymous}
                  style={!formData.isAnonymous ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                />
                <small className="text-muted">
                  {formData.isAnonymous 
                    ? "Đối với khám ẩn danh thì bạn có thể đặt tên khác để bảo mật thông tin"
                    : "Họ tên như trong CMND/CCCD"
                  }
                </small>
              </div>              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <Form.Label>
                      <FontAwesomeIcon icon={faPhone} className="me-1" />
                      Số Điện Thoại *
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className={formData.phone && !validatePhoneNumber(formData.phone) ? 'is-invalid' : ''}
                    />
                    <small className="text-muted">Để xác nhận lịch hẹn và thông báo</small>
                    {formData.phone && !validatePhoneNumber(formData.phone) && (
                      <div className="invalid-feedback d-block">
                        Số điện thoại phải có đúng 10 số (ví dụ: 0912345678)
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <Form.Label>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                      Ngày Sinh *
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                    <small className="text-muted">Ngày sinh như trong CMND/CCCD</small>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <Form.Label>
                      <FontAwesomeIcon icon={faVenusMars} className="me-1" />
                      Giới Tính *
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </Form.Select>
                    <small className="text-muted">Thông tin giới tính</small>
                  </div>
                </Col>
                <Col md={6}>
                  {/* Cột trống để cân bằng layout */}
                </Col>
              </Row>

              {/* Commented out BHYT/Patient ID field as per requirement */}
              {/*
              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Số BHYT/Mã Bệnh Nhân (nếu có)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  placeholder="Nhập số BHYT hoặc mã bệnh nhân (nếu có)"
                />
                <small className="text-muted">Để tra cứu hồ sơ bệnh án (nếu đã từng khám)</small>
              </div>
              */}

              <div className="privacy-notice">
                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <strong>Cam kết bảo mật thông tin</strong><br/>
                  <small>
                    • Thông tin cá nhân được bảo mật theo quy định của Bộ Y tế<br/>
                    • Chỉ được sử dụng cho mục đích khám chữa bệnh<br/>
                    • Không chia sẻ với bên thứ ba khi chưa có sự đồng ý<br/>
                    • Bạn có quyền yêu cầu chỉnh sửa hoặc xóa thông tin
                  </small>
                </div>
              </div>

              {/* Hiển thị error message nếu có */}
              {errorMessage && (
                <div className="alert alert-danger mt-3">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {errorMessage}
                </div>
              )}

              <div className="form-submit">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    className="flex-fill"
                    style={{
                      borderColor: '#6c757d',
                      color: '#6c757d',
                      fontWeight: '500',
                      padding: '12px 20px',
                      borderRadius: '8px'
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="flex-fill" 
                    disabled={isSubmitting}
                    style={{
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '8px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                        Hoàn Tất Đặt Lịch
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bước 5: Thanh toán */}
          {formStep === 5 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 5: Thanh toán</h4>
              
              {/* Summary Section */}
              <div className="payment-summary mb-4">
                <Card className="border-0" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Header className="bg-primary text-white">
                    <FontAwesomeIcon icon={faReceipt} className="me-2" />
                    Thông tin đặt lịch
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p><strong>Dịch vụ:</strong> {getServiceDetailName(formData.registrationType, formData.serviceDetail)}</p>
                        <p><strong>Hình thức:</strong> {formData.isOnline ? 'Khám trực tuyến' : 'Khám trực tiếp'}</p>
                        <p><strong>Bác sĩ:</strong> {availableDoctors.find(d => d.id === formData.doctor)?.name}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Ngày khám:</strong> {new Date(formData.date).toLocaleDateString('vi-VN')}</p>
                        <p><strong>Giờ khám:</strong> {getSelectedSlotInfo()}</p>
                        <p><strong>Bệnh nhân:</strong> {formData.name}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>

              {/* Payment Details */}
              <div className="payment-details mb-4">
                <Card>
                  <Card.Header>
                    <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                    Chi tiết thanh toán
                  </Card.Header>
                  <Card.Body>
                    {(() => {
                      const selectedService = availableServices.find(service => service.id === formData.serviceId);
                      const servicePrice = selectedService?.price || 200000;
                      const serviceFee = Math.round(servicePrice * 0.05);
                      const totalAmount = servicePrice + serviceFee;
                      
                      return (
                        <>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Dịch vụ: {selectedService?.name || 'Dịch vụ HIV'}</span>
                            <span>{servicePrice.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Phí dịch vụ (5%):</span>
                            <span>{serviceFee.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <hr/>
                          <div className="d-flex justify-content-between">
                            <strong>Tổng cộng:</strong>
                            <strong className="text-primary">{totalAmount.toLocaleString('vi-VN')} VNĐ</strong>
                          </div>
                        </>
                      );
                    })()}
                  </Card.Body>
                </Card>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods mb-4">
                <h6 className="mb-3">Phương thức thanh toán:</h6>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Card 
                      className="payment-method-card selected"
                      style={{ 
                        border: '2px solid #1f4e8c',
                        boxShadow: '0 4px 12px rgba(31,78,140,0.3)',
                        transform: 'translateY(-2px)'
                      }}
                    >
                      <Card.Body className="text-center py-4">
                        <FontAwesomeIcon 
                          icon={faCreditCard} 
                          size="3x" 
                          className="mb-3" 
                          style={{ color: '#1f4e8c' }}
                        />
                        <h5 className="mb-2" style={{ color: '#1f4e8c', fontWeight: '600' }}>
                          Thanh toán qua VNPay
                        </h5>
                        <p className="text-muted mb-0">
                          Phương thức thanh toán an toàn và tiện lợi
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* Payment Actions */}
              <div className="payment-actions">
                <div className="d-flex gap-3">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePreviousStep}
                    style={{
                      borderColor: '#6c757d',
                      color: '#6c757d',
                      fontWeight: '500',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      flex: '0 0 auto',
                      minWidth: '120px'
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Quay lại
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handlePaymentNow}
                    className="flex-fill" 
                    disabled={isSubmitting || isProcessingPayment}
                    style={{
                      fontWeight: '600',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      backgroundColor: '#1f4e8c',
                      borderColor: '#1f4e8c'
                    }}
                  >
                    {isProcessingPayment ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                        Đang xử lý thanh toán VNPay...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                        Thanh toán qua VNPay
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Form>
      </div>

      <Modal 
        show={showSuccessModal} 
        onHide={() => {
          setShowSuccessModal(false);
          // Reset form về bước đầu
          setFormData({
            serviceType: 'hiv-care',
            serviceDetail: '',
            serviceId: null,
            doctor: '',
            date: '',
            time: '',
            healthIssues: '',
            notes: '',
            customerId: '',
            phone: '',
            dob: '',
            name: '',
            registrationType: 'hiv-care',
            isOnline: false,
            isAnonymous: false,
            paymentMethod: 'vnpay',
            paymentAmount: 0,
            paymentStatus: 'pending'
          });
          setFormStep(1);
        }} 
        centered
        size="lg"
        className="success-modal"
        scrollable={true}
        dialogClassName="modal-dialog-scrollable"
      >
        <Modal.Body className="p-0">
          <div className="success-modal-content">
            {/* Header Section với Animation */}
            <div className="success-header">
              <div className="success-icon-wrapper">
                <div className="success-icon-circle">
                  <FontAwesomeIcon 
                    icon={faCheckCircle} 
                    className="success-icon"
                  />
                </div>
              </div>
              <h2 className="success-title">Đặt lịch thành công!</h2>
              <p className="success-subtitle">
                Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
              </p>
            </div>

            {/* Important Notice */}
            <div className="important-notice">
              <div className="notice-header">
                <FontAwesomeIcon icon={faInfoCircle} className="notice-icon" />
                <span>Lưu ý quan trọng</span>
              </div>
              <div className="notice-content">
                <div className="notice-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="notice-bullet" />
                  Lịch hẹn đang được xử lý và sẽ được xác nhận trong vòng 24h
                </div>
                <div className="notice-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="notice-bullet" />
                  Vui lòng mang theo CMND/CCCD và thẻ BHYT (nếu có)
                </div>
                <div className="notice-item">
                  <FontAwesomeIcon icon={faCheckCircle} className="notice-bullet" />
                  Đến trước giờ hẹn 30 phút để làm thủ tục
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {formData.paymentMethod && (
              <div className="payment-info">
                <div className="payment-info-header">
                  <FontAwesomeIcon icon={faCreditCard} className="payment-info-icon" />
                  <span>Thông tin thanh toán</span>
                </div>
                <div className="payment-info-content">
                  <div className="payment-info-item">
                    <span>Phương thức:</span>
                    <span className="payment-method-badge">
                      <FontAwesomeIcon icon={getPaymentMethodIcon(formData.paymentMethod)} className="me-1" />
                      {getPaymentMethodLabel(formData.paymentMethod)}
                    </span>
                  </div>
                  <div className="payment-info-item">
                    <span>Số tiền:</span>
                    <span className="payment-amount">
                      {formData.paymentAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div className="payment-info-item">
                    <span>Trạng thái:</span>
                    <span className={`payment-status ${formData.paymentStatus}`}>
                      {formData.paymentStatus === 'completed' ? 'Đã thanh toán qua VNPay' : 
                       formData.paymentStatus === 'pending' ? 'Chờ xác nhận thanh toán' :
                       formData.paymentStatus === 'processing' ? 'Đang xử lý thanh toán' : 'Lỗi thanh toán'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="contact-support">
              <div className="support-content">
                <FontAwesomeIcon icon={faPhone} className="support-icon" />
                <div className="support-text">
                  <div className="support-label">Hỗ trợ 24/7</div>
                  <div className="support-number">1900.888.866</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <Button 
                variant="outline-secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset form về bước đầu
                  setFormData({
                    serviceType: 'hiv-care',
                    serviceDetail: '',
                    serviceId: null,
                    doctor: '',
                    date: '',
                    time: '',
                    healthIssues: '',
                    notes: '',
                    customerId: '',
                    phone: '',
                    dob: '',
                    name: '',
                    registrationType: 'hiv-care',
                    consultationType: 'direct',
                    paymentMethod: 'vnpay',
                    paymentAmount: 0,
                    paymentStatus: 'pending'
                  });
                  setFormStep(1);
                }}
                className="action-btn secondary-btn"
              >
                Đóng
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Reset form
                  setFormData({
                    serviceType: 'hiv-care',
                    serviceDetail: '',
                    serviceId: null,
                    doctor: '',
                    date: '',
                    time: '',
                    healthIssues: '',
                    notes: '',
                    customerId: '',
                    phone: '',
                    dob: '',
                    name: '',
                    registrationType: 'hiv-care',
                    isOnline: false,
                    isAnonymous: false,
                    paymentMethod: 'vnpay',
                    paymentAmount: 0,
                    paymentStatus: 'pending'
                  });
                  setFormStep(1);
                }}
                className="action-btn primary-btn"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Đặt lịch mới
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .success-modal .modal-dialog {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem 0;
        }

        .success-modal .modal-content {
          border: none;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-height: 90vh;
          overflow-y: auto;
          width: 100%;
          margin: auto;
        }

        .modal-dialog-scrollable {
          max-width: 600px;
          width: 100%;
        }

        .success-modal-content {
          padding: 0;
          background: linear-gradient(135deg, #f8fffe 0%, #f0f9ff 100%);
        }

        .success-header {
          text-align: center;
          padding: 1.5rem 2rem 1rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .success-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse-bg 3s ease-in-out infinite;
        }

        @keyframes pulse-bg {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .success-icon-wrapper {
          position: relative;
          z-index: 2;
          margin-bottom: 0.75rem;
        }

        .success-icon-circle {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          backdrop-filter: blur(10px);
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .success-icon {
          font-size: 3rem;
          color: white;
          animation: check-draw 0.8s ease-in-out 0.3s both;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes check-draw {
          0% { transform: translate(-50%, -50%) scale(0); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }

        .success-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.4rem;
          position: relative;
          z-index: 2;
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .success-subtitle {
          font-size: 1rem;
          opacity: 0.95;
          margin: 0;
          position: relative;
          z-index: 2;
          animation: slide-up 0.6s ease-out 0.4s both;
        }

        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .important-notice {
          margin: 16px 1.5rem 1rem;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid #f59e0b;
        }

        .notice-header {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .notice-icon {
          color: #f59e0b;
          margin-right: 0.4rem;
          font-size: 1rem;
        }

        .notice-content {
          space-y: 0.4rem;
        }

        .notice-item {
          display: flex;
          align-items: flex-start;
          color: #78350f;
          margin-bottom: 0.4rem;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .notice-bullet {
          color: #059669;
          margin-right: 0.6rem;
          margin-top: 0.1rem;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .contact-support {
          margin: 0 1.5rem 1rem;
          background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid #8b5cf6;
        }

        .support-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .support-icon {
          color: #7c3aed;
          font-size: 1.25rem;
          margin-right: 0.75rem;
        }

        .support-text {
          text-align: center;
        }

        .support-label {
          color: #5b21b6;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .support-number {
          color: #4c1d95;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: white;
        }

        .action-btn {
          flex: 1;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border: none;
        }

        .secondary-btn {
          background: #f1f5f9;
          color: #475569;
          border: 2px solid #e2e8f0 !important;
        }

        .secondary-btn:hover {
          background: #e2e8f0;
          color: #334155;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .primary-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .primary-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        @media (max-width: 768px) {
          .success-modal .modal-dialog {
            margin: 0.5rem auto;
            min-height: calc(100vh - 1rem);
            padding: 0.5rem 0;
          }
          
          .modal-dialog-scrollable {
            max-width: 95%;
            width: 95%;
          }
          
          .success-header {
            padding: 1rem 1rem 0.75rem;
          }
          
          .success-title {
            font-size: 1.3rem;
          }
          
          .important-notice,
          .contact-support {
            margin: 0 0.75rem 0.75rem;
          }
          
          .modal-actions {
            padding: 0.75rem;
            flex-direction: column;
          }
        }

        @media (max-height: 600px) {
          .success-modal .modal-dialog {
            margin: 0.25rem auto;
            min-height: calc(100vh - 0.5rem);
            padding: 0.25rem 0;
          }
          
          .success-header {
            padding: 0.75rem 2rem 0.5rem;
          }
          
          .success-icon-circle {
            width: 40px;
            height: 40px;
          }
          
          .success-icon {
            font-size: 2.4rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          
          .success-title {
            font-size: 1.25rem;
          }
          
          .important-notice,
          .contact-support {
            margin: 0.5rem 1rem;
            padding: 0.75rem;
          }
          
          .modal-actions {
            padding: 0.75rem 1rem;
          }
        }

        /* Payment Step Styles */
        .payment-summary .card {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .payment-details .card {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .payment-method-card {
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .payment-method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .payment-method-card.selected {
          box-shadow: 0 4px 12px rgba(0,123,255,0.3);
          transform: translateY(-2px);
        }

        /* Payment Info in Success Modal */
        .payment-info {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 15px;
          padding: 1.5rem;
          margin: 1.5rem 2rem;
          border: 1px solid #dee2e6;
        }

        .payment-info-header {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
          color: #495057;
          margin-bottom: 1rem;
        }

        .payment-info-icon {
          color: #007bff;
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        .payment-info-content {
          space-y: 0.75rem;
        }

        .payment-info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .payment-info-item:last-child {
          border-bottom: none;
        }

        .payment-method-badge {
          background: #007bff;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .payment-amount {
          font-weight: 600;
          color: #28a745;
          font-size: 1.1rem;
        }

        .payment-status.completed {
          color: #28a745;
          font-weight: 600;
        }

        .payment-status.pending {
          color: #ffc107;
          font-weight: 600;
        }

        .payment-status.processing {
          color: #17a2b8;
          font-weight: 600;
        }

        .payment-status.failed {
          color: #dc3545;
          font-weight: 600;
        }

        .payment-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 0.75rem;
          font-size: 0.875rem;
        }
      `}</style>
    </Container>
  );
};

export default AppointmentForm;
