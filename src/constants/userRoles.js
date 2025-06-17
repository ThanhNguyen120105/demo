// Định nghĩa các role_id trong hệ thống
// Tương ứng với bảng user_role_entity trong database
// Lưu ý: Doctor có bảng riêng, không liên quan đến user table

export const USER_ROLES = {
  CUSTOMER: 1,  // Bệnh nhân/khách hàng - có thể đặt lịch hẹn
  STAFF: 3      // Nhân viên - duyệt lịch hẹn, quản lý hệ thống
  // Doctor không có trong user table, có bảng riêng
};

// Các role name tương ứng
export const ROLE_NAMES = {
  [USER_ROLES.CUSTOMER]: 'CUSTOMER',
  [USER_ROLES.STAFF]: 'STAFF'
};

// Helper functions - xử lý cả role_id (number) và role name (string)
export const isCustomer = (user) => {
  return user?.role === USER_ROLES.CUSTOMER || 
         user?.role === 'CUSTOMER' || 
         user?.role_id === USER_ROLES.CUSTOMER;
};

export const isStaff = (user) => {
  return user?.role === USER_ROLES.STAFF || 
         user?.role === 'STAFF' || 
         user?.role_id === USER_ROLES.STAFF;
};

// Doctor không có trong user table, sẽ có logic riêng cho doctor login

// Kiểm tra quyền truy cập cho các chức năng
export const canBookAppointment = (user) => isCustomer(user);
export const canApproveAppointment = (user) => isStaff(user);
// Doctor sẽ có logic riêng

// Helper function để convert role name về role_id
export const getRoleId = (user) => {
  if (user?.role_id) return user.role_id;
  
  switch(user?.role) {
    case 'CUSTOMER': return USER_ROLES.CUSTOMER;
    case 'STAFF': return USER_ROLES.STAFF;
    default: return user?.role || null;
  }
};

// Helper function để convert role_id về role name
export const getRoleName = (user) => {
  const roleId = getRoleId(user);
  return ROLE_NAMES[roleId] || user?.role || 'UNKNOWN';
};

// Helper function để lấy dashboard route dựa trên role của user
export const getDashboardRoute = (user) => {
  if (isCustomer(user)) {
    return '/patient/dashboard';
  } else if (isStaff(user)) {
    return '/staff/dashboard';
  } else {
    return '/'; // Default to home page
  }
};
