import React, { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import ManagerSidebar from './ManagerSidebar';
import ManagerOverview from './ManagerOverview';
import CreateStaffAccount from './CreateStaffAccount';
// Import components từ Staff cho Doctor management
import CreateDoctorAccount from '../Staff/CreateDoctorAccount';
import DoctorManagement from '../Staff/DoctorManagement';

const ManagerDashboard = () => {
  const [activeView, setActiveView] = useState('overview');

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <ManagerOverview />;
      case 'createStaff':
        return <CreateStaffAccount />;
      case 'createDoctor':
        return <CreateDoctorAccount />;
      case 'doctorManagement':
        return <DoctorManagement />;
      default:
        return <ManagerOverview />;
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <ManagerSidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="col">
          {renderContent()}
        </div>
      </Row>
    </Container>
  );
};

export default ManagerDashboard;
