# SPECIFIC TEST CASES FOR HIV TREATMENT SYSTEM

## API Test Cases Based on Actual Implementation

### Authentication API Tests

| Test ID | API Endpoint | Method | Test Scenario | Input Data | Expected Result | Test Data |
|---------|--------------|--------|---------------|------------|-----------------|-----------|
| API_AUTH_001 | /api/auth/register | POST | Register new user with valid data | Valid user object | 201 Created + user data | `{"fullName": "John Doe", "email": "john@test.com", "password": "Test123!", "phone": "0123456789", "birthdate": "1990-01-01", "gender": "MALE", "address": "Test Address"}` |
| API_AUTH_002 | /api/auth/register | POST | Register with duplicate email | Existing email | 400 Bad Request + error message | `{"email": "existing@test.com"}` |
| API_AUTH_003 | /api/auth/login | POST | Login with valid credentials | Valid username/password | 200 OK + JWT token | `{"username": "john@test.com", "password": "Test123!"}` |
| API_AUTH_004 | /api/auth/login | POST | Login with invalid credentials | Invalid username/password | 401 Unauthorized | `{"username": "wrong@test.com", "password": "wrongpass"}` |
| API_AUTH_005 | /api/auth/logout | POST | Logout with valid token | Valid JWT token | 200 OK | Headers: `Authorization: Bearer <token>` |

### Appointment API Tests

| Test ID | API Endpoint | Method | Test Scenario | Input Data | Expected Result | Test Data |
|---------|--------------|--------|---------------|------------|-----------------|-----------|
| API_APPT_001 | /api/appointments | POST | Create appointment with valid data | Valid appointment object | 201 Created + appointment data | `{"userId": 1, "doctorId": 2, "serviceId": 1, "appointmentDate": "2025-12-25", "slotStartTime": "09:00", "slotEndTime": "10:00", "reason": "Regular checkup"}` |
| API_APPT_002 | /api/appointments/{id} | GET | Get appointment by valid ID | Valid appointment ID | 200 OK + appointment details | `appointmentId: 1` |
| API_APPT_003 | /api/appointments/{id} | GET | Get appointment by invalid ID | Non-existent ID | 404 Not Found | `appointmentId: 999999` |
| API_APPT_004 | /api/appointments/{id}/status | PUT | Update appointment status | Status update data | 200 OK + updated appointment | `{"status": "ACCEPTED"}` |
| API_APPT_005 | /api/appointments/doctor/accepted | GET | Get accepted appointments for doctor | Valid doctor token | 200 OK + appointments list | Headers: `Authorization: Bearer <doctor_token>` |

### Medical Result API Tests

| Test ID | API Endpoint | Method | Test Scenario | Input Data | Expected Result | Test Data |
|---------|--------------|--------|---------------|------------|-----------------|-----------|
| API_MED_001 | /api/medical-result/create/{appointmentId} | POST | Create medical result | Valid appointment ID | 201 Created + medical result | `appointmentId: 1` |
| API_MED_002 | /api/medical-result/update/{id} | PUT | Update medical result with valid data | Valid medical data | 200 OK + updated result | `{"weight": 70.5, "height": 175, "bloodPressure": "120/80", "cd4Count": 500}` |
| API_MED_003 | /api/medical-result/update/{id} | PUT | Update with file upload | Medical data + file | 200 OK + file URL | FormData with medical data and PDF file |
| API_MED_004 | /api/medical-result/{id} | GET | Get medical result by ID | Valid result ID | 200 OK + medical data | `medicalResultId: 1` |
| API_MED_005 | /api/medical-result/update/{id} | PUT | Update with invalid doctor ID | Wrong doctor token | 403 Forbidden | Headers: `Authorization: Bearer <wrong_doctor_token>` |

### User API Tests

| Test ID | API Endpoint | Method | Test Scenario | Input Data | Expected Result | Test Data |
|---------|--------------|--------|---------------|------------|-----------------|-----------|
| API_USER_001 | /api/users/{id} | GET | Get user by valid ID | Valid user ID | 200 OK + user data | `userId: 1` |
| API_USER_002 | /api/users/{id} | PUT | Update user profile | Valid user data | 200 OK + updated user | `{"fullName": "Jane Doe", "phone": "0987654321"}` |
| API_USER_003 | /api/users/profile | GET | Get current user profile | Valid token | 200 OK + user profile | Headers: `Authorization: Bearer <token>` |
| API_USER_004 | /api/users/{id} | GET | Get user with invalid ID | Non-existent ID | 404 Not Found | `userId: 999999` |

## React Component Test Cases

### DoctorAppointments Component Tests

