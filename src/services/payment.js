import { appointmentAPI } from './api';

/**
 * Payment Service - VNPay Integration
 * Handles VNPay payment processing for HIV appointment booking
 */

// VNPay response codes
export const VNPAY_RESPONSE_CODES = {
  SUCCESS: '00',
  BANK_TRANSACTION_NOT_EXIST: '01',
  BANK_TRANSACTION_NOT_SUCCESS: '02',
  INVALID_AMOUNT: '04',
  INVALID_CURRENCY: '05',
  WRONG_CHECKSUM: '07',
  INVALID_BANK_CODE: '09',
  WRONG_VERSION: '10',
  WRONG_COMMAND: '11',
  MERCHANT_NOT_EXIST: '13',
  INVALID_ACCESS_CODE: '21',
  INVALID_AMOUNT_FORMAT: '22',
  INVALID_CURRENCY_CODE: '23',
  INVALID_REFRESH_TOKEN: '24',
  INVALID_PAYDATE: '25',
  ORDER_NOT_FOUND: '91',
  INVALID_TMNCODE: '94',
  INVALID_SIGNATURE: '97',
  OTHER_ERROR: '99'
};

// Get user-friendly message for VNPay response codes
export const getVNPayMessage = (responseCode) => {
  const messages = {
    '00': 'Giao dịch thành công',
    '01': 'Giao dịch không tồn tại',
    '02': 'Giao dịch không thành công',
    '04': 'Số tiền không hợp lệ',
    '05': 'Đơn vị tiền tệ không hợp lệ',
    '07': 'Sai checksum',
    '09': 'Ngân hàng không hợp lệ',
    '10': 'Sai phiên bản',
    '11': 'Sai lệnh',
    '13': 'Merchant không tồn tại',
    '21': 'Mã truy cập không hợp lệ',
    '22': 'Định dạng số tiền không hợp lệ',
    '23': 'Mã tiền tệ không hợp lệ',
    '24': 'Token làm mới không hợp lệ',
    '25': 'Ngày thanh toán không hợp lệ',
    '91': 'Không tìm thấy đơn hàng',
    '94': 'TMN Code không hợp lệ',
    '97': 'Chữ ký không hợp lệ',
    '99': 'Lỗi không xác định'
  };
  
  return messages[responseCode] || 'Lỗi không xác định';
};

/**
 * Create VNPay payment URL
 * @param {Object} appointmentData - Appointment data
 * @returns {Promise<Object>} Payment response with URL
 */
export const createVNPayPayment = async (appointmentData) => {
  try {
    console.log('🏦 Creating VNPay payment for appointment:', appointmentData);
    
    // Sửa returnUrl để khớp với backend - không thêm tham số ref
    const baseReturnUrl = `${window.location.origin}/payment-callback`;
    const returnUrl = baseReturnUrl; // Không thêm tham số ref vì backend sẽ tự thêm status

    // Prepare appointment data for API - đảm bảo có đầy đủ required fields
    const paymentData = {
      ...appointmentData,
      paymentMethod: 'vnpay',
      returnUrl: returnUrl, // Simple return URL để backend có thể thêm status parameter
      cancelUrl: `${window.location.origin}/appointment-form`
    };
    
    console.log('📤 Sending payment data to API:', paymentData);
    console.log('🔗 Simple Return URL:', paymentData.returnUrl);
    console.log('📋 Transaction Ref:', appointmentData.transactionRef);
    console.log('ℹ️  Backend sẽ thêm ?status=success hoặc ?status=failed vào returnUrl');
    
    // Call createAppointment API which returns VNPay payment URL
    const response = await appointmentAPI.createAppointment(paymentData);
    
    console.log('💳 VNPay payment API response:', response);
    console.log('💳 Response status:', response?.status);
    console.log('💳 Response data:', response?.data);
    
    if (response.status && response.status.code === 200 && response.data) {
      return {
        success: true,
        paymentUrl: response.data,
        message: 'Payment URL generated successfully'
      };
    } else {
      console.error('❌ Invalid API response structure:', response);
      throw new Error(response.message || 'Invalid API response format');
    }
    
  } catch (error) {
    console.error('❌ VNPay payment creation failed:', error);
    console.error('❌ Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Nếu backend chưa có VNPay, tạm thời trả về mock URL để test
    if (error.response?.status === 404 || error.message?.includes('bookAppointment') || error.code === 'ERR_NETWORK' || error.code === 'ERR_FAILED') {
      console.warn('⚠️ Backend VNPay not available, using mock URL for testing');
      
      // Tạo mock VNPay URL với đầy đủ parameters
      // const mockParams = new URLSearchParams({
      //   vnp_Amount: (appointmentData.paymentAmount * 100).toString(), // VNPay cần amount * 100
      //   vnp_Command: 'pay',
      //   vnp_CreateDate: new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14),
      //   vnp_CurrCode: 'VND',
      //   vnp_IpAddr: '127.0.0.1',
      //   vnp_Locale: 'vn',
      //   vnp_Merchant: 'DEMO_MERCHANT', 
      //   vnp_OrderInfo: encodeURIComponent('Thanh toan lich hen HIV'),
      //   vnp_OrderType: 'other',
      //   vnp_ReturnUrl: encodeURIComponent(paymentData.returnUrl), // Sử dụng simple returnUrl
      //   vnp_TmnCode: 'DEMO_TMN',
      //   vnp_TxnRef: appointmentData.transactionRef,
      //   vnp_Version: '2.1.0',
      //   vnp_SecureHash: 'mock_hash_for_testing'
      // });
      
      // const mockVNPayURL = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${mockParams.toString()}`;
      
      // console.log('🧪 Generated mock VNPay URL:', mockVNPayURL);
      
      // return {
      //   success: true,
      //   paymentUrl: mockVNPayURL,
      //   message: 'Mock payment URL generated for testing (backend not available)'
      // };
    }
    
    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra khi tạo thanh toán VNPay',
      message: 'Payment creation failed'
    };
  }
};

