// HTML to PDF generator using browser's print functionality for perfect Vietnamese support
// This method renders HTML with Vietnamese fonts and uses browser's native PDF generation

export const generateHTMLTemplate = (data) => {
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
    <title>Báo Cáo ARV</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Roboto', 'Arial', sans-serif;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
            background: white;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            background: linear-gradient(135deg, #2e7d32, #4caf50);
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 8px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            font-weight: 300;
        }
        
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-header {
            background-color: #f5f5f5;
            padding: 12px 15px;
            border-left: 4px solid #2e7d32;
            margin-bottom: 15px;
        }
        
        .section-header h3 {
            font-size: 16px;
            font-weight: 600;
            color: #2e7d32;
        }
        
        .section-header.primary {
            background: linear-gradient(135deg, #2e7d32, #4caf50);
            color: white;
            border-left: none;
        }
        
        .section-header.warning {
            background-color: #fff8dc;
            border-left-color: #ffc107;
        }
        
        .section-header.warning h3 {
            color: #856404;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .info-item {
            display: flex;
            margin-bottom: 8px;
        }
        
        .info-label {
            font-weight: 600;
            min-width: 120px;
            color: #555;
        }
        
        .info-value {
            color: #333;
        }
        
        .regimen-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background: #fafafa;
        }
        
        .regimen-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .regimen-name {
            font-size: 16px;
            font-weight: 600;
            color: #2e7d32;
        }
        
        .regimen-score {
            background: #2196f3;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .regimen-details {
            margin-left: 15px;
        }
        
        .regimen-detail {
            margin-bottom: 5px;
            font-size: 13px;
        }
        
        .advantages {
            margin-top: 10px;
        }
        
        .advantages-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: #2e7d32;
        }
        
        .advantage-item {
            margin-left: 15px;
            margin-bottom: 3px;
            font-size: 13px;
        }
        
        .list-item {
            margin-bottom: 5px;
            padding-left: 15px;
            position: relative;
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
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
        }
        
        .doctor-notes {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        .footer-item {
            margin-bottom: 5px;
        }
        
        .no-content {
            font-style: italic;
            color: #666;
            padding: 15px;
            text-align: center;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>BÁO CÁO LỰA CHỌN PHÁC ĐỒ ĐIỀU TRỊ HIV</h1>
            <p>ARV Regimen Selection Report</p>
        </div>

        <!-- Patient Information -->
        <div class="section">
            <div class="section-header">
                <h3>THÔNG TIN BỆNH NHÂN</h3>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Họ và Tên:</span>
                    <span class="info-value">${appointment?.alternativeName || appointment?.patientName || 'Chưa cập nhật'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Ngày Khám:</span>
                    <span class="info-value">${appointment?.date || new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Bác Sĩ Điều Trị:</span>
                    <span class="info-value">${appointment?.doctorName || 'Dr. ' + (appointment?.doctorId || 'Unknown')}</span>
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
                        <div class="regimen-score">Điểm số: ${regimen.score.toFixed(2)}/10</div>
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
              : '<div class="no-content">Bác sĩ chưa chọn phác đồ cụ thể từ danh sách gợi ý.</div>'
            }
        </div>

        ${notes.customRegimen && notes.customRegimen.trim() ? `
        <!-- Custom Regimen -->
        <div class="section">
            <div class="section-header warning">
                <h3>PHÁC ĐỒ TÙY CHỈNH</h3>
            </div>
            <div class="custom-regimen">
                ${notes.customRegimen}
            </div>
        </div>
        ` : ''}

        ${notes.doctorNotes && notes.doctorNotes.trim() ? `
        <!-- Doctor Notes -->
        <div class="section">
            <div class="section-header">
                <h3>GHI CHÚ BÁC SĨ</h3>
            </div>
            <div class="doctor-notes">
                ${notes.doctorNotes}
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            <div class="footer-item">Báo cáo được tạo từ công cụ khuyến nghị ARV</div>
            <div class="footer-item">Ngày tạo: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</div>
            <div class="footer-item">Lưu ý: Đây chỉ là công cụ hỗ trợ. Quyết định cuối cùng thuộc về bác sĩ điều trị.</div>
        </div>
    </div>
</body>
</html>
  `;
};

// Function to generate PDF using browser's native print functionality
export const generateHTMLPDF = async (data) => {
  try {
    console.log('🎨 Generating PDF using browser print functionality...');
    
    // Create HTML template
    const htmlContent = generateHTMLTemplate(data);
    
    // Open new window with the HTML content
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for fonts to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Focus window and trigger print
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    alert('✅ Đã mở cửa sổ in PDF!\n\n📋 Trong hộp thoại in:\n1. Chọn "Save as PDF" hoặc "Microsoft Print to PDF"\n2. Click "Save" để lưu file PDF có dấu tiếng Việt hoàn hảo!');
    
    return {
      name: `ARV_Report_${data.appointment?.userId || Date.now()}.pdf`,
      type: 'application/pdf',
      method: 'browser-print'
    };
    
  } catch (error) {
    console.error('❌ Error generating HTML PDF:', error);
    throw error;
  }
};

// Alternative: Generate downloadable HTML file
export const generateDownloadableHTML = async (data) => {
  try {
    console.log('📄 Generating downloadable HTML file...');
    
    const htmlContent = generateHTMLTemplate(data);
    
    // Create blob and download link
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARV_Report_${data.appointment?.userId || Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    alert('✅ Đã tải xuống file HTML!\n\n📋 Hướng dẫn:\n1. Mở file HTML vừa tải trong trình duyệt\n2. Nhấn Ctrl+P để in\n3. Chọn "Save as PDF"\n4. Lưu file PDF có dấu tiếng Việt hoàn hảo!');
    
    return {
      name: link.download,
      type: 'text/html',
      size: blob.size
    };
    
  } catch (error) {
    console.error('❌ Error generating downloadable HTML:', error);
    throw error;
  }
};

// Main function for Vietnamese PDF generation
export const generateVietnamesePDF = async (data) => {
  try {
    // Try browser print method first
    return await generateHTMLPDF(data);
  } catch (error) {
    console.warn('Browser print failed, trying downloadable HTML:', error);
    // Fallback to downloadable HTML
    return await generateDownloadableHTML(data);
  }
}; 