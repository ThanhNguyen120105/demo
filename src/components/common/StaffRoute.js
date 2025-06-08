import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const StaffRoute = ({ children }) => {
  const location = useLocation();
  
  // Kiểm tra xem có token và user không
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    // Chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    
    // Kiểm tra role có phải STAFF không
    if (user.role !== 'STAFF') {
      // Không phải staff, chuyển về trang chủ
      return <Navigate to="/" state={{ 
        message: 'Bạn không có quyền truy cập trang này'
      }} replace />;
    }
    
    // Là staff và đã đăng nhập, cho phép truy cập
    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Lỗi parse user data, xóa và chuyển về login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default StaffRoute;
