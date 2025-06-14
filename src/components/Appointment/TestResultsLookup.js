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
            Kết Quả Xét Nghiệm & Lịch Sử Khám Bệnh
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
      </Tabs>

      {/* Medical Report Modal  */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Xem báo cáo y tế
            <div className="text-muted fs-6">
              {selectedTest?.patientName} - {selectedTest?.testDate}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {selectedTest && (
            <div className="medical-report-form">
              {/* Phần thông tin bệnh nhân */}
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white py-2">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Thông tin bệnh nhân
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>ID bệnh nhân</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={selectedTest.patientId || ''} 
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tên bệnh nhân</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={selectedTest.patientName || ''} 
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control 
                          type="text" 
                          value="1985-06-12" 
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Control 
                          type="text" 
                          value="Nam" 
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

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
                      <Form.Group className="mb-3">
                        <Form.Label>Chỉ số CD4</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 650 tế bào/mm³" 
                          value={`${selectedTest.cd4Count} cells/μL`}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tải lượng virus</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: < 20 bản sao/mL" 
                          value={`${selectedTest.viralLoad} ${selectedTest.viralLoad !== '<50' ? 'copies/mL' : ''}`}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h6 className="mb-3 mt-4">Huyết học</h6>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hemoglobin</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 14.2 g/dL" 
                          value={selectedTest.labValues?.hemoglobin || ''}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bạch cầu</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 5.6 × 10³/μL" 
                          value="5.8 × 10³/μL"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tiểu cầu</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 235 × 10³/μL" 
                          value="230 × 10³/μL"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h6 className="mb-3 mt-4">Sinh hóa</h6>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Đường huyết</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 95 mg/dL" 
                          value={selectedTest.labValues?.glucose || '92 mg/dL'}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Creatinine</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 0.9 mg/dL" 
                          value={selectedTest.labValues?.creatinine || '0.9 mg/dL'}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>ALT</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 25 U/L" 
                          value={selectedTest.labValues?.alt || '28 U/L'}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>AST</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 28 U/L" 
                          value="26 U/L"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h6 className="mb-3 mt-4">Chỉ số mỡ máu</h6>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cholesterol toàn phần</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 185 mg/dL" 
                          value={selectedTest.labValues?.cholesterol || '180 mg/dL'}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>LDL</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 110 mg/dL" 
                          value="105 mg/dL"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>HDL</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 45 mg/dL" 
                          value="48 mg/dL"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Triglycerides</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="vd: 150 mg/dL" 
                          value="130 mg/dL"
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Phần thuốc */}
              <Card className="mb-3">
                <Card.Header className="bg-success text-white py-2">
                  <FontAwesomeIcon icon={faPills} className="me-2" />
                  Thuốc
                </Card.Header>
                <Card.Body>
                  {selectedTest.arvRegimen && selectedTest.arvRegimen.map((arvCode, index) => {
                    const med = arvMedications.find(m => m.code === arvCode);
                    return (
                      <Row key={index} className="mb-3">
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Tên thuốc</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="vd: Biktarvy" 
                              value={med ? med.name : arvCode}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Liều lượng</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="vd: 1 viên" 
                              value="1 viên"
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Tần suất</Form.Label>
                            <Form.Control 
                              type="text" 
                              placeholder="vd: Ngày 1 lần" 
                              value="Ngày 1 lần"
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control 
                              type="text" 
                              value="Tiếp tục"
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    );
                  })}
                  
                  {selectedTest.coMedications && selectedTest.coMedications.map((medication, index) => (
                    <Row key={`co-${index}`} className="mb-3">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Tên thuốc</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={medication}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Liều lượng</Form.Label>
                          <Form.Control 
                            type="text" 
                            value="1 viên"
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Tần suất</Form.Label>
                          <Form.Control 
                            type="text" 
                            value="Ngày 1 lần"
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Trạng thái</Form.Label>
                          <Form.Control 
                            type="text" 
                            value="Tiếp tục"
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>

              {/* Đánh giá & kế hoạch */}
              <Card className="mb-3">
                <Card.Header className="bg-secondary text-white py-2">
                  <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                  Đánh giá & Kế hoạch
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Đánh giá</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Nhập đánh giá bệnh nhân" 
                      value={selectedTest.notes || 'Bệnh nhân ổn định với phản ứng điều trị tốt với liệu pháp kháng virus hiện tại.'}
                      readOnly
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Kế hoạch</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Nhập kế hoạch điều trị" 
                      value="Tiếp tục liệu pháp kháng virus hiện tại. Tái khám sau 3 tháng với xét nghiệm CD4 và tải lượng virus."
                      readOnly
                    />
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Label>Khuyến nghị</Form.Label>
                    <Form.Control 
                      type="text" 
                      className="mb-2"
                      placeholder="Khuyến nghị 1" 
                      value="Duy trì chế độ ăn uống lành mạnh và tập thể dục thường xuyên"
                      readOnly
                    />
                    <Form.Control 
                      type="text" 
                      className="mb-2"
                      placeholder="Khuyến nghị 2" 
                      value="Tránh sử dụng rượu bia"
                      readOnly
                    />
                    <Form.Control 
                      type="text" 
                      className="mb-2"
                      placeholder="Khuyến nghị 3" 
                      value="Trở lại khám nếu có triệu chứng bất thường"
                      readOnly
                    />
                    <Form.Control 
                      type="text" 
                      className="mb-2"
                      placeholder="Khuyến nghị 4" 
                      value="Thực hành quan hệ tình dục an toàn"
                      readOnly
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TestResultsLookup;