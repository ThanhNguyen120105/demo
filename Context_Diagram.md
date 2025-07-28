# CONTEXT DIAGRAM - HIV TREATMENT AND MEDICAL SERVICES SYSTEM

## System Overview
**Hệ thống Tăng cường Tiếp cận Dịch vụ Y tế và Điều trị HIV**

---

## Context Diagram

```
                    ┌─────────────────────────────────────────────────────────────────┐
                    │                                                                 │
                    │              HIV TREATMENT AND MEDICAL SERVICES SYSTEM          │
                    │                                                                 │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
                    │  │   Frontend  │  │   Backend   │  │  Database   │            │
         Guest ────────▶│   (React)   │◄─▶│    (API)    │◄─▶│   (MySQL)   │            │
      (Visitor)     │  │             │  │             │  │             │            │
                    │  └─────────────┘  └─────────────┘  └─────────────┘            │
                    │                                                                 │
       Customer ────────▶ • Homepage & Blog                                          │
      (Patient)     │     • User Registration/Login                                  │
                    │     • Appointment Booking                                      │
                    │     • Medical Records Access                                   │
                    │     • Video Consultation (Anonymous)                          │
                    │     • ARV Treatment Tracking                                   │
                    │                                                                 │
        Staff ─────────▶ • Appointment Approval                                     │
      (Employee)    │     • Doctor Account Creation                                  │
                    │     • Doctor Management                                        │
                    │     • Blog Management                                          │
                    │     • User Management                                          │
                    │                                                                 │
       Doctor ─────────▶ • Appointment Management                                   │
      (Medical)     │     • Medical Report Creation                                  │
                    │     • Video Consultation                                       │
                    │     • ARV Selection Tool                                       │
                    │     • Patient Medical History                                  │
                    │                                                                 │
      Manager ─────────▶ • Dashboard & Analytics                                    │
      (Admin)       │     • System Reports                                          │
                    │     • User Management                                          │
                    │     • Staff Management                                         │
                    │     • System Configuration                                     │
                    │                                                                 │
                    └─────────────────────────────────────────────────────────────────┘
                                                  │
                                                  ▼
                    ┌─────────────────────────────────────────────────────────────────┐
                    │                    EXTERNAL SYSTEMS                             │
                    │                                                                 │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
                    │  │    Agora    │  │  Supabase   │  │   Email     │            │
                    │  │ Video Call  │  │  Storage    │  │  Service    │            │
                    │  │   Service   │  │             │  │             │            │
                    │  └─────────────┘  └─────────────┘  └─────────────┘            │
                    │                                                                 │
                    └─────────────────────────────────────────────────────────────────┘
```

---

## Primary Actors & Their Interactions

### 1. **Guest (Visitor)**
**Role:** Khách truy cập trang web chưa đăng ký tài khoản
**Interactions:**
- Xem trang chủ giới thiệu cơ sở y tế
- Đọc blog và tài liệu giáo dục về HIV
- Xem thông tin bác sĩ và dịch vụ
- Đăng ký tài khoản mới

**Code Reference:** 
- `src/components/Home/` - Homepage components
- `src/components/Blog/` - Blog components
- `src/components/Auth/` - Registration components

### 2. **Customer (Patient)**
**Role:** Bệnh nhân đã đăng ký tài khoản
**Interactions:**
- Đăng nhập/đăng xuất hệ thống
- Đặt lịch khám với bác sĩ (có thể ẩn danh)
- Xem lịch sử khám bệnh và kết quả xét nghiệm
- Tham gia video consultation
- Theo dõi phác đồ ARV và lịch uống thuốc
- Xem và tải báo cáo y tế

**Code Reference:**
- `src/components/patient/AppointmentHistory.js` - Appointment management
- `src/components/VideoCall/` - Video consultation
- `src/constants/userRoles.js` - Role: USER_ROLES.CUSTOMER (1)

