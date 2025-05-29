import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // Test results with nextVisit dates for appointment reminders
  const testResults = [
    {
      id: 1,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      appointmentId: 'APT-2024-001',
      testDate: '2024-01-15',
      nextVisit: '2024-04-15',
      doctor: 'BS. Trần Thị B',
      location: 'Phòng khám HIV - Tầng 2'
    },
    {
      id: 2,
      patientId: 'HIV002',
      patientName: 'Lê Thị C',
      appointmentId: 'APT-2024-002',
      testDate: '2024-01-10',
      nextVisit: '2024-04-10',
      doctor: 'BS. Phạm Văn D',
      location: 'Phòng khám HIV - Tầng 2'
    },
    {
      id: 3,
      patientId: 'HIV003',
      patientName: 'Hoàng Minh E',
      appointmentId: 'APT-2024-003',
      testDate: '2024-01-08',
      nextVisit: '2024-02-08',
      doctor: 'BS. Nguyễn Thị F',
      location: 'Phòng khám chuyên khoa'
    },
    {
      id: 4,
      patientId: 'HIV005',
      patientName: 'Phạm Thị H',
      appointmentId: 'APT-2024-005',
      testDate: '2024-01-05',
      nextVisit: '2024-01-19',
      doctor: 'BS. Nguyễn Văn I',
      location: 'Phòng khám HIV - Tầng 2'
    },
    {
      id: 5,
      patientId: 'HIV007',
      patientName: 'Ngô Thị M',
      appointmentId: 'APT-2024-007',
      testDate: '2024-01-01',
      nextVisit: '2024-01-29',
      doctor: 'BS. Hoàng Văn N',
      location: 'Phòng khám sản khoa'
    }
  ];

  // Reminder data for appointments and medication
  const [reminders, setReminders] = useState([
    {
      id: 1,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      type: 'appointment',
      title: 'Tái khám định kỳ',
      description: 'Kiểm tra viral load và CD4',
      dueDate: '2024-04-15',
      status: 'pending',
      priority: 'medium',
      doctor: 'BS. Trần Thị B',
      location: 'Phòng khám HIV - Tầng 2'
    },
    {
      id: 2,
      patientId: 'HIV001',
      patientName: 'Nguyễn Văn A',
      type: 'medication',
      title: 'Uống thuốc ARV',
      description: 'DTG + TAF + FTC - Sáng 1 viên',
      dueDate: '2024-01-20',
      dueTime: '08:00',
      status: 'pending',
      priority: 'high',
      frequency: 'Hàng ngày',
      dosage: '1 viên/ngày'
    },
    {
      id: 3,
      patientId: 'HIV002',
      patientName: 'Lê Thị C',
      type: 'appointment',
      title: 'Tái khám định kỳ',
      description: 'Theo dõi viral load',
      dueDate: '2024-04-10',
      status: 'pending',
      priority: 'medium',
      doctor: 'BS. Phạm Văn D',
      location: 'Phòng khám HIV - Tầng 2'
    },
    {
      id: 4,
      patientId: 'HIV002',
      patientName: 'Lê Thị C',
      type: 'medication',
      title: 'Uống thuốc ARV',
      description: 'Biktarvy - Tối 1 viên',
      dueDate: '2024-01-20',
      dueTime: '20:00',
      status: 'completed',
      priority: 'high',
      frequency: 'Hàng ngày',
      dosage: '1 viên/ngày'
    },
    {
      id: 6,
      patientId: 'HIV005',
      patientName: 'Phạm Thị H',
      type: 'medication',
      title: 'Uống thuốc ARV',
      description: 'EFV + TDF + FTC - Tối 1 viên',
      dueDate: '2024-01-20',
      dueTime: '21:00',
      status: 'pending',
      priority: 'high',
      frequency: 'Hàng ngày',
      dosage: '1 viên/ngày',
      note: 'Uống sau ăn để giảm tác dụng phụ'
    },
    {
      id: 7,
      patientId: 'HIV007',
      patientName: 'Ngô Thị M',
      type: 'appointment',
      title: 'Khám thai định kỳ',
      description: 'Theo dõi thai kỳ và viral load',
      dueDate: '2024-01-29',
      status: 'pending',
      priority: 'high',
      doctor: 'BS. Hoàng Văn N',
      location: 'Phòng khám sản khoa'
    },
    {
      id: 8,
      patientId: 'HIV004',
      patientName: 'Vũ Thị G',
      type: 'appointment',
      title: 'Tái khám 6 tháng',
      description: 'Kiểm tra sức khỏe tổng quát',
      dueDate: '2024-07-12',
      status: 'scheduled',
      priority: 'low',
      doctor: 'BS. Lê Văn H',
      location: 'Phòng khám HIV - Tầng 2'
    }
  ]);

  // Helper functions
  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const isToday = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due.toDateString() === today.toDateString();
  };

  const markReminderCompleted = (reminderId) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, status: 'completed' }
        : reminder
    ));
  };

  // Generate appointment reminders from test results
  const generateAppointmentReminders = () => {
    const today = new Date();
    const reminderDays = 7; // Nhắc nhở trước 7 ngày
    
    return testResults
      .filter(test => test.nextVisit)
      .map(test => {
        const visitDate = new Date(test.nextVisit);
        const diffTime = visitDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let status = 'scheduled';
        let priority = 'medium';
        
        if (diffDays < 0) {
          status = 'overdue';
          priority = 'high';
        } else if (diffDays <= 1) {
          status = 'pending';
          priority = 'high';
        } else if (diffDays <= reminderDays) {
          status = 'pending';
          priority = 'medium';
        }
        
        return {
          id: `appt-${test.id}`,
          patientId: test.patientId,
          patientName: test.patientName,
          type: 'appointment',
          title: 'Nhắc Nhở Tái Khám',
          description: `Tái khám sau xét nghiệm ${test.appointmentId}`,
          dueDate: test.nextVisit,
          status: status,
          priority: priority,
          doctor: test.doctor,
          location: test.location,
          appointmentId: test.appointmentId
        };
      })
      .filter(reminder => reminder.status === 'pending' || reminder.status === 'overdue');
  };

  // Combine all reminders
  const getAllReminders = () => {
    const appointmentReminders = generateAppointmentReminders();
    return [...reminders, ...appointmentReminders];
  };

  const getPendingCount = () => {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.status === 'pending' || r.status === 'overdue').length;
  };

  const getTodayReminders = () => {
    const allReminders = getAllReminders();
    return allReminders.filter(r => isToday(r.dueDate) && r.status === 'pending');
  };

  const getOverdueReminders = () => {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.status === 'overdue');
  };

  const getUpcomingReminders = () => {
    const allReminders = getAllReminders();
    return allReminders.filter(r => r.status === 'pending' && !isToday(r.dueDate) && !isOverdue(r.dueDate));
  };

  const value = {
    reminders: getAllReminders(),
    setReminders,
    markReminderCompleted,
    getPendingCount,
    getTodayReminders,
    getOverdueReminders,
    getUpcomingReminders,
    isOverdue,
    isToday
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 