import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaffDashboard.css';
import StaffSidebar from './StaffSidebar';
import StaffOverview from './StaffOverview';
import AppointmentApproval from './AppointmentApproval';
import QuestionApproval from './QuestionApproval';
import CreateDoctorAccount from './CreateDoctorAccount';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StaffOverview />;
      case 'appointments':
        return <AppointmentApproval />;
      case 'questions':
        return <QuestionApproval />;
      case 'createDoctor':
        return <CreateDoctorAccount />;
      default:
        return <StaffOverview />;
    }
  };

  return (
    <Container fluid className="staff-dashboard">
      <Row>
        <StaffSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          pendingAppointments={12}
          pendingQuestions={8}
        />
        <Col md={9} lg={10} className="main-content">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default StaffDashboard; 