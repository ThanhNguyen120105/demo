// Utility functions để xử lý JWT token

export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // JWT có 3 phần: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode payload (phần thứ 2)
    const payload = parts[1];
    
    // Thêm padding nếu cần
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserInfoFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    email: decoded.email,
    fullName: decoded.fullName,
    role: decoded.role,
    iat: decoded.iat,
    exp: decoded.exp
  };
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
