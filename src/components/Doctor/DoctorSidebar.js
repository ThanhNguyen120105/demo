import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup, Button, Badge, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faCalendarCheck, faUserMd,
  faClipboardList, faCog, faSignOutAlt, faFileAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const DoctorSidebar = ({ activeTab, setActiveTab, appointmentsCount = 0, unansweredCount = 5 }) => {
  const location = useLocation();
  
  return (
    <Col md={3} lg={2} className="sidebar">
      <div className="sidebar-header">
        <div className="doctor-avatar">
          <FontAwesomeIcon icon={faUserMd} className="avatar-icon" />
        </div>
        <h4 className="doctor-name">BS. Nguyễn Văn A</h4>
        <p className="doctor-specialty">Chuyên Gia Bệnh Truyền Nhiễm</p>
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
            <Badge bg="primary" className="ms-auto">{appointmentsCount}</Badge>
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
          Hồ Sơ Y Tế
        </ListGroup.Item>
        <ListGroup.Item 
          action 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
          as={Link} to="/doctor/settings"
        >
          <FontAwesomeIcon icon={faCog} className="menu-icon" />
          Cài Đặt
        </ListGroup.Item>
      </ListGroup>
      
      <div className="sidebar-footer">
        <Button variant="outline-danger" className="logout-btn">
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Đăng Xuất
        </Button>
      </div>
    </Col>
  );
};

export default DoctorSidebar; 