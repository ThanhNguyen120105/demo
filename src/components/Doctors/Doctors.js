import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Doctors.css';

const doctorsData = [
  {
    id: 1,
    name: "PROF.DR. NGUYEN VAN AN",
    position: "Director of Cardiovascular Center",
    hospital: "Tam Anh General Hospital, Ho Chi Minh City",
    description: "Prof.Dr. Nguyen Van An is one of the leading experts in the field of Cardiovascular Medicine in Vietnam. With over 30 years of experience in the medical field, he has successfully performed thousands of complex cardiac surgeries."
  },
  {
    id: 2,
    name: "ASSOC.PROF.DR. TRAN THI MINH",
    position: "Head of Obstetrics and Gynecology Department",
    hospital: "Tam Anh General Hospital, Hanoi",
    description: "Assoc.Prof.Dr. Tran Thi Minh is a leading expert in the field of Obstetrics and Gynecology with over 25 years of experience. She has successfully performed many complex surgeries and has many valuable scientific research works."
  },
  {
    id: 3,
    name: "DR. LE VAN PHUC",
    position: "Director of Endoscopy and Gastrointestinal Endoscopic Surgery Center",
    hospital: "Tam Anh General Hospital, Ho Chi Minh City",
    description: "Dr. Le Van Phuc is a leading expert in the field of Endoscopy and Gastrointestinal Endoscopic Surgery. With over 20 years of experience, he has successfully performed thousands of complex endoscopic surgeries."
  },
  {
    id: 4,
    name: "DR. NGUYEN THI HA",
    position: "Head of Pediatrics Department",
    hospital: "Tam Anh General Hospital, Hanoi",
    description: "Dr. Nguyen Thi Ha is an expert with many years of experience in the field of Pediatrics. She has successfully treated many complex cases and has made many contributions to improving the quality of child care."
  },
  {
    id: 5,
    name: "PROF.DR. PHAM VAN THANH",
    position: "Director of Neurology Center",
    hospital: "Tam Anh General Hospital, Ho Chi Minh City",
    description: "Prof.Dr. Pham Van Thanh is a leading expert in the field of Neurology. With over 25 years of experience, he has successfully performed many complex neurological surgeries and has many scientific research works."
  },
  {
    id: 6,
    name: "DR. TRAN VAN MINH",
    position: "Head of Traumatology and Orthopedics Department",
    hospital: "Tam Anh General Hospital, Hanoi",
    description: "Dr. Tran Van Minh is an expert with extensive experience in the field of Traumatology and Orthopedics. He has successfully performed many complex surgeries and has made many contributions to the development of new techniques."
  }
];

const Doctors = () => {
  return (
    <div className="doctors-page">
      <Container>
        <h1 className="text-center my-5">Our Medical Experts</h1>
        <Row>
          {doctorsData.map((doctor) => (
            <Col key={doctor.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 doctor-card">
                <Card.Body>
                  <Card.Title className="doctor-name">{doctor.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{doctor.position}</Card.Subtitle>
                  <Card.Text className="hospital-name">{doctor.hospital}</Card.Text>
                  <Card.Text className="doctor-description">{doctor.description}</Card.Text>
                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-primary">Book Appointment</button>
                    <button className="btn btn-outline-primary">View Details</button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Doctors; 