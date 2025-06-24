import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFlask, 
  faVial, 
  faUserMd, 
  faClock,
  faFilePdf,
  faPrescriptionBottleAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const MedicalResultDemo = () => {
  const [showModal, setShowModal] = useState(false);

  // Dữ liệu mẫu kết quả xét nghiệm với ARV và thuốc
  const sampleMedicalResult = {
    id: 'MR001',
    patientName: 'Nguyễn Văn A',
    patientPhoneNumber: '0909123456',
    reason: 'Khám định kỳ theo dõi HIV',
    
    // Kết quả xét nghiệm
    cd4Count: 650,
    viralLoad: '<20',
    hemoglobin: 14.2,
    whiteBloodCell: 5.6,
    platelets: 235,
    glucose: 95,
    creatinine: 0.9,
    alt: 25,
    ast: 28,
    totalCholesterol: 185,
    ldl: 110,
    hdl: 45,
    triglycerides: 150,
    
    // Đánh giá của bác sĩ
    patientProgressEvaluation: 'Bệnh nhân đáp ứng tốt với phác đồ điều trị hiện tại. Chỉ số CD4 ổn định, tải lượng virus không phát hiện. Cần tiếp tục theo dõi định kỳ và tuân thủ điều trị.',
    
    // Kết quả ARV
    arvResults: {
      fileName: 'Bao_cao_ARV_NguyenVanA_2024.pdf',
      recommendations: 'Tiếp tục phác đồ ARV hiện tại. Biktarvy cho hiệu quả điều trị tốt với ít tác dụng phụ.'
    },
    
    // Thuốc điều trị
    medications: [
      {
        name: 'Biktarvy',
        dosage: '1 viên',
        frequency: 'Ngày 1 lần',
        status: 'Tiếp tục'
      },
      {
        name: 'Atripla',
        dosage: '1 viên',
        frequency: 'Ngày 1 lần',
        status: 'Đã ngừng'
      },
      {
        name: 'Vitamin D3',
        dosage: '2000 IU',
        frequency: 'Ngày 1 lần',
        status: 'Mới'
      }
    ],
    
    // Thông tin thời gian
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:45:00Z'
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <FontAwesomeIcon icon={faFlask} className="me-2" />
              Demo Xem Chi Tiết Kết Quả Xét Nghiệm (Bệnh Nhân)
            </Card.Header>
            <Card.Body>
              <p className="mb-3">
                Đây là demo giao diện xem chi tiết kết quả xét nghiệm dành cho bệnh nhân. 
                Giao diện này bao gồm các phần: kết quả xét nghiệm, ARV, thuốc điều trị, 
                đánh giá của bác sĩ và thông tin thời gian (chỉ xem, không chỉnh sửa).
              </p>
              
              <Alert variant="info">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                <strong>Lưu ý:</strong> Giao diện này giống hoàn toàn phần báo cáo y tế của bác sĩ 
                nhưng chỉ để xem, không có các chức năng thêm/sửa/xóa.
              </Alert>

              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                size="lg"
              >
                <FontAwesomeIcon icon={faFlask} className="me-2" />
                Xem Chi Tiết Kết Quả Xét Nghiệm
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Chi tiết kết quả xét nghiệm */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faFlask} className="me-2" />
            Xem kết quả xét nghiệm
            <div className="text-muted fs-6">
              Mã kết quả: {sampleMedicalResult.id}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          <div className="medical-report-form">
            {/* Phần kết quả xét nghiệm */}
            <Card className="mb-3">
              <Card.Header className="bg-warning text-dark py-2">
                <FontAwesomeIcon icon={faVial} className="me-2" />
                Kết quả xét nghiệm
              </Card.Header>
              <Card.Body>
                <h6 className="mb-3">Xét nghiệm HIV</h6>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Chỉ số CD4</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.cd4Count} tế bào/mm³
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Tải lượng virus</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.viralLoad} bản sao/mL
                      </div>
                    </div>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Huyết học</h6>
                <Row>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label">Hemoglobin</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.hemoglobin} g/dL
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label">Bạch cầu</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.whiteBloodCell} × 10³/μL
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-3">
                      <label className="form-label">Tiểu cầu</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.platelets} × 10³/μL
                      </div>
                    </div>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Sinh hóa</h6>
                <Row>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">Đường huyết</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.glucose} mg/dL
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">Creatinine</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.creatinine} mg/dL
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">ALT</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.alt} U/L
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">AST</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.ast} U/L
                      </div>
                    </div>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Chỉ số mỡ máu</h6>
                <Row>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">Cholesterol toàn phần</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.totalCholesterol} mg/dL
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">LDL</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.ldl} mg/dL
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">HDL</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.hdl} mg/dL
                      </div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="mb-3">
                      <label className="form-label">Triglycerides</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {sampleMedicalResult.triglycerides} mg/dL
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Phần ARV (chỉ xem) */}
            <Card className="mb-3">
              <Card.Header className="bg-danger text-white py-2">
                <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                Kết quả ARV
              </Card.Header>
              <Card.Body>
                <div className="bg-light p-3 rounded">
                  <p className="mb-0">
                    <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                    <strong>Báo cáo ARV:</strong> {sampleMedicalResult.arvResults.fileName}
                  </p>
                  <p className="mb-0 mt-2">
                    <strong>Khuyến nghị:</strong> {sampleMedicalResult.arvResults.recommendations}
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Phần thuốc (chỉ xem) */}
            <Card className="mb-3">
              <Card.Header className="bg-success text-white py-2">
                <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                Thuốc điều trị
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <table className="table table-striped mb-0">
                    <thead>
                      <tr>
                        <th>Tên thuốc</th>
                        <th>Liều lượng</th>
                        <th>Tần suất</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleMedicalResult.medications.map((med, index) => (
                        <tr key={index}>
                          <td>{med.name}</td>
                          <td>{med.dosage}</td>
                          <td>{med.frequency}</td>
                          <td>
                            <Badge 
                              bg={
                                med.status === 'Mới' ? 'primary' :
                                med.status === 'Tiếp tục' ? 'success' :
                                med.status === 'Đã thay đổi' ? 'warning' :
                                med.status === 'Đã ngừng' ? 'danger' : 'secondary'
                              }
                            >
                              {med.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>

            {/* Đánh giá của bác sĩ */}
            <Card className="mb-3">
              <Card.Header className="bg-info text-white py-2">
                <FontAwesomeIcon icon={faUserMd} className="me-2" /> 
                Đánh giá của bác sĩ
              </Card.Header>
              <Card.Body>
                <div className="form-control" style={{ backgroundColor: '#f8f9fa', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                  {sampleMedicalResult.patientProgressEvaluation}
                </div>
              </Card.Body>
            </Card>

            {/* Thông tin thời gian */}
            <Card>
              <Card.Header className="bg-secondary text-white py-2">
                <FontAwesomeIcon icon={faClock} className="me-2" />
                Thông tin thời gian
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Thời gian tạo</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {new Date(sampleMedicalResult.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Cập nhật lần cuối</label>
                      <div className="form-control" style={{ backgroundColor: '#f8f9fa' }}>
                        {new Date(sampleMedicalResult.updatedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicalResultDemo;