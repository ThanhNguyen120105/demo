/**
 * Utility functions for user data handling
 */

import { getUserInfoFromToken } from './jwtUtils';

/**
 * Get display name from user object
 * Handles different user types including doctors and regular users
 * @param {Object} user - User object
 * @returns {string} - Display name
 */
export const getDisplayName = (user) => {
  console.log('userUtils - getDisplayName called with user:', user);
  
  if (!user) {
    console.log('userUtils - No user provided, returning default');
    return 'Người dùng';
  }
  
  // Debug: log tất cả properties của user
  console.log('userUtils - All user properties:', Object.keys(user));
  console.log('userUtils - User fullName:', user.fullName);
  console.log('userUtils - User name:', user.name);
  console.log('userUtils - User username:', user.username);
  console.log('userUtils - User email:', user.email);
  console.log('userUtils - User doctorName:', user.doctorName);
  console.log('userUtils - User displayName:', user.displayName);
  console.log('userUtils - User role:', user.role);
  
  // Nếu không có thông tin user đầy đủ nhưng có token, thử decode từ token trước
  if (!user.fullName && !user.name && !user.username && !user.email && user.token) {
    console.log('userUtils - Trying to decode user info from token');
    try {
      const tokenInfo = getUserInfoFromToken(user.token);
      console.log('userUtils - Token info:', tokenInfo);
      
      if (tokenInfo) {
        if (tokenInfo.fullName) {
          console.log('userUtils - Found fullName from token:', tokenInfo.fullName);
          return tokenInfo.fullName;
        }
        if (tokenInfo.email) {
          const emailName = tokenInfo.email.split('@')[0];
          console.log('userUtils - Found email from token, using:', emailName);
          return emailName;
        }
      }
    } catch (error) {
      console.log('userUtils - Error decoding token:', error);
    }
  }
  
  // Nếu user có role DOCTOR, ưu tiên các trường phù hợp
  if (user.role === 'DOCTOR') {
    const doctorCandidates = [
      user.fullName,
      user.doctorName,
      user.name,
      user.displayName,
      user.username,
      user.email?.split('@')[0]
    ];
    
    for (const candidate of doctorCandidates) {
      if (candidate && 
          candidate !== 'User' && 
          candidate !== 'user' && 
          candidate !== 'Doctor User' &&
          !candidate.includes('@example.com') &&
          typeof candidate === 'string' &&
          candidate.trim().length > 0) {
        console.log('userUtils - Found doctor name:', candidate);
        return candidate;
      }
    }
  }
  
  // Logic cho các role khác
  const candidates = [
    user.fullName,
    user.name, 
    user.username,
    user.doctorName,
    user.displayName,
    user.email?.split('@')[0]
  ];
  
  for (const candidate of candidates) {
    if (candidate && 
        candidate !== 'User' && 
        candidate !== 'user' && 
        candidate !== 'Doctor User' &&
        !candidate.includes('@example.com') &&
        typeof candidate === 'string' &&
        candidate.trim().length > 0) {
      console.log('userUtils - Found name:', candidate);
      return candidate;
    }
  }    
  
  console.log('userUtils - No valid name found, returning default');
  return 'Người dùng';
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role || user.role_id === role;
};

/**
 * Get user role display text
 * @param {Object} user - User object
 * @returns {string}
 */
export const getRoleDisplayText = (user) => {
  if (!user) return 'Người dùng';
  
  switch (user.role) {
    case 'DOCTOR':
      return 'Bác sĩ';
    case 'STAFF':
      return 'Nhân viên';
    case 'CUSTOMER':
      return 'Bệnh nhân';
    default:
      return 'Người dùng';
  }
};
