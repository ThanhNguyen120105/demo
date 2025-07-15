import React, { useState, useEffect } from 'react';
import { Container, Alert, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faCalendarCheck, faExclamationTriangle, 
  faCheckCircle, faTimesCircle, faFileMedical,
  faQuestionCircle, faUserMd, faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import './NotificationSection.css';

const NotificationSection = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
            type: 'appointment',
            icon: faCalendarCheck,
            variant: 'info',
            title: `Bạn có ${todayAppointments.length} lịch hẹn hôm nay`,
            message: `Lịch hẹn đầu tiên lúc ${todayAppointments[0].slotStartTime || ''}`,
            action: () => navigate('/doctor/appointments'),
            actionText: 'Xem lịch hẹn'
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
            type: 'appointment',
            icon: faStethoscope,
            variant: 'warning',
            title: 'Lịch hẹn sắp tới',
            message: `Bạn có lịch hẹn với ${nextAppointment.alternativeName || 'bệnh nhân'} vào ${appointmentDate.toLocaleDateString('vi-VN')}`,
            action: () => navigate('/doctor/appointments'),
            actionText: 'Xem chi tiết'
          });
        }
      }

      // TODO: Thêm thông báo câu hỏi mới khi có module Q&A
      notifications.push({
        id: 'doctor-new-questions',
        type: 'question',
        icon: faQuestionCircle,
        variant: 'secondary',
        title: 'Câu hỏi mới từ bệnh nhân',
        message: 'Có 3 câu hỏi mới cần trả lời',
        action: () => navigate('/doctor/questions'),
        actionText: 'Trả lời câu hỏi',
        disabled: true // Tạm thời disabled vì chưa có module
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
            type: 'approval',
            icon: faCalendarCheck,
            variant: 'warning',
            title: `${pendingAppointments.length} lịch hẹn cần duyệt`,
            message: 'Có lịch hẹn mới đang chờ phê duyệt',
            action: () => navigate('/staff/dashboard'),
            actionText: 'Duyệt ngay'
          });
        }
      }

      // TODO: Thêm thông báo câu hỏi cần duyệt
      notifications.push({
        id: 'staff-pending-questions',
        type: 'question',
        icon: faQuestionCircle,
        variant: 'info',
        title: 'Câu hỏi cần duyệt',
        message: 'Có 5 câu hỏi mới cần duyệt từ bệnh nhân',
        action: () => navigate('/staff/questions'),
        actionText: 'Duyệt câu hỏi',
        disabled: true // Tạm thời disabled vì chưa có module
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
            type: 'appointment-accepted',
            icon: faCheckCircle,
            variant: 'success',
            title: 'Lịch hẹn đã được duyệt',
            message: `Lịch hẹn ngày ${new Date(latestAccepted.appointmentDate).toLocaleDateString('vi-VN')} đã được phê duyệt`,
            action: () => navigate('/appointment-history'),
            actionText: 'Xem chi tiết'
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
            type: 'appointment-denied',
            icon: faTimesCircle,
            variant: 'danger',
            title: 'Lịch hẹn bị từ chối',
            message: `Lịch hẹn ngày ${new Date(latestDenied.appointmentDate).toLocaleDateString('vi-VN')} đã bị từ chối`,
            action: () => navigate('/appointment-history'),
            actionText: 'Xem lý do'
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
            type: 'appointment-completed',
            icon: faStethoscope,
            variant: 'info',
            title: 'Lịch hẹn đã hoàn thành',
            message: `Cuộc hẹn ngày ${new Date(latestCompleted.appointmentDate).toLocaleDateString('vi-VN')} đã hoàn thành`,
            action: () => navigate('/appointment-history'),
            actionText: 'Xem chi tiết'
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
            type: 'medical-result',
            icon: faFileMedical,
            variant: 'success',
            title: 'Báo cáo y tế mới',
            message: `Bác sĩ đã gửi báo cáo y tế cho cuộc hẹn ngày ${new Date(latestWithResult.appointmentDate).toLocaleDateString('vi-VN')}`,
            action: () => navigate('/appointment-history'),
            actionText: 'Xem báo cáo'
          });
        }
      }

    } catch (error) {
      console.error('Error generating customer notifications:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.action && !notification.disabled) {
      notification.action();
    }
  };

  if (!isAuthenticated || !user || notifications.length === 0) {
    return null;
  }

  return (
    <section className="notification-section">
      <Container>
        <div className="notification-header">
          <h5>
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Thông báo
            <Badge bg="primary" className="ms-2">{notifications.length}</Badge>
          </h5>
        </div>
        
        <div className="notifications-container">
          {notifications.map((notification) => (
            <Alert 
              key={notification.id}
              variant={notification.variant}
              className={`notification-item ${notification.disabled ? 'disabled' : 'clickable'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon 
                    icon={notification.icon} 
                    className="notification-icon me-3" 
                  />
                  <div>
                    <h6 className="mb-1">{notification.title}</h6>
                    <p className="mb-0">{notification.message}</p>
                  </div>
                </div>
                
                {notification.actionText && !notification.disabled && (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationClick(notification);
                    }}
                  >
                    {notification.actionText}
                  </Button>
                )}
                
                {notification.disabled && (
                  <Badge bg="secondary">Sắp có</Badge>
                )}
              </div>
            </Alert>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default NotificationSection;
