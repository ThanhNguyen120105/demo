import React, { useState } from 'react';
import { Modal, Button, Card, Form, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd, faHeartbeat, faVial, faFilePdf, faEye, faTimes, faSlidersH,
  faPills, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import ARVSelectionTool from './ARVSelectionTool';

const MedicalReportModal = ({
  show,
  onHide,
  report,
  onChange,
  onSave,
  appointment,
  readOnly,
  onViewPdf,
  onShowMedicineSelector,
  onMedicineChange,
  onAddMedicine,
  onRemoveMedicine
}) => {
  const [showARVTool, setShowARVTool] = useState(false);
  const [showDeleteARVConfirm, setShowDeleteARVConfirm] = useState(false);
  const [arvToDelete, setARVToDelete] = useState(null); // 'file' for new file, 'url' for existing URL

  const handleARVSelect = (pdfFile) => {
    onChange('arvResultFile', pdfFile);
    setShowARVTool(false);
  };

  const handleDeleteARVConfirm = (type) => {
    setARVToDelete(type);
    setShowDeleteARVConfirm(true);
  };

  const performDeleteARV = () => {
    if (arvToDelete === 'file') {
      onChange('arvResultFile', null);
    } else if (arvToDelete === 'url') {
      onChange('arvRegimenResultURL', null);
    }
    setShowDeleteARVConfirm(false);
    setARVToDelete(null);
  };

  // Hàm xóa một thuốc khỏi danh sách
  const handleRemoveMedicine = (index) => {
    if (!report.medicalResultMedicines || !Array.isArray(report.medicalResultMedicines)) return;
    const newMedicines = [...report.medicalResultMedicines];
    newMedicines.splice(index, 1);
    onChange('medicalResultMedicines', newMedicines);
  };

  return (
    <>
      <Modal 
        show={show} 
        onHide={onHide} 
        centered
        className="medical-report-modal"
        dialogClassName="modal-90w"
        contentClassName="medical-report-modal-content"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {readOnly ? 'Xem báo cáo y tế' : 'Nhập báo cáo y tế'}
            <div className="text-muted fs-6 mt-1">
              <div>Bệnh nhân: {appointment?.alternativeName || `#${appointment?.userId || appointment?.id}`}</div>
              <div>{appointment?.date} {`${appointment?.slotStartTime || '00:00'} - ${appointment?.slotEndTime || '00:00'}`}</div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Thông tin bệnh nhân và lịch hẹn */}
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white py-2">
              <FontAwesomeIcon icon={faUserMd} className="me-2" />
              Thông tin bệnh nhân
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID bệnh nhân</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.customerId || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên bệnh nhân</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={report.patientInfo.name || ''} 
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Chỉ số sinh hiệu */}
          <Card className="mb-3">
            <Card.Header className="bg-info text-white py-2">
              <FontAwesomeIcon icon={faHeartbeat} className="me-2" />
              Chỉ số sinh hiệu
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cân nặng</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1"
                      placeholder="kg" 
                      value={report.weight || ''}
                      onChange={(e) => onChange('weight', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chiều cao</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1"
                      placeholder="cm" 
                      value={report.height || ''}
                      onChange={(e) => onChange('height', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>BMI</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="kg/m²" 
                      value={report.bmi || ''}
                      readOnly={true}
                      className="bg-light"
                      title="BMI được tính tự động từ cân nặng và chiều cao"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nhiệt độ</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1"
                      placeholder="°C" 
                      value={report.temperature || ''}
                      onChange={(e) => onChange('temperature', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Huyết áp</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="120/80 mmHg" 
                      value={report.bloodPressure || ''}
                      onChange={(e) => onChange('bloodPressure', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nhịp tim</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="bpm" 
                      value={report.heartRate || ''}
                      onChange={(e) => onChange('heartRate', e.target.value)}
                      readOnly={readOnly}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Kết quả xét nghiệm */}
          <Card className="mb-3">
            <Card.Header className="bg-warning text-dark py-2">
              <FontAwesomeIcon icon={faVial} className="me-2" />
              Kết quả xét nghiệm
            </Card.Header>
            <Card.Body>
              <h6 className="mb-3">Xét nghiệm HIV</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chỉ số CD4</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="650" 
                      value={report.cd4Count || ''}
                      onChange={(e) => onChange('cd4Count', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">tế bào/mm³</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tải lượng virus</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="< 20" 
                      value={report.viralLoad || ''}
                      onChange={(e) => onChange('viralLoad', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">bản sao/mL</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <h6 className="mb-3 mt-4">Huyết học</h6>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hemoglobin</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1"
                      placeholder="13.5" 
                      value={report.hemoglobin || ''}
                      onChange={(e) => onChange('hemoglobin', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">g/dL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bạch cầu</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1"
                      placeholder="5.6" 
                      value={report.whiteBloodCell || ''}
                      onChange={(e) => onChange('whiteBloodCell', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">× 10³/μL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiểu cầu</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="250" 
                      value={report.platelets || ''}
                      onChange={(e) => onChange('platelets', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">× 10³/μL</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <h6 className="mb-3 mt-4">Sinh hóa</h6>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Đường huyết</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="95" 
                      value={report.glucose || ''}
                      onChange={(e) => onChange('glucose', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">mg/dL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Creatinine</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="0.1"
                      placeholder="0.9" 
                      value={report.creatinine || ''}
                      onChange={(e) => onChange('creatinine', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">mg/dL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>ALT</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="25" 
                      value={report.alt || ''}
                      onChange={(e) => onChange('alt', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">U/L</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>AST</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="28" 
                      value={report.ast || ''}
                      onChange={(e) => onChange('ast', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">U/L</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              
              <h6 className="mb-3 mt-4">Chỉ số mỡ máu</h6>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cholesterol toàn phần</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="185" 
                      value={report.totalCholesterol || ''}
                      onChange={(e) => onChange('totalCholesterol', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">mg/dL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>LDL</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="110" 
                      value={report.ldl || ''}
                      onChange={(e) => onChange('ldl', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">mg/dL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>HDL</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="45" 
                      value={report.hdl || ''}
                      onChange={(e) => onChange('hdl', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">mg/dL</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Triglycerides</Form.Label>
                    <Form.Control 
                      type="number" 
                      step="1"
                      placeholder="150" 
                      value={report.trigilycerides || ''}
                      onChange={(e) => onChange('trigilycerides', e.target.value)}
                      readOnly={readOnly}
                    />
                    <Form.Text className="text-muted">mg/dL</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>          {/* Công cụ lựa chọn ARV */}
          <Card className="mb-3">
            <Card.Header className="bg-danger text-white py-2">
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              Công cụ lựa chọn ARV
            </Card.Header>
            <Card.Body>              {/* Display existing ARV URL from backend */}
              {report.arvRegimenResultURL && !report.arvResultFile && (
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                    <span className="me-3">Báo cáo ARV hiện có</span>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => window.open(report.arvRegimenResultURL, '_blank')}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      Xem
                    </Button>
                    {!readOnly && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteARVConfirm('url')}
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                  <Badge bg="info" className="me-2">Báo cáo hiện có</Badge>
                  <span className="text-muted small">Đã được lưu trong hệ thống</span>
                </div>
              )}
              
              {/* Display new ARV file to be uploaded */}
              {report.arvResultFile && (
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faFilePdf} className="me-2 text-success" />
                    <span className="me-3">{report.arvResultFile.name}</span>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => onViewPdf(report.arvResultFile)}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      Xem
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteARVConfirm('file')}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      Xóa
                    </Button>
                  </div>
                  <Badge bg="success" className="me-2">Tệp mới</Badge>
                  <span className="text-muted small">Sẽ được tải lên khi lưu báo cáo</span>
                </div>
              )}
              
              {/* ARV Tool button - always show if not readonly */}
              {!readOnly && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => setShowARVTool(true)}
                  className="mb-3"
                >
                  <FontAwesomeIcon icon={faSlidersH} className="me-2" />
                  {report.arvResultFile || report.arvRegimenResultURL ? 'Tạo báo cáo ARV mới' : 'Mở công cụ lựa chọn ARV'}
                </Button>
              )}
            </Card.Body>
          </Card>

          {/* Thuốc điều trị */}
          <Card className="mb-3">
            <Card.Header className="bg-success text-white py-2">
              <FontAwesomeIcon icon={faPills} className="me-2" />
              Thuốc điều trị
            </Card.Header>
            <Card.Body>
              {report.medicalResultMedicines && report.medicalResultMedicines.length > 0 ? (
                <div>
                  {report.medicalResultMedicines.map((med, index) => (
                    <Row key={index} className="mb-2 p-2 border rounded">
                      <Col md={4}>
                        <strong>{med.medicineName || 'Chưa có tên'}</strong>
                      </Col>
                      <Col md={3}>
                        <span className="text-muted">Liều: {med.dosage || 'Chưa có'}</span>
                      </Col>
                      <Col md={3}>
                        <Badge bg={med.status === 'Mới' ? 'primary' : med.status === 'Tiếp tục' ? 'success' : 'warning'}>
                          {med.status || 'Mới'}
                        </Badge>
                      </Col>
                      {!readOnly && (
                        <Col md={2} className="d-flex justify-content-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleRemoveMedicine(index)}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </Col>
                      )}
                    </Row>
                  ))}
                </div>
              ) : (
                <div className="text-muted text-center py-3">
                  Chưa có thông tin thuốc
                </div>
              )}

              {!readOnly && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={onShowMedicineSelector}
                  className="mt-2"
                >
                  <FontAwesomeIcon icon={faPills} className="me-1" />
                  Quản lý thuốc
                </Button>
              )}
            </Card.Body>
          </Card>

          {/* Đánh giá & kế hoạch */}
          <Card className="mb-3">
            <Card.Header className="bg-secondary text-white py-2">
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              Đánh giá & Kế hoạch
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Đánh giá tiến triển bệnh nhân *</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Nhập đánh giá về tình trạng và tiến triển của bệnh nhân"
                  value={report.patientProgressEvaluation || ''}
                  onChange={(e) => onChange('patientProgressEvaluation', e.target.value)}
                  readOnly={readOnly}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Kế hoạch điều trị *</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Nhập kế hoạch điều trị cho bệnh nhân"
                  value={report.plan || ''}
                  onChange={(e) => onChange('plan', e.target.value)}
                  readOnly={readOnly}
                  required
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Khuyến nghị *</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  placeholder="Nhập khuyến nghị cho bệnh nhân"
                  value={report.recommendation || ''}
                  onChange={(e) => onChange('recommendation', e.target.value)}
                  readOnly={readOnly}
                  required
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Modal.Body>        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Đóng
          </Button>
          {!readOnly && (
            <Button variant="primary" onClick={onSave}>
              Lưu báo cáo y tế
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      
      {showARVTool && (
        <Modal 
          show={showARVTool} 
          onHide={() => setShowARVTool(false)} 
          centered
          className="arv-tool-modal"
          dialogClassName="arv-custom-modal-dialog"
          style={{
            '--bs-modal-width': '80vw'
          }}
        >
          <Modal.Header 
            closeButton
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderBottom: 'none',
              padding: '1.5rem 2.5rem',
              borderRadius: '20px 20px 0 0',
              minHeight: '80px'
            }}
          >
            <Modal.Title style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              letterSpacing: '0.5px',
              margin: '0',
              lineHeight: '1.2'
            }}>
              Công Cụ Lựa Chọn Phác Đồ ARV
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{
            padding: '0',
            height: 'calc(90vh - 80px)',
            maxHeight: 'calc(90vh - 80px)',
            overflowY: 'auto',
            borderRadius: '0 0 20px 20px'
          }}>
            <ARVSelectionTool 
              appointment={appointment} 
              onSelect={handleARVSelect}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* Modal xác nhận xóa ARV */}
      <Modal 
        show={showDeleteARVConfirm} 
        onHide={() => {
          setShowDeleteARVConfirm(false);
          setARVToDelete(null);
        }} 
        centered
        className="confirmation-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faTimes} className="text-danger me-2" />
            Xác nhận xóa báo cáo ARV
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="mb-3">Bạn có chắc chắn muốn xóa báo cáo ARV này?</p>
            <div className="alert alert-warning">
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              <strong>Cảnh báo:</strong> Sau khi xóa, bạn sẽ cần tạo lại báo cáo ARV nếu cần thiết.
            </div>
            
            {arvToDelete === 'file' && (
              <div className="arv-info p-3 bg-light rounded">
                <div className="mb-2">
                  <strong>📄 Loại:</strong> Báo cáo ARV mới (chưa lưu)
                </div>
                <div>
                  <strong>📝 Tên file:</strong> {report.arvResultFile?.name || 'N/A'}
                </div>
              </div>
            )}
            
            {arvToDelete === 'url' && (
              <div className="arv-info p-3 bg-light rounded">
                <div className="mb-2">
                  <strong>📄 Loại:</strong> Báo cáo ARV hiện có (đã lưu)
                </div>
                <div>
                  <strong>🔗 Trạng thái:</strong> Đã được lưu trong hệ thống
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowDeleteARVConfirm(false);
              setARVToDelete(null);
            }}
          >
            Hủy
          </Button>
          <Button 
            variant="danger" 
            onClick={performDeleteARV}
          >
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Xác nhận xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MedicalReportModal;
