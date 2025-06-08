import React from 'react';
import { ListGroup, Button, Badge, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faCalendarCheck, faUserTie,
  faQuestionCircle, faCog, faSignOutAlt, faFileAlt,
  faTasks, faUserMd
} from '@fortawesome/free-solid-svg-icons';

const StaffSidebar = ({ activeTab, setActiveTab, pendingAppointments = 0, pendingQuestions = 0 }) => {
  
  return (
    <Col md={3} lg={2} className="sidebar">
      <div className="sidebar-header">
        <div className="staff-avatar">
          <FontAwesomeIcon icon={faUserTie} className="avatar-icon" />
        </div>
        <h4 className="staff-name">Nhân viên Quản lý</h4>
        <p className="staff-role">Staff - Hệ thống HIV/AIDS</p>
      </div>
      
      <ListGroup className="sidebar-menu">
        <ListGroup.Item 
          action 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
          Tổng quan
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeTab === 'appointments'} 
          onClick={() => setActiveTab('appointments')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="menu-icon" />
          Duyệt đơn
          {pendingAppointments > 0 && (
            <Badge bg="warning" className="ms-auto">{pendingAppointments}</Badge>
          )}
        </ListGroup.Item>
          <ListGroup.Item 
          action 
          active={activeTab === 'questions'} 
          onClick={() => setActiveTab('questions')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" />
          Duyệt câu hỏi
          {pendingQuestions > 0 && (
            <Badge bg="danger" className="ms-auto">{pendingQuestions}</Badge>
          )}
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeTab === 'createDoctor'} 
          onClick={() => setActiveTab('createDoctor')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faUserMd} className="menu-icon" />
          Tạo tài khoản Bác sĩ
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeTab === 'reports'} 
          onClick={() => setActiveTab('reports')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faFileAlt} className="menu-icon" />
          Báo cáo
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faCog} className="menu-icon" />
          Cài đặt
        </ListGroup.Item>
      </ListGroup>
      
      <div className="sidebar-footer">
        <Button variant="outline-danger" className="logout-btn">
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Đăng xuất
        </Button>
      </div>
    </Col>
  );
};

export default StaffSidebar; 