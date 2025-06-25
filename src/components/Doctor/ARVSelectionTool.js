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
  // Enhanced PDF generation function with professional format
  const generatePDF = () => {
    try {
      console.log('=== GENERATING ENHANCED ARV PDF ===');
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;
      
      // Helper function to add a new page if needed
      const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      };
      
      // Helper function for Vietnamese text conversion
      const toAscii = (text) => {
        return text
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
      };
      
      // Header
      doc.setFillColor(46, 125, 50); // Dark green header
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('BAO CAO KHUYEN NGHI ARV', pageWidth/2, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('HIV Antiretroviral Treatment Recommendation Report', pageWidth/2, 22, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 45;
      
      // Patient Information Section
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('THONG TIN BENH NHAN', 15, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      // Patient details in two columns
      const patientInfo = [
        ['Ho va Ten:', appointment?.alternativeName || appointment?.patientName || 'Chua cap nhat'],
        ['Ma Benh Nhan:', appointment?.userId || appointment?.patientId || 'N/A'],
        ['Ngay Kham:', appointment?.date || new Date().toLocaleDateString('vi-VN')],
        ['Bac Si Dieu Tri:', appointment?.doctorName || 'Dr. ' + (appointment?.doctorId || 'Unknown')]
      ];
      
      patientInfo.forEach((info, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = col === 0 ? 15 : pageWidth/2 + 10;
        const y = yPosition + (row * 8);
        
        doc.setFont(undefined, 'bold');
        doc.text(toAscii(info[0]), x, y);
        doc.setFont(undefined, 'normal');
        doc.text(toAscii(info[1]), x + 35, y);
      });
      
      yPosition += 25;
      checkPageBreak(30);
      
      // Clinical Parameters Section
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('THONG SO LAM SANG', 15, yPosition + 5);
      yPosition += 20;
      
      // Clinical data table
      const clinicalData = [
        ['Tai Luong Virus:', getViralLoadDisplay(viralLoad)],
        ['So Luong CD4:', getCd4Display(cd4Count)],
        ['HLA-B5701:', hlaB5701 === 'positive' ? 'Duong tinh' : 'Am tinh'],
        ['Tinh Huong Thu The:', getTropismDisplay(tropism)]
      ];
      
      doc.setFontSize(11);
      clinicalData.forEach((data, index) => {
        const y = yPosition + (index * 8);
        doc.setFont(undefined, 'bold');
        doc.text(toAscii(data[0]), 15, y);
        doc.setFont(undefined, 'normal');
        doc.text(toAscii(data[1]), 80, y);
      });
      
      yPosition += 40;
      checkPageBreak(50);
      
      // Current Regimen Section
      if (currentRegimen.length > 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('PHAC DO HIEN TAI', 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        currentRegimen.forEach((regimen, index) => {
          const arv = arvOptions.find(option => option.value === regimen);
          doc.text(`• ${toAscii(arv?.label || regimen)}`, 20, yPosition + (index * 7));
        });
        
        yPosition += currentRegimen.length * 7 + 15;
        checkPageBreak(50);
      }
      
      // Comorbidities Section
      if (comorbidities.length > 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('BENH DONG MAC', 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        comorbidities.forEach((comorbidity, index) => {
          const option = comorbidityOptions.find(opt => opt.value === comorbidity);
          doc.text(`• ${toAscii(option?.label || comorbidity)}`, 20, yPosition + (index * 7));
        });
        
        yPosition += comorbidities.length * 7 + 15;
        checkPageBreak(50);
      }
      
      // Co-medications Section
      if (coMedications.length > 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('THUOC PHOI HOP', 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        coMedications.forEach((medication, index) => {
          doc.text(`• ${toAscii(medication)}`, 20, yPosition + (index * 7));
        });
        
        yPosition += coMedications.length * 7 + 15;
        checkPageBreak(80);
      }
        // Recommended Regimen Section - Most Important
      doc.setFillColor(46, 125, 50); // Green background for recommendations
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('KHUYEN NGHI DIEU TRI', 15, yPosition + 5);
      yPosition += 20;
      
      doc.setTextColor(0, 0, 0);
      
      // Generate comprehensive recommendations table
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Bang xep hang phac do ARV (dua tren thong so ca nhan):', 15, yPosition);
      yPosition += 15;
      
      // Add the recommendations table
      yPosition = generateARVRecommendationsTable(doc, yPosition);
      
      // Add selected regimens if any
      if (preferredRegimen.length > 0) {
        checkPageBreak(40);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Phac do da chon boi bac si:', 15, yPosition);
        yPosition += 15;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        
        preferredRegimen.forEach((regimen, index) => {
          const arv = arvOptions.find(option => option.value === regimen);
          const score = calculateRegimenScore(regimen);
          
          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}. ${toAscii(arv?.label || regimen)}`, 20, yPosition);
          doc.setFont(undefined, 'normal');
          doc.text(`Diem so: ${score.toFixed(2)}`, pageWidth - 60, yPosition);
          yPosition += 10;
          
          // Add rationale
          const rationale = getRegimenRationale(regimen);
          if (rationale) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const splitRationale = doc.splitTextToSize(toAscii(rationale), pageWidth - 50);
            doc.text(splitRationale, 25, yPosition);
            yPosition += splitRationale.length * 5 + 5;
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
          }
        });
      } else {
        doc.setFontSize(11);
        doc.text('Bac si chua chon phac do cu the. Bang tren la khuyen nghi tu dong.', 15, yPosition);
        yPosition += 15;
      }
      
      checkPageBreak(60);
      
      // Clinical Considerations
      yPosition += 10;
      doc.setFillColor(255, 245, 157); // Light yellow for warnings
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('LUU Y LAM SANG', 15, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const considerations = getClinicalConsiderations();
      considerations.forEach((consideration, index) => {
        const splitText = doc.splitTextToSize(toAscii(consideration), pageWidth - 30);
        doc.text(`• ${splitText[0]}`, 20, yPosition);
        if (splitText.length > 1) {
          for (let i = 1; i < splitText.length; i++) {
            yPosition += 6;
            doc.text(`  ${splitText[i]}`, 20, yPosition);
          }
        }
        yPosition += 8;
      });
      
      // Notes Section
      if (notes.trim()) {
        checkPageBreak(50);
        yPosition += 10;
        
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('GHI CHU BAC SI', 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        const splitNotes = doc.splitTextToSize(toAscii(notes), pageWidth - 30);
        doc.text(splitNotes, 15, yPosition);
        yPosition += splitNotes.length * 6 + 15;
      }
      
      // Footer
      checkPageBreak(30);
      yPosition = pageHeight - 25;
      
      doc.setFillColor(240, 240, 240);
      doc.rect(0, yPosition - 5, pageWidth, 30, 'F');
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      
      const footerText = [
        `Bao cao duoc tao tu cong cu khuyen nghi ARV`,
        `Ngay tao: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}`,
        `Luu y: Day chi la cong cu ho tro. Quyet dinh cuoi cung thuoc ve bac si dieu tri.`
      ];
      
      footerText.forEach((text, index) => {
        doc.text(toAscii(text), pageWidth/2, yPosition + 5 + (index * 5), { align: 'center' });
      });
      
      // Generate and return PDF
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `ARV_Recommendation_${appointment?.userId || Date.now()}.pdf`, { 
        type: 'application/pdf' 
      });
      
      console.log('📄 Enhanced PDF generated:', {
        name: pdfFile.name,
        size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
        pages: doc.internal.getNumberOfPages()
      });
      
      // Create a base64 string of the PDF
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = function() {
        const base64data = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        
        // Call onSelect with the enhanced PDF file
        if (onSelect) {
          onSelect({
            name: pdfFile.name,
            type: 'application/pdf',
            size: pdfBlob.size,
            data: base64data, // Base64 data without prefix
            file: pdfFile,
            lastModified: Date.now()
          });
        }
      };
      
    } catch (error) {
      console.error('Error generating enhanced PDF:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo PDF. Vui lòng thử lại.\n\nChi tiết lỗi: ' + error.message);
    }
  };

  // Add state for PDF preview
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Function to generate and preview PDF
  const handlePreviewPDF = () => {
    try {
      console.log('=== GENERATING PDF PREVIEW ===');
      generatePDFForPreview();
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert('Có lỗi xảy ra khi tạo bản xem trước PDF. Vui lòng thử lại.');
    }
  };
  
  // Function to generate PDF for preview (without calling onSelect)
  const generatePDFForPreview = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;
      
      // Helper function to add a new page if needed
      const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      };
      
      // Helper function for Vietnamese text conversion
      const toAscii = (text) => {
        return text
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
      };
      
      // Use the same PDF generation logic as the main function
      // Header
      doc.setFillColor(46, 125, 50);
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('BAO CAO KHUYEN NGHI ARV - BAN XEM TRUOC', pageWidth/2, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('HIV Antiretroviral Treatment Recommendation Report - Preview', pageWidth/2, 22, { align: 'center' });
      
      // Add preview watermark
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(40);
      doc.text('BAN XEM TRUOC', pageWidth/2, pageHeight/2, { 
        align: 'center', 
        angle: 45 
      });
      
      // Reset text color and continue with normal content
      doc.setTextColor(0, 0, 0);
      yPosition = 45;
      
      // Add a simplified version of the content for preview
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Noi dung bao cao se bao gom:', 15, yPosition);
      yPosition += 20;
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const contentItems = [
        '• Thong tin benh nhan va bac si dieu tri',
        '• Thong so lam sang (Viral Load, CD4, HLA-B5701, Tropism)',
        '• Phac do ARV hien tai (neu co)',
        '• Danh sach benh dong mac',
        '• Thuoc phoi hop dang su dung',
        '• Bang khuyen nghi phac do ARV voi diem so',
        '• Phan tich ly do lua chon cho tung phac do',
        '• Luu y lam sang va theo doi',
        '• Ghi chu cua bac si'
      ];
      
      contentItems.forEach((item, index) => {
        doc.text(toAscii(item), 20, yPosition + (index * 10));
      });
      
      yPosition += contentItems.length * 10 + 20;
      
      // Add current selections summary
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Tom tat lua chon hien tai:', 15, yPosition);
      yPosition += 15;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      doc.text(`Viral Load: ${getViralLoadDisplay(viralLoad)}`, 20, yPosition);
      yPosition += 8;
      doc.text(`CD4 Count: ${getCd4Display(cd4Count)}`, 20, yPosition);
      yPosition += 8;
      doc.text(`HLA-B5701: ${hlaB5701 === 'positive' ? 'Duong tinh' : 'Am tinh'}`, 20, yPosition);
      yPosition += 8;
      
      if (comorbidities.length > 0) {
        yPosition += 5;
        doc.text(`Benh dong mac: ${comorbidities.length} loai`, 20, yPosition);
        yPosition += 8;
      }
      
      if (coMedications.length > 0) {
        doc.text(`Thuoc phoi hop: ${coMedications.length} loai`, 20, yPosition);
        yPosition += 8;
      }
      
      if (preferredRegimen.length > 0) {
        doc.text(`Phac do duoc chon: ${preferredRegimen.length} loai`, 20, yPosition);
        yPosition += 8;
      }
      
      // Footer
      yPosition = pageHeight - 40;
      doc.setFillColor(240, 240, 240);
      doc.rect(0, yPosition, pageWidth, 40, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Day la ban xem truoc. Nhan "Tao Bao Cao PDF" de tao bao cao hoan chinh.', pageWidth/2, yPosition + 15, { align: 'center' });
      doc.text(`Ngay tao: ${new Date().toLocaleDateString('vi-VN')}`, pageWidth/2, yPosition + 25, { align: 'center' });
      
      // Generate blob and create URL
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setPreviewPdfUrl(pdfUrl);
      setShowPreview(true);
      
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert('Có lỗi xảy ra khi tạo bản xem trước PDF.');
    }
  };
  
  // Function to close preview
  const handleClosePreview = () => {
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
      setPreviewPdfUrl(null);
    }
    setShowPreview(false);
  };

  // Helper functions for enhanced PDF generation
  const getViralLoadDisplay = (vl) => {
    const displays = {
      'unknown': 'Khong ro',
      'suppressed_6m': 'Duoc kiem soat (>6 thang)',
      'suppressed_recent': 'Duoc kiem soat (<6 thang)',
      'low': 'Thap (200-100,000)',
      'high': 'Cao (100,000-500,000)',
      'very_high': 'Rat cao (>=500,000)'
    };
    return displays[vl] || vl;
  };
  
  const getCd4Display = (cd4) => {
    const displays = {
      'unknown': 'Khong ro',
      'le_50': '<= 50',
      'le_100': '<= 100',
      'le_200': '<= 200',
      'gt_200': '> 200'
    };
    return displays[cd4] || cd4;
  };
  
  const getTropismDisplay = (trop) => {
    const displays = {
      'unknown': 'Khong ro',
      'r5': 'Virus R5',
      'x4': 'Virus X4',
      'dual': 'Virus Huong Thu The Kep'
    };
    return displays[trop] || trop;
  };
  
  const calculateRegimenScore = (regimen) => {
    let score = 5.0; // Base score
    
    // Adjust based on viral load
    if (viralLoad === 'suppressed_6m') score += 1.0;
    if (viralLoad === 'very_high') score -= 0.5;
    
    // Adjust based on CD4
    if (cd4Count === 'gt_200') score += 0.5;
    if (cd4Count === 'le_50') score -= 1.0;
    
    // Adjust based on comorbidities
    if (comorbidities.includes('liver')) score -= 0.3;
    if (comorbidities.includes('renal')) score -= 0.3;
    if (comorbidities.includes('cardiovascular')) score -= 0.2;
    
    // Preferred regimens get bonus points
    const firstLineRegimens = ['BIC/TAF/FTC', 'DTG/ABC/3TC', 'DTG/TDF/FTC', 'DTG/3TC'];
    if (firstLineRegimens.includes(regimen)) score += 1.0;
    
    return Math.max(0, Math.min(10, score));
  };
  
  const getRegimenRationale = (regimen) => {
    const rationales = {
      'BIC/TAF/FTC': 'Phac do hang dau voi hieu qua cao, it tuong tac thuoc va an toan cho than.',
      'DTG/ABC/3TC': 'Phac do hieu qua cao, nhung can kiem tra HLA-B5701 truoc khi su dung ABC.',
      'DTG/TDF/FTC': 'Phac do co hieu qua tot, phu hop cho benh nhan co nguy co thap ve than va xuong.',
      'DTG/3TC': 'Phac do 2 thuoc, thich hop cho benh nhan co tai luong virus duoc kiem soat tot.',
      'EFV/TDF/FTC': 'Phac do truyen thong, nhung can luu y tac dung phu ve than kinh.',
      'DRV/r': 'Thuoc uc che protease manh, phu hop cho truong hop kang thuoc.',
      'RAL': 'Thuoc uc che integrase an toan, nhung can uong 2 lan/ngay.'
    };
    
    return rationales[regimen] || 'Phac do duoc lua chon dua tren dac diem ca nhan cua benh nhan.';
  };
  
  const generateRecommendations = () => {
    const recs = [];
    
    if (cd4Count === 'le_50') {
      recs.push('Uu tien bat dau dieu tri ARV gap, theo doi sat hon.');
    }
    
    if (hlaB5701 === 'positive') {
      recs.push('Tranh su dung ABC do nguy co phan ung di ung.');
    }
    
    if (comorbidities.includes('renal')) {
      recs.push('Uu tien TAF thay vi TDF de bao ve chuc nang than.');
    }
    
    if (comorbidities.includes('liver')) {
      recs.push('Can than khi su dung cac thuoc co tac dong len gan.');
    }
    
    if (viralLoad === 'very_high') {
      recs.push('Uu tien phac do co rao can gen cao truoc kang thuoc.');
    }
    
    return recs;
  };
  
  const getClinicalConsiderations = () => {
    const considerations = [];
    
    considerations.push('Theo doi chat che tai luong virus va so luong CD4 hang quy.');
    considerations.push('Danh gia tuong tac thuoc truoc khi ke don.');
    considerations.push('Giao duc benh nhan ve tham su thuoc va tac dung phu.');
    
    if (comorbidities.includes('cardiovascular')) {
      considerations.push('Theo doi nguy co tim mach, tranh ABC neu co the.');
    }
    
    if (comorbidities.includes('osteoporosis')) {
      considerations.push('Theo doi mat do xuong, co the tranh TDF.');
    }
    
    if (coMedications.length > 0) {
      considerations.push('Kiem tra tuong tac voi cac thuoc phoi hop da chon.');
    }
    
    considerations.push('Tai kham theo lich hen de danh gia hieu qua dieu tri.');
    
    return considerations;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };
  
  // Function to generate ARV recommendations table similar to HIV-ASSIST
  const generateARVRecommendationsTable = (doc, yPos) => {
    const tableData = [];
    const headers = ['Regimen', 'Score', 'Pills/Day', 'Frequency', 'Rationale'];
    
    // Get recommendations based on current selections
    const recommendedRegimens = getTopRecommendations();
    
    recommendedRegimens.forEach(regimen => {
      const arv = arvOptions.find(option => option.value === regimen.code);
      const score = calculateRegimenScore(regimen.code);
      const pillsPerDay = getRegimePillsPerDay(regimen.code);
      const frequency = getRegimenFrequency(regimen.code);
      const rationale = getShortRationale(regimen.code);
      
      tableData.push([
        arv?.label || regimen.code,
        score.toFixed(2),
        pillsPerDay,
        frequency,
        rationale
      ]);
    });
    
    // Use autoTable plugin if available
    if (doc.autoTable) {
      doc.autoTable({
        head: [headers],
        body: tableData,
        startY: yPos,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
        margin: { left: 15, right: 15 },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 60 }
        }
      });
      
      return doc.lastAutoTable.finalY + 10;
    } else {
      // Fallback: manual table creation
      let currentY = yPos;
      const cellHeight = 8;
      const colWidths = [60, 20, 25, 25, 60];
      let currentX = 15;
      
      // Draw headers
      doc.setFillColor(46, 125, 50);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      
      headers.forEach((header, i) => {
        doc.rect(currentX, currentY, colWidths[i], cellHeight, 'F');
        doc.text(header, currentX + 2, currentY + 6);
        currentX += colWidths[i];
      });
      
      currentY += cellHeight;
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      
      // Draw data rows
      tableData.forEach((row, rowIndex) => {
        currentX = 15;
        const fillColor = rowIndex % 2 === 0 ? [245, 245, 245] : [255, 255, 255];
        
        row.forEach((cell, colIndex) => {
          doc.setFillColor(...fillColor);
          doc.rect(currentX, currentY, colWidths[colIndex], cellHeight, 'F');
          
          // Text wrapping for longer content
          const cellText = cell.toString();
          if (colIndex === 0 || colIndex === 4) { // Regimen name or rationale
            const splitText = doc.splitTextToSize(cellText, colWidths[colIndex] - 4);
            doc.text(splitText[0], currentX + 2, currentY + 6);
          } else {
            doc.text(cellText, currentX + colWidths[colIndex]/2, currentY + 6, { align: 'center' });
          }
          
          currentX += colWidths[colIndex];
        });
        
        currentY += cellHeight;
      });
      
      return currentY + 10;
    }
  };
  
  // Helper functions for the recommendations table
  const getTopRecommendations = () => {
    // Generate top 5 recommendations based on current parameters
    const allRegimens = [
      'BIC/TAF/FTC', 'DTG/ABC/3TC', 'DTG/TDF/FTC', 'DTG/3TC', 
      'EFV/TDF/FTC', 'DRV/r+TDF/FTC', 'RAL+TDF/FTC', 'RPV/TAF/FTC',
      'DOR/TDF/3TC', 'EVG/c/TAF/FTC'
    ];
    
    // Score and sort regimens
    const scoredRegimens = allRegimens.map(regimen => ({
      code: regimen,
      score: calculateRegimenScore(regimen)
    }));
    
    scoredRegimens.sort((a, b) => b.score - a.score);
    
    return scoredRegimens.slice(0, 5); // Top 5
  };
  
  const getRegimePillsPerDay = (regimen) => {
    const pillCounts = {
      'BIC/TAF/FTC': '1',
      'DTG/ABC/3TC': '1', 
      'DTG/TDF/FTC': '2',
      'DTG/3TC': '1',
      'EFV/TDF/FTC': '1',
      'DRV/r+TDF/FTC': '3',
      'RAL+TDF/FTC': '3',
      'RPV/TAF/FTC': '1',
      'DOR/TDF/3TC': '1',
      'EVG/c/TAF/FTC': '1'
    };
    
    return pillCounts[regimen] || '2-3';
  };
  
  const getRegimenFrequency = (regimen) => {
    const frequencies = {
      'BIC/TAF/FTC': '1x/day',
      'DTG/ABC/3TC': '1x/day',
      'DTG/TDF/FTC': '1x/day',
      'DTG/3TC': '1x/day', 
      'EFV/TDF/FTC': '1x/day',
      'DRV/r+TDF/FTC': '1x/day',
      'RAL+TDF/FTC': '2x/day',
      'RPV/TAF/FTC': '1x/day',
      'DOR/TDF/3TC': '1x/day',
      'EVG/c/TAF/FTC': '1x/day'
    };
    
    return frequencies[regimen] || '1-2x/day';
  };
  
  const getShortRationale = (regimen) => {
    const rationales = {
      'BIC/TAF/FTC': 'First-line, renal safe',
      'DTG/ABC/3TC': 'High efficacy, check HLA-B5701',
      'DTG/TDF/FTC': 'Effective, bone monitoring',
      'DTG/3TC': '2-drug regimen, high barrier',
      'EFV/TDF/FTC': 'Traditional, CNS effects',
      'DRV/r+TDF/FTC': 'High barrier, resistance',
      'RAL+TDF/FTC': 'Well-tolerated, BID dosing',
      'RPV/TAF/FTC': 'Low resistance barrier',
      'DOR/TDF/3TC': 'New NNRTI option',
      'EVG/c/TAF/FTC': 'Boosted INSTI, interactions'
    };
    
    return rationales[regimen] || 'Individualized choice';
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
              </Form.Group>              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button 
                  type="button" 
                  variant="outline-primary" 
                  size="lg"
                  onClick={handlePreviewPDF}
                >
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  Xem Trước PDF
                </Button>
                <Button type="submit" variant="primary" size="lg">
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Tạo Báo Cáo PDF
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* PDF Preview Modal */}
        {showPreview && (
          <div className="pdf-preview-modal">
            <div className="modal-content">
              <span className="close" onClick={handleClosePreview}>&times;</span>
              
              <h2>Xem Trước Báo Cáo PDF</h2>
              
              <div className="pdf-preview-body">
                {previewPdfUrl && (
                  <iframe 
                    src={previewPdfUrl} 
                    title="PDF Preview"
                    width="100%"
                    height="500px"
                    frameBorder="0"
                  ></iframe>
                )}
              </div>
              
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" onClick={handleClosePreview} className="me-2">
                  Đóng
                </Button>
                <Button variant="primary" onClick={generatePDF} size="lg">
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                  Tạo Báo Cáo PDF Hoàn Chỉnh
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ARVSelectionTool;