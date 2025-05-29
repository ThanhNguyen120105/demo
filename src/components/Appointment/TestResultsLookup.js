import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal, Tabs, Tab, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVial, faSearch, faCalendarAlt, faDownload, faEye,
  faDna, faHeartbeat, faWeight, faStethoscope, faPills,
  faChartLine, faHistory, faFileAlt, faPrint, faFilter, faUser
} from '@fortawesome/free-solid-svg-icons';
import './TestResultsLookup.css';

const TestResultsLookup = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [testType, setTestType] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeTab, setActiveTab] = useState('test-results');

  // Fake data for ARV medications (from ARVSelectionTool)
  const arvMedications = [
    { code: '3TC', name: 'Lamivudine/Epivir', category: 'NRTI' },
    { code: 'FTC', name: 'Emtricitabine/Emtriva', category: 'NRTI' },
    { code: 'ABC', name: 'Abacavir/Ziagen', category: 'NRTI' },
    { code: 'TAF', name: 'Tenofovir alafenamide/Vemlidy', category: 'NRTI' },
    { code: 'TDF', name: 'Tenofovir diproxil fumarate/Viread', category: 'NRTI' },
    { code: 'AZT', name: 'Zidovudine/Retrovir', category: 'NRTI' },
    { code: 'EFV', name: 'Efavirenz/Sustiva', category: 'NNRTI' },
    { code: 'RPV', name: 'Rilpivirine/Edurant', category: 'NNRTI' },
    { code: 'DOR', name: 'Doravirine/Pifeltro', category: 'NNRTI' },
    { code: 'DRV/r', name: 'Dolutegravir-ritonavir/Prezista and Norvir', category: 'PI' },
    { code: 'DTG', name: 'Dolutegravir/Tivicay', category: 'INSTI' },
    { code: 'BIC', name: 'Bictegravir/NA', category: 'INSTI' },
    { code: 'BIC/TAF/FTC', name: 'Biktarvy', category: 'STR' },
    { code: 'DTG/ABC/3TC', name: 'Triumeq', category: 'STR' },
    { code: 'DTG/3TC', name: 'Dovato', category: 'STR' }
  ];

  // Fake test results data - More comprehensive like ARV Selection Tool
  const [testResults] = useState([
    {
      id: 1,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      appointmentId: 'APT-2024-001',
      testDate: '2024-01-15',
      testType: 'HIV Viral Load',
      result: 'Undetectable (<50 copies/mL)',
      status: 'completed',
      doctor: 'BS. Trần Thị B',
      nextVisit: '2024-04-15',
      cd4Count: 650,
      viralLoad: '<50',
      arvRegimen: ['DTG', 'TAF', 'FTC'],
      hlaB5701: 'Negative',
      tropism: 'R5 virus',
      comorbidities: ['cardiovascular', 'hyperlipidemia'],
      coMedications: ['Atorvastatin', 'Metformin'],
      sideEffects: 'None reported',
      notes: 'Excellent response to treatment. Continue current regimen.',
      labValues: {
        hemoglobin: '14.2 g/dL',
        creatinine: '0.9 mg/dL',
        alt: '28 U/L',
        cholesterol: '180 mg/dL'
      }
    },
    {
      id: 2,
      patientId: 'HIV002',
      patientName: 'Lê Thị C',
      appointmentId: 'APT-2024-002',
      testDate: '2024-01-10',
      testType: 'CD4 Count',
      result: '450 cells/μL',
      status: 'completed',
      doctor: 'BS. Phạm Văn D',
      nextVisit: '2024-04-10',
      cd4Count: 450,
      viralLoad: '85',
      arvRegimen: ['BIC/TAF/FTC'],
      hlaB5701: 'Positive',
      tropism: 'R5 virus',
      comorbidities: ['diabetes', 'renal'],
      coMedications: ['Metformin', 'Lisinopril'],
      sideEffects: 'Mild nausea',
      notes: 'Stable immune function. Monitor viral load closely.',
      labValues: {
        hemoglobin: '12.8 g/dL',
        creatinine: '1.2 mg/dL',
        alt: '35 U/L',
        glucose: '145 mg/dL'
      }
    },
    {
      id: 3,
      patientId: 'HIV003',
      patientName: 'Hoàng Minh E',
      appointmentId: 'APT-2024-003',
      testDate: '2024-01-08',
      testType: 'ARV Resistance',
      result: 'K65R resistance detected',
      status: 'completed',
      doctor: 'BS. Nguyễn Thị F',
      nextVisit: '2024-02-08',
      cd4Count: 320,
      viralLoad: '15000',
      arvRegimen: ['DRV/r', 'TAF', '3TC'],
      hlaB5701: 'Negative',
      tropism: 'X4 virus',
      comorbidities: ['liver', 'hbv'],
      coMedications: ['Entecavir', 'Omeprazole'],
      sideEffects: 'Diarrhea, fatigue',
      notes: 'Regimen adjustment needed.',
      labValues: {
        hemoglobin: '11.5 g/dL',
        creatinine: '0.8 mg/dL',
        alt: '65 U/L',
        hbsAg: 'Positive'
      }
    },
    {
      id: 4,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      appointmentId: 'APT-2023-045',
      testDate: '2023-12-15',
      testType: 'HIV Viral Load',
      result: '150 copies/mL',
      status: 'completed',
      doctor: 'BS. Trần Thị B',
      nextVisit: '2024-01-15',
      cd4Count: 580,
      viralLoad: '150',
      arvRegimen: ['DTG', 'TAF', 'FTC'],
      hlaB5701: 'Negative',
      tropism: 'R5 virus',
      comorbidities: ['cardiovascular'],
      coMedications: ['Atorvastatin'],
      sideEffects: 'None',
      notes: 'Viral load decreasing. Good treatment response.',
      labValues: {
        hemoglobin: '13.8 g/dL',
        creatinine: '0.9 mg/dL',
        alt: '32 U/L',
        cholesterol: '195 mg/dL'
      }
    },
    {
      id: 5,
      patientId: 'HIV004',
      patientName: 'Vũ Thị G',
      appointmentId: 'APT-2024-004',
      testDate: '2024-01-12',
      testType: 'Complete Panel',
      result: 'VL: <50, CD4: 720',
      status: 'completed',
      doctor: 'BS. Lê Văn H',
      nextVisit: '2024-07-12',
      cd4Count: 720,
      viralLoad: '<50',
      arvRegimen: ['DTG/ABC/3TC'],
      hlaB5701: 'Negative',
      tropism: 'R5 virus',
      comorbidities: ['osteoporosis'],
      coMedications: ['Calcium', 'Vitamin D'],
      sideEffects: 'None',
      notes: 'Excellent treatment response. Continue current regimen.',
      labValues: {
        hemoglobin: '13.5 g/dL',
        creatinine: '0.7 mg/dL',
        alt: '25 U/L',
        vitaminD: '32 ng/mL'
      }
    },
    {
      id: 6,
      patientId: 'HIV005',
      patientName: 'Phạm Thị H',
      appointmentId: 'APT-2024-005',
      testDate: '2024-01-05',
      testType: 'HIV Viral Load',
      result: '2500 copies/mL',
      status: 'completed',
      doctor: 'BS. Nguyễn Văn I',
      nextVisit: '2024-01-19',
      cd4Count: 280,
      viralLoad: '2500',
      arvRegimen: ['EFV', 'TDF', 'FTC'],
      hlaB5701: 'Unknown',
      tropism: 'Dual tropic',
      comorbidities: ['psychiatric', 'dementia'],
      coMedications: ['Fluoxetine', 'Risperidone'],
      sideEffects: 'CNS symptoms, vivid dreams',
      notes: 'Consider regimen switch and intensive counseling.',
      labValues: {
        hemoglobin: '10.8 g/dL',
        creatinine: '1.0 mg/dL',
        alt: '45 U/L',
        mood: 'Stable on medication'
      }
    },
    {
      id: 7,
      patientId: 'HIV006',
      patientName: 'Trần Văn K',
      appointmentId: 'APT-2024-006',
      testDate: '2024-01-03',
      testType: 'ARV Resistance',
      result: 'Multiple resistance detected',
      status: 'completed',
      doctor: 'BS. Lê Thị L',
      nextVisit: '2024-01-17',
      cd4Count: 180,
      viralLoad: '45000',
      arvRegimen: ['DRV/r', 'RPV', 'TAF'],
      hlaB5701: 'Positive',
      tropism: 'X4 virus',
      comorbidities: ['renal', 'liver'],
      coMedications: ['Furosemide', 'Spironolactone'],
      sideEffects: 'Renal dysfunction, hepatotoxicity',
      notes: 'Started on salvage therapy. Close monitoring required.',
      labValues: {
        hemoglobin: '9.5 g/dL',
        creatinine: '1.8 mg/dL',
        alt: '85 U/L',
        egfr: '45 mL/min'
      }
    },
    {
      id: 8,
      patientId: 'HIV007',
      patientName: 'Ngô Thị M',
      appointmentId: 'APT-2024-007',
      testDate: '2024-01-01',
      testType: 'Complete Panel',
      result: 'VL: 250, CD4: 380',
      status: 'completed',
      doctor: 'BS. Hoàng Văn N',
      nextVisit: '2024-01-29',
      cd4Count: 380,
      viralLoad: '250',
      arvRegimen: ['DTG/3TC'],
      hlaB5701: 'Negative',
      tropism: 'R5 virus',
      comorbidities: ['pregnancy'],
      coMedications: ['Prenatal vitamins', 'Folic acid'],
      sideEffects: 'Mild nausea (pregnancy-related)',
      notes: 'Pregnant patient. Monitor closely. Good viral suppression expected.',
      labValues: {
        hemoglobin: '11.2 g/dL',
        creatinine: '0.6 mg/dL',
        alt: '22 U/L',
        hcg: 'Positive (12 weeks)'
      }
    }
  ]);

  // Medical history data - More comprehensive
  const [medicalHistory] = useState([
    {
      id: 1,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      visitDate: '2024-01-15',
      visitType: 'Routine Follow-up',
      diagnosis: 'HIV infection, well controlled',
      treatment: 'Continue current ARV regimen (DTG + TAF + FTC)',
      doctor: 'BS. Trần Thị B',
      viralLoad: '<50',
      cd4Count: 650,
      nextVisit: '2024-04-15',
      notes: 'Patient reports no side effects. Continue current regimen. Next visit in 3 months.'
    },
    {
      id: 2,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      visitDate: '2023-12-15',
      visitType: 'Routine Follow-up',
      diagnosis: 'HIV infection, responding to treatment',
      treatment: 'Continue DTG + TAF + FTC',
      doctor: 'BS. Trần Thị B',
      viralLoad: '150',
      cd4Count: 580,
      nextVisit: '2024-01-15',
      notes: 'Viral load decreasing, good tolerance.'
    },
    {
      id: 3,
      patientId: 'HIV002',
      patientName: 'Lê Thị C',
      visitDate: '2024-01-10',
      visitType: 'Treatment Monitoring',
      diagnosis: 'HIV infection, stable',
      treatment: 'Biktarvy once daily',
      doctor: 'BS. Phạm Văn D',
      viralLoad: '85',
      cd4Count: 450,
      nextVisit: '2024-04-10',
      notes: 'Stable CD4 count. Monitor for viral suppression.'
    },
    {
      id: 4,
      patientId: 'HIV003',
      patientName: 'Hoàng Minh E',
      visitDate: '2024-01-08',
      visitType: 'Resistance Consultation',
      diagnosis: 'HIV infection with drug resistance',
      treatment: 'Switch to DRV/r + TAF + 3TC',
      doctor: 'BS. Nguyễn Thị F',
      viralLoad: '15000',
      cd4Count: 320,
      nextVisit: '2024-02-08',
      notes: 'Regimen changed. Intensive counseling provided.'
    },
    {
      id: 5,
      patientId: 'HIV004',
      patientName: 'Vũ Thị G',
      visitDate: '2024-01-12',
      visitType: 'Routine Follow-up',
      diagnosis: 'HIV infection, excellent response',
      treatment: 'Continue Triumeq (DTG/ABC/3TC)',
      doctor: 'BS. Lê Văn H',
      viralLoad: '<50',
      cd4Count: 720,
      nextVisit: '2024-07-12',
      notes: 'Excellent treatment response. Extend follow-up interval to 6 months.'
    },
    {
      id: 6,
      patientId: 'HIV005',
      patientName: 'Phạm Thị H',
      visitDate: '2024-01-05',
      visitType: 'Urgent Consultation',
      diagnosis: 'HIV infection, treatment challenges',
      treatment: 'Counseling, consider regimen simplification',
      doctor: 'BS. Nguyễn Văn I',
      viralLoad: '2500',
      cd4Count: 280,
      nextVisit: '2024-01-19',
      notes: 'CNS side effects reported. Consider switching from EFV. Follow-up in 2 weeks.'
    },
    {
      id: 7,
      patientId: 'HIV006',
      patientName: 'Trần Văn K',
      visitDate: '2024-01-03',
      visitType: 'Salvage Therapy Consultation',
      diagnosis: 'HIV infection, extensive drug resistance',
      treatment: 'Salvage regimen: DRV/r + RPV + TAF',
      doctor: 'BS. Lê Thị L',
      viralLoad: '45000',
      cd4Count: 180,
      nextVisit: '2024-01-17',
      notes: 'Started on salvage therapy. Close monitoring required.'
    },
    {
      id: 8,
      patientId: 'HIV007',
      patientName: 'Ngô Thị M',
      visitDate: '2024-01-01',
      visitType: 'Pregnancy Consultation',
      diagnosis: 'HIV infection in pregnancy',
      treatment: 'Dovato (DTG + 3TC) - pregnancy safe',
      doctor: 'BS. Hoàng Văn N',
      viralLoad: '250',
      cd4Count: 380,
      nextVisit: '2024-01-29',
      notes: 'Pregnant patient at 12 weeks. Switched to pregnancy-safe regimen. Monthly monitoring.'
    }
  ]);

  const filteredTestResults = testResults.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.appointmentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAppointment = selectedPatient === '' || test.appointmentId === selectedPatient;
    const matchesTestType = testType === 'all' || test.testType.toLowerCase().includes(testType.toLowerCase());
    const matchesDateRange = (!dateRange.from || test.testDate >= dateRange.from) &&
                            (!dateRange.to || test.testDate <= dateRange.to);
    
    return matchesSearch && matchesAppointment && matchesTestType && matchesDateRange;
  });

  const filteredMedicalHistory = medicalHistory.filter(visit => {
    const matchesSearch = visit.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visit.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPatient = selectedPatient === '' || visit.patientId === selectedPatient;
    const matchesDateRange = (!dateRange.from || visit.visitDate >= dateRange.from) &&
                            (!dateRange.to || visit.visitDate <= dateRange.to);
    
    return matchesSearch && matchesPatient && matchesDateRange;
  });

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getARVRegimenDisplay = (regimen) => {
    return regimen.map(code => {
      const med = arvMedications.find(m => m.code === code);
      return med ? `${med.code} (${med.name})` : code;
    }).join(' + ');
  };

  const handleViewDetail = (test) => {
    setSelectedTest(test);
    setShowDetailModal(true);
  };

  return (
    <Container fluid className="test-results-lookup">
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon={faVial} className="me-2" />
          Tra Cứu Kết Quả Xét Nghiệm & Lịch Sử Khám Bệnh
        </h2>
        <p style={{textAlign: 'center'}}>Theo dõi kết quả xét nghiệm HIV, phác đồ ARV và lịch sử điều trị</p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  Tìm kiếm
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tên bệnh nhân hoặc mã số..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Mã Lịch Hẹn</Form.Label>
                <Form.Select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {[...new Set(testResults.map(test => test.appointmentId))].map(appointmentId => (
                    <option key={appointmentId} value={appointmentId}>{appointmentId}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Loại Xét Nghiệm</Form.Label>
                <Form.Select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="viral">Viral Load</option>
                  <option value="cd4">CD4 Count</option>
                  <option value="resistance">ARV Resistance</option>
                  <option value="complete">Complete Panel</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Từ ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Đến ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={() => {
                setSearchQuery('');
                setSelectedPatient('');
                setTestType('all');
                setDateRange({from: '', to: ''});
              }}>
                <FontAwesomeIcon icon={faFilter} />
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Main Content Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="test-results" title={
          <span>
            <FontAwesomeIcon icon={faVial} className="me-1" />
            Kết Quả Xét Nghiệm
          </span>
        }>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Danh Sách Kết Quả Xét Nghiệm</h5>
                <Button variant="outline-primary" size="sm">
                  <FontAwesomeIcon icon={faDownload} className="me-1" />
                  Xuất Excel
                </Button>
              </div>
              
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Mã Lịch Hẹn</th>
                    <th>Ngày XN</th>
                    <th>Bác Sĩ</th>
                    <th>Loại Xét Nghiệm</th>
                    <th>Ngày Tái Khám</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestResults.map(test => (
                    <tr key={test.id}>
                      <td><strong>{test.appointmentId}</strong></td>
                      <td>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                        {new Date(test.testDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <FontAwesomeIcon icon={faStethoscope} className="me-1" />
                        {test.doctor}
                      </td>
                      <td>
                        <Badge bg="info">{test.testType}</Badge>
                      </td>
                      <td>
                        {test.nextVisit ? (
                          <span className="next-visit">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                            {new Date(test.nextVisit).toLocaleDateString('vi-VN')}
                          </span>
                        ) : (
                          <span className="text-muted">Chưa xác định</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetail(test)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="medical-history" title={
          <span>
            <FontAwesomeIcon icon={faHistory} className="me-1" />
            Lịch Sử Khám Bệnh
          </span>
        }>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Lịch Sử Khám Bệnh</h5>
                <Button variant="outline-primary" size="sm">
                  <FontAwesomeIcon icon={faPrint} className="me-1" />
                  In Báo Cáo
                </Button>
              </div>
              
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Mã BN</th>
                    <th>Tên Bệnh Nhân</th>
                    <th>Ngày Khám</th>
                    <th>Loại Khám</th>
                    <th>Viral Load</th>
                    <th>CD4</th>
                    <th>Điều Trị</th>
                    <th>Bác Sĩ</th>
                    <th>Hẹn Tái Khám</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicalHistory.map(visit => (
                    <tr key={visit.id}>
                      <td><strong>{visit.patientId}</strong></td>
                      <td>{visit.patientName}</td>
                      <td>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                        {new Date(visit.visitDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td>
                        <Badge bg="primary">{visit.visitType}</Badge>
                      </td>
                      <td>
                        {visit.viralLoad && (
                          <span className={`viral-load ${visit.viralLoad === '<50' ? 'undetectable' : 
                            parseInt(visit.viralLoad) < 1000 ? 'low' : 'high'}`}>
                            {visit.viralLoad} {visit.viralLoad !== '<50' ? 'copies/mL' : ''}
                          </span>
                        )}
                      </td>
                      <td>
                        {visit.cd4Count && (
                          <span className={`cd4-count ${visit.cd4Count > 500 ? 'high' : visit.cd4Count > 200 ? 'medium' : 'low'}`}>
                            {visit.cd4Count} cells/μL
                          </span>
                        )}
                      </td>
                      <td className="treatment-cell">{visit.treatment}</td>
                      <td>
                        <FontAwesomeIcon icon={faStethoscope} className="me-1" />
                        {visit.doctor}
                      </td>
                      <td>
                        {visit.nextVisit && (
                          <span className="next-visit">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                            {new Date(visit.nextVisit).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
            Chi Tiết Kết Quả Xét Nghiệm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTest && (
            <Row>
              <Col md={6}>
                <h6><FontAwesomeIcon icon={faUser} className="me-1" />Thông Tin Bệnh Nhân</h6>
                <p><strong>Mã BN:</strong> {selectedTest.patientId}</p>
                <p><strong>Tên:</strong> {selectedTest.patientName}</p>
                <p><strong>Mã Lịch Hẹn:</strong> {selectedTest.appointmentId}</p>
                <p><strong>Ngày XN:</strong> {new Date(selectedTest.testDate).toLocaleDateString('vi-VN')}</p>
                <p><strong>Bác sĩ:</strong> {selectedTest.doctor}</p>
                
                <h6 className="mt-3"><FontAwesomeIcon icon={faVial} className="me-1" />Kết Quả Xét Nghiệm</h6>
                <p><strong>Loại XN:</strong> {selectedTest.testType}</p>
                <p><strong>Viral Load:</strong> 
                  <span className={`ms-2 viral-load ${selectedTest.viralLoad === '<50' ? 'undetectable' : 
                    parseInt(selectedTest.viralLoad) < 1000 ? 'low' : 'high'}`}>
                    {selectedTest.viralLoad} {selectedTest.viralLoad !== '<50' ? 'copies/mL' : ''}
                  </span>
                </p>
                <p><strong>CD4 Count:</strong> 
                  <span className={`ms-2 cd4-count ${selectedTest.cd4Count > 500 ? 'high' : selectedTest.cd4Count > 200 ? 'medium' : 'low'}`}>
                    {selectedTest.cd4Count} cells/μL
                  </span>
                </p>
                <p><strong>HLA-B5701:</strong> {selectedTest.hlaB5701}</p>
                <p><strong>Tropism:</strong> {selectedTest.tropism}</p>
                
                <h6 className="mt-3"><FontAwesomeIcon icon={faHeartbeat} className="me-1" />Bệnh Đi Kèm</h6>
                <div className="comorbidities-list">
                  {selectedTest.comorbidities && selectedTest.comorbidities.length > 0 ? (
                    selectedTest.comorbidities.map((condition, index) => (
                      <Badge key={index} bg="warning" className="me-1 mb-1">
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">Không có</span>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <h6><FontAwesomeIcon icon={faPills} className="me-1" />Phác Đồ ARV Hiện Tại</h6>
                <div className="arv-detail">
                  {selectedTest.arvRegimen.map((arvCode, index) => {
                    const med = arvMedications.find(m => m.code === arvCode);
                    return (
                      <div key={index} className="arv-item mb-2">
                        <Badge bg="secondary" className="me-2">{arvCode}</Badge>
                        {med && (
                          <span>
                            <strong>{med.name}</strong>
                            <br />
                            <small className="text-muted">Nhóm: {med.category}</small>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <h6 className="mt-3"><FontAwesomeIcon icon={faStethoscope} className="me-1" />Thuốc Đi Kèm</h6>
                <div className="co-medications">
                  {selectedTest.coMedications && selectedTest.coMedications.length > 0 ? (
                    selectedTest.coMedications.map((med, index) => (
                      <Badge key={index} bg="info" className="me-1 mb-1">
                        {med}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">Không có</span>
                  )}
                </div>
                
                <h6 className="mt-3">Tác Dụng Phụ</h6>
                <p className="side-effects">{selectedTest.sideEffects}</p>
                
                <h6 className="mt-3">Ghi Chú Bác Sĩ</h6>
                <p className="doctor-notes">{selectedTest.notes}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faDownload} className="me-1" />
            Tải PDF
          </Button>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestResultsLookup;