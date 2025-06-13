import React, { useState } from 'react';
import { Card, Table, Button, Modal, Badge, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFileMedical, faNotesMedical, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/dateUtils';

const MedicalRecords = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const getTestResultColor = (testType, value) => {
    if (!value) return 'secondary';
    
    if (testType === 'cd4') {
      const cd4 = parseInt(value);
      if (cd4 >= 500) return 'success';
      if (cd4 >= 200) return 'warning';
      return 'danger';
    }
    
    if (testType === 'viralLoad') {
      if (value.toLowerCase().includes('không phát hiện')) return 'success';
      if (value.toLowerCase().includes('<')) return 'warning';
      return 'danger';
    }
    
    return 'info';
  };

  const renderTestResults = (record) => (
    <div className="medical-report-form">
      {/* Thông tin khám */}
      <Card className="mb-3">
        <Card.Header className="bg-primary text-white py-2">
          <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
          Thông tin khám
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Ngày khám</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formatDate(record.date)} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bác sĩ khám</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.doctorName} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Loại khám</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.type} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Kết quả xét nghiệm */}
      <Card className="mb-3">
        <Card.Header className="bg-warning text-dark py-2">
          <FontAwesomeIcon icon={faFileMedical} className="me-2" />
          Kết quả xét nghiệm
        </Card.Header>
        <Card.Body>
          <h6 className="mb-3">Xét nghiệm HIV</h6>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Chỉ số CD4</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control 
                    type="text" 
                    value={record.results?.cd4 ? `${record.results.cd4} cells/mm³` : 'Chưa có kết quả'} 
                    readOnly
                  />
                  <Badge 
                    bg={getTestResultColor('cd4', record.results?.cd4)} 
                    className="ms-2"
                  >
                    {record.results?.cd4 ? 'Đã có kết quả' : 'Chờ kết quả'}
                  </Badge>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tải lượng virus</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control 
                    type="text" 
                    value={record.results?.viralLoad ? `${record.results.viralLoad} copies/mL` : 'Chưa có kết quả'} 
                    readOnly
                  />
                  <Badge 
                    bg={getTestResultColor('viralLoad', record.results?.viralLoad)} 
                    className="ms-2"
                  >
                    {record.results?.viralLoad ? 'Đã có kết quả' : 'Chờ kết quả'}
                  </Badge>
                </div>
              </Form.Group>
            </Col>
          </Row>

          {record.results?.otherTests && Object.keys(record.results.otherTests).length > 0 && (
            <>
              <h6 className="mb-3 mt-4">Các xét nghiệm khác</h6>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Loại xét nghiệm</th>
                    <th>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(record.results.otherTests).map(([test, result]) => (
                    <tr key={test}>
                      <td>{test}</td>
                      <td>{result}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Ghi chú */}
      {record.notes && (
        <Card className="mb-3">
          <Card.Header className="bg-secondary text-white py-2">
            <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
            Ghi chú
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={record.notes} 
                readOnly
              />
            </Form.Group>
          </Card.Body>
        </Card>
      )}
    </div>
  );

  return (
    <div className="medical-records">
      <Card>
        <Card.Header className="bg-primary text-white">
          <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
          Kết quả khám & xét nghiệm
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Ngày khám</th>
                <th>Bác sĩ</th>
                <th>Loại khám</th>
                <th>CD4</th>
                <th>Tải lượng virus</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.date)}</td>
                  <td>{record.doctorName}</td>
                  <td>{record.type}</td>
                  <td>
                    <Badge bg={getTestResultColor('cd4', record.results?.cd4)}>
                      {record.results?.cd4 ? `${record.results.cd4} cells/mm³` : 'Chờ kết quả'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getTestResultColor('viralLoad', record.results?.viralLoad)}>
                      {record.results?.viralLoad ? `${record.results.viralLoad} copies/mL` : 'Chờ kết quả'}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewDetails(record)}
                    >
                      <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                      Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Chi tiết kết quả khám
            <div className="text-muted fs-6">
              {selectedRecord && `${formatDate(selectedRecord.date)} - ${selectedRecord.doctorName}`}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && renderTestResults(selectedRecord)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicalRecords; 