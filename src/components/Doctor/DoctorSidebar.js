import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ListGroup, Button, Badge, Col, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faCalendarCheck, faUserMd,
  faClipboardList, faSignOutAlt, faFileAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { getUserInfoFromToken } from '../../utils/jwtUtils';

const DoctorSidebar = ({ activeTab, setActiveTab, unansweredCount = 5 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  // Lấy số lượng lịch hẹn chưa hoàn thành trong hôm nay
  const fetchAppointmentsCount = async () => {
    try {
      const appointmentsResponse = await appointmentAPI.getAcceptedAppointmentsForDoctor();
      
      if (appointmentsResponse.success && appointmentsResponse.data) {
        // Lấy ngày hôm nay
        const today = new Date().toDateString();
        
        // Lọc appointments có status = 'ACCEPTED' và trong hôm nay
        const todayIncompleteAppointments = appointmentsResponse.data.filter(appointment => {
          const isAccepted = appointment.status && appointment.status.toUpperCase() === 'ACCEPTED';
          const isToday = appointment.appointmentDate && 
            new Date(appointment.appointmentDate).toDateString() === today;
          return isAccepted && isToday;
        });
        
        setAppointmentsCount(todayIncompleteAppointments.length);
      } else {
        setAppointmentsCount(0);
      }
    } catch (error) {
      console.error('DoctorSidebar - Error fetching appointments:', error);
      setAppointmentsCount(0);
    }
  };

  // Lấy thông tin bác sĩ hiện tại
  useEffect(() => {
    const fetchCurrentDoctorInfo = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin user từ token
        let userInfo = null;
        if (user && user.token) {
          userInfo = getUserInfoFromToken(user.token);
        }
        
        // Gọi API lấy tất cả bác sĩ
        const doctorsResponse = await doctorAPI.getAllDoctors();
        
        if (doctorsResponse.success && doctorsResponse.data) {
          // Tìm bác sĩ hiện tại dựa trên thông tin từ token
          const doctors = doctorsResponse.data;
          let foundDoctor = null;
          
          if (userInfo) {
            // So sánh theo email hoặc ID
            foundDoctor = doctors.find(doctor => 
              doctor.email === userInfo.email || 
              doctor.id === userInfo.id ||
              doctor.id === userInfo.sub
            );
          }
          
          if (foundDoctor) {
            setCurrentDoctor(foundDoctor);
          } else {
            // Fallback: sử dụng thông tin từ token
            if (userInfo) {
              setCurrentDoctor({
                fullName: userInfo.fullName || 'Bác sĩ',
                email: userInfo.email,
                specialization: 'Chuyên khoa HIV/AIDS',
                id: userInfo.id || userInfo.sub
              });
            }
          }
        }
      } catch (error) {
        console.error('DoctorSidebar - Error fetching doctor info:', error);
        // Fallback: sử dụng thông tin từ token nếu có
        if (user && user.token) {
          const userInfo = getUserInfoFromToken(user.token);
          if (userInfo) {
            setCurrentDoctor({
              fullName: userInfo.fullName || 'Bác sĩ',
              email: userInfo.email,
              specialization: 'Chuyên khoa HIV/AIDS',
              id: userInfo.id || userInfo.sub
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCurrentDoctorInfo();
      fetchAppointmentsCount();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setShowLogoutModal(false);
    }
  };
  
  return (
    <Col md={3} lg={2} className="sidebar">
      <div className="sidebar-header">
        <div className="doctor-avatar">
          <FontAwesomeIcon icon={faUserMd} className="avatar-icon" />
        </div>
        {loading ? (
          <>
            <h4 className="doctor-name">Đang tải...</h4>
            <p className="doctor-specialty">...</p>
          </>
        ) : currentDoctor ? (
          <>
            <h4 className="doctor-name">BS. {currentDoctor.fullName}</h4>
            <p className="doctor-specialty">
              {currentDoctor.specialization || 'Chuyên khoa HIV/AIDS'}
            </p>
          </>
        ) : (
          <>
            <h4 className="doctor-name">BS. Nguyễn Văn A</h4>
            <p className="doctor-specialty">Chuyên khoa HIV/AIDS</p>
          </>
        )}
      </div>
      
      <ListGroup className="sidebar-menu">
        <ListGroup.Item 
          action 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          as={Link} to="/doctor/dashboard"
        >
          <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
          Tổng Quan
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          active={activeTab === 'appointments'} 
          onClick={() => setActiveTab('appointments')}
          as={Link} to="/doctor/appointments"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="menu-icon" />
          Lịch Hẹn
          {appointmentsCount > 0 && (
            <Badge bg="warning" className="ms-auto">{appointmentsCount}</Badge>
          )}
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          active={activeTab === 'unanswered-questions'} 
          onClick={() => setActiveTab('unanswered-questions')}
          as={Link} to="/doctor/unanswered-questions"
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" />
          Câu Hỏi Chưa Trả Lời
          {unansweredCount > 0 && (
            <Badge bg="danger" className="ms-auto">{unansweredCount}</Badge>
          )}
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          active={activeTab === 'medical-records'} 
          onClick={() => setActiveTab('medical-records')}
          as={Link} to="/doctor/medical-records"
        >
          <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
          Hồ Sơ Cá Nhân
        </ListGroup.Item>
      </ListGroup>
        <div className="sidebar-footer">
        <Button 
          variant="outline-danger" 
          className="logout-btn"
          onClick={() => setShowLogoutModal(true)}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Đăng Xuất
        </Button>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal 
        show={showLogoutModal} 
        onHide={() => setShowLogoutModal(false)} 
        centered
        className="logout-confirmation-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faSignOutAlt} className="text-warning me-2" />
            Xác nhận đăng xuất
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
            Đăng Xuất
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

export default DoctorSidebar; 