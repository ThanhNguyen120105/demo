import React, { useState } from 'react';
import { Button, Badge, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCalendarAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const NotificationBell = () => {
  const [show, setShow] = useState(false);
  
  // Dữ liệu thông báo mẫu
  const notifications = [
    {
      id: 1,
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch hẹn với bác sĩ vào 15:30 ngày mai',
      time: '2 giờ trước',
      type: 'appointment',
      isRead: false
    },
    {
      id: 2,
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm HIV của bạn đã có',
      time: '5 giờ trước',
      type: 'test-result',
      isRead: false
    },
    {
      id: 3,
      title: 'Nhắc nhở uống thuốc',
      message: 'Đến giờ uống thuốc ARV',
      time: '1 ngày trước',
      type: 'reminder',
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch(type) {
      case 'appointment':
        return faCalendarAlt;
      case 'reminder':
        return faExclamationTriangle;
      default:
        return faBell;
    }
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
              className={`py-3 ${!notification.isRead ? 'bg-light' : ''}`}
            >
              <div className="d-flex">
                <div className="me-3">
                  <FontAwesomeIcon 
                    icon={getIcon(notification.type)} 
                    className="text-primary"
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold small">{notification.title}</div>
                  <div className="text-muted small mb-1">{notification.message}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {notification.time}
                  </div>
                </div>
                {!notification.isRead && (
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