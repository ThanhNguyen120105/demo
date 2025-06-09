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
          role: userData.role,
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
            role: tokenPayload.role || tokenPayload.authorities?.[0] || 'USER'
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
          role: userData.role,
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
            role: userData.role,
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
  }
};

export default api; 