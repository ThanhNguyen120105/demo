# 1. GIỚI THIỆU DỰ ÁN

## 1.1 Tổng quan dự án

**Tên dự án:** Hệ thống quản lý điều trị HIV và dịch vụ y tế (HIV Treatment Center Management System)

**Mô tả:** Đây là một ứng dụng web hiện đại được phát triển bằng React.js, cung cấp nền tảng toàn diện cho việc quản lý và điều trị HIV. Hệ thống được thiết kế để phục vụ nhiều đối tượng người dùng khác nhau bao gồm bệnh nhân, bác sĩ, nhân viên y tế và quản lý.

## 1.2 Phạm vi dự án

### 1.2.1 Đối tượng người dùng
- **Bệnh nhân:** Đặt lịch hẹn, xem lịch sử khám bệnh, truy cập kết quả xét nghiệm, quản lý hồ sơ y tế
- **Bác sĩ:** Quản lý lịch hẹn, công cụ lựa chọn thuốc ARV, trả lời câu hỏi y tế, video call với bệnh nhân
- **Nhân viên y tế:** Phê duyệt lịch hẹn, quản lý blog, quản lý câu hỏi y tế
- **Quản lý:** Tổng quan hệ thống, tạo tài khoản nhân viên và bác sĩ

### 1.2.2 Tính năng chính
1. **Quản lý lịch hẹn:** Đặt lịch, phê duyệt, theo dõi lịch sử
2. **Hệ thống video call:** Tích hợp Agora RTC cho tư vấn trực tuyến
3. **Công cụ ARV:** Hỗ trợ bác sĩ lựa chọn phác đồ điều trị
4. **Quản lý hồ sơ y tế:** Lưu trữ và truy xuất thông tin bệnh nhân
5. **Blog giáo dục:** Cung cấp thông tin về phòng chống HIV
6. **Hệ thống QA:** Hỏi đáp y tế trực tuyến
7. **Báo cáo y tế:** Xuất PDF báo cáo kết quả điều trị

## 1.3 Công nghệ sử dụng

### 1.3.1 Frontend Framework
- **React.js 19.1.0:** Framework chính cho giao diện người dùng
- **React Router DOM 7.6.0:** Quản lý routing và navigation
- **Bootstrap 5.3.6:** Framework CSS cho responsive design

### 1.3.2 UI/UX Libraries
- **Ant Design 5.26.0:** Component library cho giao diện admin
- **FontAwesome:** Icon library
- **Framer Motion 12.12.1:** Animation library
- **Chart.js 4.4.9:** Thư viện biểu đồ và thống kê

### 1.3.3 Communication & Media
- **Agora RTC SDK 4.23.0:** Video call và real-time communication
- **Agora RTM SDK 1.5.1:** Real-time messaging

### 1.3.4 Document & PDF
- **jsPDF 3.0.1:** Tạo và xuất file PDF
- **React PDF Viewer 3.12.0:** Hiển thị file PDF
- **HTML2Canvas 1.4.1:** Chuyển đổi HTML sang hình ảnh

### 1.3.5 Utilities
- **Axios 1.9.0:** HTTP client cho API calls
- **JWT Decode 4.0.0:** Xử lý authentication tokens
- **React Intersection Observer 9.16.0:** Lazy loading và animations

## 1.4 Kiến trúc hệ thống

### 1.4.1 Cấu trúc thư mục
```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Doctor/         # Doctor-specific features
│   ├── Staff/          # Staff management
│   ├── Manager/        # Manager dashboard
│   ├── patient/        # Patient features
│   ├── VideoCall/      # Video call functionality
│   └── common/         # Shared components
├── contexts/           # React contexts
├── services/           # API services
├── utils/              # Utility functions
└── assets/             # Static assets
```

### 1.4.2 Mô hình bảo mật
- **Protected Routes:** Phân quyền truy cập theo vai trò
- **JWT Authentication:** Xác thực và phân quyền người dùng
- **Role-based Access Control:** Kiểm soát quyền truy cập theo vai trò

## 1.5 Mục tiêu và ý nghĩa

### 1.5.1 Mục tiêu kỹ thuật
- Xây dựng hệ thống quản lý y tế hiện đại, dễ sử dụng
- Tích hợp công nghệ video call cho tư vấn trực tuyến
- Cung cấp công cụ hỗ trợ quyết định cho bác sĩ
- Đảm bảo bảo mật thông tin y tế

### 1.5.2 Ý nghĩa xã hội
- Cải thiện chất lượng dịch vụ chăm sóc bệnh nhân HIV
- Giảm thiểu rào cản địa lý trong việc tiếp cận dịch vụ y tế
- Nâng cao hiệu quả quản lý trong các cơ sở y tế
- Góp phần vào việc giáo dục và phòng chống HIV

## 1.6 Điểm nổi bật của dự án

1. **Tính toàn diện:** Hệ thống phục vụ đầy đủ các nhu cầu của một trung tâm điều trị HIV
2. **Công nghệ hiện đại:** Sử dụng các công nghệ mới nhất trong phát triển web
3. **Giao diện thân thiện:** Thiết kế responsive, dễ sử dụng trên mọi thiết bị
4. **Bảo mật cao:** Đảm bảo an toàn thông tin y tế nhạy cảm
5. **Khả năng mở rộng:** Kiến trúc modular cho phép dễ dàng mở rộng tính năng

## 1.7 Kết luận

Dự án này thể hiện sự kết hợp giữa công nghệ hiện đại và nhu cầu thực tế trong lĩnh vực y tế. Việc áp dụng các công nghệ web tiên tiến vào quản lý điều trị HIV không chỉ mang lại hiệu quả cao mà còn góp phần vào việc cải thiện chất lượng cuộc sống của bệnh nhân và hiệu quả làm việc của đội ngũ y tế. 