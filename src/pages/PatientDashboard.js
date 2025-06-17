import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { authAPI } from '../services/api'; // Sử dụng real API thay vì mock
import AppointmentHistory from '../components/patient/AppointmentHistory';
import MedicalRecords from '../components/patient/MedicalRecords';
import ARVRegimen from '../components/patient/ARVRegimen';
import ProfileInfo from '../components/patient/ProfileInfo';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [arvRegimen, setARVRegimen] = useState(null);
  const [loading, setLoading] = useState(true);  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== PatientDashboard: Starting data fetch ===');
        
        // Lấy thông tin profile từ real API
        const profileResult = await authAPI.getUserProfile();
        
        console.log('=== API getUserProfile result ===', profileResult);
        
        if (profileResult.success) {
          // Cấu trúc profile data với fields hiện có và fields trống cho tương lai
          const profileData = {
            id: profileResult.data.id,
            fullName: profileResult.data.fullName || profileResult.data.name || '',
            email: profileResult.data.email || '',
            phone: profileResult.data.phoneNumber || profileResult.data.phone || '',
            // Các fields này để trống vì chưa có trong database
            dateOfBirth: '',
            gender: '',
            address: ''
          };
          
          console.log('=== Processed profile data ===', profileData);
          setProfile(profileData);
        } else {
          console.error('=== API failed, using fallback ===', profileResult.message);
          // Fallback: sử dụng data từ localStorage nếu API fail
          const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
          console.log('=== Fallback data from localStorage ===', savedUser);
          
          if (savedUser.id) {
            const fallbackProfile = {
              id: savedUser.id,
              fullName: savedUser.fullName || savedUser.name || '',
              email: savedUser.email || '',
              phone: savedUser.phoneNumber || savedUser.phone || '',
              dateOfBirth: '',
              gender: '',
              address: ''
            };
            console.log('=== Final fallback profile ===', fallbackProfile);
            setProfile(fallbackProfile);
          }
        }
        
        // TODO: Thay thế các API calls khác bằng real APIs
        // Tạm thời comment out để tránh lỗi
        // const [appointmentsData, medicalRecordsData, arvRegimenData] = await Promise.all([
        //   patientAPI.getAppointments(),
        //   patientAPI.getMedicalRecords(),
        //   patientAPI.getARVRegimen()
        // ]);
        // setAppointments(appointmentsData);
        // setMedicalRecords(medicalRecordsData);
        // setARVRegimen(arvRegimenData);
        
      } catch (error) {
        console.error('=== Error fetching patient data ===', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleCancelAppointment = async (appointmentId) => {
    try {
      // TODO: Implement real API call để cancel appointment
      // await appointmentAPI.cancelAppointment(appointmentId);
      console.log('Cancel appointment:', appointmentId);
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </Container>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInfo 
            profile={profile}
            onUpdateProfile={(updatedProfile) => setProfile(updatedProfile)}
          />
        );
      case 'medical-records':
        return <MedicalRecords records={medicalRecords} />;
      case 'arv-regimen':
        return <ARVRegimen regimen={arvRegimen} />;
      case 'appointments':
        return (
          <AppointmentHistory 
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="patient-dashboard mt-4">
      <Row>
        {/* Menu bên trái */}
        <Col md={3}>
          <Card className="menu-card">
            <Card.Body className="p-0">
              <Nav className="flex-column patient-menu">
                <Nav.Link 
                  className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Thông tin cá nhân
                </Nav.Link>
                <Nav.Link 
                  className={`menu-item ${activeTab === 'medical-records' ? 'active' : ''}`}
                  onClick={() => setActiveTab('medical-records')}
                >
                  Kết quả khám & Xét nghiệm
                </Nav.Link>
                <Nav.Link 
                  className={`menu-item ${activeTab === 'arv-regimen' ? 'active' : ''}`}
                  onClick={() => setActiveTab('arv-regimen')}
                >
                  Phác đồ ARV
                </Nav.Link>
                <Nav.Link 
                  className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appointments')}
                >
                  Lịch hẹn
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Nội dung bên phải */}
        <Col md={9}>
          <Card>
            <Card.Body>
              {renderContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard; 