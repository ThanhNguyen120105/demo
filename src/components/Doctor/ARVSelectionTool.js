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

    </div>
  );
};

export default ARVSelectionTool;