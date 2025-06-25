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
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './AppointmentForm.css';
import { useLocation } from 'react-router-dom';
import BackButton from '../common/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI, slotAPI, doctorAPI } from '../../services/api';

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
    customerId: '',
    phone: '',
    dob: '',
    name: '',
    registrationType: 'hiv-care',
    consultationType: 'direct' // direct: khám trực tiếp, anonymous: khám ẩn danh
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAvailableSlots, setLoadingAvailableSlots] = useState(false);
  // useState hook để lưu trữ array of objects chứa thông tin slot thời gian từ database
  const [availableTimes, setAvailableTimes] = useState([]);
  // useState hook để lưu trữ array of objects chứa thông tin bác sĩ từ database
  const [availableDoctors, setAvailableDoctors] = useState([]);

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
    if (user) {
      console.log('Auto-filling user name from user object:', user);
      
      const nameToFill = user.fullName || user.name || '';
      
      console.log('Name to fill:', nameToFill);
      
      setFormData(prev => {
        const newData = {
          ...prev,
          name: nameToFill // Chỉ auto-fill họ tên, phone để user tự nhập
        };
        console.log('Updated formData with user name:', newData);
        return newData;
      });
    }  }, [user]); // Dependency array chứa user để re-run khi user thay đổi  // useEffect để load doctors từ database
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
      // Validation: kiểm tra consultationType
      if (!formData.consultationType) {
        alert('Vui lòng chọn loại hình khám');
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
      // Final validation: kiểm tra các required fields
      if (!formData.name || !formData.phone) {
        alert('Vui lòng điền đầy đủ họ tên và số điện thoại');
        return;
      }
      
      // Validation số điện thoại
      if (!validatePhoneNumber(formData.phone)) {
        alert('Số điện thoại phải có đúng 10 số (ví dụ: 0912345678)');
        return;
      }
      
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
        reason: formData.healthIssues || '', // Để trống nếu user không nhập
        alternativeName: formData.name,
        alternativePhoneNumber: formData.phone,
        notes: formData.healthIssues || '',
        doctorId: formData.doctor || null, // Giữ nguyên string UUID, không parseInt
        serviceId: parseInt(formData.serviceId), // Service ID thực từ user chọn (1 hoặc 2)
        anonymous: formData.consultationType === 'anonymous', // true nếu khám ẩn danh
        slotEntityId: formData.time // Giữ nguyên slotId từ database (có thể là string)
      };
        console.log('Creating appointment with schema-compliant data:', appointmentData);
      console.log('Current user:', user);
      console.log('Service ID:', formData.serviceId, 'Type:', typeof formData.serviceId);
      console.log('Slot ID:', formData.time, 'Type:', typeof formData.time);
      console.log('Doctor ID:', formData.doctor, 'Type:', typeof formData.doctor);
      
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
    const serviceDetails = {
      'hiv-testing': 'Tư vấn và xét nghiệm HIV',
      'viral-load-monitoring': 'Theo dõi tải lượng virus'
    };
    return serviceDetails[value] || value;
  };

  // Helper function để tìm và format thông tin slot đã chọn
  const getSelectedSlotInfo = () => {
    const selectedSlot = availableTimes.find(slot => slot.id === formData.time);
    if (!selectedSlot) return '';
    return `${selectedSlot.label} (${selectedSlot.time})`;
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
        </div>
        
        <Form onSubmit={handleSubmit}>
          {/* Bước 1: Chọn chi tiết dịch vụ HIV */}
          {formStep === 1 && (
            <div className="form-step-container animated fadeIn">
              <h4 className="text-center mb-4">Bước 1: Chọn dịch vụ HIV</h4>              <div className="alert alert-info mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Dịch vụ: <strong>{getServiceTypeName(formData.registrationType)}</strong>
              </div><div className="service-detail-grid">
                <div 
                  className={`service-detail-option ${formData.serviceDetail === 'hiv-testing' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, serviceDetail: 'hiv-testing', serviceId: 1})}
                >                  <div className="mb-2">🧪</div>
                  <strong>Tư vấn và xét nghiệm HIV</strong>
                  <small className="d-block text-muted mt-1">Xét nghiệm sàng lọc, xét nghiệm khẳng định</small>
                </div>
                
                <div 
                  className={`service-detail-option ${formData.serviceDetail === 'viral-load-monitoring' ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, serviceDetail: 'viral-load-monitoring', serviceId: 2})}
                >                  <div className="mb-2">📊</div>
                  <strong>Theo dõi tải lượng virus</strong>
                  <small className="d-block text-muted mt-1">Xét nghiệm định kỳ, đánh giá hiệu quả điều trị</small>
                </div>
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
              <h4 className="text-center mb-4">Bước 2: Chọn loại hình khám</h4>

              <div className="alert alert-info mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Dịch vụ: <strong>{getServiceDetailName(formData.registrationType, formData.serviceDetail)}</strong>
              </div>

              <div className="form-group">
                <Form.Label>
                  <FontAwesomeIcon icon={faUserMd} className="me-1" />
                  Loại hình khám *
                </Form.Label>
                <div className="consultation-type-options">
                  <div className="d-flex gap-3">
                    <div 
                      className={`consultation-card ${formData.consultationType === 'direct' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, consultationType: 'direct'})}
                      style={{
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.consultationType === 'direct' ? '#f8f9ff' : 'white',
                        borderColor: formData.consultationType === 'direct' ? '#007bff' : '#e9ecef',
                        boxShadow: formData.consultationType === 'direct' ? '0 4px 15px rgba(0,123,255,0.2)' : 'none',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Form.Check
                        type="radio"
                        id="direct-consultation"
                        name="consultationType"
                        value="direct"
                        checked={formData.consultationType === 'direct'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <FontAwesomeIcon icon={faUser} size="2x" className="mb-3" style={{ color: '#007bff' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        Khám trực tiếp
                      </div>
                    </div>

                    <div 
                      className={`consultation-card ${formData.consultationType === 'anonymous' ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, consultationType: 'anonymous'})}
                      style={{
                        border: '2px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: formData.consultationType === 'anonymous' ? '#f8f9ff' : 'white',
                        borderColor: formData.consultationType === 'anonymous' ? '#007bff' : '#e9ecef',
                        boxShadow: formData.consultationType === 'anonymous' ? '0 4px 15px rgba(0,123,255,0.2)' : 'none',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Form.Check
                        type="radio"
                        id="anonymous-consultation"
                        name="consultationType"
                        value="anonymous"
                        checked={formData.consultationType === 'anonymous'}
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                      />
                      <FontAwesomeIcon icon={faInfoCircle} size="2x" className="mb-3" style={{ color: '#007bff' }} />
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        Khám ẩn danh
                      </div>
                    </div>
                  </div>
                </div>
                <small className="text-muted">
                  {formData.consultationType === 'anonymous' 
                    ? 'Chế độ ẩn danh: Thông tin cá nhân sẽ được mã hóa và bảo mật tuyệt đối'
                    : 'Chế độ trực tiếp: Thông tin sẽ được lưu trữ trong hệ thống để theo dõi quá trình điều trị'
                  }
                </small>
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

              <div className="alert alert-info mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Dịch vụ: <strong>{getServiceDetailName(formData.registrationType, formData.serviceDetail)}</strong> - 
                Loại khám: <strong>{formData.consultationType === 'anonymous' ? 'Khám ẩn danh' : 'Khám trực tiếp'}</strong>
                {formData.doctor && (
                  <span> - Bác sĩ: <strong>{availableDoctors.find(d => d.id === formData.doctor)?.name}</strong></span>
                )}
              </div>

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
              {formData.serviceDetail && formData.consultationType && formData.date && formData.time && (
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
                        Loại khám đã chọn:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // Ternary operator để conditional value based on consultationType
                        value={formData.consultationType === 'anonymous' ? 'Khám ẩn danh' : 'Khám trực tiếp'}
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
                  placeholder="Nhập họ và tên đầy đủ"
                />
                <small className="text-muted">Họ tên như trong CMND/CCCD</small>
              </div>              <Row>                <Col md={6}>
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
                {/* Commented out Date of Birth field as per requirement */}
                {/*
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
                  </div>
                </Col>
                */}
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
        </Form>
      </div>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-center w-100">
            <FontAwesomeIcon 
              icon={faCheckCircle} 
              className="text-success me-2"
              size="2x"
            />
            <br />
            Đặt Lịch Thành Công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="alert alert-success">
            <h5 className="mb-3">Cảm ơn bạn đã đặt lịch khám!</h5>
            <p className="mb-2">
              <strong>Dịch vụ:</strong> {getServiceTypeName(formData.registrationType)}
            </p>
            {formData.serviceDetail && (
              <p className="mb-2">
                <strong>Chi tiết:</strong> {getServiceDetailName(formData.registrationType, formData.serviceDetail)}
              </p>
            )}
            {formData.date && (
              <p className="mb-2">
                <strong>Ngày khám:</strong> {new Date(formData.date).toLocaleDateString('vi-VN')}
                {formData.time && <span> - <strong>Giờ:</strong> {getSelectedSlotInfo()}</span>}
              </p>
            )}
            <p className="mb-0">
              <strong>Liên hệ:</strong> {formData.phone}
            </p>
          </div>

          <div className="alert alert-info">
            <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
            <strong>Thông báo quan trọng:</strong><br/>
            <small>
              • Lịch hẹn của bạn đang được xử lý<br/>
              • Chúng tôi sẽ gọi điện xác nhận trong vòng 24h<br/>
              • Vui lòng mang theo CMND/CCCD và thẻ BHYT (nếu có)<br/>
              • Đến trước giờ hẹn 30 phút để làm thủ tục
            </small>
          </div>

          <div className="contact-reminder">
            <p className="mb-1"><strong>Hotline hỗ trợ:</strong></p>
            <h4 className="text-primary mb-2">1900.888.866</h4>
            <small className="text-muted">
              Thời gian làm việc: T2-T6 (7:30-21:00) | T7-CN (7:30-16:30)
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button 
            variant="primary" 
            onClick={() => {
              setShowSuccessModal(false);              // Reset form
              setFormData({
                serviceType: 'hiv-care',
                serviceDetail: '',
                serviceId: null,
                doctor: '',
                date: '',
                time: '',
                healthIssues: '',
                customerId: '',
                phone: '',
                dob: '',
                name: '',
                registrationType: 'hiv-care',
                consultationType: 'direct'
              });
              setFormStep(1);
            }}
            className="px-4"
          >
            Đặt Lịch Mới
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentForm;
