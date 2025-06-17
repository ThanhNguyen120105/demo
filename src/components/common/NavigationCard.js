import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClipboardList, 
  faHistory,
  faUserTie,
  faStethoscope,
  faChartLine,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import './NavigationCard.css';

const NavigationCard = ({ title = "Truy cập nhanh", showStaffOptions = false }) => {
  const patientLinks = [
    {
      path: '/appointment',
      icon: faCalendarAlt,
      title: 'Đặt lịch hẹn',
      description: 'Đặt lịch hẹn với bác sĩ',
      color: 'primary'
    },
    {
      path: '/appointment-history',
      icon: faHistory,
      title: 'Lịch sử hẹn',      description: 'Xem lịch sử các cuộc hẹn',
      color: 'info'
    },
    {
      path: '/qna',
      icon: faQuestionCircle,
      title: 'Hỏi & Đáp',
      description: 'Câu hỏi và giải đáp y khoa',
      color: 'warning'
    }
  ];

  const staffLinks = [
    {
      path: '/staff/doctor-management',
      icon: faClipboardList,
      title: 'Quản lý Bác sĩ & Lịch hẹn',
      description: 'Phân công và quản lý lịch hẹn',
      color: 'primary'
    },
    {
      path: '/doctor/dashboard',
      icon: faChartLine,
      title: 'Dashboard Bác sĩ',
      description: 'Thống kê và quản lý bệnh nhân',
      color: 'success'
    },
    {
      path: '/doctor/appointments',
      icon: faStethoscope,
      title: 'Lịch hẹn Bác sĩ',
      description: 'Quản lý lịch hẹn cá nhân',
      color: 'info'
    }
  ];

  const links = showStaffOptions ? [...patientLinks, ...staffLinks] : patientLinks;

  return (
    <Card className="navigation-card">
      <Card.Header className="navigation-header">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faUserTie} className="me-2" />
          {title}
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {links.map((link, index) => (
            <Col xs={12} sm={6} md={showStaffOptions ? 4 : 6} lg={showStaffOptions ? 3 : 4} key={index} className="mb-3">
              <div className="nav-link-card">
                <Link to={link.path} className="text-decoration-none">
                  <div className={`nav-link-content nav-link-${link.color}`}>
                    <div className="nav-link-icon">
                      <FontAwesomeIcon icon={link.icon} />
                    </div>
                    <div className="nav-link-info">
                      <h6 className="nav-link-title">{link.title}</h6>
                      <p className="nav-link-description">{link.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default NavigationCard; 