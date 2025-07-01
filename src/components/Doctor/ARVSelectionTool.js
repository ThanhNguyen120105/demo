import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDna, faVial, faAllergies,
  faWeight, faHeartbeat, faLungs, faBrain, faStethoscope,
  faPills, faCalendarAlt, faUtensils, faSyringe, faCapsules,
  faPrescriptionBottleAlt, faFilePdf, faEye, faTrash, faStar,
  faUserMd, faBaby, faVenus, faChild, faCheck, faDownload, faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { vietnameseToAscii } from '../../utils/vietnamese-ascii';
import { generateVietnamesePDF as generateHTMLPDF } from '../../utils/html-pdf-generator';
import { ARVReportWebViewer, generateWebReport } from '../../utils/vietnamese-web-viewer';
import { generateVietnamesePDF } from '../../utils/vietnamese-pdf-generator';
import { generateVietnameseHTMLtoPDF } from '../../utils/vietnamese-html-to-pdf';
import { generateVietnamesePDFForSupabase } from '../../utils/vietnamese-pdf-supabase';

const ARVSelectionTool = ({ onSelect, appointment }) => {
  const [activeTab, setActiveTab] = useState('arv-tool');
  const [viralLoad, setViralLoad] = useState('unknown');
  const [cd4Count, setCd4Count] = useState('unknown');
  const [hlaB5701, setHlaB5701] = useState('negative');
  const [tropism, setTropism] = useState('unknown');
  const [comorbidities, setComorbidities] = useState([]);
  const [currentRegimen, setCurrentRegimen] = useState([]);
  const [selectedRegimens, setSelectedRegimens] = useState([]);
  const [coMedications, setCoMedications] = useState([]);
  const [notes, setNotes] = useState({
    doctorNotes: '',
    customRegimen: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // New state for special populations
  const [specialPopulation, setSpecialPopulation] = useState('none');
  const [recommendedRegimens, setRecommendedRegimens] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCustomRegimen, setShowCustomRegimen] = useState(false);
  
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
  
  // Special population options
  const specialPopulationOptions = [
    { value: 'none', label: 'Không có đặc biệt', icon: faUserMd },
    { value: 'pregnant', label: 'Phụ nữ mang thai', icon: faVenus },
    { value: 'pediatric', label: 'Trẻ em (< 18 tuổi)', icon: faChild },
    { value: 'elderly', label: 'Người cao tuổi (> 65)', icon: faUserMd }
  ];
  
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
  
  // Comprehensive ARV regimens with detailed information
  const arvRegimens = [
    // First-line regimens
    {
      code: 'BIC/TAF/FTC',
      name: 'Bictegravir/Tenofovir alafenamide/Emtricitabine',
      shortName: 'BIC + TAF + FTC',
      displayName: 'Biktarvy',
      type: 'First-line',
      components: ['BIC', 'TAF', 'FTC'],
      pillsPerDay: 1,
      frequency: '1 lần/ngày',
      foodRequirement: 'Không yêu cầu',
      contraindications: ['Dofetilide'],
      specialPopulations: {
        pregnant: false,
        pediatric: true, // ≥25kg
        elderly: true,
        renal: true
      },
      advantages: ['Hiệu quả cao', 'An toàn cho thận', 'Ít tương tác thuốc'],
      disadvantages: ['Đắt tiền', 'Tăng cân có thể']
    },
    {
      code: 'DTG/ABC/3TC',
      name: 'Dolutegravir/Abacavir/Lamivudine',
      shortName: 'DTG + ABC + 3TC',
      displayName: 'Triumeq',
      type: 'First-line',
      components: ['DTG', 'ABC', '3TC'],
      pillsPerDay: 1,
      frequency: '1 lần/ngày',
      foodRequirement: 'Không yêu cầu',
      contraindications: ['HLA-B*5701 dương tính'],
      specialPopulations: {
        pregnant: true,
        pediatric: true,
        elderly: true,
        renal: true
      },
      advantages: ['Hiệu quả cao', 'Rào cản gen cao', 'Ít tương tác thuốc'],
      disadvantages: ['Cần test HLA-B*5701', 'Nguy cơ tim mạch với ABC']
    },
    {
      code: 'DTG/TDF/3TC',
      name: 'Dolutegravir/Tenofovir/Lamivudine',
      shortName: 'DTG + TDF + 3TC',
      displayName: 'TLD',
      type: 'First-line',
      components: ['DTG', 'TDF', '3TC'],
      pillsPerDay: 1,
      frequency: '1 lần/ngày',
      foodRequirement: 'Không yêu cầu',
      contraindications: ['Bệnh thận nặng'],
      specialPopulations: {
        pregnant: true,
        pediatric: true,
        elderly: false, // Thận
        renal: false
      },
      advantages: ['Hiệu quả cao', 'Giá rẻ', 'Có sẵn'],
      disadvantages: ['Độc tính thận và xương với TDF']
    },
    {
      code: 'DTG/3TC',
      name: 'Dolutegravir/Lamivudine',
      shortName: 'DTG + 3TC',
      displayName: 'Dovato',
      type: 'First-line',
      components: ['DTG', '3TC'],
      pillsPerDay: 1,
      frequency: '1 lần/ngày',
      foodRequirement: 'Không yêu cầu',
      contraindications: ['HBV đồng nhiễm', 'Viral load cao'],
      specialPopulations: {
        pregnant: false,
        pediatric: false,
        elderly: true,
        renal: true
      },
      advantages: ['2 thuốc', 'Ít tác dụng phụ', 'Ít tương tác thuốc'],
      disadvantages: ['Không dùng cho HBV', 'Cần viral load thấp']
    },
    // Second-line and alternative regimens
    {
      code: 'DRV/r/TDF/FTC',
      name: 'Darunavir/ritonavir + Tenofovir/Emtricitabine',
      shortName: 'DRV/r + TDF + FTC',
      displayName: 'DRV/r + Truvada',
      type: 'Second-line',
      components: ['DRV/r', 'TDF', 'FTC'],
      pillsPerDay: 3,
      frequency: '1 lần/ngày',
      foodRequirement: 'Cùng thức ăn',
      contraindications: ['Sulfa allergy'],
      specialPopulations: {
        pregnant: true,
        pediatric: true,
        elderly: false,
        renal: false
      },
      advantages: ['Rào cản gen cao', 'Hiệu quả với kháng thuốc'],
      disadvantages: ['Nhiều viên', 'Tương tác thuốc', 'Tác dụng phụ GI']
    },
    {
      code: 'RAL/TDF/FTC',
      name: 'Raltegravir + Tenofovir/Emtricitabine',
      shortName: 'RAL + TDF + FTC',
      displayName: 'Isentress + Truvada',
      type: 'Alternative',
      components: ['RAL', 'TDF', 'FTC'],
      pillsPerDay: 3,
      frequency: '2 lần/ngày',
      foodRequirement: 'Không yêu cầu',
      contraindications: ['Không có đặc biệt'],
      specialPopulations: {
        pregnant: true,
        pediatric: true,
        elderly: true,
        renal: false
      },
      advantages: ['An toàn', 'Ít tương tác thuốc'],
      disadvantages: ['2 lần/ngày', 'Nhiều viên']
    },
    {
      code: 'EFV/TDF/FTC',
      name: 'Efavirenz/Tenofovir/Emtricitabine',
      shortName: 'EFV + TDF + FTC',
      displayName: 'Atripla',
      type: 'Alternative',
      components: ['EFV', 'TDF', 'FTC'],
      pillsPerDay: 1,
      frequency: '1 lần/ngày',
      foodRequirement: 'Tránh thức ăn nhiều mỡ',
      contraindications: ['Thai kỳ trimester 1', 'Tâm thần nặng'],
      specialPopulations: {
        pregnant: false,
        pediatric: true,
        elderly: false,
        renal: false
      },
      advantages: ['1 viên/ngày', 'Kinh nghiệm dài'],
      disadvantages: ['Tác dụng phụ CNS', 'Thai kỳ', 'Độc tính thận']
    },
    // Pediatric specific
    {
      code: 'LPV/r/ABC/3TC',
      name: 'Lopinavir/ritonavir + Abacavir/Lamivudine',
      shortName: 'LPV/r + ABC + 3TC',
      displayName: 'Kaletra + Epzicom',
      type: 'Pediatric',
      components: ['LPV/r', 'ABC', '3TC'],
      pillsPerDay: 4,
      frequency: '2 lần/ngày',
      foodRequirement: 'Cùng thức ăn',
      contraindications: ['HLA-B*5701 dương tính'],
      specialPopulations: {
        pregnant: true,
        pediatric: true,
        elderly: false,
        renal: true
      },
      advantages: ['Kinh nghiệm pediatric', 'Dạng siro'],
      disadvantages: ['Nhiều viên', 'Tác dụng phụ GI', 'Vị đắng']
    }
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
  
  // Calculate regimen score based on patient parameters
  const calculateRegimenScore = (regimen) => {
    let score = 7.0; // Increased base score from 5.0 to 7.0
    
    // Special population adjustments
    if (specialPopulation === 'pregnant' && !regimen.specialPopulations.pregnant) {
      return 0; // Not suitable for pregnancy
    }
    if (specialPopulation === 'pediatric' && !regimen.specialPopulations.pediatric) {
      score -= 3.0;
    }
    if (specialPopulation === 'elderly' && !regimen.specialPopulations.elderly) {
      score -= 1.0;
    }
    
    // HLA-B5701 contraindication
    if (hlaB5701 === 'positive' && regimen.components.includes('ABC')) {
      return 0; // Absolute contraindication
    }
    
    // Viral load considerations
    if (viralLoad === 'suppressed_6m') {
      score += 1.0;
      if (regimen.code === 'DTG/3TC') score += 0.5; // 2-drug regimen bonus for suppressed patients
    }
    if (viralLoad === 'very_high') {
      score -= 0.5;
      if (regimen.type === 'First-line' && regimen.components.includes('DTG')) {
        score += 0.5; // DTG bonus for high viral load
      }
    }
    
    // CD4 considerations
    if (cd4Count === 'gt_200') {
      score += 0.5;
    }
    if (cd4Count === 'le_50') {
      score -= 1.0;
      if (regimen.type === 'First-line') score += 0.5; // Prefer first-line for low CD4
    }
    
    // Comorbidity adjustments
    if (comorbidities.includes('renal') && !regimen.specialPopulations.renal) {
      score -= 2.0;
    }
    if (comorbidities.includes('liver') && regimen.components.includes('EFV')) {
      score -= 1.0;
    }
    if (comorbidities.includes('cardiovascular') && regimen.components.includes('ABC')) {
      score -= 0.5;
    }
    if (comorbidities.includes('osteoporosis') && regimen.components.includes('TDF')) {
      score -= 0.5;
    }
    if (comorbidities.includes('psychiatric') && regimen.components.includes('EFV')) {
      score -= 1.5;
    }
    
    // Regimen type bonuses
    if (regimen.type === 'First-line') {
      score += 1.0;
    }
    
    // Simplicity bonuses
    if (regimen.pillsPerDay === 1) {
      score += 0.5;
    }
    if (regimen.frequency === '1 lần/ngày') {
      score += 0.3;
    }
    
    // Co-medication interactions (simplified)
    if (coMedications.length > 0) {
      if (regimen.components.includes('DRV/r') || regimen.components.includes('LPV/r')) {
        score -= 0.5; // PI interactions
      }
      if (regimen.components.includes('EFV')) {
        score -= 0.3; // EFV interactions
      }
    }
    
    // Current regimen considerations
    if (currentRegimen.length > 0) {
      // Count overlapping components between current regimen and recommended regimen
      const currentComponents = currentRegimen.filter(comp => comp && comp.trim() !== '');
      const overlap = regimen.components.filter(comp => 
        currentComponents.some(current => 
          current.includes(comp) || comp.includes(current) || 
          // Handle combination names like DRV/r
          (current.includes('DRV') && comp.includes('DRV')) ||
          (current.includes('LPV') && comp.includes('LPV'))
        )
      );
      
      // Penalty for too much overlap (avoid same regimen)
      if (overlap.length >= 2) {
        score -= 2.0; // Significant penalty for similar regimen
      } else if (overlap.length === 1) {
        score -= 0.5; // Minor penalty for partial overlap
      }
      
      // Special considerations for treatment-experienced patients
      // Prefer integrase inhibitors if not currently on one
      const currentHasINSTI = currentComponents.some(comp => 
        ['DTG', 'BIC', 'RAL', 'EVG'].some(insti => comp.includes(insti))
      );
      
      if (!currentHasINSTI && regimen.components.some(comp => 
        ['DTG', 'BIC', 'RAL', 'EVG'].some(insti => comp.includes(insti))
      )) {
        score += 1.0; // Bonus for switching to INSTI-based regimen
      }
      
      // Avoid NNRTI if currently on NNRTI (cross-resistance risk)
      const currentHasNNRTI = currentComponents.some(comp => 
        ['EFV', 'RPV', 'DOR'].some(nnrti => comp.includes(nnrti))
      );
      
      if (currentHasNNRTI && regimen.components.some(comp => 
        ['EFV', 'RPV', 'DOR'].some(nnrti => comp.includes(nnrti))
      )) {
        score -= 1.5; // Penalty for staying with NNRTI class
      }
      
      // Consider backbone changes
      const currentHasTDF = currentComponents.some(comp => comp.includes('TDF'));
      const currentHasTAF = currentComponents.some(comp => comp.includes('TAF'));
      const currentHasABC = currentComponents.some(comp => comp.includes('ABC'));
      
      // If currently on TDF and has renal issues, prefer TAF
      if (currentHasTDF && comorbidities.includes('renal') && 
          regimen.components.includes('TAF')) {
        score += 0.8; // Bonus for switching to safer backbone
      }
      
      // If currently on ABC and has cardiovascular issues, prefer other backbones
      if (currentHasABC && comorbidities.includes('cardiovascular') && 
          !regimen.components.includes('ABC')) {
        score += 0.5; // Bonus for avoiding ABC
      }
    }
    
    return Math.max(0, Math.min(10, score));
  };
  
  // Generate recommendations when parameters change
  const generateRecommendations = () => {
    const scoredRegimens = arvRegimens.map(regimen => ({
      ...regimen,
      score: calculateRegimenScore(regimen),
      suitability: getSuitabilityLevel(calculateRegimenScore(regimen))
    }));
    
    // Sort by score (highest first) and filter out unsuitable ones
    const filteredAndSorted = scoredRegimens
      .filter(regimen => regimen.score > 0)
      .sort((a, b) => b.score - a.score);
    
    setRecommendedRegimens(filteredAndSorted);
    setShowRecommendations(true);
  };
  
  const getSuitabilityLevel = (score) => {
    if (score >= 8) return { level: 'excellent', label: 'Rất phù hợp', color: 'success' };
    if (score >= 6) return { level: 'good', label: 'Phù hợp', color: 'primary' };
    if (score >= 4) return { level: 'fair', label: 'Chấp nhận được', color: 'warning' };
    if (score > 0) return { level: 'poor', label: 'Ít phù hợp', color: 'danger' };
    return { level: 'unsuitable', label: 'Không phù hợp', color: 'dark' };
  };
  
  // Event handlers
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
  
  const handleRegimenSelection = (regimen) => {
    if (selectedRegimens.find(r => r.code === regimen.code)) {
      setSelectedRegimens(selectedRegimens.filter(r => r.code !== regimen.code));
    } else {
      setSelectedRegimens([...selectedRegimens, regimen]);
    }
  };
  
  // Generate recommendations when key parameters change
  useEffect(() => {
    if (showRecommendations) {
      generateRecommendations();
    }
  }, [viralLoad, cd4Count, hlaB5701, specialPopulation, comorbidities, coMedications]);
  
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

  // Add state for PDF preview
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [lastGeneratedPdf, setLastGeneratedPdf] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  
  // State cho Web Viewer (XEM TRỰC TIẾP)
  const [showWebViewer, setShowWebViewer] = useState(false);
  const [webViewerData, setWebViewerData] = useState(null);
  
  // Helper functions for displays
  const getSpecialPopulationDisplay = (population) => {
    const option = specialPopulationOptions.find(opt => opt.value === population);
    return option?.label || 'Không có đặc biệt';
  };
  
  const getViralLoadDisplay = (vl) => {
    const displays = {
      'unknown': 'Đang chờ kết quả',
      'suppressed_6m': 'Được kiểm soát (>6 tháng)',
      'suppressed_recent': 'Được kiểm soát (<6 tháng)',
      'low': 'Thấp (200-100,000)',
      'high': 'Cao (100,000-500,000)',
      'very_high': 'Rất cao (>=500,000)'
    };
    return displays[vl] || vl;
  };
  
  const getCd4Display = (cd4) => {
    const displays = {
      'unknown': 'Đang chờ kết quả',
      'le_50': '<= 50',
      'le_100': '<= 100',
      'le_200': '<= 200',
      'gt_200': '> 200'
    };
    return displays[cd4] || cd4;
  };
  
  const getTropismDisplay = (trop) => {
    const displays = {
      'unknown': 'Đang chờ kết quả',
      'r5': 'Virus R5',
      'x4': 'Virus X4',
      'dual': 'Virus Hướng Thụ Thể Kép'
    };
    return displays[trop] || trop;
  };

  // Main PDF generation function (ASCII-safe, guaranteed to work)
  const generatePDF = () => {
    try {
      console.log('🎨 Starting ASCII-safe PDF generation...');
      console.log('📍 Current method: generateASCIIPDF (ASCII-SAFE)');
      
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
      
      // Header with green background
      doc.setFillColor(46, 125, 50);
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(vietnameseToAscii('BAO CAO LUA CHON PHAC DO DIEU TRI HIV'), pageWidth/2, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('ARV Regimen Selection Report', pageWidth/2, 22, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 45;
      
      // Patient Information Section
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(vietnameseToAscii('THONG TIN BENH NHAN'), 15, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Patient details (ASCII-safe)
      const patientInfo = [
        [vietnameseToAscii('Ho va Ten:'), vietnameseToAscii(appointment?.alternativeName || appointment?.patientName || 'Chua cap nhat')],
        [vietnameseToAscii('Ngay Kham:'), appointment?.date || new Date().toLocaleDateString('vi-VN')],
        [vietnameseToAscii('Bac Si Dieu Tri:'), vietnameseToAscii(appointment?.doctorName || 'Dr. ' + (appointment?.doctorId || 'Unknown'))],
        [vietnameseToAscii('Nhom Dac Biet:'), vietnameseToAscii(getSpecialPopulationDisplay(specialPopulation))]
      ];
      
      patientInfo.forEach((info, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = col === 0 ? 15 : pageWidth/2 + 10;
        const y = yPosition + (row * 8);
        
        doc.setFont('helvetica', 'bold');
        doc.text(info[0], x, y);
        doc.setFont('helvetica', 'normal');
        doc.text(info[1], x + 35, y);
      });
      
      yPosition += 25;
      checkPageBreak(30);
      
      // Clinical Parameters Section
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(vietnameseToAscii('THONG SO LAM SANG'), 15, yPosition + 5);
      yPosition += 20;
      
      // Clinical data (ASCII-safe)
      const clinicalData = [
        [vietnameseToAscii('Tai Luong Virus:'), vietnameseToAscii(getViralLoadDisplay(viralLoad))],
        [vietnameseToAscii('So Luong CD4:'), vietnameseToAscii(getCd4Display(cd4Count))],
        [vietnameseToAscii('HLA-B5701:'), vietnameseToAscii(hlaB5701 === 'positive' ? 'Duong tinh' : 'Am tinh')],
        [vietnameseToAscii('Tinh Huong Thu The:'), vietnameseToAscii(getTropismDisplay(tropism))]
      ];
      
      doc.setFontSize(11);
      clinicalData.forEach((data, index) => {
        const y = yPosition + (index * 8);
        doc.setFont('helvetica', 'bold');
        doc.text(data[0], 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(data[1], 80, y);
      });
      
      yPosition += 40;
      checkPageBreak(50);
      
      // Comorbidities
      if (comorbidities.length > 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(vietnameseToAscii('BENH DONG MAC'), 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        comorbidities.forEach((comorbidity, index) => {
          const option = comorbidityOptions.find(opt => opt.value === comorbidity);
          doc.text(`• ${vietnameseToAscii(option?.label || comorbidity)}`, 20, yPosition + (index * 7));
        });
        
        yPosition += comorbidities.length * 7 + 15;
        checkPageBreak(50);
      }
      
      // Co-medications Section
      if (coMedications.length > 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(vietnameseToAscii('THUOC PHOI HOP'), 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        coMedications.forEach((medication, index) => {
          doc.text(`• ${vietnameseToAscii(medication)}`, 20, yPosition + (index * 7));
        });
        
        yPosition += coMedications.length * 7 + 15;
        checkPageBreak(80);
      }
      
      // Selected Regimens Section
      doc.setFillColor(46, 125, 50);
      doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(vietnameseToAscii('PHAC DO DUOC CHON BOI BAC SI'), 15, yPosition + 5);
      yPosition += 20;
      
      doc.setTextColor(0, 0, 0);
      
      if (selectedRegimens.length > 0) {
        selectedRegimens.forEach((regimen, index) => {
        checkPageBreak(40);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
          doc.text(vietnameseToAscii(`${index + 1}. ${regimen.name}`), 15, yPosition);
        doc.setFont('helvetica', 'normal');
          doc.text(vietnameseToAscii(`Diem so: ${regimen.score.toFixed(2)}/10`), pageWidth - 60, yPosition);
          yPosition += 8;
          
            doc.setFontSize(10);
          doc.text(vietnameseToAscii(`Thuong hieu: ${regimen.displayName || regimen.shortName}`), 20, yPosition);
          yPosition += 6;
          doc.text(vietnameseToAscii(`Lieu dung: ${regimen.pillsPerDay} vien/ngay, ${regimen.frequency}`), 20, yPosition);
          yPosition += 6;
          doc.text(vietnameseToAscii(`Thuc an: ${regimen.foodRequirement}`), 20, yPosition);
          yPosition += 6;
          
          // Advantages
          if (regimen.advantages && regimen.advantages.length > 0) {
          doc.setFont('helvetica', 'bold');
            doc.text(vietnameseToAscii('Uu diem:'), 20, yPosition);
          doc.setFont('helvetica', 'normal');
            yPosition += 5;
            regimen.advantages.forEach(advantage => {
              doc.text(vietnameseToAscii(`  • ${advantage}`), 25, yPosition);
              yPosition += 5;
            });
          }
          
          yPosition += 5;
        });
      } else {
        doc.setFontSize(11);
        doc.text(vietnameseToAscii('Bac si chua chon phac do cu the tu danh sach goi y.'), 15, yPosition);
        yPosition += 15;
      }
      
      // Custom Regimen Section (ASCII-safe)
      if (notes.customRegimen && notes.customRegimen.trim()) {
        checkPageBreak(30);
        yPosition += 10;
        
        doc.setFillColor(255, 248, 220); // Light yellow background
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(vietnameseToAscii('PHAC DO TUY CHINH'), 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const splitCustomRegimen = doc.splitTextToSize(vietnameseToAscii(notes.customRegimen), pageWidth - 30);
        doc.text(splitCustomRegimen, 15, yPosition);
        yPosition += splitCustomRegimen.length * 6 + 15;
      }
      
      // Notes Section
      if (notes.doctorNotes && notes.doctorNotes.trim()) {
        checkPageBreak(50);
        yPosition += 10;
        
        doc.setFillColor(240, 240, 240);
        doc.rect(10, yPosition - 5, pageWidth - 20, 15, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(vietnameseToAscii('GHI CHU BAC SI'), 15, yPosition + 5);
        yPosition += 20;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(vietnameseToAscii(notes.doctorNotes), pageWidth - 30);
        doc.text(splitNotes, 15, yPosition);
        yPosition += splitNotes.length * 6 + 15;
      }
      
      // Footer
      checkPageBreak(30);
      yPosition = pageHeight - 25;
      
      doc.setFillColor(240, 240, 240);
      doc.rect(0, yPosition - 5, pageWidth, 30, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      
      const footerText = [
        vietnameseToAscii(`Bao cao duoc tao tu cong cu khuyen nghi ARV`),
        vietnameseToAscii(`Ngay tao: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}`),
        vietnameseToAscii(`Luu y: Day chi la cong cu ho tro. Quyet dinh cuoi cung thuoc ve bac si dieu tri.`)
      ];
      
      footerText.forEach((text, index) => {
        doc.text(text, pageWidth/2, yPosition + 5 + (index * 5), { align: 'center' });
      });
      
      // Generate and return PDF
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `ARV_ASCII_Report_${appointment?.userId || Date.now()}.pdf`, { 
        type: 'application/pdf' 
      });
      
      console.log('📄 ASCII-safe PDF generated:', {
        name: pdfFile.name,
        size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
        pages: doc.internal.getNumberOfPages()
      });
      
      alert('✅ PDF ASCII-safe đã được tạo thành công! (Không có dấu tiếng Việt nhưng đọc được)');
      
      // Create a base64 string of the PDF
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = function() {
        const base64data = reader.result.split(',')[1];
        
        if (onSelect) {
          onSelect({
            name: pdfFile.name,
            type: 'application/pdf',
            size: pdfBlob.size,
            data: base64data,
            file: pdfFile,
            lastModified: Date.now()
          });
        }
      };
      
    } catch (error) {
      console.error('Error generating ASCII-safe PDF:', error);
      alert('Có lỗi xảy ra khi tạo báo cáo PDF ASCII-safe. Vui lòng thử lại.\n\nChi tiết lỗi: ' + error.message);
    }
  };

  // Tạo HTML static để mở trong tab mới
  const generateStaticHTML = (data) => {
    const {
      appointment,
      specialPopulation,
      viralLoad,
      cd4Count,
      hlaB5701,
      tropism,
      comorbidities,
      coMedications,
      selectedRegimens,
      notes,
      getSpecialPopulationDisplay,
      getViralLoadDisplay,
      getCd4Display,
      getTropismDisplay,
      comorbidityOptions
    } = data;

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Báo Cáo ARV - ${appointment?.alternativeName || 'Bệnh nhân'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Roboto', Arial, sans-serif !important; }
    body { margin: 0; padding: 20px; background: #f8f9fa; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2e7d32, #4caf50); color: white; padding: 25px; text-align: center; margin: -30px -30px 30px -30px; border-radius: 12px 12px 0 0; }
    .header h1 { font-size: 24px; font-weight: 700; margin: 0 0 8px 0; }
    .header p { font-size: 16px; margin: 0; opacity: 0.9; }
    .section { margin-bottom: 25px; }
    .section-header { background: #f5f5f5; padding: 12px 15px; border-left: 4px solid #2e7d32; margin-bottom: 15px; border-radius: 4px; }
    .section-header h3 { font-size: 16px; font-weight: 600; color: #2e7d32; margin: 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
    .info-item { display: flex; margin-bottom: 8px; }
    .info-label { font-weight: 600; min-width: 130px; color: #555; }
    .info-value { color: #333; }
    .regimen-item { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: #fafafa; }
    .regimen-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .regimen-name { font-size: 16px; font-weight: 600; color: #2e7d32; }
    .regimen-score { background: #2196f3; color: white; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: 500; }
    .list-item { margin-bottom: 5px; padding-left: 15px; position: relative; }
    .list-item::before { content: "•"; position: absolute; left: 0; color: #2e7d32; font-weight: bold; }
    .custom-regimen, .doctor-notes { background: #fff8dc; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-top: 10px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
    @media print { body { background: white; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BÁO CÁO LỰA CHỌN PHÁC ĐỒ ĐIỀU TRỊ HIV</h1>
      <p>ARV Regimen Selection Report</p>
    </div>

    <div class="section">
      <div class="section-header">
        <h3>THÔNG TIN BỆNH NHÂN</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Họ và Tên:</span>
          <span class="info-value">${appointment?.alternativeName || 'Chưa cập nhật'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Ngày Khám:</span>
          <span class="info-value">${appointment?.date || new Date().toLocaleDateString('vi-VN')}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Bác Sĩ:</span>
          <span class="info-value">${appointment?.doctorName || 'Bác sĩ điều trị'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Nhóm Đặc Biệt:</span>
          <span class="info-value">${getSpecialPopulationDisplay(specialPopulation)}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3>THÔNG SỐ LÂM SÀNG</h3>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Tải Lượng Virus:</span>
          <span class="info-value">${getViralLoadDisplay(viralLoad)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Số Lượng CD4:</span>
          <span class="info-value">${getCd4Display(cd4Count)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">HLA-B5701:</span>
          <span class="info-value">${hlaB5701 === 'positive' ? 'Dương tính' : 'Âm tính'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Tính Hướng Thụ Thể:</span>
          <span class="info-value">${getTropismDisplay(tropism)}</span>
        </div>
      </div>
    </div>

    ${comorbidities.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <h3>BỆNH ĐỒNG MẮC</h3>
      </div>
      <div>
        ${comorbidities.map(comorbidity => {
          const option = comorbidityOptions.find(opt => opt.value === comorbidity);
          return `<div class="list-item">${option?.label || comorbidity}</div>`;
        }).join('')}
      </div>
    </div>
    ` : ''}

    ${coMedications.length > 0 ? `
    <div class="section">
      <div class="section-header">
        <h3>THUỐC PHỐI HỢP</h3>
      </div>
      <div>
        ${coMedications.map(medication => `<div class="list-item">${medication}</div>`).join('')}
      </div>
    </div>
    ` : ''}

    <div class="section">
      <div class="section-header">
        <h3>PHÁC ĐỒ ĐƯỢC CHỌN BỞI BÁC SĨ</h3>
      </div>
      ${selectedRegimens.length > 0 ? 
        selectedRegimens.map((regimen, index) => `
          <div class="regimen-item">
            <div class="regimen-header">
              <div class="regimen-name">${index + 1}. ${regimen.name}</div>
              <div class="regimen-score">Điểm: ${regimen.score.toFixed(2)}/10</div>
            </div>
            <div>
              <strong>Thương hiệu:</strong> ${regimen.displayName || regimen.shortName}<br/>
              <strong>Liều dùng:</strong> ${regimen.pillsPerDay} viên/ngày, ${regimen.frequency}<br/>
              <strong>Thức ăn:</strong> ${regimen.foodRequirement}<br/>
              <strong>Ưu điểm:</strong> ${regimen.advantages?.join(', ')}
            </div>
          </div>
        `).join('') 
        : '<div style="padding: 15px; text-align: center; font-style: italic;">Bác sĩ chưa chọn phác đồ cụ thể từ danh sách gợi ý.</div>'
      }
    </div>

    ${notes.customRegimen && notes.customRegimen.trim() ? `
    <div class="section">
      <div class="section-header">
        <h3>PHÁC ĐỒ TÙY CHỈNH</h3>
      </div>
      <div class="custom-regimen">${notes.customRegimen}</div>
    </div>
    ` : ''}

    ${notes.doctorNotes && notes.doctorNotes.trim() ? `
    <div class="section">
      <div class="section-header">
        <h3>GHI CHÚ BÁC SĨ</h3>
      </div>
      <div class="doctor-notes">${notes.doctorNotes}</div>
    </div>
    ` : ''}

    <div class="footer">
      <div>Báo cáo được tạo ngày: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</div>
      <div>Công cụ hỗ trợ chẩn đoán - Quyết định cuối thuộc về bác sĩ điều trị</div>
    </div>
  </div>

  <script>
    // Auto print option
    if (confirm('Bạn có muốn in báo cáo này không?')) {
      window.print();
    }
  </script>
</body>
</html>`;
  };

  // TẠO PDF TIẾNG VIỆT CẢI TIẾN - GIẢI QUYẾT VẤN ĐỀ FONT!
  const generateImprovedVietnamesePDF = async () => {
    try {
      console.log('🎯 Tạo PDF tiếng Việt với HTML-to-PDF...');
      
      const reportData = {
        appointment,
        specialPopulation,
        viralLoad,
        cd4Count,
        hlaB5701,
        tropism,
        comorbidities,
        coMedications,
        selectedRegimens,
        notes,
        getSpecialPopulationDisplay,
        getViralLoadDisplay,
        getCd4Display,
        getTropismDisplay,
        comorbidityOptions
      };
      
      const result = await generateVietnameseHTMLtoPDF(reportData);
      
      if (result.success) {
        console.log('✅ HTML-to-PDF thành công!');
        if (result.method === 'html-print') {
          alert('✅ Đã mở cửa sổ in với font tiếng Việt chính xác!\n\n' +
                'Từ cửa sổ đó bạn có thể:\n' +
                '• In thành PDF (Save as PDF)\n' +
                '• In trực tiếp\n' +
                '• Font tiếng Việt sẽ hiển thị đúng 100%');
        } else {
          alert('✅ Đã tải xuống file HTML với font tiếng Việt!\n\n' +
                'Mở file HTML và in thành PDF để có font chính xác.');
        }
      } else {
        console.error('❌ Lỗi HTML-to-PDF:', result.error);
        alert('❌ Có lỗi xảy ra khi tạo HTML-to-PDF. Vui lòng thử lại.');
      }
      
    } catch (error) {
      console.error('❌ Lỗi HTML-to-PDF:', error);
      alert('❌ Có lỗi xảy ra khi tạo HTML-to-PDF. Vui lòng thử lại.');
    }
  };

  // TẠO PDF JSPDF CẢI TIẾN (Backup)
  const generateJSPDFImproved = async () => {
    try {
      console.log('🎨 Tạo PDF tiếng Việt với jsPDF cải tiến...');
      
      const reportData = {
        appointment,
        specialPopulation,
        viralLoad,
        cd4Count,
        hlaB5701,
        tropism,
        comorbidities,
        coMedications,
        selectedRegimens,
        notes,
        getSpecialPopulationDisplay,
        getViralLoadDisplay,
        getCd4Display,
        getTropismDisplay,
        comorbidityOptions
      };
      
      const result = await generateVietnamesePDF(reportData);
      
      if (result.success) {
        console.log('✅ PDF tiếng Việt cải tiến đã được tạo thành công!');
        alert('✅ PDF jsPDF cải tiến đã được tạo thành công!\n\nFont tiếng Việt được xử lý tốt hơn.');
        
        // Create a base64 string of the PDF
        const reader = new FileReader();
        reader.readAsDataURL(result.blob);
        reader.onloadend = function() {
          const base64data = reader.result.split(',')[1];
          
          if (onSelect) {
            onSelect({
              name: result.fileName,
              type: 'application/pdf',
              size: result.blob.size,
              data: base64data,
              file: result.file,
              lastModified: Date.now()
            });
          }
        };
      } else {
        console.error('❌ Lỗi tạo PDF:', result.error);
        alert('❌ Có lỗi xảy ra khi tạo PDF tiếng Việt. Vui lòng thử lại.');
      }
      
    } catch (error) {
      console.error('❌ Lỗi tạo PDF tiếng Việt cải tiến:', error);
      alert('❌ Có lỗi xảy ra khi tạo PDF tiếng Việt. Vui lòng thử lại.');
    }
  };

  // XEM TRỰC TIẾP TRÊN WEB - FONT TIẾNG VIỆT HOÀN HẢO!
  const showWebReportViewer = () => {
    try {
      console.log('🎨 Hiển thị báo cáo trực tiếp trên web với font tiếng Việt hoàn hảo...');
      
      const reportData = {
        appointment,
        specialPopulation,
        viralLoad,
        cd4Count,
        hlaB5701,
        tropism,
        comorbidities,
        coMedications,
        selectedRegimens,
        notes,
        getSpecialPopulationDisplay,
        getViralLoadDisplay,
        getCd4Display,
        getTropismDisplay,
        comorbidityOptions
      };
      
      // Tạo và hiển thị web report
      const result = generateWebReport(reportData);
      
      if (result.success) {
        console.log('✅ Web report generated successfully');
        setWebViewerData(result.data);
        setShowWebViewer(true);
        
        // Callback cho parent component
        if (onSelect) {
          onSelect({
            name: `ARV_Web_Report_${appointment?.userId || Date.now()}.html`,
            type: 'text/html',
            method: 'web-viewer',
            message: 'Báo cáo đang hiển thị trực tiếp trên web',
            showWebViewer: true
          });
        }
        
        alert('✅ Báo cáo ARV đã sẵn sàng!\n\n🌐 Hiển thị trực tiếp trên web với font tiếng Việt hoàn hảo.\n💡 Không cần tải về, xem ngay trên trang!');
      }
      
    } catch (error) {
      console.error('❌ Error showing web report:', error);
      alert('❌ Lỗi khi hiển thị báo cáo web: ' + error.message);
    }
  };

  // Vietnamese PDF generation with HTML-to-Image method
  const generateVietnamesePDFMethod = async () => {
    try {
      console.log('🎨 Generating Vietnamese PDF with browser print functionality...');
      alert('Đang tạo báo cáo ARV tiếng Việt...\n\n🔄 Sử dụng tính năng in của trình duyệt để tạo PDF có dấu hoàn hảo.');
      
      const pdfData = {
        appointment,
        specialPopulation,
        viralLoad,
        cd4Count,
        hlaB5701,
        tropism,
        comorbidities,
        coMedications,
        selectedRegimens,
        notes,
        getSpecialPopulationDisplay,
        getViralLoadDisplay,
        getCd4Display,
        getTropismDisplay,
        comorbidityOptions
      };
      
      const pdfFile = await generateVietnamesePDF(pdfData);
      
      console.log('✅ Browser print PDF initiated successfully');
      
      // Handle browser print result
      if (pdfFile && pdfFile.method === 'browser-print') {
        // Browser print was initiated, no file to handle
        console.log('✅ Browser print dialog opened successfully');
        
        if (onSelect) {
          onSelect({
            name: pdfFile.name,
            type: 'application/pdf',
            method: 'browser-print',
            message: 'PDF được tạo qua tính năng in của trình duyệt'
          });
        }
      } else if (pdfFile && pdfFile.type === 'text/html') {
        // HTML file was downloaded
        console.log('✅ HTML file downloaded successfully');
        
        if (onSelect) {
          onSelect({
            name: pdfFile.name,
            type: pdfFile.type,
            size: pdfFile.size,
            method: 'html-download',
            message: 'File HTML đã được tải xuống'
          });
        }
      }
      
    } catch (error) {
      console.error('❌ Error generating browser print PDF:', error);
      alert(`❌ Lỗi tạo PDF với trình duyệt: ${error.message}\n\n🔄 Chuyển sang phương pháp ASCII-safe...`);
      
      // Fallback to ASCII-safe
      generatePDF();
    }
  };

  // TẠO BÁO CÁO ARV VÀ LUU VÀO DATABASE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('📤 Tạo báo cáo ARV và lưu vào database...');
      
      const reportData = {
        appointment,
        specialPopulation,
        viralLoad,
        cd4Count,
        hlaB5701,
        tropism,
        comorbidities,
        coMedications,
        selectedRegimens,
        notes,
        getSpecialPopulationDisplay,
        getViralLoadDisplay,
        getCd4Display,
        getTropismDisplay,
        comorbidityOptions
      };
      
      // Tạo PDF với font tiếng Việt cải tiến cho Supabase
      const result = await generateVietnamesePDFForSupabase(reportData);
      
      if (result.success) {
        console.log('✅ PDF đã được tạo thành công!');
        
        // Create a base64 string of the PDF để lưu vào database
        const reader = new FileReader();
        reader.readAsDataURL(result.blob);
        reader.onloadend = function() {
          const base64data = reader.result.split(',')[1];
          
          if (onSelect) {
            onSelect({
              name: result.fileName,
              type: 'application/pdf',
              size: result.blob.size,
              data: base64data,
              file: result.file,
              lastModified: Date.now(),
              isARVReport: true, // Flag để identify báo cáo ARV
              reportType: 'arv-regimen-selection',
              // Lưu metadata ARV để có thể tái tạo PDF sau này
              arvMetadata: {
                appointment,
                specialPopulation,
                viralLoad,
                cd4Count,
                hlaB5701,
                tropism,
                comorbidities,
                coMedications,
                selectedRegimens,
                notes,
                timestamp: Date.now()
              }
            });
          }
          
          // No alert - just log success
          console.log('✅ Báo cáo ARV đã được tạo và lưu vào hệ thống thành công');
        };
    } else {
        console.error('❌ Lỗi tạo báo cáo:', result.error);
        alert('❌ Có lỗi xảy ra khi tạo báo cáo ARV. Vui lòng thử lại.');
      }
      
    } catch (error) {
      console.error('❌ Lỗi tạo báo cáo ARV:', error);
      alert('❌ Có lỗi xảy ra khi tạo báo cáo ARV. Vui lòng thử lại.');
    }
  };

  const downloadLastPdf = () => {
    if (lastGeneratedPdf) {
      const url = URL.createObjectURL(lastGeneratedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = lastGeneratedPdf.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
      setPreviewPdfUrl(null);
    }
  };

  const openPdfInNewTab = () => {
    if (previewPdfUrl) {
      window.open(previewPdfUrl, '_blank');
    }
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
            <Form>
              <Row>
                <Col md={6}>
                  {/* Special Population */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center">
                      <FontAwesomeIcon icon={faUserMd} className="me-2" />
                      Nhóm Đặc Biệt
                    </Form.Label>
                    <Form.Select 
                      value={specialPopulation}
                      onChange={(e) => setSpecialPopulation(e.target.value)}
                    >
                      {specialPopulationOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Lựa chọn này sẽ ảnh hưởng đến khuyến nghị phác đồ
                    </Form.Text>
                  </Form.Group>

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
                      <option value="positive">Dương tính</option>
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
                    
                    {/* Treatment status */}
                    <div className="treatment-status-section">
                        <Form.Check
                        type="radio"
                        id="treatment-naive"
                        name="treatmentStatus"
                        label="Chưa điều trị ARV"
                        checked={currentRegimen.length === 0}
                        onChange={() => setCurrentRegimen([])}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        id="treatment-experienced"
                        name="treatmentStatus"
                        label="Đang/đã điều trị ARV"
                        checked={currentRegimen.length > 0}
                        onChange={() => {
                          if (currentRegimen.length === 0) {
                            setCurrentRegimen(['DTG']); // Default selection
                          }
                        }}
                      />
                    </div>

                    {/* ARV Components Selection */}
                    {currentRegimen.length > 0 && (
                      <div className="current-regimen-section">
                        <h6 className="mb-3 text-center text-primary">
                          <FontAwesomeIcon icon={faCapsules} className="me-2" />
                          Các thành phần thuốc đang sử dụng
                        </h6>
                        
                        {/* INSTI - Integrase Inhibitors */}
                        <div className="drug-class-section">
                          <h6 className="drug-class-title text-primary">
                            <FontAwesomeIcon icon={faDna} className="me-2" />
                            Chất ức chế Integrase (INSTI)
                          </h6>
                          <Row>
                            {['DTG', 'BIC', 'RAL', 'EVG'].map(drug => (
                              <Col md={3} sm={6} key={drug}>
                                <Form.Check
                          type="checkbox"
                                  id={`current-${drug}`}
                                  label={drug}
                                  checked={currentRegimen.includes(drug)}
                          onChange={handleCurrentRegimenChange}
                                  value={drug}
                                  className="drug-checkbox"
                        />
                              </Col>
                      ))}
                          </Row>
                    </div>

                        {/* NRTI - Nucleoside RTIs */}
                        <div className="drug-class-section">
                          <h6 className="drug-class-title text-success">
                            <FontAwesomeIcon icon={faVial} className="me-2" />
                            Chất ức chế Reverse Transcriptase Nucleoside (NRTI)
                          </h6>
                          <Row>
                            {['TDF', 'TAF', 'ABC', '3TC', 'FTC', 'AZT'].map(drug => (
                              <Col md={3} sm={6} key={drug}>
                            <Form.Check
                              type="checkbox"
                                  id={`current-${drug}`}
                                  label={drug}
                                  checked={currentRegimen.includes(drug)}
                                  onChange={handleCurrentRegimenChange}
                                  value={drug}
                                  className="drug-checkbox"
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>

                        {/* NNRTI - Non-Nucleoside RTIs */}
                        <div className="drug-class-section">
                          <h6 className="drug-class-title text-warning">
                            <FontAwesomeIcon icon={faPills} className="me-2" />
                            Chất ức chế Reverse Transcriptase Non-Nucleoside (NNRTI)
                          </h6>
                          <Row>
                            {['EFV', 'RPV', 'DOR'].map(drug => (
                              <Col md={3} sm={6} key={drug}>
                                <Form.Check
                                  type="checkbox"
                                  id={`current-${drug}`}
                                  label={drug}
                                  checked={currentRegimen.includes(drug)}
                                  onChange={handleCurrentRegimenChange}
                                  value={drug}
                                  className="drug-checkbox"
                                />
                              </Col>
                            ))}
                          </Row>
                    </div>

                        {/* PI - Protease Inhibitors */}
                        <div className="drug-class-section">
                          <h6 className="drug-class-title text-danger">
                            <FontAwesomeIcon icon={faCapsules} className="me-2" />
                            Chất ức chế Protease (PI)
                          </h6>
                          <Row>
                            {['DRV/r', 'LPV/r', 'ATV/r'].map(drug => (
                              <Col md={3} sm={6} key={drug}>
                                <Form.Check
                                  type="checkbox"
                                  id={`current-${drug}`}
                                  label={drug}
                                  checked={currentRegimen.includes(drug)}
                                  onChange={handleCurrentRegimenChange}
                                  value={drug}
                                  className="drug-checkbox"
                                />
                              </Col>
                            ))}
                          </Row>
                        </div>

                        {/* Current regimen display */}
                        {currentRegimen.length > 0 && (
                          <div className="current-regimen-display">
                            <strong>Phác đồ hiện tại: </strong>
                            {currentRegimen.join(' + ')}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Form.Text className="text-muted">
                      Thông tin này sẽ được sử dụng để tránh khuyến nghị phác đồ tương tự và phát hiện kháng thuốc tiềm ẩn
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
                </Col>
              </Row>

              <div className="d-flex justify-content-center mb-4">
                <Button 
                  type="button" 
                  variant="success" 
                  size="lg"
                  onClick={generateRecommendations}
                  className="me-3"
                >
                  <FontAwesomeIcon icon={faStar} className="me-2" />
                  Tạo Gợi Ý Phác Đồ ARV
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Recommendations Table */}
        {showRecommendations && recommendedRegimens.length > 0 && (
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faStar} className="me-2" />
                Khuyến Nghị Phác Đồ ARV
              </h4>
            </Card.Header>
            <Card.Body>
              <Alert variant="info" className="mb-3">
                      <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                Dựa trên thông số lâm sàng đã nhập, dưới đây là các phác đồ được khuyến nghị theo thứ tự ưu tiên:
              </Alert>
              
              <Table responsive striped hover>
                <thead className="table-dark">
                  <tr>
                    <th>Chọn</th>
                    <th>Phác Đồ</th>
                    <th>Điểm Số</th>
                    <th>Phù Hợp</th>
                    <th>Liều Dùng</th>
                    <th>Ưu Điểm</th>
                    <th>Lưu Ý</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedRegimens.slice(0, 8).map((regimen, index) => (
                    <tr key={regimen.code} className={selectedRegimens.find(r => r.code === regimen.code) ? 'table-success' : ''}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedRegimens.find(r => r.code === regimen.code) ? true : false}
                          onChange={() => handleRegimenSelection(regimen)}
                        />
                      </td>
                      <td>
                        <strong>{regimen.shortName}</strong>
                        <br />
                        <small className="text-muted">{regimen.displayName}</small>
                      </td>
                      <td>
                        <Badge bg="primary" className="fs-6">
                          {regimen.score.toFixed(1)}/10
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={regimen.suitability.color}>
                          {regimen.suitability.label}
                        </Badge>
                      </td>
                      <td>
                        <div>{regimen.pillsPerDay} viên/ngày</div>
                        <small className="text-muted">{regimen.frequency}</small>
                      </td>
                      <td>
                        <ul className="mb-0" style={{ fontSize: '0.85rem' }}>
                          {regimen.advantages.slice(0, 2).map((advantage, i) => (
                            <li key={i}>{advantage}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {regimen.foodRequirement !== 'Không yêu cầu' && (
                            <div>🍽️ {regimen.foodRequirement}</div>
                          )}
                          {regimen.contraindications.length > 0 && (
                            <div className="text-danger">
                              ⚠️ {regimen.contraindications[0]}
                    </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {selectedRegimens.length > 0 && (
                <Alert variant="success" className="mt-3">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  Đã chọn {selectedRegimens.length} phác đồ. Hãy thêm ghi chú và tạo báo cáo PDF.
                </Alert>
              )}
              
              {selectedRegimens.length === 0 && notes.customRegimen && notes.customRegimen.trim() !== '' && (
                <Alert variant="info" className="mt-3">
                  <FontAwesomeIcon icon={faPills} className="me-2" />
                  Đã nhập phác đồ tùy chỉnh. Bạn có thể tạo báo cáo PDF ngay bây giờ.
                </Alert>
              )}
              
              {/* Custom Regimen Toggle Button */}
              <div className="mt-3 text-center">
                {!showCustomRegimen ? (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setShowCustomRegimen(true)}
                    className="btn-custom-regimen"
                  >
                    <FontAwesomeIcon icon={faPills} className="me-2" />
                    Phác Đồ Tùy Chỉnh
                  </Button>
                ) : (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      setShowCustomRegimen(false);
                      setNotes({...notes, customRegimen: ''}); // Clear custom regimen when hiding
                    }}
                    className="mb-3"
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-2" />
                    Ẩn Phác Đồ Tùy Chỉnh
                  </Button>
                )}
              </div>
              
              {/* Custom Regimen Option - Only show when toggled */}
              {showCustomRegimen && (
                <div className="mt-3 custom-regimen-section">
                  <Form.Group>
                    <Form.Label className="fw-bold text-center d-block">
                      <FontAwesomeIcon icon={faPills} className="me-2" />
                      Phác Đồ Tùy Chỉnh
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ví dụ: TAF + FTC + BIC hoặc phác đồ khác..."
                      value={notes.customRegimen || ''}
                      onChange={(e) => setNotes({...notes, customRegimen: e.target.value})}
                      className="custom-regimen-input"
                    />
                    <Form.Text className="text-muted text-center d-block mt-2">
                      Nhập phác đồ tùy chỉnh nếu các gợi ý không phù hợp với bệnh nhân cụ thể
                    </Form.Text>
                  </Form.Group>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Notes and PDF Generation */}
        {showRecommendations && (
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
              {/* Notes Section */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                    Ghi Chú Bác Sĩ
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                    placeholder="Nhập các ghi chú bổ sung về bệnh nhân, lý do lựa chọn phác đồ, hướng dẫn theo dõi..."
                  value={notes.doctorNotes}
                  onChange={(e) => setNotes({...notes, doctorNotes: e.target.value})}
                />
                <Form.Text className="text-muted">
                  Ghi chú này sẽ được bao gồm trong báo cáo khuyến nghị điều trị
                </Form.Text>
                </Form.Group>

                                <div className="d-flex justify-content-center mt-4">
                  {/* NÚT DUY NHẤT: TẠO BÁO CÁO ARV (Lưu vào Database) */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={selectedRegimens.length === 0 && (!notes.customRegimen || notes.customRegimen.trim() === '')}
                    className="px-5 py-3"
                    title="Tạo báo cáo PDF và lưu vào hệ thống database"
                  >
                    <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                    TẠO BÁO CÁO ARV
                  </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        )}


      </Container>

              {/* WEB VIEWER MODAL - XEM TRỰC TIẾP FONT TIẾNG VIỆT */}
        <Modal 
          show={showWebViewer} 
          onHide={() => setShowWebViewer(false)}
          size="xl"
          centered
          backdrop="static"
          className="web-viewer-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FontAwesomeIcon icon={faEye} className="me-2 text-success" />
              Báo Cáo ARV - Xem Trực Tiếp
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, height: '85vh', overflow: 'auto' }}>
            {webViewerData && (
              <ARVReportWebViewer 
                data={webViewerData} 
                onClose={null} // Không cần nút close riêng vì đã có trong modal header
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-primary" onClick={() => {
              // Mở trong tab mới với HTML static để in
              const htmlContent = generateStaticHTML(webViewerData);
              const newWindow = window.open();
              newWindow.document.write(htmlContent);
              newWindow.document.close();
              newWindow.focus();
            }}>
              <FontAwesomeIcon icon={faEye} className="me-2" />
              Mở Tab Mới (Để In)
            </Button>
            <Button variant="outline-secondary" onClick={() => {
              // Fallback: Generate PDF if user wants to download
              generateVietnamesePDFMethod();
            }}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              Tạo PDF Để Tải
            </Button>
            <Button variant="secondary" onClick={() => setShowWebViewer(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        {/* PDF Preview Modal */}
      <Modal 
        show={showPdfModal} 
        onHide={closePdfModal}
        size="xl"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
            Xem Trước Báo Cáo ARV
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, height: '80vh' }}>
                {previewPdfUrl && (
                  <iframe 
                    src={previewPdfUrl} 
              style={{ 
                width: '100%', 
                height: '100%', 
                border: 'none',
                borderRadius: '0 0 8px 8px'
              }}
                    title="PDF Preview"
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={openPdfInNewTab}>
            <FontAwesomeIcon icon={faEye} className="me-2" />
            Mở Tab Mới
                </Button>
          <Button variant="success" onClick={downloadLastPdf}>
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Tải Xuống
                </Button>
          <Button variant="secondary" onClick={closePdfModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ARVSelectionTool;