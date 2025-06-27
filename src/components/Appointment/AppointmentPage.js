import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { canBookAppointment, getRoleId, getRoleName } from '../../constants/userRoles';
import AppointmentForm from './AppointmentForm';
import './AppointmentPage.css';

const AppointmentPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Debug: log user information
  console.log('AppointmentPage - Current user:', user);
  console.log('AppointmentPage - User role:', user?.role);
  console.log('AppointmentPage - User role_id:', user?.role_id);
  console.log('AppointmentPage - Can book appointment:', canBookAppointment(user));

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Kiểm tra authentication và role
  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center p-4 shadow-sm">
              <Card.Body>
                <FontAwesomeIcon icon={faSignInAlt} size="3x" className="text-primary mb-3" />
                <Card.Title as="h4">Vui lòng đăng nhập</Card.Title>
                <Card.Text className="mb-4">
                  Bạn cần đăng nhập vào tài khoản bệnh nhân để có thể đặt lịch hẹn khám bệnh.
                </Card.Text>
                <Button variant="primary" size="lg" onClick={handleLoginRedirect}>
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Đến trang đăng nhập
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  // Kiểm tra role_id = 1 (customer/patient)
  if (!canBookAppointment(user)) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center p-4 shadow-sm">
              <Card.Body>
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-danger mb-3" />
                <Card.Title as="h4">Không có quyền truy cập</Card.Title>
                <Card.Text className="mb-4">
                  Chỉ có bệnh nhân mới có thể sử dụng chức năng đặt lịch hẹn này. 
                  Tài khoản của bạn không có quyền truy cập.
                </Card.Text>                <p className="text-muted small">
                  Role hiện tại: {getRoleName(user)} (ID: {getRoleId(user)})
                  <br/>
                  Debug - user.role: {user?.role}, user.role_id: {user?.role_id}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // User authenticated và có role_id = 1, hiển thị form đặt lịch
  return (
    <div className="simple-appointment-page">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={12} lg={10}>
            <AppointmentForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentPage;