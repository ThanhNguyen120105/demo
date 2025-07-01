// Vietnamese HTML-to-PDF Generator
// Giải pháp cuối cùng cho vấn đề font tiếng Việt trên Supabase

export const generateVietnameseHTMLtoPDF = async (data) => {
  try {
    console.log('🎯 Tạo PDF tiếng Việt bằng HTML-to-PDF...');
    
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

    // Tạo HTML với font web Google Fonts
    const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Báo Cáo ARV - ${appointment?.alternativeName || 'Bệnh nhân'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    body {
      font-family: 'Roboto', Arial, sans-serif !important;
      font-size: 11pt;
      line-height: 1.4;
      color: #333;
      background: white;
      padding: 15mm;
    }
    
    .header {
      background: linear-gradient(135deg, #2e7d32, #4caf50);
      color: white;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    
    .header h1 {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 5px;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .header p {
      font-size: 12pt;
      font-weight: 300;
      margin: 0;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .section-header {
      background-color: #f5f5f5;
      padding: 10px 15px;
      border-left: 4px solid #2e7d32;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    
    .section-header h3 {
      font-size: 14pt;
      font-weight: 600;
      color: #2e7d32;
      margin: 0;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .section-header.primary {
      background: #e0e0e0;
      color: #2e7d32;
      border-left: 4px solid #2e7d32;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .info-item {
      display: flex;
      margin-bottom: 5px;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .info-label {
      font-weight: 600;
      min-width: 120px;
      color: #555;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .info-value {
      color: #333;
      word-break: break-word;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .regimen-item {
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      background: #fafafa;
      page-break-inside: avoid;
    }
    
    .regimen-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .regimen-name {
      font-size: 12pt;
      font-weight: 600;
      color: #2e7d32;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .regimen-score {
      background: #2196f3;
      color: white;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 10pt;
      font-weight: 500;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .regimen-details {
      margin-left: 10px;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .regimen-detail {
      margin-bottom: 3px;
      font-size: 10pt;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .advantages {
      margin-top: 8px;
    }
    
    .advantages-title {
      font-weight: 600;
      margin-bottom: 3px;
      color: #2e7d32;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .advantage-item {
      margin-left: 10px;
      margin-bottom: 2px;
      font-size: 10pt;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .list-item {
      margin-bottom: 3px;
      padding-left: 10px;
      position: relative;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .list-item::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #2e7d32;
      font-weight: bold;
    }
    
    .custom-regimen {
      background: #fffbf0;
      border: 1px solid #ffc107;
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
      word-break: break-word;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .doctor-notes {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 12px;
      margin-top: 8px;
      word-break: break-word;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 9pt;
      color: #666;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    .footer-item {
      margin-bottom: 3px;
      font-family: 'Roboto', Arial, sans-serif !important;
    }
    
    @media print {
      body { margin: 0; padding: 10mm; }
      .header { break-inside: avoid; }
      .section { break-inside: avoid; }
      .regimen-item { break-inside: avoid; }
    }
    
    @page {
      size: A4;
      margin: 15mm;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>Báo cáo lựa chọn phác đồ ARV</h1>
  </div>

  <!-- Patient Information -->
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

  <!-- Clinical Parameters -->
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
  <!-- Comorbidities -->
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
  <!-- Co-medications -->
  <div class="section">
    <div class="section-header">
      <h3>THUỐC PHỐI HỢP</h3>
    </div>
    <div>
      ${coMedications.map(medication => `<div class="list-item">${medication}</div>`).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Selected Regimens -->
  <div class="section">
    <div class="section-header primary">
      <h3>PHÁC ĐỒ ĐƯỢC CHỌN BỞI BÁC SĨ</h3>
    </div>
    
    ${selectedRegimens.length > 0 ? 
      selectedRegimens.map((regimen, index) => `
        <div class="regimen-item">
          <div class="regimen-header">
            <div class="regimen-name">${index + 1}. ${regimen.name}</div>
            <div class="regimen-score">Điểm: ${regimen.score.toFixed(2)}/10</div>
          </div>
          <div class="regimen-details">
            <div class="regimen-detail"><strong>Thương hiệu:</strong> ${regimen.displayName || regimen.shortName}</div>
            <div class="regimen-detail"><strong>Liều dùng:</strong> ${regimen.pillsPerDay} viên/ngày, ${regimen.frequency}</div>
            <div class="regimen-detail"><strong>Thức ăn:</strong> ${regimen.foodRequirement}</div>
            ${regimen.advantages && regimen.advantages.length > 0 ? `
              <div class="advantages">
                <div class="advantages-title">Ưu điểm:</div>
                ${regimen.advantages.map(advantage => `<div class="advantage-item">• ${advantage}</div>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('') 
      : '<div style="padding: 15px; text-align: center; font-style: italic; color: #666;">Bác sĩ chưa chọn phác đồ cụ thể từ danh sách gợi ý.</div>'
    }
  </div>

  ${notes.customRegimen && notes.customRegimen.trim() ? `
  <!-- Custom Regimen -->
  <div class="section">
    <div class="section-header">
      <h3>PHÁC ĐỒ TÙY CHỈNH</h3>
    </div>
    <div class="custom-regimen">${notes.customRegimen}</div>
  </div>
  ` : ''}

  ${notes.doctorNotes && notes.doctorNotes.trim() ? `
  <!-- Doctor Notes -->
  <div class="section">
    <div class="section-header">
      <h3>GHI CHÚ BÁC SĨ</h3>
    </div>
    <div class="doctor-notes">${notes.doctorNotes}</div>
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="footer">
    <div class="footer-item">Báo cáo được tạo ngày: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</div>
  </div>
</body>
</html>`;

    // Sử dụng Puppeteer hoặc browser API để convert HTML to PDF
    // Đây là phương pháp chính xác nhất để giữ font tiếng Việt
    
    try {
      // Method 1: Sử dụng window.print() với CSS tối ưu
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Chờ font load
      await new Promise(resolve => {
        printWindow.addEventListener('load', () => {
          // Chờ thêm 500ms để font Google Fonts load hoàn toàn
          setTimeout(resolve, 500);
        });
      });
      
      // Tự động print
      printWindow.print();
      
      return {
        success: true,
        method: 'html-print',
        message: 'Đã mở cửa sổ in với font tiếng Việt chính xác'
      };
      
    } catch (error) {
      console.error('Lỗi HTML-to-PDF:', error);
      
      // Method 2: Fallback - tạo blob HTML để download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ARV_Report_HTML_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return {
        success: true,
        method: 'html-download',
        message: 'Đã tải xuống file HTML - có thể mở và in với font đúng'
      };
    }
    
  } catch (error) {
    console.error('❌ Lỗi tạo HTML-to-PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 