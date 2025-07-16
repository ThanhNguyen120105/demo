// Định nghĩa các role_id trong hệ thống
// Tương ứng với bảng user_role_entity trong database
// Lưu ý: Doctor có bảng riêng, không liên quan đến user table

export const USER_ROLES = {
  CUSTOMER: 1,  // Bệnh nhân/khách hàng - có thể đặt lịch hẹn
  STAFF: 3,     // Nhân viên - duyệt lịch hẹn, quản lý hệ thống
  MANAGER: 4,   // Quản lý - quản lý staff, doctor, thống kê
  DOCTOR: 'DOCTOR' // Bác sĩ - có bảng riêng, role string
};

// Các role name tương ứng
export const ROLE_NAMES = {
  [USER_ROLES.CUSTOMER]: 'CUSTOMER',
  [USER_ROLES.STAFF]: 'STAFF',
  [USER_ROLES.MANAGER]: 'MANAGER',
  [USER_ROLES.DOCTOR]: 'DOCTOR'
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

export const isManager = (user) => {
  return user?.role === USER_ROLES.MANAGER || 
         user?.role === 'MANAGER' || 
         user?.role_id === USER_ROLES.MANAGER;
};

export const isDoctor = (user) => {
  return user?.role === USER_ROLES.DOCTOR || 
         user?.role === 'DOCTOR';
};

// Kiểm tra quyền truy cập cho các chức năng
export const canBookAppointment = (user) => isCustomer(user);
export const canApproveAppointment = (user) => isStaff(user);
export const canViewMedicalRecords = (user) => isDoctor(user);
export const canManageStaff = (user) => isManager(user);
export const canManageDoctor = (user) => isManager(user) || isStaff(user);

// Helper function để convert role name về role_id
export const getRoleId = (user) => {
  if (user?.role_id) return user.role_id;
  
  switch(user?.role) {
    case 'CUSTOMER': return USER_ROLES.CUSTOMER;
    case 'STAFF': return USER_ROLES.STAFF;
    case 'MANAGER': return USER_ROLES.MANAGER;
    case 'DOCTOR': return USER_ROLES.DOCTOR;
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
    return '/'; // CUSTOMER chuyển về trang chủ thay vì dashboard
  } else if (isStaff(user)) {
    return '/staff/dashboard';
  } else if (isManager(user)) {
    return '/manager/dashboard';
  } else if (isDoctor(user)) {
    return '/doctor/dashboard';
  } else {
    return '/'; // Default to home page
  }
};
