import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AppointmentHistoryNew from './AppointmentHistory_new';

const AppointmentHistoryDemo = () => {
  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Demo: Lịch sử lịch hẹn với tính năng xem chi tiết</h2>
          <AppointmentHistoryNew />
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentHistoryDemo;
