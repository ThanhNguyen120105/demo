import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DoctorDetail from '../Doctor/DoctorDetail';
import { doctorAPI } from '../../services/api';
import './Doctors.css';

// Import images from assets (fallback images)
import id1Image from '../../assets/images/id1.png';
import id2Image from '../../assets/images/id2.png';
import id3Image from '../../assets/images/id3.png';
import id4Image from '../../assets/images/id4.png';
import id5Image from '../../assets/images/id5.png';
import id6Image from '../../assets/images/id6.png';

// Fallback images array
const fallbackImages = [id1Image, id2Image, id3Image, id4Image, id5Image, id6Image];

const Doctors = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching doctors from API...');
        
        const result = await doctorAPI.getAllDoctors();
        
        if (result.success) {
          // Transform API data to match component format - only use real data from API
          const transformedDoctors = result.data.map((doctor, index) => ({
            id: doctor.id,
            name: doctor.fullName || '',
            position: doctor.specialization || '',
            image: doctor.avatarURL || '',
            description: doctor.description || '',
            title: doctor.title || '',
            specialization: doctor.specialization || '',
            hospital: doctor.hospital || '',
            email: doctor.email || '',
            phoneNumber: doctor.phoneNumber || '',
            birthdate: doctor.birthdate || '',
            gender: doctor.gender || '',
            awards: doctor.awards || ''
          }));
          
          setDoctors(transformedDoctors);
          console.log('Doctors loaded successfully:', transformedDoctors);
        } else {
          setError(result.message || 'Không thể tải danh sách bác sĩ');
          console.error('Failed to fetch doctors:', result);
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải danh sách bác sĩ');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleAppointment = (doctorId) => {
    navigate('/appointment', { state: { selectedDoctor: doctorId } });
  };

  const handleViewDetail = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="doctors-page">
        <Container>
          <h1 className="text-center my-5">Đội Ngũ Chuyên Gia Y Tế</h1>
          <div className="text-center py-5">
            <Spinner animation="border" role="status" size="lg">
              <span className="visually-hidden">Đang tải...</span>
            </Spinner>
            <p className="mt-3">Đang tải thông tin bác sĩ...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctors-page">
        <Container>
          <h1 className="text-center my-5">Đội Ngũ Chuyên Gia Y Tế</h1>
          <Alert variant="danger" className="text-center">
            <h5>Không thể tải thông tin bác sĩ</h5>
            <p>{error}</p>
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      <Container>
        <h1 className="text-center my-5">Đội Ngũ Chuyên Gia Y Tế</h1>
        
        {doctors.length === 0 ? (
          <Alert variant="info" className="text-center">
            <h5>Chưa có thông tin bác sĩ</h5>
            <p>Hiện tại chưa có thông tin bác sĩ nào trong hệ thống.</p>
          </Alert>
        ) : (
          <Row>
            {doctors.map((doctor) => (
              <Col key={doctor.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 doctor-card">
                  {doctor.image && (
                    <div className="doctor-image-container">
                      <Card.Img 
                        variant="top" 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="doctor-image"
                      />
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="doctor-name">
                      {doctor.name || 'Chưa có tên'}
                    </Card.Title>
                    {doctor.position && (
                      <Card.Subtitle className="mb-3 text-muted">{doctor.position}</Card.Subtitle>
                    )}
                    {doctor.description && (
                      <Card.Text className="doctor-description flex-grow-1">
                        {doctor.description.length > 200 
                          ? `${doctor.description.substring(0, 200)}...` 
                          : doctor.description}
                      </Card.Text>
                    )}
                    
                    <div className="d-flex justify-content-between mt-auto pt-3">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAppointment(doctor.id)}
                      >
                        Đặt Lịch Hẹn
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleViewDetail(doctor)}
                      >
                        Xem Chi Tiết
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
        centered
        dialogClassName="modal-double-wide"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thông tin chi tiết bác sĩ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && <DoctorDetail doctor={selectedDoctor} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Doctors; 