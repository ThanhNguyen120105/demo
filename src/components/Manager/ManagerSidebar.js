import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faUserPlus, 
  faUsers, 
  faUserMd,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';

const ManagerSidebar = ({ activeView, setActiveView }) => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const managerName = user.fullName || 'Quản lý';

  return (
    <Col md={3} lg={2} className="sidebar">
      <div className="sidebar-header">
        <div className="manager-avatar">
          <FontAwesomeIcon icon={faUserTie} className="avatar-icon" />
        </div>
        <h4 className="manager-name">QL. {managerName}</h4>
        <p className="manager-role">Quản lý hệ thống</p>
      </div>
      
      <ListGroup className="sidebar-menu">
        <ListGroup.Item 
          action 
          active={activeView === 'overview'} 
          onClick={() => setActiveView('overview')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faTachometerAlt} className="menu-icon" />
          Tổng quan
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeView === 'createStaff'} 
          onClick={() => setActiveView('createStaff')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="menu-icon" />
          Tạo tài khoản Staff
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeView === 'createDoctor'} 
          onClick={() => setActiveView('createDoctor')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faUserMd} className="menu-icon" />
          Tạo tài khoản Doctor
        </ListGroup.Item>
        
        <ListGroup.Item 
          action 
          active={activeView === 'doctorManagement'} 
          onClick={() => setActiveView('doctorManagement')}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faUsers} className="menu-icon" />
          Danh sách bác sĩ
        </ListGroup.Item>
      </ListGroup>
    </Col>
  );
};

export default ManagerSidebar;
