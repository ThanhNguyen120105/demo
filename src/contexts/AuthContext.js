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
      setUser(userWithToken);
      setIsAuthenticated(true);
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
      
      if (result.success) {
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
            // Đảm bảo userData có đầy đủ thông tin và ưu tiên role_id
          const processedUser = {
            id: userData?.id,
            email: userData?.email,
            fullName: userData?.fullName || userData?.doctorName || userData?.name || userData?.username || userData?.displayName,
            name: userData?.name || userData?.doctorName || userData?.fullName,
            phoneNumber: userData?.phoneNumber || userData?.phone,
            role: userData?.role_id || userData?.role, // Ưu tiên role_id
            role_id: userData?.role_id, // Giữ lại role_id gốc
            token: result.token, // Lưu token để có thể decode thông tin
            ...userData // Spread tất cả properties gốc để không mất dữ liệu
          };
          
          console.log('AuthContext - Setting user:', processedUser);
          setUser(processedUser);
          setIsAuthenticated(true);
          
          // Tạm thời tắt getUserProfile vì backend chưa hỗ trợ
          // TODO: Bật lại khi backend có API lấy user profile
          /*
          console.log('AuthContext - Attempting to fetch full user profile...');
          authAPI.getUserProfile().then(profileResult => {
            if (profileResult.success && profileResult.data) {
              console.log('AuthContext - Got full user profile:', profileResult.data);
              setUser(profileResult.data);
            } else {
              console.log('AuthContext - Could not fetch full profile, keeping current user data');
            }
          }).catch(error => {
            console.log('AuthContext - Profile fetch failed, keeping current user data:', error);
          });
          */
        } else {
          console.warn('AuthContext - Warning: No user data available after login');
        }
        
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
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

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 