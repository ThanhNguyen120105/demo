import React from 'react';
import { ListGroup, Button, Badge, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faCalendarCheck, faUserTie,
  faQuestionCircle, faCog, faFileAlt,
  faTasks, faUserMd, faList
} from '@fortawesome/free-solid-svg-icons';


const StaffSidebar = ({ activeTab, setActiveTab, pendingAppointments = 0, pendingQuestions = 0 }) => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const staffName = user.fullName || 'Nhân viên';
  
  return (
    <Col md={3} lg={2} className="sidebar">
      <div className="sidebar-header">
        <div className="staff-avatar">
          <FontAwesomeIcon icon={faUserTie} className="avatar-icon" />
        </div>
        <h4 className="staff-name">Nhân viên {staffName}</h4>
      </div>
      
      <ListGroup className="sidebar-menu">
        {/* Hidden menu items: Tổng quan, Báo cáo, Cài đặt */}
        {/* <ListGroup.Item 
          action 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
          Tổng quan
        </ListGroup.Item> */}
        
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
          active={activeTab === 'doctorManagement'} 
          onClick={() => setActiveTab('doctorManagement')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faList} className="menu-icon" />
          Danh sách bác sĩ
        </ListGroup.Item>
        
        {/* <ListGroup.Item 
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
        </ListGroup.Item> */}
      </ListGroup>
      

    </Col>
  );
};

export default StaffSidebar; 