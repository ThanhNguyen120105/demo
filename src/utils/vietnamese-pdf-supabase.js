// Vietnamese PDF Generator for Supabase Storage - HTML2CANVAS METHOD
// Sử dụng HTML2Canvas để capture HTML thành ảnh, rồi chèn vào PDF

import jsPDF from 'jspdf';

export const generateVietnamesePDFForSupabase = async (data) => {
  try {
    console.log('📤 Tạo PDF từ HTML Canvas cho Supabase...');
    
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

    // Tạo HTML element tạm thời với Google Fonts
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = '"Roboto", "Segoe UI", "Tahoma", sans-serif';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#333';

    // Load Google Fonts trước
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

          tempDiv.innerHTML = `
          <div style="background: linear-gradient(135deg, #2e7d32, #4caf50); color: white; padding: 20px; text-align: center; margin-bottom: 30px; border-radius: 8px;">
             <h1 style="font-size: 24px; font-weight: 700; margin: 0;">Báo cáo lựa chọn phác đồ ARV</h1>
          </div>

                  <div style="background: #f8f9fa; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #e0e0e0; padding: 15px; font-weight: 600; font-size: 16px; color: #2e7d32; border-left: 4px solid #2e7d32;">
                  THÔNG TIN BỆNH NHÂN
             </div>
            <div style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px;">
                    <div><strong>Họ và Tên:</strong> ${appointment?.alternativeName || appointment?.patientName || 'Chưa cập nhật'}</div>
                    <div><strong>Ngày Khám:</strong> ${appointment?.date || new Date().toLocaleDateString('vi-VN')}</div>
                    <div><strong>Bác Sĩ Điều Trị:</strong> ${appointment?.doctorName || 'Bác sĩ điều trị'}</div>
                    <div><strong>Nhóm Đặc Biệt:</strong> ${getSpecialPopulationDisplay(specialPopulation)}</div>
                </div>
            </div>
        </div>

                  <div style="background: #f8f9fa; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #e0e0e0; padding: 15px; font-weight: 600; font-size: 16px; color: #2e7d32; border-left: 4px solid #2e7d32;">
                  THÔNG SỐ LÂM SÀNG
             </div>
            <div style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px 30px;">
                    <div><strong>Tải Lượng Virus:</strong> ${getViralLoadDisplay(viralLoad)}</div>
                    <div><strong>Số Lượng CD4:</strong> ${getCd4Display(cd4Count)}</div>
                    <div><strong>HLA-B5701:</strong> ${hlaB5701 === 'positive' ? 'Dương tính' : 'Âm tính'}</div>
                    <div><strong>Tính Hướng Thụ Thể:</strong> ${getTropismDisplay(tropism)}</div>
                </div>
            </div>
        </div>

        ${comorbidities.length > 0 ? `
                  <div style="background: #f8f9fa; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #e0e0e0; padding: 15px; font-weight: 600; font-size: 16px; color: #2e7d32; border-left: 4px solid #2e7d32;">
                  BỆNH ĐỒNG MẮC
             </div>
            <div style="padding: 20px;">
                ${comorbidities.map(comorbidity => {
                    const option = comorbidityOptions.find(opt => opt.value === comorbidity);
                    return `<div style="margin-bottom: 8px;">• ${option?.label || comorbidity}</div>`;
                }).join('')}
            </div>
        </div>
        ` : ''}

        ${coMedications.length > 0 ? `
                  <div style="background: #f8f9fa; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #e0e0e0; padding: 15px; font-weight: 600; font-size: 16px; color: #2e7d32; border-left: 4px solid #2e7d32;">
                  THUỐC PHỐI HỢP
             </div>
            <div style="padding: 20px;">
                ${coMedications.map(medication => `<div style="margin-bottom: 8px;">• ${medication}</div>`).join('')}
            </div>
        </div>
        ` : ''}

                 <div style="background: #f8f9fa; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #e0e0e0; padding: 15px; font-weight: 600; font-size: 16px; color: #2e7d32; border-left: 4px solid #2e7d32;">
                  PHÁC ĐỒ ĐƯỢC CHỌN BỞI BÁC SĨ
             </div>
            <div style="padding: 20px;">
                ${selectedRegimens.length > 0 ? selectedRegimens.map((regimen, index) => `
                    <div style="background: white; border: 1px solid #ddd; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <div style="font-weight: 600; font-size: 16px; color: #2e7d32;">${index + 1}. ${regimen.name}</div>
                            <div style="background: #2196f3; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                                Điểm số: ${regimen.score.toFixed(2)}/10
                            </div>
                        </div>
                        <div style="font-size: 13px; color: #666; margin-bottom: 10px;">
                            <div><strong>Thương hiệu:</strong> ${regimen.displayName || regimen.shortName}</div>
                            <div><strong>Liều dùng:</strong> ${regimen.pillsPerDay} viên/ngày, ${regimen.frequency}</div>
                            <div><strong>Thức ăn:</strong> ${regimen.foodRequirement}</div>
                        </div>
                        ${regimen.advantages && regimen.advantages.length > 0 ? `
                            <div>
                                <strong>Ưu điểm:</strong>
                                <div style="margin-top: 8px;">
                                    ${regimen.advantages.map(advantage => `<div style="margin-bottom: 5px;">• ${advantage}</div>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('') : '<p>Bác sĩ chưa chọn phác đồ cụ thể từ danh sách gợi ý.</p>'}
            </div>
        </div>

        ${notes.customRegimen && notes.customRegimen.trim() ? `
                  <div style="background: #e8f5e8; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #c8e6c9; padding: 15px; font-weight: 600; font-size: 16px; color: #2e7d32; border-left: 4px solid #4caf50;">
                  PHÁC ĐỒ TÙY CHỈNH
             </div>
            <div style="padding: 20px;">
                <p>${notes.customRegimen.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
        ` : ''}

        ${notes.doctorNotes && notes.doctorNotes.trim() ? `
                  <div style="background: #fff3e0; border-radius: 8px; margin-bottom: 20px; overflow: hidden;">
             <div style="background: #ffe0b2; padding: 15px; font-weight: 600; font-size: 16px; color: #e65100; border-left: 4px solid #ff9800;">
                  GHI CHÚ BÁC SĨ
             </div>
            <div style="padding: 20px;">
                <p>${notes.doctorNotes.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
        ` : ''}

                 <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666; border-radius: 6px;">
             <p style="margin: 0;">Báo cáo được tạo ngày: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
         </div>
    `;

    document.body.appendChild(tempDiv);

    // Wait for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
             // Import html2canvas dynamically
       const html2canvas = await import('html2canvas');
       const canvas = await html2canvas.default(tempDiv, {
         scale: 1.8, // Increased to 1.8 for better quality
         useCORS: true,
         allowTaint: true,
         backgroundColor: '#ffffff',
         width: 794,
         height: tempDiv.scrollHeight,
         logging: false,
         removeContainer: true
       });

      // Remove temp element
      document.body.removeChild(tempDiv);
      document.head.removeChild(fontLink);

             // Create PDF with compression
       const imgWidth = 210; // A4 width in mm
       const pageHeight = 297; // A4 height in mm
       const imgHeight = (canvas.height * imgWidth) / canvas.width;
       
       const pdf = new jsPDF({
         orientation: 'p',
         unit: 'mm',
         format: 'a4',
         compress: true // Enable PDF compression
       });
       
              // Auto-adjust quality to target 7-9MB for optimal clarity
       let quality = 0.9; // Start with 90% quality for better clarity
       let attempts = 0;
       let pdfBlob, fileSizeMB;
       const targetSizeMin = 7; // Minimum 7MB for good quality
       const targetSizeMax = 9; // Maximum 9MB to stay under 10MB limit
       
       do {
         attempts++;
         
         // Convert canvas to compressed JPEG with current quality
         const imageData = canvas.toDataURL('image/jpeg', quality);
         
         // Reset PDF
         const currentPdf = new jsPDF({
           orientation: 'p',
           unit: 'mm',
           format: 'a4',
           compress: true
         });
         
         let heightLeft = imgHeight;
         let position = 0;

         // Add first page
         currentPdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight);
         heightLeft -= pageHeight;

         // Add additional pages if needed
         while (heightLeft >= 0) {
           position = heightLeft - imgHeight;
           currentPdf.addPage();
           currentPdf.addImage(imageData, 'JPEG', 0, position, imgWidth, imgHeight);
           heightLeft -= pageHeight;
         }

         pdfBlob = currentPdf.output('blob');
         fileSizeMB = pdfBlob.size / (1024 * 1024);
         
         console.log(`📏 Attempt ${attempts}: Quality ${(quality * 100).toFixed(0)}% = ${fileSizeMB.toFixed(2)} MB`);
         
         // Smart quality adjustment for target range 7-9MB
         if (fileSizeMB > targetSizeMax) {
           // Too large, reduce quality
           quality -= 0.05; // Smaller reduction steps for finer control
           if (quality < 0.5) break; // Don't go below 50% quality
         } else if (fileSizeMB < targetSizeMin && quality < 0.95) {
           // Too small, increase quality if possible
           quality += 0.05;
           if (quality > 0.95) quality = 0.95; // Cap at 95%
         } else {
           // Within target range 7-9MB, we're good!
           break;
         }
         
       } while (attempts < 8); // Increased attempts for better optimization

       const fileName = `ARV_Canvas_Report_${Date.now()}.pdf`;

                const qualityStatus = fileSizeMB >= targetSizeMin && fileSizeMB <= targetSizeMax ? 
           '🎯 OPTIMAL' : 
           fileSizeMB < targetSizeMin ? '📉 SMALL' : '📈 LARGE';

         console.log('✅ HTML2Canvas PDF được tạo thành công:', {
           name: fileName,
           size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
           sizeMB: `${fileSizeMB.toFixed(2)} MB`,
           status: qualityStatus,
           targetRange: `${targetSizeMin}-${targetSizeMax}MB`,
           method: 'html2canvas-to-pdf',
           compressionLevel: `JPEG ${(quality * 100).toFixed(0)}%`,
           attempts: attempts,
           withinLimit: fileSizeMB <= 10
         });

         // Final check and warning
         if (fileSizeMB > 10) {
           console.warn('⚠️ File size exceeds 10MB limit:', fileSizeMB.toFixed(2), 'MB');
         } else if (fileSizeMB >= targetSizeMin && fileSizeMB <= targetSizeMax) {
           console.log('🎯 Perfect! File size is in optimal range for clarity and storage.');
         }

      return {
        success: true,
        blob: pdfBlob,
        fileName: fileName,
        file: new File([pdfBlob], fileName, { type: 'application/pdf' }),
        method: 'html2canvas-to-pdf'
      };

    } catch (canvasError) {
      console.error('❌ HTML2Canvas error:', canvasError);
      
      // Fallback to ASCII method
      document.body.removeChild(tempDiv);
      document.head.removeChild(fontLink);
      
      // Return simple ASCII PDF as last resort
      const pdf = new jsPDF();
      pdf.text('BAO CAO ARV - Canvas method failed', 20, 20);
      pdf.text('Loi: ' + canvasError.message, 20, 40);
      
      const pdfBlob = pdf.output('blob');
      const fileName = `ARV_Fallback_Report_${Date.now()}.pdf`;
      
      return {
        success: true,
        blob: pdfBlob,
        fileName: fileName,
        file: new File([pdfBlob], fileName, { type: 'application/pdf' }),
        method: 'fallback-ascii'
      };
    }

  } catch (error) {
    console.error('❌ Lỗi tạo Canvas PDF cho Supabase:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 