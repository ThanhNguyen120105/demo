import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDna, faVial, faAllergies,
  faWeight, faHeartbeat, faLungs, faBrain, faStethoscope,
  faPills, faCalendarAlt, faUtensils, faSyringe, faCapsules,
  faPrescriptionBottleAlt, faFilePdf, faEye, faTrash
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ARVSelectionTool = ({ onSelect, appointment }) => {
  const [activeTab, setActiveTab] = useState('arv-tool');
  const [viralLoad, setViralLoad] = useState('unknown');
  const [cd4Count, setCd4Count] = useState('unknown');
  const [hlaB5701, setHlaB5701] = useState('positive');
  const [tropism, setTropism] = useState('unknown');
  const [comorbidities, setComorbidities] = useState([]);
  const [currentRegimen, setCurrentRegimen] = useState([]);
  const [preferredRegimen, setPreferredRegimen] = useState([]);
  const [coMedications, setCoMedications] = useState([]);
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const [formData, setFormData] = useState({
    patientInfo: {
      name: appointment?.patient || '',
      age: appointment?.age || '',
      gender: 'Nam',
      weight: '',
      height: ''
    },
    testResults: {
      cd4Count: '',
      viralLoad: '',
      hivResistance: '',
      pregnancyTest: 'Âm tính',
      hbsAg: 'Âm tính',
      antiHcv: 'Âm tính'
    },
    currentRegimen: {
      status: 'Chưa điều trị',
      regimen: '',
      duration: '',
      adherence: '',
      sideEffects: ''
    },
    comorbidities: [],
    coMedications: [],
    preferredRegimen: {
      type: 'First-line',
      regimen: '',
      reason: ''
    }
  });
  
  // List of comorbidities
  const comorbidityOptions = [
    { value: 'cardiovascular', label: 'Bệnh Tim Mạch', icon: faHeartbeat },
    { value: 'hyperlipidemia', label: 'Tăng Lipid Máu', icon: faHeartbeat },
    { value: 'diabetes', label: 'Đái Tháo Đường', icon: faWeight },
    { value: 'liver', label: 'Rối Loạn Chức Năng Gan', icon: faLungs },
    { value: 'hbv', label: 'Đồng Nhiễm Viêm Gan B (HBV)', icon: faVial },
    { value: 'osteoporosis', label: 'Loãng Xương', icon: faBrain },
    { value: 'dementia', label: 'Sa Sút Trí Tuệ Do HIV', icon: faBrain },
    { value: 'renal', label: 'Bệnh Thận Mãn Tính', icon: faLungs },
    { value: 'psychiatric', label: 'Rối Loạn Tâm Thần', icon: faBrain },
    { value: 'pregnancy', label: 'Thai Kỳ', icon: faWeight }
  ];
  
  // List of ARV medications
  const arvOptions = [
    { value: '3TC', label: '3TC (Lamivudine/Epivir)' },
    { value: 'FTC', label: 'FTC (Emtricitabine/Emtriva)' },
    { value: 'ABC', label: 'ABC (Abacavir/Ziagen)' },
    { value: 'TAF', label: 'TAF (Tenofovir alafenamide/Vemlidy)' },
    { value: 'TDF', label: 'TDF (Tenofovir diproxil fumarate/Viread)' },
    { value: 'AZT', label: 'AZT (Zidovudine/Retrovir)' },
    { value: 'D4T', label: 'D4T (Stavudine/Zerit)' },
    { value: 'DDI', label: 'DDI (Didanosine/Videx)' },
    { value: 'EFV', label: 'EFV (Efavirenz/Sustiva)' },
    { value: 'ETR', label: 'ETR (Etravirine/Intelence)' },
    { value: 'RPV', label: 'RPV (Rilpivirine/Edurant)' },
    { value: 'NVP', label: 'NVP (Nevirapine/Viramune)' },
    { value: 'DOR', label: 'DOR (Doravirine/Pifeltro)' },
    { value: 'LPV/r', label: 'LPV/r (Lopinavir-ritonavir/Kaletra)' },
    { value: 'FPV/r', label: 'FPV/r (Fosamprenavir-ritonavir/Lexiva and Norvir)' },
    { value: 'TPV/r', label: 'TPV/r (Tipranavir-ritonavir/Aptivus and Norvir)' },
    { value: 'SQV/r', label: 'SQV/r (Saquinavir-ritonavir/Invirase and Norvir)' },
    { value: 'IDV/r', label: 'IDV/r (Indinavir-ritonavir/Crixivan and Norvir)' },
    { value: 'NFV', label: 'NFV (Nelfinavir/Viracept)' },
    { value: 'ATV/r', label: 'ATV/r (Atazanavir-ritonavir/Reyataz and Norvir)' },
    { value: 'ATV/c', label: 'ATV/c (Atazanavir-cobicistat/Evotaz)' },
    { value: 'ATV', label: 'ATV (Atazanavir/Reyataz)' },
    { value: 'DRV', label: 'DRV (Darunavir/Prezista)' },
    { value: 'DRV/r', label: 'DRV/r (Darunavir-ritonavir/Prezista and Norvir)' },
    { value: 'DRV/c', label: 'DRV/c (Darunavir-cobicistat/Prezcobix)' },
    { value: 'RAL', label: 'RAL (Raltegravir/Isentress)' },
    { value: 'EVG/c', label: 'EVG/c (Elvitegravir/NA)' },
    { value: 'DTG', label: 'DTG (Dolutegravir/Tivicay)' },
    { value: 'BIC', label: 'BIC (Bictegravir/NA)' },
    { value: 'MVC', label: 'MVC (Maraviroc/Selzentry)' },
    { value: 'IBA', label: 'IBA (Ibalizumab/Trogarzo)' },
    { value: 'FTR', label: 'FTR (Fostemsavir/Rukobia)' },
    { value: '3TC/AZT', label: '3TC/AZT (Combivir)' },
    { value: 'TDF/FTC', label: 'TDF/FTC (Truvada)' },
    { value: 'ABC/3TC', label: 'ABC/3TC (Epzicom)' },
    { value: 'TAF/FTC', label: 'TAF/FTC (Descovy)' },
    { value: 'DTG/RPV', label: 'DTG/RPV (Juluca)' },
    { value: 'BIC/TAF/FTC', label: 'BIC/TAF/FTC (Biktarvy)' },
    { value: 'DTG/ABC/3TC', label: 'DTG/ABC/3TC (Triumeq)' },
    { value: 'EVG/c/TDF/FTC', label: 'EVG/c/TDF/FTC (Stribild)' },
    { value: 'EVG/c/TAF/FTC', label: 'EVG/c/TAF/FTC (Genvoya)' },
    { value: 'RPV/TDF/FTC', label: 'RPV/TDF/FTC (Complera)' },
    { value: 'RPV/TAF/FTC', label: 'RPV/TAF/FTC (Odefsey)' },
    { value: 'EFV/TDF/FTC', label: 'EFV/TDF/FTC (Atripla)' },
    { value: 'DRV/c/TAF/FTC', label: 'DRV/c/TAF/FTC (Symtuza)' },
    { value: 'DOR/TDF/3TC', label: 'DOR/TDF/3TC (Delstrigo)' },
    { value: 'DTG/3TC', label: 'DTG/3TC (Dovato)' },
    { value: 'CAB', label: 'CAB (Cabotegravir/Apretude)' },
    { value: 'CAB/RPV', label: 'CAB/RPV (Cabenuva)' },
    { value: 'DTG/TDF/3TC', label: 'DTG/TDF/3TC (TLD)' },
    { value: 'LEN', label: 'LEN (lenacapavir/Sunlenca)' }
  ];
  
  // List of common co-medications
  const medicationCategories = [
    {
      category: 'Thuốc Tim Mạch',
      options: [
        'Amiodarone', 'Digoxin', 'Flecainide', 'Propafenone', 'Quinidine', 'Sotalol'
      ]
    },
    {
      category: 'Thuốc Kháng Virus',
      options: [
        'Acyclovir', 'Ganciclovir', 'Ribavirin', 'Entecavir', 'Remdesivir', 'Sofosbuvir'
      ]
    },
    {
      category: 'Kháng Sinh',
      options: [
        'Azithromycin', 'Clarithromycin', 'Ciprofloxacin', 'Doxycycline', 'Rifampin', 'Trimethoprim-Sulfamethoxazole'
      ]
    },
    {
      category: 'Thuốc Tâm Thần',
      options: [
        'Amitriptyline', 'Fluoxetine', 'Bupropion', 'Carbamazepine', 'Lamotrigine', 'Risperidone'
      ]
    },
    {
      category: 'Thuốc Khác',
      options: [
        'Methadone', 'Metformin', 'Atorvastatin', 'Warfarin', 'Prednisone', 'Tacrolimus'
      ]
    }
  ];
  
  const handleComorbidityChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setComorbidities([...comorbidities, value]);
    } else {
      setComorbidities(comorbidities.filter(item => item !== value));
    }
  };
  
  const handleCoMedicationChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCoMedications([...coMedications, value]);
    } else {
      setCoMedications(coMedications.filter(item => item !== value));
    }
  };
  
  const handleCurrentRegimenChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCurrentRegimen([...currentRegimen, value]);
    } else {
      setCurrentRegimen(currentRegimen.filter(item => item !== value));
    }
  };
  
  const handlePreferredRegimenChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setPreferredRegimen([...preferredRegimen, value]);
    } else {
      setPreferredRegimen(preferredRegimen.filter(item => item !== value));
    }
  };
  
  // Add file management functions
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      date: new Date().toISOString()
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const handleViewFile = (file) => {
    const url = URL.createObjectURL(file.file);
    window.open(url, '_blank');
  };

  const generatePDF = () => {
    try {
      // Create PDF with default font
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set default font
      doc.setFont('helvetica');
      
      // Add header
      doc.setFontSize(16);
      doc.text('Bao Cao Lua Chon ARV', 105, 20, { align: 'center' });
      
      // Add patient info
      doc.setFontSize(12);
      doc.text(`Benh nhan: ${appointment?.patient || 'N/A'}`, 20, 30);
      doc.text(`Ngay: ${appointment?.date || 'N/A'}`, 20, 40);
      
      // Add test results
      doc.setFontSize(14);
      doc.text('Ket Qua Xet Nghiem:', 20, 50);
      doc.setFontSize(12);
      doc.text(`Tai luong virus: ${viralLoad}`, 30, 60);
      doc.text(`So luong CD4: ${cd4Count}`, 30, 70);
      doc.text(`HLA-B5701: ${hlaB5701}`, 30, 80);
      doc.text(`Tropism: ${tropism}`, 30, 90);
      
      // Add current regimen
      doc.setFontSize(14);
      doc.text('Phac Do Hien Tai:', 20, 110);
      doc.setFontSize(12);
      currentRegimen.forEach((regimen, index) => {
        const arv = arvOptions.find(option => option.value === regimen);
        doc.text(`- ${arv?.label || regimen}`, 30, 120 + (index * 10));
      });
      
      // Add comorbidities
      doc.setFontSize(14);
      doc.text('Benh Dong Mac:', 20, 150);
      doc.setFontSize(12);
      comorbidities.forEach((comorbidity, index) => {
        const option = comorbidityOptions.find(opt => opt.value === comorbidity);
        // Convert Vietnamese text to ASCII
        const label = option?.label
          .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
          .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
          .replace(/[ìíịỉĩ]/g, 'i')
          .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
          .replace(/[ùúụủũưừứựửữ]/g, 'u')
          .replace(/[ỳýỵỷỹ]/g, 'y')
          .replace(/đ/g, 'd')
          .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
          .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
          .replace(/[ÌÍỊỈĨ]/g, 'I')
          .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
          .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
          .replace(/[ỲÝỴỶỸ]/g, 'Y')
          .replace(/Đ/g, 'D');
        doc.text(`- ${label || comorbidity}`, 30, 160 + (index * 10));
      });
      
      // Add recommendations
      doc.setFontSize(14);
      doc.text('Khuyen Nghi Dieu Tri:', 20, 200);
      doc.setFontSize(12);
      preferredRegimen.forEach((regimen, index) => {
        const arv = arvOptions.find(option => option.value === regimen);
        doc.text(`- ${arv?.label || regimen}`, 30, 210 + (index * 10));
      });
      
      // Add notes
      if (notes) {
        doc.setFontSize(14);
        doc.text('Ghi Chu:', 20, 250);
        doc.setFontSize(12);
        const splitNotes = doc.splitTextToSize(notes, 170);
        doc.text(splitNotes, 30, 260);
      }
      
      // Save the PDF
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `ARV_Recommendation_${appointment?.patientId || 'new'}.pdf`, { type: 'application/pdf' });
      
      // Create a base64 string of the PDF
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = function() {
        const base64data = reader.result;
        
        // Call onSelect with the PDF file and its base64 data
        if (onSelect) {
          onSelect({
            name: pdfFile.name,
            size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
            date: new Date().toISOString().split('T')[0],
            file: pdfFile,
            data: base64data
          });
        }
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };
  
  return (
    <div className="arv-tool-container">
      <Container fluid>
        <div className="content-header">
          <h2>Công Cụ Lựa Chọn ARV</h2>
          <p>Khuyến nghị điều trị HIV cá nhân hóa</p>
        </div>
        
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  {/* Viral Load */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faVial} className="me-2" />
                      Tải Lượng Virus
                    </Form.Label>
                    <Form.Select 
                      value={viralLoad}
                      onChange={(e) => setViralLoad(e.target.value)}
                    >
                      <option value="unknown">Không rõ</option>
                      <option value="suppressed_6m">Được kiểm soát (&lt;50) hơn 6 tháng</option>
                      <option value="suppressed_recent">Được kiểm soát (&lt;50) dưới 6 tháng</option>
                      <option value="low">Thấp (200 - 100,000)</option>
                      <option value="high">Cao (100,000 - 500,000)</option>
                      <option value="very_high">Rất cao (≥ 500,000)</option>
                    </Form.Select>
                  </Form.Group>
                  
                  {/* CD4 Cell Count */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faVial} className="me-2" />
                      Số Lượng Tế Bào CD4
                    </Form.Label>
                    <Form.Select 
                      value={cd4Count}
                      onChange={(e) => setCd4Count(e.target.value)}
                    >
                      <option value="unknown">Không rõ</option>
                      <option value="le_50">≤ 50</option>
                      <option value="le_100">≤ 100</option>
                      <option value="le_200">≤ 200</option>
                      <option value="gt_200">&gt; 200</option>
                    </Form.Select>
                  </Form.Group>
                  
                  {/* HLA-B5701 */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faAllergies} className="me-2" />
                      Trạng thái HLA-B5701
                    </Form.Label>
                    <Form.Select 
                      value={hlaB5701}
                      onChange={(e) => setHlaB5701(e.target.value)}
                    >
                      <option value="positive">Dương tính </option>
                      <option value="negative">Âm tính</option>
                    </Form.Select>
                  </Form.Group>
                  
                  {/* Tropism */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faVial} className="me-2" />
                      Tính Hướng Thụ Thể
                    </Form.Label>
                    <Form.Select 
                      value={tropism}
                      onChange={(e) => setTropism(e.target.value)}
                    >
                      <option value="unknown">Không rõ</option>
                      <option value="r5">Virus R5</option>
                      <option value="x4">Virus X4</option>
                      <option value="dual">Virus Hướng Thụ Thể Kép</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  {/* Current Regimen */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faCapsules} className="me-2" />
                      Phác Đồ Hiện Tại
                    </Form.Label>
                    <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {arvOptions.map(arv => (
                        <Form.Check
                          key={`current-${arv.value}`}
                          type="checkbox"
                          id={`current-${arv.value}`}
                          label={arv.label}
                          value={arv.value}
                          checked={currentRegimen.includes(arv.value)}
                          onChange={handleCurrentRegimenChange}
                          className="mb-2"
                        />
                      ))}
                    </div>
                    <Form.Text className="text-muted">
                      Chọn phác đồ ARV hiện tại của bệnh nhân (nếu có)
                    </Form.Text>
                  </Form.Group>
                  
                  {/* Co-medications */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                      Thuốc Phối Hợp
                    </Form.Label>
                    <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {medicationCategories.map((category, index) => (
                        <div key={index} className="mb-3">
                          <h6 className="medication-category">{category.category}</h6>
                          {category.options.map((med, medIndex) => (
                            <Form.Check
                              key={`med-${index}-${medIndex}`}
                              type="checkbox"
                              id={`med-${med.replace(/\s+/g, '-').toLowerCase()}`}
                              label={med}
                              value={med}
                              checked={coMedications.includes(med)}
                              onChange={handleCoMedicationChange}
                              className="mb-1 ms-3"
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <Form.Text className="text-muted">
                      Chọn các thuốc khác mà bệnh nhân đang sử dụng
                    </Form.Text>
                  </Form.Group>
                  
                  {/* Comorbidities */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                      Bệnh Đồng Mắc
                    </Form.Label>
                    <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {comorbidityOptions.map(option => (
                        <Form.Check
                          key={option.value}
                          type="checkbox"
                          id={`comorbidity-${option.value}`}
                          label={
                            <span>
                              <FontAwesomeIcon icon={option.icon} className="me-2" />
                              {option.label}
                            </span>
                          }
                          value={option.value}
                          checked={comorbidities.includes(option.value)}
                          onChange={handleComorbidityChange}
                          className="mb-2"
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Preferred Regimen - Full Width */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FontAwesomeIcon icon={faSyringe} className="me-2" />
                  Phác Đồ Ưu Tiên
                </Form.Label>
                <Row>
                  {arvOptions.map((arv, index) => (
                    <Col md={4} key={`preferred-${arv.value}`} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        id={`preferred-${arv.value}`}
                        label={arv.label}
                        value={arv.value}
                        checked={preferredRegimen.includes(arv.value)}
                        onChange={handlePreferredRegimenChange}
                        className="small-text"
                      />
                    </Col>
                  ))}
                </Row>
                <Form.Text className="text-muted">
                  Chọn phác đồ ART mà bạn đang cân nhắc cho bệnh nhân này
                </Form.Text>
              </Form.Group>

              {/* Notes Section */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                  Ghi Chú
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Nhập các ghi chú bổ sung về bệnh nhân, lịch sử điều trị, hoặc các cân nhắc đặc biệt khác..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Ghi chú này sẽ được bao gồm trong báo cáo khuyến nghị điều trị
                </Form.Text>
              </Form.Group>

              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" variant="primary" size="lg">
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Tạo Báo Cáo PDF
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ARVSelectionTool; 