### 3. **Staff (Employee)**
**Role:** Nhân viên y tế quản lý lịch hẹn và hệ thống
**Interactions:**
- Duyệt và phê duyệt lịch hẹn
- Tạo tài khoản bác sĩ mới
- Quản lý danh sách bác sĩ
- Quản lý blog và nội dung giáo dục
- Quản lý thông tin người dùng

**Code Reference:**
- `src/components/Staff/StaffDashboard.js` - Main dashboard
- `src/components/Staff/AppointmentApproval.js` - Appointment approval
- `src/components/Staff/CreateDoctorAccount.js` - Doctor account creation
- `src/components/Staff/DoctorManagement.js` - Doctor management
- `src/constants/userRoles.js` - Role: USER_ROLES.STAFF (3)

### 4. **Doctor (Medical Professional)**
**Role:** Bác sĩ điều trị HIV
**Interactions:**
- Quản lý lịch hẹn được phân công
- Tạo và cập nhật báo cáo y tế
- Thực hiện video consultation
- Sử dụng ARV Selection Tool
- Theo dõi lịch sử điều trị bệnh nhân
- Tải lên và quản lý tài liệu y tế

**Code Reference:**
- `src/components/Doctor/DoctorAppointments.js` - Appointment management
- `src/components/Doctor/ARVSelectionTool.js` - ARV treatment selection
- `src/components/Doctor/MedicalReportModal.js` - Medical reporting
- `src/constants/userRoles.js` - Role: USER_ROLES.DOCTOR ('DOCTOR')

### 5. **Manager (Administrator)**
**Role:** Quản lý hệ thống và giám sát hoạt động
**Interactions:**
- Xem dashboard thống kê tổng quan
- Tạo và xem báo cáo hệ thống
- Quản lý staff và bác sĩ
- Giám sát hiệu suất hệ thống
- Cấu hình hệ thống

**Code Reference:**
- `src/components/Manager/` - Manager components
- `src/constants/userRoles.js` - Role: USER_ROLES.MANAGER (4)

---

## System Boundaries & Data Flows

### Internal System Components

#### Frontend (React Application)
```
┌─────────────────────────────────────────┐
│              FRONTEND (React)           │
├─────────────────────────────────────────┤
│ • Authentication & Authorization        │
│ • User Interface Components             │
│ • State Management (Context API)        │
│ • Routing (React Router)                │
│ • Form Validation & Input Handling      │
│ • File Upload/Download                  │
│ • Real-time Updates                     │
└─────────────────────────────────────────┘
```

#### Backend API Services
```
┌─────────────────────────────────────────┐
│              BACKEND API                │
├─────────────────────────────────────────┤
│ • JWT Authentication                    │
│ • RESTful API Endpoints                 │
│ • Business Logic Processing             │
│ • File Upload Handling                  │
│ • Database Operations                   │
│ • Role-based Access Control             │
│ • Data Validation & Security            │
└─────────────────────────────────────────┘
```

#### Database (MySQL)
```
┌─────────────────────────────────────────┐
│              DATABASE (MySQL)           │
├─────────────────────────────────────────┤
│ • User Management Tables                │
│ • Appointment Tables                    │
│ • Medical Records Tables                │
│ • Doctor Information Tables             │
│ • ARV Treatment Tables                  │
│ • Blog & Content Tables                 │
│ • System Configuration Tables           │
└─────────────────────────────────────────┘
```

### External System Integrations

#### Agora Video Service
```
Guest/Customer/Doctor ─── Video Call ──▶ Agora SDK ──▶ Real-time Communication
                                            │
                                            ▼
                                      Call Logs & Analytics
```

#### Supabase Storage
```
Doctor/Customer ─── File Upload ──▶ Supabase Storage ──▶ Secure File Storage
                                         │
                                         ▼
                                   File URLs & Metadata
```

