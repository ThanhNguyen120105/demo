import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentCallback.css';

const PaymentCallback = () => {
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const [autoRedirect, setAutoRedirect] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Built-in VNPay error messages (no external dependencies)
  const getVNPayErrorMessage = useCallback((code) => {
    const messages = {
      '01': 'Giao dịch chưa hoàn tất',
      '02': 'Giao dịch không thành công',
      '04': 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)',
      '05': 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
      '06': 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
      '07': 'Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
      '09': 'GD Hoàn trả bị từ chối',
      '10': 'Đã giao hàng',
      '11': 'Giao dịch không thành công do: Khách hàng nhập sai mật khẩu OTP quá số lần quy định',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu thanh toán quá số lần quy định',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định'
    };
    return messages[code] || 'Lỗi không xác định';
  }, []);

  const handleGoHome = useCallback(() => {
    console.log('🏠 Redirecting to home page...');
    navigate('/', { replace: true });
  }, [navigate]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Redirecting to appointment form...');
    navigate('/appointment', { replace: true });
  }, [navigate]);

  const cancelAutoRedirect = useCallback(() => {
    setAutoRedirect(false);
    console.log('⏸️ Auto redirect cancelled');
  }, []);

  // Format số tiền thành VND
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Xử lý URL parameters từ backend để lấy thông tin thanh toán
  const handleBackendCallback = useCallback((status, urlParams) => {
    const isSuccess = status === 'success';
    
    // Lấy các tham số VNPay từ URL
    const vnpTxnRef = urlParams.get('vnp_TxnRef');
    const vnpAmount = urlParams.get('vnp_Amount');
    const vnpBankCode = urlParams.get('vnp_BankCode');
    
    console.log('🔍 Backend callback received with status:', status);
    console.log('💰 VNPay parameters:', { vnpTxnRef, vnpAmount, vnpBankCode });
    
    // Tạo object kết quả thanh toán từ URL parameters
    const result = {
      success: isSuccess,
      responseCode: isSuccess ? '00' : '02',
      transactionRef: vnpTxnRef || 'N/A',
      amount: vnpAmount ? parseFloat(vnpAmount) : 0,
      bankCode: vnpBankCode || 'N/A',
      payDate: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
      orderInfo: 'Thanh toan lich hen HIV',
      message: isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'
    };
    
    console.log('💳 Backend callback result:', result);
    setPaymentResult(result);
    setPaymentStatus(isSuccess ? 'success' : 'failed');
    
    // Lưu dữ liệu thanh toán riêng để hiển thị
    if (vnpTxnRef && vnpAmount) {
      setPaymentData({
        transactionRef: vnpTxnRef,
        amount: parseFloat(vnpAmount),
        bankCode: vnpBankCode || 'N/A'
      });
    }
  }, []);

  const formatAmount = useCallback((amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    
    // Handle ISO format (from simple status)
    if (dateString.includes('T') || dateString.includes('-')) {
      return new Date(dateString).toLocaleString('vi-VN');
    }
    
    // Handle VNPay format (yyyyMMddHHmmss)
    if (dateString.length === 14) {
      const year = dateString.substr(0, 4);
      const month = dateString.substr(4, 2);
      const day = dateString.substr(6, 2);
      const hour = dateString.substr(8, 2);
      const minute = dateString.substr(10, 2);
      const second = dateString.substr(12, 2);
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }
    
    return dateString;
  }, []);

  // Handle simple format: ?status=success&amount=52500&transactionId=12345
  const handleSimpleStatusFormat = useCallback((status, urlParams) => {
    const isSuccess = status === 'success';
    
    const result = {
      success: isSuccess,
      responseCode: isSuccess ? '00' : '02',
      transactionNo: urlParams.get('transactionId') || urlParams.get('id') || 'N/A',
      transactionRef: urlParams.get('ref') || urlParams.get('transactionRef') || 'N/A',
      amount: urlParams.get('amount') ? parseInt(urlParams.get('amount')) : 0,
      bankCode: urlParams.get('bankCode') || urlParams.get('bank') || 'N/A',
      payDate: urlParams.get('payDate') || new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
      orderInfo: urlParams.get('orderInfo') || 'Thanh toan lich hen HIV',
      message: isSuccess ? 'Thanh toán thành công' : getVNPayErrorMessage(urlParams.get('errorCode') || '02')
    };
    
    console.log('💳 Simple format result:', result);
    setPaymentResult(result);
    setPaymentStatus(isSuccess ? 'success' : 'failed');
  }, [getVNPayErrorMessage]);

  // Handle VNPay format: ?vnp_ResponseCode=00&vnp_Amount=5250000&...
  const handleVNPayFormat = useCallback((urlParams) => {
    const callbackParams = {};
    
    // Extract all vnp_ parameters
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('vnp_')) {
        callbackParams[key] = value;
      }
    }
    
    console.log('📋 VNPay Callback parameters:', callbackParams);
    
    if (Object.keys(callbackParams).length === 0) {
      throw new Error('Không tìm thấy thông tin thanh toán');
    }
    
    // Simple VNPay processing without mock functions
    const responseCode = callbackParams.vnp_ResponseCode;
    const success = responseCode === '00';
    
    const result = {
      success,
      responseCode,
      transactionNo: callbackParams.vnp_TransactionNo,
      transactionRef: callbackParams.vnp_TxnRef,
      amount: callbackParams.vnp_Amount ? parseInt(callbackParams.vnp_Amount) / 100 : 0,
      bankCode: callbackParams.vnp_BankCode,
      payDate: callbackParams.vnp_PayDate,
      orderInfo: callbackParams.vnp_OrderInfo,
      message: success ? 'Thanh toán thành công' : getVNPayErrorMessage(responseCode)
    };
    
    console.log('💳 VNPay format result:', result);
    setPaymentResult(result);
    setPaymentStatus(success ? 'success' : 'failed');
  }, [getVNPayErrorMessage]);

  const handlePaymentCallback = useCallback(() => {
    try {
      console.log('🏦 Processing payment callback...');
      
      const urlParams = new URLSearchParams(location.search);
      console.log('📋 URL parameters:', Object.fromEntries(urlParams));
      
      // Ưu tiên xử lý tham số status từ backend với các tham số VNPay bổ sung
      const status = urlParams.get('status');
      
      if (status) {
        console.log('🎯 Using backend callback format with VNPay params:', status);
        handleBackendCallback(status, urlParams);
      } else {
        console.log('🏦 Using VNPay format callback');
        handleVNPayFormat(urlParams);
      }
      
    } catch (error) {
      console.error('❌ Payment callback processing failed:', error);
      setPaymentStatus('error');
      setPaymentResult({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi xử lý thanh toán'
      });
    }
  }, [location.search, handleBackendCallback, handleVNPayFormat]);

  useEffect(() => {
    console.log('🔄 PaymentCallback component mounted');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔗 Location search:', location.search);
    
    handlePaymentCallback();
  }, [handlePaymentCallback, location.search]);

  useEffect(() => {
    // Auto redirect countdown
    if ((paymentStatus === 'success' || paymentStatus === 'failed') && autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Auto redirect when countdown reaches 0
    if (countdown === 0 && autoRedirect) {
      handleGoHome();
    }
  }, [countdown, paymentStatus, autoRedirect, handleGoHome]);

  if (paymentStatus === 'processing') {
    return (
      <div className="payment-callback-container">
        <div className="payment-callback-card">
          <div className="processing-section">
            <div className="processing-icon">⏳</div>
            <h2>Đang xử lý kết quả thanh toán...</h2>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="payment-callback-container">
        <div className="payment-callback-card">
          <div className="success-section">
            <div className="success-icon">✅</div>
            <h2>Thanh toán thành công! 🎉</h2>
            <p>Lịch hẹn của bạn đã được đặt thành công</p>
            
            {/* Payment Details - Sử dụng dữ liệu từ URL parameters */}
            {paymentData && (
              <div className="payment-details">
                <h4><span className="icon">📋</span>Chi tiết thanh toán</h4>
                <div className="detail-row">
                  <span className="label">Mã giao dịch:</span>
                  <span className="value">{paymentData.transactionRef}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Số tiền:</span>
                  <span className="value">{formatCurrency(paymentData.amount)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Ngân hàng:</span>
                  <span className="value">{paymentData.bankCode}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Trạng thái:</span>
                  <span className="value text-success">✅ Thành công</span>
                </div>
              </div>
            )}
            
            {/* Fallback nếu không có paymentData, sử dụng paymentResult */}
            {!paymentData && paymentResult && (
              <div className="payment-details">
                <h4><span className="icon">📋</span>Chi tiết thanh toán</h4>
                <div className="detail-row">
                  <span className="label">Mã giao dịch:</span>
                  <span className="value">{paymentResult.transactionNo || paymentResult.transactionRef || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Số tiền:</span>
                  <span className="value">{formatCurrency(paymentResult.amount)} VND</span>
                </div>
                <div className="detail-row">
                  <span className="label">Ngân hàng:</span>
                  <span className="value">{paymentResult.bankCode || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Thời gian:</span>
                  <span className="value">{formatDate(paymentResult.payDate)}</span>
                </div>
              </div>
            )}

            {/* Auto redirect countdown */}
            {autoRedirect && (
              <div className="countdown-message">
                <span className="icon">⏰</span>
                Tự động chuyển về trang chủ sau <strong>{countdown}</strong> giây
                <button 
                  className="cancel-redirect-btn"
                  onClick={cancelAutoRedirect}
                >
                  Hủy
                </button>
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={handleGoHome}
              >
                <span className="icon">🏠</span>
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment failed or error
  return (
    <div className="payment-callback-container">
      <div className="payment-callback-card">
        <div className="failed-section">
          <div className="failed-icon">❌</div>
          <h2>{paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Có lỗi xảy ra'}</h2>
          <p>{paymentResult?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}</p>
          
          {/* Error Details */}
          {paymentResult && paymentStatus === 'failed' && (
            <div className="payment-details">
              <h4><span className="icon">ℹ️</span>Chi tiết lỗi</h4>
              <div className="detail-row">
                <span className="label">Mã lỗi:</span>
                <span className="value">{paymentResult.responseCode}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mô tả:</span>
                <span className="value">{paymentResult.message}</span>
              </div>
              {paymentResult.transactionRef && paymentResult.transactionRef !== 'N/A' && (
                <div className="detail-row">
                  <span className="label">Mã tham chiếu:</span>
                  <span className="value">{paymentResult.transactionRef}</span>
                </div>
              )}
            </div>
          )}

          {/* Auto redirect countdown */}
          {autoRedirect && (
            <div className="countdown-message warning">
              <span className="icon">⏰</span>
              Tự động chuyển về trang chủ sau <strong>{countdown}</strong> giây
              <button 
                className="cancel-redirect-btn"
                onClick={cancelAutoRedirect}  
              >
                Hủy
              </button>
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={handleRetry}
            >
              <span className="icon">🔄</span>
              Thử lại
            </button>
            <button 
              className="btn btn-secondary ms-3"
              onClick={handleGoHome}
            >
              <span className="icon">🏠</span>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
