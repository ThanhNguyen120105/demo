import axios from 'axios';

// Cấu hình base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('API Error:', error);
    
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
      const response = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        fullName: userData.name || userData.fullName,
        phoneNumber: userData.phone || userData.phoneNumber
      });
      
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
  }
};

// Slot API
export const slotAPI = {
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
      const response = await api.get('/doctors');
      
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

export default api;
