import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra authentication status khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = authAPI.getCurrentUser();
    
    console.log('AuthContext - useEffect - token:', token);
    console.log('AuthContext - useEffect - savedUser:', savedUser);
    
    if (token && savedUser) {
      // Đảm bảo token được lưu trong user object
      const userWithToken = {
        ...savedUser,
        token: token
      };
      console.log('AuthContext - Setting user from localStorage:', userWithToken);
      setUser(userWithToken);
      setIsAuthenticated(true);
    } else {
      console.log('AuthContext - No valid token or user found in localStorage');
    }
  }, []);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Registering user...', userData);
      const result = await authAPI.register(userData);
      
      console.log('AuthContext: Register result:', result);
      
      if (result.success) {
        // Lưu thông tin đăng ký vào localStorage để auto-fill sau này
        const registrationInfo = {
          email: userData.email,
          fullName: userData.name || userData.fullName,
          phoneNumber: userData.phone || userData.phoneNumber,
          birthdate: userData.birthdate,
          gender: userData.gender
        };
        localStorage.setItem('registrationInfo', JSON.stringify(registrationInfo));
        console.log('AuthContext: Saved registration info for auto-fill:', registrationInfo);
        
        // Backend Java không auto-login sau register
        // Chỉ trả về success để redirect tới login page
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      console.error('AuthContext: Register error:', error);
      const errorMessage = 'Đã xảy ra lỗi không mong muốn';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Logging in user...', credentials);
      const result = await authAPI.login(credentials);
      
      console.log('AuthContext: Login result:', result);
      
      if (!result.success) {
        const errorMessage = result.message || 'Đăng nhập thất bại';
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      }
      
      // Ưu tiên sử dụng user data từ API service đã process
      let userData = result.user;
      
      // Nếu không có, fallback về cách parse cũ
      if (!userData && result.data) {
        if (result.data.data?.user) {
          userData = result.data.data.user;
        } else if (result.data.data) {
          userData = result.data.data;
        } else if (result.data.user) {
          userData = result.data.user;
        } else {
          userData = result.data;
        }
      }
      
      console.log('AuthContext - Raw userData from login result:', userData);
      
      if (userData) {
        // Debug: log tất cả properties
        console.log('AuthContext - All userData properties:', Object.keys(userData));
        
        // Lấy thông tin đăng ký đã lưu (nếu có) để bổ sung
        const savedRegistrationInfo = localStorage.getItem('registrationInfo');
        let registrationData = {};
        if (savedRegistrationInfo) {
          try {
            registrationData = JSON.parse(savedRegistrationInfo);
            console.log('AuthContext - Found saved registration info:', registrationData);
          } catch (e) {
            console.warn('AuthContext - Failed to parse registration info:', e);
          }
        }
        
        // Đảm bảo userData có đầy đủ thông tin và ưu tiên role_id
        const processedUser = {
          id: userData?.id,
          email: userData?.email,
          fullName: userData?.fullName || userData?.doctorName || userData?.name || userData?.username || userData?.displayName || registrationData?.fullName,
          name: userData?.name || userData?.doctorName || userData?.fullName || registrationData?.fullName,
          phoneNumber: userData?.phoneNumber || userData?.phone || registrationData?.phoneNumber,
          birthdate: userData?.birthdate || userData?.dob || userData?.dateOfBirth || registrationData?.birthdate,
          gender: userData?.gender || userData?.sex || registrationData?.gender,
          role: userData?.role_id || userData?.role, // Ưu tiên role_id
          role_id: userData?.role_id, // Giữ lại role_id gốc
          token: result.token, // Lưu token để có thể decode thông tin
          ...userData // Spread tất cả properties gốc để không mất dữ liệu
        };
        
        console.log('AuthContext - Setting user:', processedUser);
        setUser(processedUser);
        setIsAuthenticated(true);
        
        // Xóa thông tin đăng ký đã lưu sau khi merge thành công
        if (savedRegistrationInfo) {
          localStorage.removeItem('registrationInfo');
          console.log('AuthContext - Cleaned up registration info after successful merge');
        }
        
        return {
          success: true,
          data: processedUser,
          message: 'Đăng nhập thành công'
        };
      } else {
        console.warn('AuthContext - Warning: No user data available after login');
        const errorMessage = 'Không thể lấy thông tin người dùng';
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi đăng nhập';
      
      if (error.response?.status === 401) {
        errorMessage = 'Sai tài khoản hoặc mật khẩu';
      } else if (error.response?.status === 400) {
        errorMessage = 'Thông tin đăng nhập không hợp lệ';
      } else if (error.response?.status === 403) {
        errorMessage = 'Tài khoản không có quyền truy cập';
      } else if (error.response?.data?.message) {
        // Kiểm tra các trường hợp lỗi cụ thể từ backend
        const backendMessage = error.response.data.message.toLowerCase();
        if (backendMessage.includes('password') || backendMessage.includes('mật khẩu')) {
          errorMessage = 'Sai tài khoản hoặc mật khẩu';
        } else if (backendMessage.includes('email') || backendMessage.includes('not found')) {
          errorMessage = 'Sai tài khoản hoặc mật khẩu';
        } else if (backendMessage.includes('locked') || backendMessage.includes('khóa')) {
          errorMessage = 'Tài khoản đã bị khóa';
        } else if (backendMessage.includes('authentication')) {
          errorMessage = 'Sai tài khoản hoặc mật khẩu';
        } else if (backendMessage.includes('exception')) {
          errorMessage = 'Sai tài khoản hoặc mật khẩu';
        } else {
          errorMessage = 'Sai tài khoản hoặc mật khẩu';
        }
      }
      
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Update user and auth status manually (for special cases like doctor login)
  const updateUserAuth = (userData, authStatus = true) => {
    console.log('AuthContext - Manual user update:', userData);
    setUser(userData);
    setIsAuthenticated(authStatus);
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError,
    updateUserAuth,
    setUser,
    setIsAuthenticated,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 