| Test ID | Component | Test Type | Test Scenario | Props/State | Expected Behavior | Test Code Example |
|---------|-----------|-----------|---------------|-------------|-------------------|-------------------|
| RC_DOC_001 | DoctorAppointments | Render | Component renders with appointments | `appointments: [appointmentData]` | Displays appointment list correctly | `render(<DoctorAppointments />); expect(screen.getByText('Lịch hẹn')).toBeInTheDocument();` |
| RC_DOC_002 | DoctorAppointments | Event | Click create medical result button | Valid appointment without medical result | Shows create medical result modal | `fireEvent.click(screen.getByText('Tạo báo cáo y tế')); expect(modal).toBeVisible();` |
| RC_DOC_003 | DoctorAppointments | Event | Video call button click | Anonymous appointment | Initiates video call | `fireEvent.click(screen.getByText('Video Call')); expect(videoCallHandler).toHaveBeenCalled();` |
| RC_DOC_004 | DoctorAppointments | State | Calendar navigation | Current month/year | Updates calendar display | `fireEvent.click(nextMonthButton); expect(screen.getByText('Tháng 1')).toBeInTheDocument();` |

### AppointmentHistory Component Tests

| Test ID | Component | Test Type | Test Scenario | Props/State | Expected Behavior | Test Code Example |
|---------|-----------|-----------|---------------|-------------|-------------------|-------------------|
| RC_HIST_001 | AppointmentHistory | Render | Display patient appointment history | `appointments: patientAppointments` | Shows appointment table with 7 columns | `expect(screen.getAllByRole('columnheader')).toHaveLength(7);` |
| RC_HIST_002 | AppointmentHistory | Event | View video call log button | Completed appointment | Opens video call log modal | `fireEvent.click(screen.getByText('Xem chi tiết cuộc gọi')); expect(videoCallModal).toBeVisible();` |
| RC_HIST_003 | AppointmentHistory | Data | Filter appointments by status | Mixed status appointments | Shows only specified status | `expect(completedAppointments).toHaveLength(3);` |

### VideoCall Component Tests

| Test ID | Component | Test Type | Test Scenario | Props/State | Expected Behavior | Test Code Example |
|---------|-----------|-----------|---------------|-------------|-------------------|-------------------|
| RC_VIDEO_001 | VideoCall | Integration | Initialize Agora client | Valid app ID and token | Client connects successfully | `expect(agoraClient.connectionState).toBe('CONNECTED');` |
| RC_VIDEO_002 | VideoCall | Event | Start video call | Valid appointment data | Video stream starts | `expect(localVideoTrack).toBeDefined();` |
| RC_VIDEO_003 | VideoCall | Event | Send chat message | Message text | Message appears in chat log | `fireEvent.click(sendButton); expect(screen.getByText(messageText)).toBeInTheDocument();` |
| RC_VIDEO_004 | VideoCall | Cleanup | End video call | Active call | Resources cleaned up properly | `expect(agoraClient.leave).toHaveBeenCalled();` |

## Integration Test Cases

### Frontend-Backend Integration

| Test ID | Integration Point | Test Scenario | Test Steps | Expected Result |
|---------|------------------|---------------|------------|-----------------|
| INT_001 | Login Flow | Complete authentication flow | 1. Submit login form 2. Receive JWT token 3. Store in localStorage 4. Redirect to dashboard | User authenticated and redirected |
| INT_002 | Appointment Creation | Patient books appointment | 1. Select service 2. Choose date/time 3. Fill reason 4. Submit form | Appointment created in database |
| INT_003 | Medical Report | Doctor creates medical report | 1. Fill medical form 2. Add medicines 3. Upload ARV file 4. Save report | Medical data saved with file |
| INT_004 | Video Call Log | Doctor uploads call log | 1. Complete video call 2. Generate log 3. Upload to Supabase 4. Update appointment | Log file uploaded and linked |

### Database Integration

| Test ID | Database Operation | Test Scenario | Expected Result |
|---------|-------------------|---------------|-----------------|
| DB_001 | User CRUD | Create, read, update, delete user records | All operations complete successfully |
| DB_002 | Appointment Relationships | Test foreign key constraints between users, doctors, services | Referential integrity maintained |
| DB_003 | Medical Result Storage | Store complex medical data with file references | Data integrity preserved |
| DB_004 | Transaction Rollback | Test database rollback on failed operations | Data consistency maintained |

## System Test Cases

### End-to-End User Workflows

| Test ID | User Role | Workflow | Test Steps | Success Criteria |
|---------|-----------|----------|------------|------------------|
| E2E_001 | Patient | Complete appointment booking | 1. Register/Login 2. Browse services 3. Select appointment slot 4. Book appointment 5. Receive confirmation | Appointment successfully booked |
| E2E_002 | Doctor | Conduct consultation | 1. Login 2. View appointments 3. Start video call 4. Create medical report 5. Complete appointment | Full consultation workflow completed |
| E2E_003 | Staff | Manage appointments | 1. Login 2. View pending appointments 3. Approve/reject appointments 4. Update schedules | Appointment management completed |
| E2E_004 | Manager | Generate reports | 1. Login 2. Access dashboard 3. View analytics 4. Export reports | Business intelligence data accessed |

### Cross-Browser Testing

