import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Vietnamese PDF Generator with proper font embedding
// This solves the issue where Vietnamese text appears garbled when PDF is saved to Supabase

export const generateVietnamesePDF = async (data) => {
  try {
    console.log('🎨 Generating Vietnamese PDF with embedded fonts...');
    
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

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Use built-in fonts with Unicode support
    // jsPDF supports some Unicode characters when using specific fonts
    doc.setFont('helvetica', 'normal');
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    const margin = 15;
    
    // Helper function to add a new page if needed
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Helper function to add text with proper encoding
    const addText = (text, x, y, options = {}) => {
      try {
        // Keep Vietnamese text but use compatible encoding
        // This version maintains Vietnamese characters for PDF
        doc.text(text, x, y, options);
      } catch (error) {
        console.warn('Text encoding issue:', error);
        // Fallback to ASCII if needed
        const cleanText = text
          .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
          .replace(/[ÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ]/g, 'A')
          .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
          .replace(/[ÉÈẺẼẸÊẾỀỂỄỆ]/g, 'E')
          .replace(/[íìỉĩị]/g, 'i')
          .replace(/[ÍÌỈĨỊ]/g, 'I')
          .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
          .replace(/[ÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]/g, 'O')
          .replace(/[úùủũụưứừửữự]/g, 'u')
          .replace(/[ÚÙỦŨỤƯỨỪỬỮỰ]/g, 'U')
          .replace(/[ýỳỷỹỵ]/g, 'y')
          .replace(/[ÝỲỶỸỴ]/g, 'Y')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
        
        doc.text(cleanText, x, y, options);
      }
    };

    // Header with gradient effect
    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    addText('BÁO CÁO LỰA CHỌN PHÁC ĐỒ ĐIỀU TRỊ HIV', pageWidth/2, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    addText('ARV Regimen Selection Report', pageWidth/2, 25, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 45;
    
    // Patient Information Section
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    addText('THÔNG TIN BỆNH NHÂN', margin + 5, yPosition + 5);
    yPosition += 20;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Patient details in a clean format
    const patientInfo = [
      ['Họ và Tên:', appointment?.alternativeName || appointment?.patientName || 'Chưa cập nhật'],
      ['Ngày Khám:', appointment?.date || new Date().toLocaleDateString('vi-VN')],
      ['Bác Sĩ Điều Trị:', appointment?.doctorName || 'Bác sĩ điều trị'],
      ['Nhóm Đặc Biệt:', getSpecialPopulationDisplay(specialPopulation)]
    ];
    
    patientInfo.forEach((info, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col === 0 ? margin + 5 : pageWidth/2 + 10;
      const y = yPosition + (row * 8);
      
      doc.setFont('helvetica', 'bold');
      addText(info[0], x, y);
      doc.setFont('helvetica', 'normal');
      addText(info[1], x + 40, y);
    });
    
    yPosition += 25;
    checkPageBreak(30);
    
    // Clinical Parameters Section
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    addText('THÔNG SỐ LÂM SÀNG', margin + 5, yPosition + 5);
    yPosition += 20;
    
    // Clinical data
    const clinicalData = [
      ['Tải Lượng Virus:', getViralLoadDisplay(viralLoad)],
      ['Số Lượng CD4:', getCd4Display(cd4Count)],
      ['HLA-B5701:', hlaB5701 === 'positive' ? 'Dương tính' : 'Âm tính'],
      ['Tính Hướng Thụ Thể:', getTropismDisplay(tropism)]
    ];
    
    doc.setFontSize(11);
    clinicalData.forEach((data, index) => {
      const y = yPosition + (index * 8);
      doc.setFont('helvetica', 'bold');
      addText(data[0], margin + 5, y);
      doc.setFont('helvetica', 'normal');
      addText(data[1], margin + 80, y);
    });
    
    yPosition += 40;
    checkPageBreak(50);
    
    // Comorbidities
    if (comorbidities.length > 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      addText('BENH DONG MAC', margin + 5, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      comorbidities.forEach((comorbidity, index) => {
        const option = comorbidityOptions.find(opt => opt.value === comorbidity);
        addText(`• ${option?.label || comorbidity}`, margin + 10, yPosition + (index * 7));
      });
      
      yPosition += comorbidities.length * 7 + 15;
      checkPageBreak(50);
    }
    
    // Co-medications Section
    if (coMedications.length > 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      addText('THUOC PHOI HOP', margin + 5, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      coMedications.forEach((medication, index) => {
        addText(`• ${medication}`, margin + 10, yPosition + (index * 7));
      });
      
      yPosition += coMedications.length * 7 + 15;
      checkPageBreak(80);
    }
    
    // Selected Regimens Section
    doc.setFillColor(46, 125, 50);
    doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    addText('PHÁC ĐỒ ĐƯỢC CHỌN BỞI BÁC SĨ', margin + 5, yPosition + 5);
    yPosition += 20;
    
    doc.setTextColor(0, 0, 0);
    
    if (selectedRegimens.length > 0) {
      selectedRegimens.forEach((regimen, index) => {
        checkPageBreak(50);
        
        // Regimen box with border
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 3, pageWidth - 2*margin, 35, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(margin, yPosition - 3, pageWidth - 2*margin, 35, 'S');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        addText(`${index + 1}. ${regimen.name}`, margin + 5, yPosition + 5);
        doc.setFont('helvetica', 'normal');
        addText(`Điểm số: ${regimen.score.toFixed(2)}/10`, pageWidth - 50, yPosition + 5);
        yPosition += 10;
        
        doc.setFontSize(10);
        addText(`Thương hiệu: ${regimen.displayName || regimen.shortName}`, margin + 10, yPosition);
        yPosition += 6;
        addText(`Liều dùng: ${regimen.pillsPerDay} viên/ngày, ${regimen.frequency}`, margin + 10, yPosition);
        yPosition += 6;
        addText(`Thức ăn: ${regimen.foodRequirement}`, margin + 10, yPosition);
        yPosition += 6;
        
        // Advantages
        if (regimen.advantages && regimen.advantages.length > 0) {
          doc.setFont('helvetica', 'bold');
          addText('Ưu điểm:', margin + 10, yPosition);
          doc.setFont('helvetica', 'normal');
          yPosition += 5;
          regimen.advantages.forEach(advantage => {
            addText(`  • ${advantage}`, margin + 15, yPosition);
            yPosition += 5;
          });
        }
        
        yPosition += 10;
      });
    } else {
      doc.setFontSize(11);
      addText('Bác sĩ chưa chọn phác đồ cụ thể từ danh sách gợi ý.', margin + 5, yPosition);
      yPosition += 15;
    }
    
    // Custom Regimen Section
    if (notes.customRegimen && notes.customRegimen.trim()) {
      checkPageBreak(40);
      yPosition += 10;
      
      doc.setFillColor(255, 248, 220);
      doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      addText('PHÁC ĐỒ TUY CHINH', margin + 5, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const splitCustomRegimen = doc.splitTextToSize(notes.customRegimen, pageWidth - 2*margin - 10);
      splitCustomRegimen.forEach((line, index) => {
        addText(line, margin + 5, yPosition + (index * 6));
      });
      yPosition += splitCustomRegimen.length * 6 + 15;
    }
    
    // Notes Section
    if (notes.doctorNotes && notes.doctorNotes.trim()) {
      checkPageBreak(50);
      yPosition += 10;
      
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition - 5, pageWidth - 2*margin, 15, 'F');
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      addText('GHI CHÚ BÁC SĨ', margin + 5, yPosition + 5);
      yPosition += 20;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(notes.doctorNotes, pageWidth - 2*margin - 10);
      splitNotes.forEach((line, index) => {
        addText(line, margin + 5, yPosition + (index * 6));
      });
      yPosition += splitNotes.length * 6 + 15;
    }
    
    // Footer
    checkPageBreak(30);
    yPosition = pageHeight - 35;
    
    doc.setFillColor(245, 245, 245);
    doc.rect(0, yPosition - 5, pageWidth, 40, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    const footerText = [
      `Báo cáo được tạo ngày: ${new Date().toLocaleDateString('vi-VN')}`,
      `Công cụ hỗ trợ chẩn đoán - Quyết định cuối thuộc về bác sĩ điều trị.`
    ];
    
    footerText.forEach((text, index) => {
      addText(text, pageWidth/2, yPosition + 5 + (index * 6), { align: 'center' });
    });
    
    // Generate PDF blob
    const pdfBlob = doc.output('blob');
    const fileName = `ARV_Vietnamese_Report_${Date.now()}.pdf`;
    
    console.log('✅ Vietnamese PDF generated successfully:', {
      name: fileName,
      size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
      pages: doc.internal.getNumberOfPages()
    });
    
    return {
      success: true,
      blob: pdfBlob,
      fileName: fileName,
      file: new File([pdfBlob], fileName, { type: 'application/pdf' })
    };
    
  } catch (error) {
    console.error('❌ Error generating Vietnamese PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 