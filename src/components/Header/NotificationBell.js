import React, { useState } from 'react';
import { Button, Badge, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faCalendarAlt, 
  faCheckCircle, 
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faHospital
} from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationBell = () => {
  const [show, setShow] = useState(false);
  const {
    getPendingCount,
    getTodayReminders,
    getOverdueReminders,
    getUpcomingReminders,
    markReminderCompleted
  } = useNotifications();

  const pendingCount = getPendingCount();
  const todayReminders = getTodayReminders();
  const overdueReminders = getOverdueReminders();
  const upcomingReminders = getUpcomingReminders();

  const handleMarkComplete = (e, reminderId) => {
    e.stopPropagation();
    markReminderCompleted(reminderId);
  };

  return (
    <Dropdown show={show} onToggle={setShow} className="notification-bell">
      <Dropdown.Toggle 
        as={Button}
        variant="link" 
        id="notification-dropdown"
        className="position-relative notification-toggle p-0"
      >
        <div className="notification-icon-wrapper">
          <FontAwesomeIcon 
            icon={faBell} 
            className={`notification-icon ${pendingCount > 0 ? 'has-notifications' : ''}`}
          />
          {pendingCount > 0 && (
            <>
              <Badge 
                bg="danger" 
                pill 
                className="position-absolute notification-badge"
              >
                {pendingCount > 99 ? '99+' : pendingCount}
              </Badge>
              <div className="notification-pulse"></div>
            </>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" className="notification-menu">
        <div className="notification-header">
          <div className="header-content">
            <FontAwesomeIcon icon={faBell} className="header-icon" />
            <h6 className="mb-0">Thông Báo</h6>
          </div>
          {pendingCount > 0 && (
            <span className="notification-count-badge">{pendingCount}</span>
          )}
        </div>
        
        <div className="notification-body">
          {/* Overdue reminders */}
          {overdueReminders.length > 0 && (
            <div className="notification-section">
              <div className="section-header overdue">
                <FontAwesomeIcon icon={faExclamationTriangle} className="section-icon" />
                <span>Quá Hạn ({overdueReminders.length})</span>
              </div>
              {overdueReminders.slice(0, 3).map(reminder => (
                <div key={reminder.id} className="notification-item overdue-item">
                  <div className="item-content">
                    <div className="item-header">
                      <span className="patient-name">{reminder.patientName}</span>
                      <button
                        className="complete-btn overdue"
                        onClick={(e) => handleMarkComplete(e, reminder.id)}
                        title="Đánh dấu hoàn thành"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>
                    </div>
                    <div className="item-title">{reminder.title}</div>
                    <div className="item-description">{reminder.description}</div>
                    <div className="item-details">
                      <span className="detail-item date">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {new Date(reminder.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                      {reminder.location && (
                        <span className="detail-item location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          {reminder.location}
                        </span>
                      )}
                      {reminder.appointmentId && (
                        <span className="detail-item appointment">
                          <FontAwesomeIcon icon={faHospital} />
                          {reminder.appointmentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Today's reminders */}
          {todayReminders.length > 0 && (
            <div className="notification-section">
              <div className="section-header today">
                <FontAwesomeIcon icon={faClock} className="section-icon" />
                <span>Hôm Nay ({todayReminders.length})</span>
              </div>
              {todayReminders.slice(0, 3).map(reminder => (
                <div key={reminder.id} className="notification-item today-item">
                  <div className="item-content">
                    <div className="item-header">
                      <span className="patient-name">{reminder.patientName}</span>
                      <button
                        className="complete-btn today"
                        onClick={(e) => handleMarkComplete(e, reminder.id)}
                        title="Đánh dấu hoàn thành"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>
                    </div>
                    <div className="item-title">{reminder.title}</div>
                    <div className="item-description">{reminder.description}</div>
                    <div className="item-details">
                      {reminder.dueTime && (
                        <span className="detail-item time">
                          <FontAwesomeIcon icon={faClock} />
                          {reminder.dueTime}
                        </span>
                      )}
                      {reminder.location && (
                        <span className="detail-item location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          {reminder.location}
                        </span>
                      )}
                      {reminder.appointmentId && (
                        <span className="detail-item appointment">
                          <FontAwesomeIcon icon={faHospital} />
                          {reminder.appointmentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming reminders */}
          {upcomingReminders.length > 0 && (
            <div className="notification-section">
              <div className="section-header upcoming">
                <FontAwesomeIcon icon={faCalendarAlt} className="section-icon" />
                <span>Sắp Tới ({upcomingReminders.length})</span>
              </div>
              {upcomingReminders.slice(0, 2).map(reminder => (
                <div key={reminder.id} className="notification-item upcoming-item">
                  <div className="item-content">
                    <div className="item-header">
                      <span className="patient-name">{reminder.patientName}</span>
                    </div>
                    <div className="item-title">{reminder.title}</div>
                    <div className="item-description">{reminder.description}</div>
                    <div className="item-details">
                      <span className="detail-item date">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {new Date(reminder.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                      {reminder.location && (
                        <span className="detail-item location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          {reminder.location}
                        </span>
                      )}
                      {reminder.appointmentId && (
                        <span className="detail-item appointment">
                          <FontAwesomeIcon icon={faHospital} />
                          {reminder.appointmentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendingCount === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div className="empty-text">Không có thông báo mới</div>
              <div className="empty-subtext">Bạn đã xem hết tất cả thông báo</div>
            </div>
          )}
        </div>

        {pendingCount > 0 && (
          <div className="notification-footer">
            <button className="view-all-btn">
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell; 