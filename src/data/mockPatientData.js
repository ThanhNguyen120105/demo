export const mockPatientData = {
  profile: {
    id: "P001",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận XYZ, TP.HCM",
    dateOfBirth: "1990-01-01",
    gender: "Nam"
  },
  appointments: [
    {
      id: "A001",
      date: "2024-03-20",
      time: "09:00",
      doctorName: "BS. Trần Thị B",
      status: "upcoming",
      type: "Khám định kỳ",
      notes: "Khám định kỳ 3 tháng"
    },
    {
      id: "A002",
      date: "2024-02-15",
      time: "14:30",
      doctorName: "BS. Lê Văn C",
      status: "completed",
      type: "Khám bệnh",
      notes: "Khám bệnh thông thường"
    }
  ],
  medicalRecords: [
    {
      id: "MR001",
      date: "2024-02-15",
      type: "Xét nghiệm máu",
      doctorName: "BS. Lê Văn C",
      results: {
        cd4: 450,
        viralLoad: "< 40",
        hivStatus: "Positive",
        otherTests: {
          "ALT": "25 U/L",
          "AST": "28 U/L",
          "Creatinine": "0.9 mg/dL"
        }
      }
    }
  ],
  arvRegimen: {
    currentRegimen: {
      startDate: "2023-12-01",
      medications: [
        {
          name: "TDF/FTC/DTG",
          dosage: "1 viên/ngày",
          time: "Buổi tối",
          notes: "Uống sau bữa ăn"
        }
      ],
      doctorName: "BS. Trần Thị B",
      adherence: 95
    },
    history: [
      {
        startDate: "2023-06-01",
        endDate: "2023-11-30",
        medications: [
          {
            name: "ABC/3TC/DTG",
            dosage: "1 viên/ngày",
            time: "Buổi tối"
          }
        ],
        reason: "Thay đổi phác đồ do tác dụng phụ"
      }
    ]
  }
};

// Mock API functions
export const patientAPI = {
  getProfile: () => Promise.resolve(mockPatientData.profile),
  getAppointments: () => Promise.resolve(mockPatientData.appointments),
  getMedicalRecords: () => Promise.resolve(mockPatientData.medicalRecords),
  getARVRegimen: () => Promise.resolve(mockPatientData.arvRegimen),
  cancelAppointment: (appointmentId) => Promise.resolve({ success: true }),
  updateProfile: (profileData) => Promise.resolve({ ...mockPatientData.profile, ...profileData })
}; 