import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Cấu hình base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // KHÔNG set Content-Type mặc định ở đây
});

// Request interceptor để thêm token và xử lý FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: Log token info for medical result updates
      if (config.url && config.url.includes('medical-result/update')) {
        console.log('=== DEBUG Request Interceptor ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
        console.log('Token exists:', !!token);
        console.log('Token preview:', token ? `${token.substring(0, 50)}...` : 'NO TOKEN');
      }
    } else {
      console.warn('No token found in localStorage for API request:', config.url);
    }

    // FIX: Xử lý Content-Type linh hoạt
    // Nếu data là FormData, để trình duyệt tự set Content-Type (multipart/form-data)
    if (config.data instanceof FormData) {
      // Không làm gì cả, để header Content-Type trống
      delete config.headers['Content-Type'];
    } else {
      // Đối với các request khác, set Content-Type là application/json
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Log header cuối cùng trước khi gửi
    if (config.url && config.url.includes('medical-result/update')) {
        console.log('Final Headers:', config.headers);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    // Debug: Log successful responses for medical result updates
    if (response.config.url && response.config.url.includes('medical-result/update')) {
      console.log('=== DEBUG Response Interceptor Success ===');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
    }
    return response;
  },
  (error) => {
    console.log('=== DEBUG Response Interceptor Error ===');
    console.log('API Error:', error);
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Response Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - Token may be expired');
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.error('403 Forbidden - Access denied. Check user permissions and token validity');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Đăng ký
  register: async (userData) => {
    try {
      console.log('Calling register API with data:', userData);
      
      // Đảm bảo format ngày đúng (YYYY-MM-DD)
      let formattedBirthdate = userData.birthdate;
      if (userData.birthdate) {
        const date = new Date(userData.birthdate);
        formattedBirthdate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      
      const requestData = {
        email: userData.email,
        password: userData.password,
        fullName: userData.name || userData.fullName,
        phoneNumber: userData.phone || userData.phoneNumber,
        birthdate: formattedBirthdate,
        gender: userData.gender
      };
      
      console.log('Request data with formatted birthdate:', requestData);
      
      const response = await api.post('/auth/register', requestData);
      
      console.log('Register API response:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Register API error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đăng ký';
      
      if (error.response?.status === 409) {
        errorMessage = 'Email này đã được sử dụng';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin đăng ký không hợp lệ';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      console.log('Calling login API with credentials:', credentials);
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('Login API response:', response.data);
      console.log('Full response object:', response);
      console.log('Response data keys:', response.data ? Object.keys(response.data) : 'No data');
      console.log('Response data.data keys:', response.data?.data ? Object.keys(response.data.data) : 'No data.data');
      
      // Backend Java trả về format: {status: {...}, data: {...}}
      let token = null;
      let userData = null;
      
      // Parse dữ liệu từ response
      if (response.data?.data) {
        // Nếu data là object chứa user info và token
        const data = response.data.data;
        console.log('API - Parsing data object:', data);
        
        // Token có thể nằm trong data hoặc response.data
        token = data.token || data.accessToken || response.data.token;
        
        // User data có thể là data object hoặc data.user
        userData = data.user || data;
        
        console.log('API - Extracted token:', token);
        console.log('API - Extracted userData:', userData);
      } else if (response.data?.token) {
        // Nếu token nằm trực tiếp trong response.data
        token = response.data.token;
        userData = response.data.user || response.data;
      }
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('API - Token saved to localStorage');
      } else {
        console.warn('API - Warning: No token found in response');
      }
      
      if (userData && Object.keys(userData).length > 1) {
        // Có user data thực sự (không chỉ token)
        console.log('API - Original userData from backend:', userData);
          // Đảm bảo userData có format đúng
        const userToSave = {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName || userData.name || userData.username,
          phoneNumber: userData.phoneNumber || userData.phone,
          role: userData.role_id || userData.role,
          ...userData
        };
        
        console.log('API - Processed userToSave:', userToSave);
        localStorage.setItem('user', JSON.stringify(userToSave));
      } else if (token) {
        // Chỉ có token, decode để lấy user info
        console.log('API - No user data, attempting to decode JWT token');
        try {
          // Decode JWT token (không verify signature, chỉ lấy payload)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const tokenPayload = JSON.parse(jsonPayload);
          console.log('API - Decoded token payload:', tokenPayload);
            // Tạo user object từ token payload
          const userFromToken = {
            id: tokenPayload.sub, // 'sub' là user ID trong trường hợp này
            email: tokenPayload.email || tokenPayload.username || tokenPayload.sub + '@example.com',
            fullName: tokenPayload.name || tokenPayload.fullName || tokenPayload.given_name || tokenPayload.preferred_username || 'User',
            phoneNumber: tokenPayload.phoneNumber || tokenPayload.phone_number,
            role: tokenPayload.role_id || tokenPayload.role || tokenPayload.authorities?.[0] || 'USER'
          };
          
          console.log('API - User info from token:', userFromToken);
          localStorage.setItem('user', JSON.stringify(userFromToken));
          userData = userFromToken; // Cập nhật userData để return
        } catch (decodeError) {
          console.error('API - Error decoding JWT token:', decodeError);
          // Fallback: tạo user object minimal
          userData = {
            email: 'User',
            fullName: 'User',
            role: 'USER'
          };
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        console.warn('API - Warning: No user data and no token found in response');
      }
      
      return {
        success: true,
        data: response.data,
        token: token,
        user: userData,
        message: 'Đăng nhập thành công'
      };
    } catch (error) {
      console.error('Login API error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không đúng';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin đăng nhập không hợp lệ';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Kiểm tra token có hợp lệ không
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Lấy thông tin user profile từ backend
  getUserProfile: async () => {
    try {
      console.log('Getting user profile...');
      const response = await api.get('/auth/me'); // hoặc /user/profile
      
      console.log('User profile response:', response.data);
        if (response.data?.data) {
        const userData = response.data.data;
        
        // Lưu user data đầy đủ
        const userToSave = {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName || userData.name,
          phoneNumber: userData.phoneNumber,
          role: userData.role_id || userData.role,
          ...userData
        };
        
        localStorage.setItem('user', JSON.stringify(userToSave));
        return { success: true, data: userToSave };
      }
      
      return { success: false, message: 'No user data found' };
    } catch (error) {
      console.error('Get user profile error:', error);
      
      // Thử endpoint khác
      try {
        console.log('Trying alternative endpoint /user/profile...');
        const response = await api.get('/user/profile');
          if (response.data?.data) {
          const userData = response.data.data;
          
          const userToSave = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName || userData.name,
            phoneNumber: userData.phoneNumber,
            role: userData.role_id || userData.role,
            ...userData
          };
          
          localStorage.setItem('user', JSON.stringify(userToSave));
          return { success: true, data: userToSave };
        }
      } catch (altError) {
        console.error('Alternative endpoint also failed:', altError);
      }
        return { 
        success: false, 
        message: 'Could not fetch user profile',
        error: error.response?.data || error.message 
      };
    }
  },

  // Đăng ký tài khoản doctor (chỉ staff có thể thực hiện)
  registerAsDoctor: async (doctorData) => {
    try {
      console.log('Calling registerAsDoctor API with data:', doctorData);
      const response = await api.post('/auth/registerAsDoctor', {
        email: doctorData.email,
        password: doctorData.password,
        fullName: doctorData.fullName,
        phoneNumber: doctorData.phoneNumber
      });
      
      console.log('RegisterAsDoctor API response:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Tạo tài khoản bác sĩ thành công'
      };
    } catch (error) {
      console.error('RegisterAsDoctor API error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi tạo tài khoản bác sĩ';
      
      if (error.response?.status === 409) {
        errorMessage = 'Email này đã được sử dụng';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin không hợp lệ';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Đăng nhập cho doctor
  loginAsDoctor: async (credentials) => {
    try {
      console.log('Calling loginAsDoctor API with credentials:', credentials);
      const response = await api.post('/auth/loginAsDoctor', {
        email: credentials.email,
        password: credentials.password
      });
        console.log('LoginAsDoctor API response:', response.data);
      console.log('Full response object:', response);
      console.log('Response data keys:', response.data ? Object.keys(response.data) : 'No data');
      
      // Parse dữ liệu từ response - thử nhiều format khác nhau
      let token = null;
      let userData = null;
      
      // Backend Java thường trả về format: {status: {...}, data: {...}}
      if (response.data?.data) {
        const data = response.data.data;
        console.log('LoginAsDoctor - Parsing data object:', data);
        
        // Token có thể nằm trong data hoặc response.data
        token = data.token || data.accessToken || response.data.token;
        
        // User data có thể là data object hoặc data.user
        userData = data.user || data;
        
        console.log('LoginAsDoctor - Extracted token:', token);
        console.log('LoginAsDoctor - Extracted userData:', userData);
      } else if (response.data?.token) {
        // Nếu token nằm trực tiếp trong response.data
        token = response.data.token;
        userData = response.data.user || response.data;
      } else {
        // Thử parse theo format khác
        console.log('LoginAsDoctor - Trying alternative parsing...');
        token = response.data?.accessToken || response.data?.jwt;
        userData = response.data;
      }
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('Doctor token saved to localStorage:', token);
      } else {
        console.warn('LoginAsDoctor - Warning: No token found in response');
        console.log('Available response fields:', Object.keys(response.data || {}));
      }
      
      if (userData && (typeof userData === 'object')) {
        console.log('LoginAsDoctor - Processing userData:', userData);
        
        // Đảm bảo userData có format đúng
        const userToSave = {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName || userData.name || userData.username,
          phoneNumber: userData.phoneNumber || userData.phone,
          role: userData.role || 'DOCTOR', // Đảm bảo role là DOCTOR
          ...userData
        };
        
        console.log('LoginAsDoctor - Final userToSave:', userToSave);
        localStorage.setItem('user', JSON.stringify(userToSave));
        
        return {
          success: true,
          data: userToSave,
          token: token,
          message: 'Đăng nhập thành công'
        };
      } else if (token) {
        // Có token nhưng không có user data, tạo user data cơ bản
        console.log('LoginAsDoctor - Creating basic user data from token');
        const basicUser = {
          email: credentials.email,
          role: 'DOCTOR',
          fullName: 'Doctor User'
        };
        
        localStorage.setItem('user', JSON.stringify(basicUser));
        
        return {
          success: true,
          data: basicUser,
          token: token,
          message: 'Đăng nhập thành công'
        };
      }
      
      console.error('LoginAsDoctor - Failed to parse response:', response.data);
      return {
        success: false,
        message: 'Không thể lấy thông tin người dùng từ server'
      };
    } catch (error) {
      console.error('LoginAsDoctor API error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';
      
      if (error.response?.status === 401) {
        errorMessage = 'Email hoặc mật khẩu không đúng';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin đăng nhập không hợp lệ';
      } else if (error.response?.status === 403) {
        errorMessage = 'Tài khoản không có quyền truy cập';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  }
};

// Appointment API
export const appointmentAPI = {
  // Tạo appointment mới (customer)
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment:', appointmentData);
      const response = await api.post('/appointment/bookAnAppointment', appointmentData);
      
      console.log('Create appointment response:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Đặt lịch hẹn thành công! Lịch hẹn đang chờ được duyệt.'
      };
    } catch (error) {
      console.error('Create appointment error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đặt lịch hẹn';
      
      if (error.response?.status === 400) {
        errorMessage = 'Thông tin đặt lịch không hợp lệ';
      } else if (error.response?.status === 409) {
        errorMessage = 'Khung giờ này đã được đặt, vui lòng chọn giờ khác';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
        return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy danh sách appointments của user (customer)
  getAppointmentsByUserId: async () => {
    try {
      console.log('Getting appointments by user ID...');
      const response = await api.get('/appointment/getAllAppointmentsByUserId');
      
      console.log('Get user appointments response:', response.data);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: 'Lấy danh sách lịch hẹn thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không có dữ liệu lịch hẹn',
        data: []
      };
    } catch (error) {
      console.error('Get user appointments error:', error);
      
      let errorMessage = 'Không thể lấy danh sách lịch hẹn';
      
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch hẹn nào';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Lấy danh sách appointments cần duyệt (staff)
  getPendingAppointments: async () => {
    try {
      console.log('Calling getPendingAppointments API...');
      
      // Thử các endpoint có thể có
      let response;
      try {
        // Thử endpoint 1: /appointment/pending
        response = await api.get('/appointment/pending?includeUser=true');
      } catch (error) {
        if (error.response?.status === 404) {
          try {
            // Thử endpoint 2: /appointment/status/pending
            console.log('Trying alternative endpoint: /appointment/status/pending');
            response = await api.get('/appointment/status/pending');
          } catch (error2) {
            if (error2.response?.status === 404) {
              try {
                // Thử endpoint 3: getAllAppointments với filter
                console.log('Trying alternative: getAllAppointments with filter');
                response = await api.get('/appointment/getAllAppointments?status=PENDING');
              } catch (error3) {
                // Nếu tất cả đều fail, throw error cuối
                throw error3;
              }
            } else {
              throw error2;
            }
          }
        } else {
          throw error;
        }
      }
      
      console.log('Get pending appointments response:', response.data);
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        message: 'Lấy danh sách lịch hẹn chờ duyệt thành công'
      };
    } catch (error) {
      console.error('Get pending appointments error:', error);
      
      let errorMessage = 'Không thể lấy danh sách lịch hẹn chờ duyệt';
      
      if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền truy cập danh sách này';
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để xem danh sách này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },
  // Duyệt appointment (staff)
  approveAppointment: async (appointmentId, approvalData) => {
    try {
      console.log('Approving appointment:', appointmentId, approvalData);
      const response = await api.put(`/appointment/${appointmentId}/approve`, approvalData);
      
      return {
        success: true,
        data: response.data,
        message: 'Duyệt lịch hẹn thành công! Lịch hẹn đã được thêm vào lịch làm việc của bác sĩ.'
      };
    } catch (error) {
      console.error('Approve appointment error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi duyệt lịch hẹn';
      
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch hẹn';
      } else if (error.response?.status === 409) {
        errorMessage = 'Lịch hẹn đã được duyệt hoặc từ chối trước đó';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },
  // Cập nhật appointment (staff) - sử dụng PATCH endpoint
  // Status values: PENDING, ACCEPTED, DENIED, COMPLETED
  updateAppointment: async (appointmentId, updateData) => {
    try {
      console.log('Updating appointment:', appointmentId, updateData);
      const response = await api.patch(`/appointment/${appointmentId}`, updateData);
      
      console.log('Update appointment response:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Cập nhật lịch hẹn thành công'
      };
    } catch (error) {
      console.error('Update appointment error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật lịch hẹn';
      
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch hẹn';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dữ liệu cập nhật không hợp lệ';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền cập nhật lịch hẹn này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Từ chối appointment (staff)
  rejectAppointment: async (appointmentId, rejectionData) => {
    try {
      console.log('Rejecting appointment:', appointmentId, rejectionData);
      const response = await api.put(`/appointment/${appointmentId}/reject`, rejectionData);
      
      return {
        success: true,
        data: response.data,
        message: 'Từ chối lịch hẹn thành công'
      };
    } catch (error) {
      console.error('Reject appointment error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi từ chối lịch hẹn';
      
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch hẹn';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy lịch hẹn của bác sĩ (doctor)
  getDoctorAppointments: async (doctorId, status = 'approved') => {
    try {
      const response = await api.get(`/appointment/doctor/${doctorId}?status=${status}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy lịch hẹn của bác sĩ thành công'
      };
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy lịch hẹn của bác sĩ',
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy lịch hẹn của customer (patient)
  getCustomerAppointments: async (customerId) => {
    try {
      const response = await api.get(`/appointment/customer/${customerId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy lịch hẹn của bệnh nhân thành công'
      };    } catch (error) {
      console.error('Get customer appointments error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy lịch hẹn của bệnh nhân',
        error: error.response?.data || error.message
      };
    }  },

  // Lấy tất cả appointments (staff)
  getAllAppointments: async () => {
    try {
      console.log('Calling getAllAppointments API...');
      // Try to include user data in the request
      const response = await api.get('/appointment/getAllAppointments?includeUser=true');
      
      console.log('Get all appointments response:', response.data);
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        message: 'Lấy danh sách tất cả lịch hẹn thành công'
      };
    } catch (error) {
      console.error('Get all appointments error:', error);
      
      let errorMessage = 'Không thể lấy danh sách lịch hẹn';
      
      if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền truy cập danh sách này';
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để xem danh sách này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
        data: []
      };
    }  },

  // Lấy chi tiết appointment theo ID
  getAppointmentById: async (appointmentId) => {
    try {
      console.log('Calling getAppointmentById API for ID:', appointmentId);
      const response = await api.get(`/appointment/${appointmentId}`);
      
      console.log('Get appointment by ID response:', response.data);
      
      return {
        success: true,
        data: response.data?.data || response.data || {},
        message: 'Lấy chi tiết lịch hẹn thành công'
      };
    } catch (error) {
      console.error('Get appointment by ID error:', error);
      
      let errorMessage = 'Không thể lấy chi tiết lịch hẹn';
      
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch hẹn';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền xem lịch hẹn này';
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để xem lịch hẹn này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
        data: {}
      };
    }
  },
  // Lấy appointments cho doctor (chỉ ACCEPTED)
  getDoctorAcceptedAppointments: async (doctorId) => {
    try {
      console.log('Getting accepted appointments for doctor:', doctorId);
      const result = await appointmentAPI.getAppointmentsByUserId(doctorId);
      
      if (result.success) {
        // Filter chỉ lấy appointments có status ACCEPTED
        const acceptedAppointments = (result.data || []).filter(appointment => {
          const status = appointment.status?.toUpperCase();
          return status === 'ACCEPTED';
        });
        
        console.log('Filtered accepted appointments:', acceptedAppointments);
        
        return {
          success: true,
          data: acceptedAppointments,
          message: 'Lấy danh sách lịch hẹn đã duyệt thành công'
        };
      }
      
      return result;
    } catch (error) {
      console.error('Get doctor accepted appointments error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy danh sách lịch hẹn của bác sĩ',
        error: error.message,
        data: []
      };
    }
  },

  // Lấy lịch hẹn được chấp nhận cho bác sĩ hiện tại (doctor) - API mới
  getAcceptedAppointmentsForDoctor: async () => {
    try {
      console.log('Calling getAcceptedAppointmentsForDoctor API...');
      const response = await api.get('/appointment/getAcceptedAppointmentsForAnDoctor');
      
      console.log('Get accepted appointments for doctor response:', response.data);
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        message: 'Lấy danh sách lịch hẹn của bác sĩ thành công'
      };
    } catch (error) {
      console.error('Get accepted appointments for doctor error:', error);
      
      let errorMessage = 'Không thể lấy danh sách lịch hẹn';
      
      if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền truy cập danh sách này';
      } else if (error.response?.status === 401) {
        errorMessage = 'Bạn cần đăng nhập để xem danh sách này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
        return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Lấy chi tiết appointment theo ID
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await api.get(`/appointment/${appointmentId}`);
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: 'Lấy chi tiết lịch hẹn thành công'
      };
    } catch (error) {
      console.error('Get appointment details error:', error);
      
      let errorMessage = 'Không thể lấy chi tiết lịch hẹn';
      
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy lịch hẹn';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền xem lịch hẹn này';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
        return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
        data: null
      };
    }
  },
  // Cập nhật trạng thái appointment
  updateAppointmentStatus: async (appointmentId, status) => {
    console.log('=== DEBUG: Starting appointment status update ===');
    console.log('Appointment ID:', appointmentId);
    console.log('New Status:', status);
    
    // List of possible API endpoints to try
    const endpoints = [
      {
        method: 'patch',
        url: `/appointment/updateStatus/${appointmentId}`,
        data: { status: status }
      },
      {
        method: 'patch',
        url: `/appointment/${appointmentId}/status`,
        data: { status: status }
      },
      {
        method: 'put',
        url: `/appointment/${appointmentId}/status`,
        data: { status: status }
      },
      {
        method: 'patch',
        url: `/appointment/${appointmentId}`,
        data: { status: status }
      },
      {
        method: 'put',
        url: `/appointment/${appointmentId}`,
        data: { status: status }
      },
      {
        method: 'post',
        url: `/appointment/${appointmentId}/complete`,
        data: { status: status }
      },
      {
        method: 'put',
        url: `/appointment/${appointmentId}/complete`,
        data: {}
      }
    ];
    
    let lastError = null;
    
    // Try each endpoint until one works
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      
      try {
        console.log(`=== ATTEMPT ${i + 1}: Trying ${endpoint.method.toUpperCase()} ${endpoint.url} ===`);
        
        let response;
        if (endpoint.method === 'patch') {
          response = await api.patch(endpoint.url, endpoint.data);
        } else if (endpoint.method === 'put') {
          response = await api.put(endpoint.url, endpoint.data);
        } else if (endpoint.method === 'post') {
          response = await api.post(endpoint.url, endpoint.data);
        }
        
        console.log('✅ SUCCESS: Update appointment status response:', response.data);
        
        return {
          success: true,
          data: response.data?.data || response.data,
          message: `Cập nhật trạng thái lịch hẹn thành ${status} thành công`,
          endpoint: `${endpoint.method.toUpperCase()} ${endpoint.url}` // For debugging
        };
        
      } catch (error) {
        console.warn(`❌ ATTEMPT ${i + 1} FAILED: ${endpoint.method.toUpperCase()} ${endpoint.url}`);
        console.warn('Error:', error.response?.status, error.response?.statusText || error.message);
        
        lastError = error;
        
        // If it's a 404 or network error, try next endpoint
        if (error.code === 'ERR_NETWORK' || 
            error.response?.status === 404 || 
            error.response?.status === 405) { // Method not allowed
          continue;
        }
        
        // If it's a different error (403, 401, etc.), it means the endpoint exists
        // but there's a permission or data issue, so don't try other endpoints
        if (error.response?.status === 403) {
          console.error('❌ CRITICAL: 403 Forbidden - Permission denied');
          return {
            success: false,
            message: 'Bạn không có quyền cập nhật lịch hẹn này',
            error: error.response?.data || error.message,
            data: null
          };
        }
        
        if (error.response?.status === 401) {
          console.error('❌ CRITICAL: 401 Unauthorized - Token invalid');
          return {
            success: false,
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
            error: error.response?.data || error.message,
            data: null
          };
        }
        
        // For other errors, also break to avoid unnecessary attempts
        if (error.response?.status && error.response.status !== 404 && error.response.status !== 405) {
          break;
        }
      }
    }
    
    // All attempts failed
    console.error('❌ ALL ATTEMPTS FAILED: Could not update appointment status');
    console.error('Last error:', lastError);
    
    let errorMessage = 'Không thể cập nhật trạng thái lịch hẹn';
    
    if (lastError?.code === 'ERR_NETWORK') {
      errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
    } else if (lastError?.response?.status === 404) {
      errorMessage = 'API endpoint không tồn tại. Vui lòng liên hệ admin để kiểm tra cấu hình backend.';
    } else if (lastError?.response?.data?.message) {
      errorMessage = lastError.response.data.message;
    }
    
    return {
      success: false,
      message: errorMessage,
      error: lastError?.response?.data || lastError?.message || 'Unknown error',
      data: null,
      attemptsLog: endpoints.map((ep, i) => `${i + 1}. ${ep.method.toUpperCase()} ${ep.url}`)
    };
  }
};

// Slot API
export const slotAPI = {
  // Lấy tất cả slots (endpoint cũ)
  getAllSlots: async () => {
    try {
      console.log('Getting all slots...');
      const response = await api.get('/slot-entity/getAllSlotEntity');
      
      console.log('Get slots response:', response.data);
      
      if (response.data?.data) {
        return {
          success: true,
          data: response.data.data,
          message: 'Lấy danh sách slots thành công'
        };
      }
      
      return {
        success: false,
        message: 'Không có dữ liệu slots',
        data: []
      };
    } catch (error) {
      console.error('Get slots error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy danh sách slots',
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Lấy các slot thời gian có sẵn
  getAvailableSlots: async (date, doctorId) => {
    try {
      console.log('Getting available slots for date:', date, 'doctor:', doctorId);
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (doctorId) params.append('doctorId', doctorId);
      
      const response = await api.get(`/slots/available?${params.toString()}`);
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        message: 'Lấy danh sách slot thành công'
      };
    } catch (error) {
      console.error('Get available slots error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy danh sách slot thời gian',
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Lấy slot trống theo doctorId và date (API mới)
  getAvailableSlotsByDoctorAndDate: async (doctorId, date) => {
    try {
      console.log('Calling getAvailableSlotsByDoctorAndDate API with:', { doctorId, date });
      const response = await api.get(`/slot-entity/getAllSlotEntity/${doctorId}?date=${date}`);
      
      console.log('Get available slots response:', response.data);
      
      if (response.data?.status?.code === 200) {
        return {
          success: true,
          data: response.data.data || [],
          message: 'Lấy danh sách slot trống thành công'
        };
      } else {
        return {
          success: false,
          data: [],
          message: 'Không thể lấy danh sách slot'
        };
      }
    } catch (error) {
      console.error('Get available slots error:', error);
      return {
        success: false,
        data: [],
        message: 'Không thể lấy danh sách slot trống',
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy chi tiết slot theo ID
  getSlotById: async (slotId) => {
    try {
      const response = await api.get(`/slots/${slotId}`);
      
      return {
        success: true,
        data: response.data?.data || response.data || {},
        message: 'Lấy chi tiết slot thành công'
      };
    } catch (error) {
      console.error('Get slot by ID error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy chi tiết slot',
        error: error.response?.data || error.message,
        data: {}
      };
    }
  }
};

// Doctor API
export const doctorAPI = {
  // Lấy danh sách bác sĩ
  getAllDoctors: async () => {
    try {
      console.log('Getting all doctors...');
      // Thử endpoint cũ trước
      let response;
      try {
        response = await api.get('/doctor/getAllDoctors');
      } catch (error) {
        if (error.response?.status === 404) {
          // Nếu endpoint cũ không có, thử endpoint mới
          response = await api.get('/doctors');
        } else {
          throw error;
        }
      }
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        message: 'Lấy danh sách bác sĩ thành công'
      };
    } catch (error) {
      console.error('Get all doctors error:', error);
      return {
        success: false,
        message: 'Không thể lấy danh sách bác sĩ',
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Lấy chi tiết bác sĩ theo ID
  getDoctorById: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      
      return {
        success: true,
        data: response.data?.data || response.data || {},
        message: 'Lấy chi tiết bác sĩ thành công'
      };
    } catch (error) {
      console.error('Get doctor by ID error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy chi tiết bác sĩ',
        error: error.response?.data || error.message,
        data: {}
      };
    }
  },

  // Lấy danh sách bác sĩ theo chuyên khoa
  getDoctorsBySpecialty: async (specialty) => {
    try {
      const response = await api.get(`/doctors/specialty/${specialty}`);
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        message: 'Lấy danh sách bác sĩ theo chuyên khoa thành công'
      };
    } catch (error) {
      console.error('Get doctors by specialty error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy danh sách bác sĩ theo chuyên khoa',
        error: error.response?.data || error.message,
        data: []
      };
    }
  },

  // Lấy lịch làm việc của bác sĩ
  getDoctorSchedule: async (doctorId, date) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      
      const response = await api.get(`/doctors/${doctorId}/schedule?${params.toString()}`);
      
      return {
        success: true,
        data: response.data?.data || response.data || {},
        message: 'Lấy lịch làm việc bác sĩ thành công'
      };
    } catch (error) {
      console.error('Get doctor schedule error:', error);
      
      return {
        success: false,
        message: 'Không thể lấy lịch làm việc bác sĩ',
        error: error.response?.data || error.message,
        data: {}
      };
    }
  }
};

// User API
export const userAPI = {
  // Lấy thông tin user theo ID
  getUserById: async (userId) => {
    try {
      console.log('Getting user by ID:', userId);
      const response = await api.get(`/users/${userId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin người dùng thành công'
      };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin người dùng',
        error: error.response?.data
      };
    }
  },

  // Lấy thông tin customer theo ID
  getCustomerById: async (customerId) => {
    try {
      console.log('Getting customer by ID:', customerId);
      const response = await api.get(`/customers/${customerId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin khách hàng thành công'
      };
    } catch (error) {
      console.error('Get customer by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin khách hàng',
        error: error.response?.data
      };
    }  }
};

// Medical Result API
export const medicalResultAPI = {  // Tạo medical result cho appointment
  createMedicalResult: async (appointmentId) => {
    try {
      console.log('=== DEBUG CREATE MEDICAL RESULT ===');
      console.log('Creating medical result for appointment:', appointmentId);
      console.log('Appointment ID type:', typeof appointmentId);
      console.log('Appointment ID length:', appointmentId?.length);
      
      // Get doctor ID from token to ensure proper ownership
      const token = localStorage.getItem('token');
      let doctorId = null;
      if (token) {
        try {
          const tokenPayload = jwtDecode(token);
          doctorId = tokenPayload?.sub;
          console.log('Doctor ID from token for creation:', doctorId);
        } catch (error) {
          console.error('Error extracting doctorId from token:', error);
        }
      }
      
      // Send doctor ID in request body to ensure proper ownership
      const requestBody = doctorId ? { doctorId } : {};
      console.log('Request body:', requestBody);
        const endpoint = `/medical-result/create-MedicalResult/${appointmentId}`;
      console.log('API Base URL:', api.defaults.baseURL);
      console.log('Full endpoint URL:', `${api.defaults.baseURL}${endpoint}`);
      console.log('Making POST request to:', endpoint);
      
      // Log current API configuration
      console.log('API Config:', {
        baseURL: api.defaults.baseURL,
        timeout: api.defaults.timeout,
        headers: api.defaults.headers
      });
      
      const response = await api.post(endpoint, requestBody);
      console.log('✅ Create medical result response:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Tạo báo cáo y tế thành công'
      };
    } catch (error) {
      console.error('❌ Error creating medical result:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`
      });
      
      if (error.response?.status === 404) {
        console.error('🚫 404 ERROR: Endpoint not found');
        console.error('Possible issues:');
        console.error('1. Backend endpoint URL is different');
        console.error('2. Appointment ID format is invalid');
        console.error('3. Backend server is not running');
        console.error('4. API route is not registered');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo báo cáo y tế',
        error: error.response?.data
      };
    }
  },

  // Lấy medical result theo ID - sử dụng endpoint chính thức
  getMedicalResult: async (medicalResultId) => {
    try {
      console.log('🔍 Getting medical result with ID:', medicalResultId);
      console.log('🔍 medicalResultId type:', typeof medicalResultId);
      console.log('🔍 API endpoint:', `/medical-result/getMedicalResult/${medicalResultId}`);
      
      // Sử dụng POST method theo API documentation
      const response = await api.post(`/medical-result/getMedicalResult/${medicalResultId}`);
      
      console.log('✅ Medical result API response:', response.data);
      console.log('✅ Response status:', response.status);
      console.log('✅ Response structure:', Object.keys(response.data || {}));
      
      // Xử lý data từ response
      let resultData = null;
      if (response.data) {
        // Thử các cấu trúc response khác nhau
        resultData = response.data.data || response.data.result || response.data;
        console.log('📋 Extracted result data:', resultData);
        
        // Log cấu trúc của data để debug
        if (resultData && typeof resultData === 'object') {
          console.log('📋 Result data keys:', Object.keys(resultData));
        }
      }
      
      return {
        success: true,
        data: resultData,
        message: response.data.message || 'Lấy thông tin báo cáo y tế thành công'
      };
    } catch (error) {
      console.error('❌ Error getting medical result:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Status Text:', error.response?.statusText);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Error config URL:', error.config?.url);
      
      let errorMessage = 'Không thể lấy thông tin báo cáo y tế';
      
      // Xử lý các loại lỗi cụ thể
      if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy kết quả xét nghiệm';
      } else if (error.response?.status === 401) {
        errorMessage = 'Không có quyền truy cập kết quả xét nghiệm';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server khi tải kết quả xét nghiệm';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data,
        status: error.response?.status
      };
    }
  },  // Cập nhật medical result
  updateMedicalResult: async (medicalResultId, medicalData) => {
    try {
      // ========= COMPREHENSIVE TOKEN AND HEADER DEBUGGING =========
      console.log('=== API LAYER TOKEN DEBUGGING ===');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found in localStorage');
        throw new Error('Authentication required - no token found');
      }
      
      console.log('📋 Token present in API call:', !!token);
      console.log('📋 Token length:', token.length);
      console.log('📋 Token first 50 chars:', token.substring(0, 50) + '...');
      
      // Decode and check token in API layer too
      let apiTokenPayload = null;
      try {
        const jwtDecode = require('jwt-decode').default || require('jwt-decode');
        apiTokenPayload = jwtDecode(token);
        console.log('🔍 API Layer - Token payload:', JSON.stringify(apiTokenPayload, null, 2));
        
        const roles = apiTokenPayload?.roles || apiTokenPayload?.authorities || [];
        const hasDoctor = Array.isArray(roles) ? 
          roles.some(r => (typeof r === 'string' ? r : r?.authority)?.includes('DOCTOR')) :
          roles?.toString().includes('DOCTOR');
        
        console.log('🎯 API Layer - DOCTOR role check:', hasDoctor);
        console.log('🎯 API Layer - All roles/authorities:', roles);
        
        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        const exp = apiTokenPayload?.exp;
        console.log('⏰ Token expiry check:');
        console.log('- Token exp:', exp ? new Date(exp * 1000) : 'Not found');
        console.log('- Current time:', new Date(now * 1000));
        console.log('- Is expired:', exp && exp < now);
        
      } catch (decodeError) {
        console.error('❌ API Layer - Error decoding token:', decodeError);
      }
      
      console.log('=== END API TOKEN DEBUGGING ===');
      // ========= END TOKEN DEBUGGING =========

      console.log('=== DEBUG updateMedicalResult API ===');
      console.log('Medical Result ID:', medicalResultId);
      console.log('Medical Data:', JSON.stringify(medicalData, null, 2));      // Debug token and headers
      console.log('Token in API call:', token ? `${token.substring(0, 50)}...` : 'NO TOKEN');        // ============ FORMDATA WITH INDIVIDUAL FIELDS ============
      console.log('=== CREATING FORMDATA WITH INDIVIDUAL FIELDS ===');
        const formData = new FormData();
      
      // Backend expects @RequestPart("data") as a JSON object
      const dataObj = {
        doctorId: medicalData.doctorId || '',
        weight: medicalData.weight || '',
        height: medicalData.height || '',
        bmi: medicalData.bmi || '',
        temperature: medicalData.temperature || '',
        bloodPressure: medicalData.bloodPressure || '',
        heartRate: medicalData.heartRate || '',
        cd4Count: medicalData.cd4Count || '',
        viralLoad: medicalData.viralLoad || '',
        hemoglobin: medicalData.hemoglobin || '',
        whiteBloodCell: medicalData.whiteBloodCell || '',
        platelets: medicalData.platelets || '',
        glucose: medicalData.glucose || '',
        creatinine: medicalData.creatinine || '',
        alt: medicalData.alt || '',
        ast: medicalData.ast || '',
        totalCholesterol: medicalData.totalCholesterol || '',
        ldl: medicalData.ldl || '',
        hdl: medicalData.hdl || '',
        trigilycerides: medicalData.trigilycerides || '',
        patientProgressEvaluation: medicalData.patientProgressEvaluation || '',
        plan: medicalData.plan || '',
        recommendation: medicalData.recommendation || '',        medicalResultMedicines: medicalData.medicalResultMedicines && Array.isArray(medicalData.medicalResultMedicines) 
          ? medicalData.medicalResultMedicines.map(med => {
              // Ensure proper medicine structure for API
              const apiMedicine = {
                medicineId: med.medicineId || med.id,
                name: med.name || med.medicineName, // Use name or medicineName
                dosage: med.dosage || '',
                status: med.status || 'Mới'
              };
              console.log('🔄 API: Mapping medicine for update:', med, '→', apiMedicine);
              return apiMedicine;
            })
          : [],
        arvMetadata: medicalData.arvMetadata || null // Include ARV metadata for later PDF recreation
      };
      
      // Send data as JSON blob under "data" key (matching @RequestPart("data"))
      const dataBlob = new Blob([JSON.stringify(dataObj)], { type: 'application/json' });
      formData.append('data', dataBlob);
      
      console.log('=== FormData Data Object ===');
      console.log('Data object being sent:', JSON.stringify(dataObj, null, 2));        // Add ARV file if present - BACKEND EXPECTS "arvRegimenResultURL"
      if (medicalData.arvFile) {
        console.log('📎 ARV file data received:', medicalData.arvFile);
        
        // Handle different ARV file formats
        if (medicalData.arvFile instanceof File) {
          // Standard File object
          console.log('✅ Adding standard File object:', medicalData.arvFile.name);
          formData.append('arvRegimenResultURL', medicalData.arvFile);
        } else if (medicalData.arvFile.data && medicalData.arvFile.name) {
          // Custom file object from ARV Selection Tool (with base64 data)
          console.log('✅ Adding custom ARV file object:', medicalData.arvFile.name);
          
          try {
            // Convert base64 data to Blob
            const base64Data = medicalData.arvFile.data;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: medicalData.arvFile.type || 'application/pdf' });
            const file = new File([blob], medicalData.arvFile.name, { type: medicalData.arvFile.type || 'application/pdf' });
            
            console.log('📎 Converted ARV file:', file.name, file.size, 'bytes');
            formData.append('arvRegimenResultURL', file);
          } catch (conversionError) {
            console.error('❌ Error converting ARV file data:', conversionError);
            console.log('⚠️ ARV file will not be uploaded due to conversion error');
          }
        } else {
          console.warn('⚠️ Invalid ARV file format:', medicalData.arvFile);
        }
      } else {
        console.log('📎 No ARV file to upload');
      }
      
      // Debug log all FormData entries
      console.log('=== FormData Individual Entries ===');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: "${value}"`);
        }
      }
      
      // Send as FormData (browser automatically sets multipart/form-data with boundary)
      const response = await api.patch(`/medical-result/update-MedicalResult/${medicalResultId}`, formData);
      
      console.log('=== DEBUG API Response Success ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Cập nhật báo cáo y tế thành công'
      };    } catch (error) {
      console.error('=== DEBUG API Error ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      console.error('Full error object:', error);
      
      // Kiểm tra nếu là lỗi 403
      if (error.response?.status === 403) {
        return {
          success: false,
          message: 'Lỗi 403: Không có quyền cập nhật báo cáo y tế này',
          error: '403 Forbidden - Access denied',
          is403: true
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật báo cáo y tế',
        error: error.response?.data || error.message
      };
    }
  }
};

// Medicine APIs
export const medicineAPI = {
  // Lấy tất cả thuốc
  getAllMedicines: async () => {
    try {
      console.log('=== DEBUG getAllMedicines API ===');
      
      const response = await api.get('/medicine/getAllMedicine');
      
      console.log('=== DEBUG getAllMedicines Success ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Lấy danh sách thuốc thành công'
      };
    } catch (error) {
      console.error('=== DEBUG getAllMedicines Error ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách thuốc',
        error: error.response?.data,
        data: []
      };
    }
  },

  // Tạo thuốc mới
  createMedicine: async (medicineData) => {
    try {
      console.log('=== DEBUG createMedicine API ===');
      console.log('Medicine Data:', medicineData);
      
      const response = await api.post('/medicine/create', medicineData);
      
      console.log('=== DEBUG createMedicine Success ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Tạo thuốc mới thành công'
      };
    } catch (error) {
      console.error('=== DEBUG createMedicine Error ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo thuốc mới',
        error: error.response?.data
      };
    }
  }
};

export default api;
