import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const DoctorRoute = ({ children }) => {
  const location = useLocation();
  
  // Kiểm tra xem có token và user không
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    // Chưa đăng nhập, chuyển về trang login doctor
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    // Kiểm tra role có phải DOCTOR không
    if (user.role !== 'DOCTOR') {
      // Không phải doctor, chuyển về trang login doctor
      return <Navigate to="/doctor/login" state={{ 
        from: location,
        message: 'Bạn không có quyền truy cập trang này'
      }} replace />;
    }
    
    // Là doctor và đã đăng nhập, cho phép truy cập
    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Lỗi parse user data, xóa và chuyển về login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/doctor/login" state={{ from: location }} replace />;
  }
};

export default DoctorRoute;
