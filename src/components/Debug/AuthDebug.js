import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthDebug = () => {
  const { user } = useAuth();
  
  const token = localStorage.getItem('token');
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  
  const testAppointmentAPI = async () => {
    try {
      console.log('🧪 TESTING APPOINTMENT API...');
      
      const response = await fetch('http://localhost:8080/api/appointment/bookAnAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentDate: '2025-06-19',
          status: 'PENDING',
          doctorId: 'test-doctor-id',
          ServiceId: '1',
          SlotEntityId: '1',
          userId: user?.id || 'test-user-id'
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.text();
      console.log('Response body:', data);
      
    } catch (error) {
      console.error('Test error:', error);
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔍 Auth Debug</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Token exists:</strong> {token ? 'YES' : 'NO'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Token length:</strong> {token?.length || 0}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>User from AuthContext:</strong>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>User from localStorage:</strong>
        <pre>{JSON.stringify(userFromStorage, null, 2)}</pre>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Role ID:</strong> {user?.role_id || userFromStorage?.role_id || 'UNKNOWN'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Can book appointment:</strong> {
          (user?.role_id === 1 || userFromStorage?.role_id === 1) ? 'YES' : 'NO'
        }
      </div>
      
      <button onClick={testAppointmentAPI} style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
        🧪 Test Appointment API
      </button>
    </div>
  );
};

export default AuthDebug;
