import { useState, useEffect } from 'react';
import { serviceAPI } from '../services/api';

/**
 * Custom hook để lấy và cache service data
 * Sử dụng để thay thế hardcode service mapping
 */
export const useServiceData = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const result = await serviceAPI.getAllServiceEntity();
        
        if (result.success && result.data) {
          setServices(result.data);
          setError(null);
        } else {
          setError(result.message || 'Không thể tải danh sách dịch vụ');
          setServices([]);
        }
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Đã xảy ra lỗi khi tải danh sách dịch vụ');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Hàm helper để lấy tên service theo ID
  const getServiceNameById = (serviceId) => {
    if (!serviceId) return 'Dịch vụ không xác định';
    
    const service = services.find(s => s.id == serviceId);
    return service ? service.name : `Dịch vụ ${serviceId}`;
  };

  // Hàm helper để lấy full service object theo ID
  const getServiceById = (serviceId) => {
    if (!serviceId) return null;
    return services.find(s => s.id == serviceId) || null;
  };

  return {
    services,
    loading,
    error,
    getServiceNameById,
    getServiceById
  };
};

/**
 * Utility function để sử dụng khi không thể dùng hook
 * Cache services trong memory để tránh gọi API nhiều lần
 */
let cachedServices = null;
let cachePromise = null;

export const getServiceNameByIdAsync = async (serviceId) => {
  if (!serviceId) return 'Dịch vụ không xác định';

  // Nếu đã có cache, sử dụng luôn
  if (cachedServices) {
    const service = cachedServices.find(s => s.id == serviceId);
    return service ? service.name : `Dịch vụ ${serviceId}`;
  }

  // Nếu đang loading, chờ kết quả
  if (cachePromise) {
    try {
      await cachePromise;
      const service = cachedServices?.find(s => s.id == serviceId);
      return service ? service.name : `Dịch vụ ${serviceId}`;
    } catch (error) {
      return `Dịch vụ ${serviceId}`;
    }
  }

  // Load services lần đầu
  cachePromise = serviceAPI.getAllServiceEntity();
  
  try {
    const result = await cachePromise;
    if (result.success && result.data) {
      cachedServices = result.data;
      const service = cachedServices.find(s => s.id == serviceId);
      return service ? service.name : `Dịch vụ ${serviceId}`;
    } else {
      return `Dịch vụ ${serviceId}`;
    }
  } catch (error) {
    console.error('Error loading services:', error);
    return `Dịch vụ ${serviceId}`;
  } finally {
    cachePromise = null;
  }
};

// Helper function để get service display từ appointment object
export const getServiceDisplayFromAppointment = async (appointment) => {
  if (!appointment) return 'Dịch vụ không xác định';

  // Ưu tiên tên service có sẵn
  if (appointment.appointmentService) {
    return appointment.appointmentService;
  }

  // Tìm serviceId từ nhiều trường khác nhau
  let serviceId = appointment?.serviceId || 
                  appointment?.service?.id || 
                  appointment?.service?.serviceId;

  if (serviceId) {
    return await getServiceNameByIdAsync(serviceId);
  }

  // Nếu không có serviceId, trả về appointmentType được format đẹp
  if (appointment?.appointmentType) {
    switch (appointment.appointmentType.toUpperCase()) {
      case 'INITIAL':
        return 'Khám lần đầu';
      case 'FOLLOW_UP':
        return 'Tái khám';
      default:
        return appointment.appointmentType;
    }
  }

  // Fallback cuối cùng
  return 'Dịch vụ không xác định';
};