/**
 * Check VNPay payment status from callback parameters
 * @param {Object} callbackParams - URL parameters from VNPay callback
 * @returns {Object} Payment status result
 */
export const processVNPayCallback = (callbackParams) => {
  try {
    console.log('🔍 Processing VNPay callback:', callbackParams);
    
    const {
      vnp_ResponseCode,
      vnp_TxnRef,
      vnp_Amount,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_BankCode,
      vnp_TransactionNo,
      vnp_SecureHash
    } = callbackParams;
    
    // Validate required parameters
    if (!vnp_ResponseCode || !vnp_TxnRef) {
      throw new Error('Missing required payment parameters');
    }
    
    const isSuccess = vnp_ResponseCode === VNPAY_RESPONSE_CODES.SUCCESS;
    const message = getVNPayMessage(vnp_ResponseCode);
    
    const result = {
      success: isSuccess,
      responseCode: vnp_ResponseCode,
      transactionRef: vnp_TxnRef,
      amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0, // VNPay returns amount * 100
      orderInfo: vnp_OrderInfo,
      payDate: vnp_PayDate,
      bankCode: vnp_BankCode,
      transactionNo: vnp_TransactionNo,
      secureHash: vnp_SecureHash,
      message: message
    };
    
    console.log('✅ VNPay callback processed:', result);
    
    return result;
    
  } catch (error) {
    console.error('❌ VNPay callback processing failed:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
    };
  }
};

/**
 * Store temporary appointment data in localStorage
 * @param {Object} appointmentData - Appointment data to store
 * @param {string} transactionRef - Transaction reference
 */
export const storeTempAppointmentData = (appointmentData, transactionRef) => {
  try {
    const tempData = {
      appointmentData,
      transactionRef,
      timestamp: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes expiry
    };
    
    localStorage.setItem('tempAppointmentData', JSON.stringify(tempData));
    console.log('💾 Stored temporary appointment data:', tempData);
    
  } catch (error) {
    console.error('❌ Failed to store temporary appointment data:', error);
  }
};

/**
 * Retrieve temporary appointment data from localStorage
 * @param {string} transactionRef - Transaction reference to match
 * @returns {Object|null} Stored appointment data or null
 */
export const getTempAppointmentData = (transactionRef) => {
  try {
    const stored = localStorage.getItem('tempAppointmentData');
    if (!stored) return null;
    
    const tempData = JSON.parse(stored);
    
    // Check if data has expired
    if (new Date() > new Date(tempData.expiryTime)) {
      localStorage.removeItem('tempAppointmentData');
      console.log('⏰ Temporary appointment data expired');
      return null;
    }
    
    // Check if transaction ref matches
    if (tempData.transactionRef !== transactionRef) {
      console.log('🔄 Transaction ref mismatch');
      return null;
    }
    
    console.log('📦 Retrieved temporary appointment data:', tempData);
    return tempData.appointmentData;
    
  } catch (error) {
    console.error('❌ Failed to retrieve temporary appointment data:', error);
    return null;
  }
};

/**
 * Clear temporary appointment data from localStorage
 */
export const clearTempAppointmentData = () => {
  try {
    localStorage.removeItem('tempAppointmentData');
    console.log('🧹 Cleared temporary appointment data');
  } catch (error) {
    console.error('❌ Failed to clear temporary appointment data:', error);
  }
};

/**
 * Create final appointment after successful payment
 * @param {Object} appointmentData - Appointment data
 * @param {Object} paymentResult - Payment result from VNPay
 * @returns {Promise<Object>} Appointment creation result
 */
export const createAppointmentAfterPayment = async (appointmentData, paymentResult) => {
  try {
    console.log('📝 Creating appointment after successful payment');
    
    // Prepare final appointment data with payment info
    const finalAppointmentData = {
      ...appointmentData,
      paymentStatus: 'completed',
      paymentTransactionId: paymentResult.transactionNo,
      paymentTransactionRef: paymentResult.transactionRef,
      paymentDate: paymentResult.payDate,
      paymentBankCode: paymentResult.bankCode,
      paymentAmount: paymentResult.amount
    };
    
    // This would typically call a different API endpoint for final appointment creation
    // For now, we'll use the existing appointment API structure
    const response = await appointmentAPI.createAppointment(finalAppointmentData);
    
    if (response.success) {
      console.log('✅ Appointment created successfully after payment');
      return {
        success: true,
        appointmentId: response.data?.id,
        message: 'Đặt lịch thành công sau thanh toán'
      };
    } else {
      throw new Error(response.message || 'Failed to create appointment');
    }
    
  } catch (error) {
    console.error('❌ Failed to create appointment after payment:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Có lỗi xảy ra khi tạo lịch hẹn sau thanh toán'
    };
  }
};

const paymentService = {
  createVNPayPayment,
  processVNPayCallback,
  storeTempAppointmentData,
  getTempAppointmentData,
  clearTempAppointmentData,
  createAppointmentAfterPayment,
  VNPAY_RESPONSE_CODES,
  getVNPayMessage
};

export default paymentService;