| Test ID | Browser | Version | Critical Features | Expected Result |
|---------|---------|---------|-------------------|-----------------|
| CB_001 | Chrome | 120+ | All core functionality | 100% feature compatibility |
| CB_002 | Firefox | 119+ | Video calling, file upload | 95%+ feature compatibility |
| CB_003 | Safari | 16+ | Core features (limited video) | 90%+ feature compatibility |
| CB_004 | Edge | 119+ | All features | 100% feature compatibility |

## Performance Test Cases

### Load Testing Scenarios

| Test ID | Scenario | Load Pattern | Metrics | Acceptance Criteria |
|---------|----------|--------------|---------|-------------------|
| PERF_001 | Normal Load | 50 concurrent users for 30 minutes | Response time, throughput | < 2s response time, no errors |
| PERF_002 | Peak Load | Ramp up to 100 users over 10 minutes | System stability | < 3s response time, < 1% error rate |
| PERF_003 | Stress Test | 200+ concurrent users | Breaking point | System degrades gracefully |
| PERF_004 | Video Call Load | 20 simultaneous video calls | Video quality, connection stability | < 100ms latency, stable connections |

### Performance Metrics

| Metric | Target | Measurement Method | Current Result |
|--------|--------|--------------------|----------------|
| Page Load Time | < 3 seconds | Browser DevTools | TBD |
| API Response Time | < 1 second | Postman/JMeter | TBD |
| Database Query Time | < 500ms | Database profiler | TBD |
| Video Call Latency | < 100ms | Agora SDK metrics | TBD |
| File Upload Speed | > 1MB/s | Browser network tab | TBD |

## Security Test Cases

### Authentication & Authorization

| Test ID | Security Aspect | Test Scenario | Expected Result |
|---------|-----------------|---------------|-----------------|
| SEC_001 | JWT Token Validation | Access protected routes with invalid token | 401 Unauthorized |
| SEC_002 | Role-based Access | Patient tries to access doctor endpoints | 403 Forbidden |
| SEC_003 | Password Security | Attempt login with weak passwords | Password policy enforced |
| SEC_004 | Session Management | Token expiration handling | Automatic logout and redirect |

### Data Protection

| Test ID | Data Type | Test Scenario | Expected Result |
|---------|-----------|---------------|-----------------|
| SEC_005 | Medical Data | Unauthorized access to medical records | Access denied |
| SEC_006 | File Upload | Upload malicious files | File type validation |
| SEC_007 | SQL Injection | Malicious SQL in form inputs | Input sanitization |
| SEC_008 | XSS Protection | Script injection attempts | Scripts blocked/escaped |

## Test Data Management

### Test User Accounts

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Patient | patient@test.com | Test123! | Standard patient account |
| Doctor | doctor@test.com | Test123! | Doctor account with full permissions |
| Staff | staff@test.com | Test123! | Staff account for appointment management |
| Manager | manager@test.com | Test123! | Manager account for reporting |

### Test Appointment Data

| Appointment ID | Patient | Doctor | Service | Date | Status |
|----------------|---------|--------|---------|------|--------|
| 1 | patient@test.com | doctor@test.com | HIV Consultation | 2025-12-25 | ACCEPTED |
| 2 | patient@test.com | doctor@test.com | Follow-up | 2025-12-26 | COMPLETED |
| 3 | patient@test.com | doctor@test.com | Video Consultation | 2025-12-27 | PENDING |

### Test Medical Data

| Field | Test Value | Validation Rule |
|-------|------------|-----------------|
| Weight | 70.5 kg | > 0, < 500 |
| Height | 175 cm | > 0, < 300 |
| Blood Pressure | 120/80 mmHg | Format: XXX/XX |
| CD4 Count | 500 cells/μL | > 0, < 2000 |
| Viral Load | Undetectable | Text field |

## Test Environment Setup

### Development Environment
- **URL:** http://localhost:3000
- **Database:** MySQL 8.0.34 (localhost)
- **API Server:** http://localhost:8080
- **Video Service:** Agora SDK (test environment)

### Staging Environment
- **URL:** https://staging.hivcare.com
- **Database:** MySQL (staging server)
- **API Server:** https://api-staging.hivcare.com
- **Video Service:** Agora SDK (staging environment)

### Production Environment
- **URL:** https://hivcare.com
- **Database:** MySQL (production server)
- **API Server:** https://api.hivcare.com
- **Video Service:** Agora SDK (production environment)

## Test Execution Schedule

### Phase 1: Unit Testing (Nov 8-15, 2025)
- API service tests
- React component tests
- Utility function tests
- Authentication module tests

### Phase 2: Integration Testing (Nov 16-28, 2025)
- Frontend-backend integration
- Database integration tests
- Third-party service integration
- File upload/download tests

### Phase 3: System Testing (Nov 29 - Dec 8, 2025)
- End-to-end workflow tests
- Cross-browser compatibility
- Performance testing
- Security testing

### Phase 4: User Acceptance Testing (Dec 9-18, 2025)
- Business scenario validation
- Stakeholder approval testing
- User experience evaluation
- Final system acceptance

### Phase 5: Final Testing & Deployment (Dec 19-20, 2025)
- Production environment validation
- Go-live readiness assessment
- Final test report generation
- System handover documentation
