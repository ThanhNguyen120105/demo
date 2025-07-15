import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaffDashboard.css';
import StaffSidebar from './StaffSidebar';
import StaffOverview from './StaffOverview';
import AppointmentApproval from './AppointmentApproval';
import QuestionApproval from './QuestionApproval';
import CreateDoctorAccount from './CreateDoctorAccount';
import DoctorManagement from './DoctorManagement';
import { appointmentAPI } from '../../services/api'; // Import a relevant API

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments'); // Default to appointments (Duyệt đơn) for staff
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);

  // Fetch appointments to count pending ones
  useEffect(() => {
    const fetchPendingAppointments = async () => {
      try {
        // Assuming there's an API to get all pending appointments
        const result = await appointmentAPI.getPendingAppointments();
        if (result.success && Array.isArray(result.data)) {
          setPendingAppointmentsCount(result.data.length);
        }
      } catch (error) {
        console.error("Failed to fetch pending appointments:", error);
      }
    };

    fetchPendingAppointments();
  }, []);

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
      case 'doctorManagement':
        return <DoctorManagement />;
      default:
        return <AppointmentApproval />; // Default to AppointmentApproval instead of StaffOverview
    }
  };

  return (
    <Container fluid className="staff-dashboard">
      <Row>
        <StaffSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          pendingAppointments={pendingAppointmentsCount}
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