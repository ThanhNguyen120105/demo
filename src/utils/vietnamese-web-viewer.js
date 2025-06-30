import React from 'react';

// Vietnamese Report Web Viewer - Xem báo cáo trực tiếp trên web với font hoàn hảo
// Không cần tải về, hiển thị ngay trong modal/iframe

export const ARVReportWebViewer = ({ data, onClose }) => {
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

  return (
    <div style={{
      fontFamily: "'Roboto', 'Arial', sans-serif",
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#333',
      backgroundColor: 'white',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* CSS cho font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        
        .arv-report * {
          font-family: 'Roboto', 'Arial', sans-serif !important;
        }
        
        .header {
          background: linear-gradient(135deg, #2e7d32, #4caf50);
          color: white;
          padding: 25px;
          text-align: center;
          margin-bottom: 30px;
          border-radius: 8px;
        }
        
        .header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          margin-top: 0;
        }
        
        .header p {
          font-size: 16px;
          font-weight: 300;
          margin: 0;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-header {
          background-color: #f5f5f5;
          padding: 12px 15px;
          border-left: 4px solid #2e7d32;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .section-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #2e7d32;
          margin: 0;
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
          min-width: 130px;
          color: #555;
        }
        
        .info-value {
          color: #333;
          word-break: break-word;
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
          word-break: break-word;
        }
        
        .doctor-notes {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-top: 10px;
          word-break: break-word;
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
        
        .close-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 18px;
          cursor: pointer;
          z-index: 1000;
        }
      `}</style>

      <div className="arv-report">
        {onClose && (
          <button className="close-button" onClick={onClose}>×</button>
        )}

        {/* Header */}
        <div className="header">
          <h1>BÁO CÁO LỰA CHỌN PHÁC ĐỒ ĐIỀU TRỊ HIV</h1>
          <p>ARV Regimen Selection Report</p>
        </div>

        {/* Patient Information */}
        <div className="section">
          <div className="section-header">
            <h3>THÔNG TIN BỆNH NHÂN</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Họ và Tên:</span>
              <span className="info-value">{appointment?.alternativeName || 'Chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ngày Khám:</span>
              <span className="info-value">{appointment?.date || new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bác Sĩ:</span>
              <span className="info-value">{appointment?.doctorName || 'Bác sĩ'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Nhóm Đặc Biệt:</span>
              <span className="info-value">{getSpecialPopulationDisplay(specialPopulation)}</span>
            </div>
          </div>
        </div>

        {/* Clinical Parameters */}
        <div className="section">
          <div className="section-header">
            <h3>THÔNG SỐ LÂM SÀNG</h3>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Tải Lượng Virus:</span>
              <span className="info-value">{getViralLoadDisplay(viralLoad)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số Lượng CD4:</span>
              <span className="info-value">{getCd4Display(cd4Count)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">HLA-B5701:</span>
              <span className="info-value">{hlaB5701 === 'positive' ? 'Dương tính' : 'Âm tính'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tính Hướng Thụ Thể:</span>
              <span className="info-value">{getTropismDisplay(tropism)}</span>
            </div>
          </div>
        </div>

        {/* Comorbidities */}
        {comorbidities.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h3>BỆNH ĐỒNG MẮC</h3>
            </div>
            <div>
              {comorbidities.map((comorbidity, index) => {
                const option = comorbidityOptions.find(opt => opt.value === comorbidity);
                return (
                  <div key={index} className="list-item">{option?.label || comorbidity}</div>
                );
              })}
            </div>
          </div>
        )}

        {/* Co-medications */}
        {coMedications.length > 0 && (
          <div className="section">
            <div className="section-header">
              <h3>THUỐC PHỐI HỢP</h3>
            </div>
            <div>
              {coMedications.map((medication, index) => (
                <div key={index} className="list-item">{medication}</div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Regimens */}
        <div className="section">
          <div className="section-header">
            <h3>PHÁC ĐỒ ĐƯỢC CHỌN</h3>
          </div>
          
          {selectedRegimens.length > 0 ? (
            selectedRegimens.map((regimen, index) => (
              <div key={index} className="regimen-item">
                <div className="regimen-header">
                  <div className="regimen-name">{index + 1}. {regimen.name}</div>
                  <div className="regimen-score">Điểm: {regimen.score.toFixed(2)}/10</div>
                </div>
                <div>
                  <strong>Thương hiệu:</strong> {regimen.displayName || regimen.shortName}<br/>
                  <strong>Liều dùng:</strong> {regimen.pillsPerDay} viên/ngày, {regimen.frequency}<br/>
                  <strong>Ưu điểm:</strong> {regimen.advantages?.join(', ')}
                </div>
              </div>
            ))
          ) : (
            <div style={{padding: '15px', textAlign: 'center', fontStyle: 'italic'}}>
              Chưa chọn phác đồ
            </div>
          )}
        </div>

        {/* Custom Regimen */}
        {notes.customRegimen && (
          <div className="section">
            <div className="section-header">
              <h3>PHÁC ĐỒ TÙY CHỈNH</h3>
            </div>
            <div style={{background: '#fff8dc', padding: '15px', borderRadius: '4px'}}>
              {notes.customRegimen}
            </div>
          </div>
        )}

        {/* Doctor Notes */}
        {notes.doctorNotes && (
          <div className="section">
            <div className="section-header">
              <h3>GHI CHÚ BÁC SĨ</h3>
            </div>
            <div style={{background: '#f8f9fa', padding: '15px', borderRadius: '4px'}}>
              {notes.doctorNotes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <div className="footer-item">Báo cáo được tạo ngày: {new Date().toLocaleDateString('vi-VN')}</div>
          <div className="footer-item">Công cụ hỗ trợ chẩn đoán - Quyết định cuối thuộc về bác sĩ</div>
        </div>
      </div>
    </div>
  );
};

// Hook để tạo và hiển thị báo cáo web
export const useARVWebViewer = () => {
  const [showViewer, setShowViewer] = React.useState(false);
  const [reportData, setReportData] = React.useState(null);

  const showReport = (data) => {
    setReportData(data);
    setShowViewer(true);
  };

  const hideReport = () => {
    setShowViewer(false);
    setReportData(null);
  };

  return {
    showViewer,
    reportData,
    showReport,
    hideReport
  };
};

// Function để generate web viewer (thay thế cho PDF generation)
export const generateWebReport = (data) => {
  return {
    success: true,
    data: data,
    method: 'web-viewer'
  };
};

// Export main function for compatibility
export const generateVietnamesePDF = generateWebReport; 