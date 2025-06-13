import React from 'react';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, faUserMd, faPills, 
  faExclamationTriangle, faFileMedical, 
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/dateUtils';

const ARVRegimen = ({ regimen }) => {
  if (!regimen) {
    return (
      <div className="text-center p-4">
        <p>Chưa có thông tin phác đồ ARV</p>
      </div>
    );
  }

  const renderCurrentRegimen = () => {
    if (!regimen.currentRegimen) return null;

    return (
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <FontAwesomeIcon icon={faPills} className="me-2" />
          Phác đồ hiện tại
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <div className="mb-3">
                <h6 className="text-muted mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Thời gian
                </h6>
                <p className="mb-0">Bắt đầu: {formatDate(regimen.currentRegimen.startDate)}</p>
              </div>
              <div className="mb-3">
                <h6 className="text-muted mb-2">
                  <FontAwesomeIcon icon={faUserMd} className="me-2" />
                  Bác sĩ kê đơn
                </h6>
                <p className="mb-0">{regimen.currentRegimen.doctorName}</p>
              </div>
            </Col>
          </Row>

          <h6 className="text-muted mb-3">
            <FontAwesomeIcon icon={faPills} className="me-2" />
            Danh sách thuốc
          </h6>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Thuốc</th>
                <th>Liều lượng</th>
                <th>Thời gian uống</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {regimen.currentRegimen.medications.map((med, index) => (
                <tr key={index}>
                  <td>{med.name}</td>
                  <td>{med.dosage}</td>
                  <td>{med.time}</td>
                  <td>{med.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {regimen.currentRegimen.monitoringResults && (
            <div className="mt-4">
              <h6 className="text-muted mb-3">
                <FontAwesomeIcon icon={faFileMedical} className="me-2" />
                Kết quả theo dõi
              </h6>
              <Row>
                <Col md={6}>
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">CD4</td>
                        <td>{regimen.currentRegimen.monitoringResults.cd4 || 'Chưa có kết quả'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Tải lượng virus</td>
                        <td>{regimen.currentRegimen.monitoringResults.viralLoad || 'Chưa có kết quả'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Chức năng gan</td>
                        <td>{regimen.currentRegimen.monitoringResults.liverFunction || 'Bình thường'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Chức năng thận</td>
                        <td>{regimen.currentRegimen.monitoringResults.kidneyFunction || 'Bình thường'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderRegimenHistory = () => {
    if (!regimen.history || regimen.history.length === 0) return null;

    return (
      <Card>
        <Card.Header className="bg-secondary text-white">
          <FontAwesomeIcon icon={faNotesMedical} className="me-2" />
          Lịch sử phác đồ
        </Card.Header>
        <Card.Body>
          {regimen.history.map((reg, index) => (
            <div key={index} className="mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="mb-1">
                    Phác đồ {index + 1}
                    {reg.reason && (
                      <Badge bg="info" className="ms-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                        {reg.reason}
                      </Badge>
                    )}
                  </h6>
                  <p className="text-muted mb-0">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    {formatDate(reg.startDate)} - {reg.endDate ? formatDate(reg.endDate) : 'Hiện tại'}
                  </p>
                </div>
              </div>

              {reg.sideEffects && (
                <div className="mb-3">
                  <h6 className="text-muted mb-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    Tác dụng phụ
                  </h6>
                  <p className="mb-0">{reg.sideEffects}</p>
                </div>
              )}

              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Thuốc</th>
                    <th>Liều lượng</th>
                    <th>Thời gian uống</th>
                    <th>Ghi chú</th>
                    {reg.monitoringResults && <th>Kết quả</th>}
                  </tr>
                </thead>
                <tbody>
                  {reg.medications.map((med, medIndex) => (
                    <tr key={medIndex}>
                      <td>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.time}</td>
                      <td>{med.notes || '-'}</td>
                      {reg.monitoringResults && (
                        <td>
                          {reg.monitoringResults.cd4 && `CD4: ${reg.monitoringResults.cd4}`}
                          {reg.monitoringResults.viralLoad && (
                            <div>VL: {reg.monitoringResults.viralLoad}</div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      {renderCurrentRegimen()}
      {renderRegimenHistory()}
    </div>
  );
};

export default ARVRegimen; 