#### Email Service
```
System ─── Notifications ──▶ Email Service ──▶ Patient Reminders
           Appointments                          Appointment Confirmations
           Reminders                            System Notifications
```

---

## Key System Features & Flows

### 1. **Appointment Booking Flow**
```
Customer ──▶ Select Service ──▶ Choose Doctor ──▶ Select Date/Time ──▶ Submit Request
                                                                            │
                                                                            ▼
Staff ──▶ Review Request ──▶ Approve/Reject ──▶ Assign Doctor ──▶ Confirm Appointment
                                                                            │
                                                                            ▼
Doctor ──▶ View Schedule ──▶ Conduct Consultation ──▶ Create Medical Report ──▶ Complete
```

### 2. **Anonymous Video Consultation Flow**
```
Customer ──▶ Request Anonymous Consultation ──▶ Staff Approval ──▶ Doctor Assignment
                                                                         │
                                                                         ▼
Doctor ──▶ Start Video Call ──▶ Consultation ──▶ Generate Call Log ──▶ Upload to Storage
```

### 3. **Medical Record Management Flow**
```
Doctor ──▶ Create Medical Report ──▶ Add ARV Treatment ──▶ Upload Files ──▶ Save to Database
                                                                              │
                                                                              ▼
Customer ──▶ View Medical History ──▶ Download Reports ──▶ Track Treatment Progress
```

### 4. **ARV Treatment Selection Flow**
```
Doctor ──▶ Access ARV Tool ──▶ Select Patient Criteria ──▶ Choose Treatment ──▶ Generate PDF
                                                                                    │
                                                                                    ▼
Patient ──▶ Receive Treatment Plan ──▶ Follow Medication Schedule ──▶ Track Progress
```

---

## Data Exchange Formats

### API Communication
```json
{
  "authentication": "JWT Bearer Token",
  "dataFormat": "JSON",
  "endpoints": {
    "auth": "/api/auth/*",
    "appointments": "/api/appointments/*",
    "medical-results": "/api/medical-result/*",
    "users": "/api/users/*",
    "doctors": "/api/doctors/*"
  }
}
```

### File Storage
```json
{
  "medicalReports": "PDF format",
  "arvTreatmentPlans": "PDF format",
  "videoCallLogs": "JSON format",
  "profileImages": "JPG/PNG format",
  "storage": "Supabase Cloud Storage"
}
```

---

## Security & Access Control

### Role-Based Permissions
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   Feature   │   Guest     │  Customer   │    Staff    │   Doctor    │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ View Home   │     ✓       │      ✓      │      ✓      │      ✓      │
│ Book Appt   │     ✗       │      ✓      │      ✗      │      ✗      │
│ Approve     │     ✗       │      ✗      │      ✓      │      ✗      │
│ Consult     │     ✗       │      ✓      │      ✗      │      ✓      │
│ Med Reports │     ✗       │      ✓      │      ✗      │      ✓      │
│ Manage Docs │     ✗       │      ✗      │      ✓      │      ✗      │
│ Analytics   │     ✗       │      ✗      │      ✗      │      ✓      │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Authentication Flow
```
User ──▶ Login Request ──▶ JWT Token Generation ──▶ Role-based Authorization
                                     │
                                     ▼
                            Token Validation ──▶ API Access Control
```

---

## System Scalability & Performance

### Performance Considerations
- **Frontend:** React optimization with lazy loading
- **Backend:** RESTful API with efficient database queries
- **Database:** MySQL with proper indexing
- **Video:** Agora SDK for real-time communication
- **Storage:** Supabase for scalable file storage

### Monitoring & Analytics
- **User Activity:** Login/logout tracking
- **Appointment Metrics:** Booking success rates
- **Video Call Quality:** Connection stability
- **System Performance:** Response time monitoring

---

This Context Diagram represents the complete HIV Treatment and Medical Services System with all primary actors, their interactions, system boundaries, and external dependencies based on the actual codebase analysis.
