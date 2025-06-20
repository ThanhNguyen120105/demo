import React, { useState } from 'react';
import { Card, Table, Button, Modal, Badge, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFileMedical, faNotesMedical, faExclamationTriangle, faEye } from '@fortawesome/free-solid-svg-icons';
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
    
    if (testType === 'cd4_count') {
      const cd4 = parseInt(value);
      if (cd4 >= 500) return 'success';
      if (cd4 >= 200) return 'warning';
      return 'danger';
    }
    
    if (testType === 'viral_load') {
      if (value.toLowerCase().includes('không phát hiện') || value.toLowerCase().includes('undetectable')) return 'success';
      if (value.toLowerCase().includes('<')) return 'warning';
      return 'danger';
    }

    if (testType === 'hemoglobin') {
      const hgb = parseFloat(value);
      if (hgb >= 12) return 'success';
      if (hgb >= 10) return 'warning';
      return 'danger';
    }

    if (testType === 'glucose') {
      const glucose = parseInt(value);
      if (glucose >= 70 && glucose <= 99) return 'success';
      if (glucose >= 100 && glucose <= 125) return 'warning';
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
                  value={formatDate(record.created_date || record.date)} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bác sĩ khám</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.doctor_name || record.doctorName || 'Chưa có thông tin'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>ID Cuộc hẹn</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.appointment_id || 'Chưa có thông tin'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Thông số sinh tồn */}
      <Card className="mb-3">
        <Card.Header className="bg-info text-white py-2">
          <FontAwesomeIcon icon={faFileMedical} className="me-2" />
          Thông số sinh tồn
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Cân nặng (kg)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.weight ? `${record.weight} kg` : 'Chưa đo'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Chiều cao (cm)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.height ? `${record.height} cm` : 'Chưa đo'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>BMI</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.bmi ? `${record.bmi}` : 'Chưa tính'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Nhiệt độ (°C)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.temperature ? `${record.temperature}°C` : 'Chưa đo'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Huyết áp</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.blood_pressure || 'Chưa đo'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nhịp tim (bpm)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.heart_rate ? `${record.heart_rate} bpm` : 'Chưa đo'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Kết quả xét nghiệm HIV */}
      <Card className="mb-3">
        <Card.Header className="bg-warning text-dark py-2">
          <FontAwesomeIcon icon={faFileMedical} className="me-2" />
          Kết quả xét nghiệm HIV
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Chỉ số CD4 (cells/mm³)</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control 
                    type="text" 
                    value={record.cd4_count ? `${record.cd4_count} cells/mm³` : 'Chưa có kết quả'} 
                    readOnly
                  />
                  <Badge 
                    bg={getTestResultColor('cd4_count', record.cd4_count)} 
                    className="ms-2"
                  >
                    {record.cd4_count ? 'Đã có kết quả' : 'Chờ kết quả'}
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
                    value={record.viral_load || 'Chưa có kết quả'} 
                    readOnly
                  />
                  <Badge 
                    bg={getTestResultColor('viral_load', record.viral_load)} 
                    className="ms-2"
                  >
                    {record.viral_load ? 'Đã có kết quả' : 'Chờ kết quả'}
                  </Badge>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Kết quả xét nghiệm huyết học */}
      <Card className="mb-3">
        <Card.Header className="bg-success text-white py-2">
          <FontAwesomeIcon icon={faFileMedical} className="me-2" />
          Xét nghiệm huyết học
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Hemoglobin (g/dL)</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control 
                    type="text" 
                    value={record.hemoglobin ? `${record.hemoglobin} g/dL` : 'Chưa có kết quả'} 
                    readOnly
                  />
                  <Badge 
                    bg={getTestResultColor('hemoglobin', record.hemoglobin)} 
                    className="ms-2"
                  >
                    {record.hemoglobin ? 'OK' : 'Chờ'}
                  </Badge>
                </div>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bạch cầu (×10³/μL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.white_blood_cell ? `${record.white_blood_cell} ×10³/μL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tiểu cầu (×10³/μL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.platelets ? `${record.platelets} ×10³/μL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Kết quả xét nghiệm sinh hóa */}
      <Card className="mb-3">
        <Card.Header className="bg-danger text-white py-2">
          <FontAwesomeIcon icon={faFileMedical} className="me-2" />
          Xét nghiệm sinh hóa
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Glucose (mg/dL)</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control 
                    type="text" 
                    value={record.glucose ? `${record.glucose} mg/dL` : 'Chưa có kết quả'} 
                    readOnly
                  />
                  <Badge 
                    bg={getTestResultColor('glucose', record.glucose)} 
                    className="ms-2"
                  >
                    {record.glucose ? 'OK' : 'Chờ'}
                  </Badge>
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Creatinine (mg/dL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.creatinine ? `${record.creatinine} mg/dL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>ALT (U/L)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.alt ? `${record.alt} U/L` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>AST (U/L)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.ast ? `${record.ast} U/L` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Lipid Panel */}
      <Card className="mb-3">
        <Card.Header className="bg-secondary text-white py-2">
          <FontAwesomeIcon icon={faFileMedical} className="me-2" />
          Chỉ số mỡ máu
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Cholesterol TP (mg/dL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.total_cholesterol ? `${record.total_cholesterol} mg/dL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>LDL (mg/dL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.ldl ? `${record.ldl} mg/dL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>HDL (mg/dL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.hdl ? `${record.hdl} mg/dL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Triglycerides (mg/dL)</Form.Label>
                <Form.Control 
                  type="text" 
                  value={record.trigilycerides ? `${record.trigilycerides} mg/dL` : 'Chưa có kết quả'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Đánh giá và kế hoạch */}
      <Card className="mb-3">
        <Card.Header className="bg-dark text-white py-2">
          <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
          Đánh giá và kế hoạch điều trị
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Đánh giá tiến triển bệnh nhân</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={record.patient_progress_evaluation || 'Chưa có đánh giá'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Kế hoạch điều trị</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={record.plan || 'Chưa có kế hoạch'} 
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Khuyến nghị</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={record.recommendation || 'Chưa có khuyến nghị'} 
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ARV Regimen Result */}
      {record.arv_regimen_result_url && (
        <Card className="mb-3">
          <Card.Header className="bg-warning text-dark py-2">
            <FontAwesomeIcon icon={faFileMedical} className="me-2" />
            Kết quả phác đồ ARV
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label>URL kết quả phác đồ ARV</Form.Label>
              <Form.Control 
                type="text" 
                value={record.arv_regimen_result_url} 
                readOnly
              />
              <small className="text-muted">
                <a href={record.arv_regimen_result_url} target="_blank" rel="noopener noreferrer">
                  Xem kết quả phác đồ ARV
                </a>
              </small>
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
          <Table responsive hover>            <thead>
              <tr>
                <th>Ngày khám</th>
                <th>Bác sĩ</th>
                <th>CD4 Count</th>
                <th>Tải lượng virus</th>
                <th>BMI</th>
                <th>Hemoglobin</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatDate(record.created_date || record.date)}</td>
                  <td>{record.doctor_name || record.doctorName || 'Chưa có thông tin'}</td>
                  <td>
                    <Badge bg={getTestResultColor('cd4_count', record.cd4_count)}>
                      {record.cd4_count ? `${record.cd4_count} cells/mm³` : 'Chờ kết quả'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getTestResultColor('viral_load', record.viral_load)}>
                      {record.viral_load || 'Chờ kết quả'}
                    </Badge>
                  </td>
                  <td>
                    {record.bmi ? `${record.bmi}` : 'Chưa tính'}
                  </td>
                  <td>
                    <Badge bg={getTestResultColor('hemoglobin', record.hemoglobin)}>
                      {record.hemoglobin ? `${record.hemoglobin} g/dL` : 'Chờ kết quả'}
                    </Badge>
                  </td>                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewDetails(record)}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
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
        <Modal.Header closeButton>          <Modal.Title>
            Chi tiết kết quả khám
            <div className="text-muted fs-6">
              {selectedRecord && `${formatDate(selectedRecord.created_date || selectedRecord.date)} - ${selectedRecord.doctor_name || selectedRecord.doctorName || 'Bác sĩ'}`}
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