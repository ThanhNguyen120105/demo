import React, { useState, useEffect } from 'react';
import { Button, Badge, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faCalendarCheck, faExclamationTriangle, 
  faCheckCircle, faTimesCircle, faFileMedical,
  faQuestionCircle, faUserMd, faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';

const NotificationBell = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const userNotifications = await generateNotifications(user);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNotifications = async (user) => {
    const notifications = [];

    switch (user.role) {
      case 'DOCTOR':
        await generateDoctorNotifications(notifications);
        break;
      case 'STAFF':
        await generateStaffNotifications(notifications);
        break;
      case 'CUSTOMER':
        await generateCustomerNotifications(notifications, user.id);
        break;
      default:
        break;
    }

    return notifications;
  };

  const generateDoctorNotifications = async (notifications) => {
    try {
      // Lấy lịch hẹn của bác sĩ
      const result = await appointmentAPI.getAcceptedAppointmentsForDoctor();
      
      if (result.success && result.data) {
        // Lịch hẹn hôm nay
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = result.data.filter(apt => {
          const aptDate = apt.appointmentDate || apt.date;
          return aptDate === today && apt.status?.toUpperCase() === 'ACCEPTED';
        });

        if (todayAppointments.length > 0) {
          notifications.push({
            id: 'doctor-today-appointments',
            title: `${todayAppointments.length} lịch hẹn hôm nay`,
            message: `Lịch hẹn đầu tiên lúc ${todayAppointments[0].slotStartTime || ''}`,
            icon: faCalendarCheck,
            type: 'appointment',
            time: 'Hôm nay',
            isRead: false,
            action: () => navigate('/doctor/appointments')
          });
        }

        // Lịch hẹn sắp tới (trong 3 ngày tới)
        const upcomingAppointments = result.data.filter(apt => {
          const aptDate = new Date(apt.appointmentDate || apt.date);
          const today = new Date();
          const threeDaysLater = new Date();
          threeDaysLater.setDate(today.getDate() + 3);
          
          return aptDate > today && aptDate <= threeDaysLater && 
                 apt.status?.toUpperCase() === 'ACCEPTED';
        });

        if (upcomingAppointments.length > 0) {
          const nextAppointment = upcomingAppointments[0];
          const appointmentDate = new Date(nextAppointment.appointmentDate || nextAppointment.date);
          
          notifications.push({
            id: 'doctor-upcoming-appointments',
            title: 'Lịch hẹn sắp tới',
            message: `Lịch hẹn với ${nextAppointment.alternativeName || 'bệnh nhân'} vào ${appointmentDate.toLocaleDateString('vi-VN')}`,
            icon: faStethoscope,
            type: 'appointment',
            time: 'Sắp tới',
            isRead: false,
            action: () => navigate('/doctor/appointments')
          });
        }
      }

      // TODO: Thêm thông báo câu hỏi mới khi có module Q&A
      notifications.push({
        id: 'doctor-new-questions',
        title: 'Câu hỏi mới từ bệnh nhân',
        message: 'Có 3 câu hỏi mới cần trả lời',
        icon: faQuestionCircle,
        type: 'question',
        time: '2 giờ trước',
        isRead: false,
        disabled: true,
        action: () => navigate('/doctor/questions')
      });

    } catch (error) {
      console.error('Error generating doctor notifications:', error);
    }
  };

  const generateStaffNotifications = async (notifications) => {
    try {
      // Lấy lịch hẹn cần duyệt
      const result = await appointmentAPI.getAllAppointments();
      
      if (result.success && result.data) {
        const pendingAppointments = result.data.filter(apt => 
          apt.status?.toUpperCase() === 'PENDING'
        );

        if (pendingAppointments.length > 0) {
          notifications.push({
            id: 'staff-pending-appointments',
            title: `${pendingAppointments.length} lịch hẹn cần duyệt`,
            message: 'Có lịch hẹn mới đang chờ phê duyệt',
            icon: faCalendarCheck,
            type: 'approval',
            time: 'Mới',
            isRead: false,
            action: () => navigate('/staff/dashboard')
          });
        }
      }

      // TODO: Thêm thông báo câu hỏi cần duyệt
      notifications.push({
        id: 'staff-pending-questions',
        title: 'Câu hỏi cần duyệt',
        message: 'Có 5 câu hỏi mới cần duyệt từ bệnh nhân',
        icon: faQuestionCircle,
        type: 'question',
        time: '1 giờ trước',
        isRead: false,
        disabled: true,
        action: () => navigate('/staff/questions')
      });

    } catch (error) {
      console.error('Error generating staff notifications:', error);
    }
  };

  const generateCustomerNotifications = async (notifications, userId) => {
    try {
      // Lấy lịch hẹn của customer
      const result = await appointmentAPI.getCustomerAppointments(userId);
      
      if (result.success && result.data) {
        // Lịch hẹn được duyệt
        const recentlyAccepted = result.data.filter(apt => {
          const status = apt.status?.toUpperCase();
          return status === 'ACCEPTED';
        });

        if (recentlyAccepted.length > 0) {
          const latestAccepted = recentlyAccepted[0];
          notifications.push({
            id: 'customer-accepted-appointment',
            title: 'Lịch hẹn đã được duyệt',
            message: `Lịch hẹn ngày ${new Date(latestAccepted.appointmentDate).toLocaleDateString('vi-VN')} đã được phê duyệt`,
            icon: faCheckCircle,
            type: 'appointment-accepted',
            time: '3 giờ trước',
            isRead: false,
            action: () => navigate('/appointment-history')
          });
        }

        // Lịch hẹn bị từ chối
        const recentlyDenied = result.data.filter(apt => {
          const status = apt.status?.toUpperCase();
          return status === 'DENIED';
        });

        if (recentlyDenied.length > 0) {
          const latestDenied = recentlyDenied[0];
          notifications.push({
            id: 'customer-denied-appointment',
            title: 'Lịch hẹn bị từ chối',
            message: `Lịch hẹn ngày ${new Date(latestDenied.appointmentDate).toLocaleDateString('vi-VN')} đã bị từ chối`,
            icon: faTimesCircle,
            type: 'appointment-denied',
            time: '5 giờ trước',
            isRead: false,
            action: () => navigate('/appointment-history')
          });
        }

        // Lịch hẹn hoàn thành
        const recentlyCompleted = result.data.filter(apt => {
          const status = apt.status?.toUpperCase();
          return status === 'COMPLETED';
        });

        if (recentlyCompleted.length > 0) {
          const latestCompleted = recentlyCompleted[0];
          notifications.push({
            id: 'customer-completed-appointment',
            title: 'Lịch hẹn đã hoàn thành',
            message: `Cuộc hẹn ngày ${new Date(latestCompleted.appointmentDate).toLocaleDateString('vi-VN')} đã hoàn thành`,
            icon: faStethoscope,
            type: 'appointment-completed',
            time: '1 ngày trước',
            isRead: false,
            action: () => navigate('/appointment-history')
          });
        }

        // Báo cáo y tế mới
        const appointmentsWithResults = result.data.filter(apt => 
          apt.medicalResultId && apt.status?.toUpperCase() === 'COMPLETED'
        );

        if (appointmentsWithResults.length > 0) {
          const latestWithResult = appointmentsWithResults[0];
          notifications.push({
            id: 'customer-medical-result',
            title: 'Báo cáo y tế mới',
            message: `Bác sĩ đã gửi báo cáo y tế cho cuộc hẹn ngày ${new Date(latestWithResult.appointmentDate).toLocaleDateString('vi-VN')}`,
            icon: faFileMedical,
            type: 'medical-result',
            time: '2 giờ trước',
            isRead: false,
            action: () => navigate('/appointment-history')
          });
        }
      }

    } catch (error) {
      console.error('Error generating customer notifications:', error);
    }
  };

  // Chỉ hiển thị nếu user đã đăng nhập
  if (!isAuthenticated || !user) {
    return null;
  }

  const unreadCount = notifications.filter(n => !n.isRead && !n.disabled).length;

  const handleNotificationClick = (notification) => {
    if (notification.action && !notification.disabled) {
      notification.action();
      setShow(false);
    }
  };

  const getIcon = (notification) => {
    return notification.icon || faBell;
  };

  return (
    <Dropdown show={show} onToggle={setShow} className="notification-bell">
      <Dropdown.Toggle 
        as={Button}
        variant="link" 
        id="notification-dropdown"
        className="position-relative p-0"
      >
        <FontAwesomeIcon 
          icon={faBell} 
          size="lg" 
          className="text-primary"
        />
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            pill 
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" style={{ minWidth: '300px' }}>
        <Dropdown.Header>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Thông báo</span>
            {unreadCount > 0 && (
              <Badge bg="primary" pill>{unreadCount} mới</Badge>
            )}
          </div>
        </Dropdown.Header>
        
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              className={`py-3 ${!notification.isRead ? 'bg-light' : ''} ${notification.disabled ? 'text-muted' : ''}`}
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: notification.disabled ? 'not-allowed' : 'pointer' }}
            >
              <div className="d-flex">
                <div className="me-3">
                  <FontAwesomeIcon 
                    icon={getIcon(notification)} 
                    className={notification.disabled ? 'text-muted' : 'text-primary'}
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold small d-flex justify-content-between">
                    <span>{notification.title}</span>
                    {notification.disabled && (
                      <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.6rem' }}>
                        Sắp có
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted small mb-1">{notification.message}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {notification.time}
                  </div>
                </div>
                {!notification.isRead && !notification.disabled && (
                  <div className="ms-2">
                    <span className="badge bg-primary rounded-pill" style={{ width: '8px', height: '8px' }}></span>
                  </div>
                )}
              </div>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>
            <div className="text-center text-muted py-3">
              <FontAwesomeIcon icon={faBell} size="2x" className="mb-2" />
              <div>Không có thông báo mới</div>
            </div>
          </Dropdown.Item>
        )}
        
        <Dropdown.Divider />
        <Dropdown.Item className="text-center text-primary">
          <small>Xem tất cả thông báo</small>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell; 