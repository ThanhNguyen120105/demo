# Màn hình Quản lý Bác sĩ & Lịch hẹn (Staff Doctor Management)

## Mô tả
Màn hình quản lý dành cho staff để phân công và quản lý lịch hẹn cho các bác sĩ trong hệ thống. Giao diện hiện đại với đầy đủ tính năng quản lý chuyên nghiệp.

## Tính năng chính

### 1. Dashboard Thống kê
- **Tổng lịch hẹn**: Hiển thị tổng số lịch hẹn trong hệ thống
- **Lịch hẹn hôm nay**: Số lượng lịch hẹn trong ngày hiện tại
- **Chờ phân công**: Số lịch hẹn đang chờ được phân công bác sĩ
- **Bác sĩ hoạt động**: Số lượng bác sĩ đang hoạt động

### 2. Chế độ xem đa dạng
- **Danh sách**: Xem danh sách lịch hẹn dạng card
- **Bác sĩ**: Xem thông tin và thống kê của các bác sĩ
- **Lịch**: Chế độ xem lịch (đang phát triển)

### 3. Bộ lọc mạnh mẽ
- Lọc theo bác sĩ và chuyên khoa
- Lọc theo ngày cụ thể
- Lọc theo trạng thái (chờ phân công, đã xác nhận, hoàn thành, hủy bỏ)
- Nút reset để xóa tất cả bộ lọc

### 4. Quản lý lịch hẹn
- Xem chi tiết đầy đủ thông tin lịch hẹn
- Phân công bác sĩ cho lịch hẹn chưa có bác sĩ
- Cập nhật trạng thái lịch hẹn
- Hiển thị mức độ ưu tiên và loại dịch vụ

### 5. Quản lý bác sĩ
- Xem danh sách bác sĩ với avatar và thông tin cá nhân
- Hiển thị chuyên khoa và lịch làm việc
- Theo dõi số lượng bệnh nhân và lịch hẹn hôm nay
- Trạng thái hoạt động (sẵn sàng/bận)

### 6. Phân công thông minh
- Hiển thị khối lượng công việc hiện tại của mỗi bác sĩ
- Chỉ cho phép phân công cho bác sĩ đang sẵn sàng
- Tự động cập nhật trạng thái sau khi phân công

## Cấu trúc Files

```
src/components/Appointment/
├── StaffDoctorManagement.js    # Component chính
├── StaffDoctorManagement.css   # Styling
└── index.js                    # Export component

src/
└── StaffDoctorDemo.js         # File demo để test
```

## Cách sử dụng

### 1. Import component
```jsx
import StaffDoctorManagement from './components/Appointment/StaffDoctorManagement';
```

### 2. Sử dụng trong ứng dụng
```jsx
function App() {
  return (
    <div className="App">
      <StaffDoctorManagement />
    </div>
  );
}
```

### 3. Chạy demo
```bash
# Thêm route vào ứng dụng
<Route path="/staff/doctor-management" component={StaffDoctorManagement} />

# Hoặc chạy file demo
import StaffDoctorDemo from './StaffDoctorDemo';
```

## Data Structure

### Appointment Object
```javascript
{
  id: number,
  patientName: string,
  patientEmail: string,
  patientPhone: string,
  serviceType: 'hiv-test' | 'treatment-program' | 'prevention-service' | 'counseling',
  doctorId: string,
  doctorName: string,
  appointmentDate: string, // YYYY-MM-DD
  appointmentTime: string, // HH:MM
  status: 'pending_assignment' | 'confirmed' | 'completed' | 'cancelled',
  priority: 'low' | 'normal' | 'high',
  reason: string,
  notes: string,
  createdAt: string // ISO DateTime
}
```

### Doctor Object
```javascript
{
  id: string,
  name: string,
  specialty: string,
  avatar: string,
  schedule: string,
  totalPatients: number,
  todayAppointments: number,
  status: 'active' | 'busy'
}
```

## Trạng thái và Ý nghĩa

### Trạng thái lịch hẹn
- **pending_assignment**: Chờ phân công bác sĩ
- **confirmed**: Đã được phân công và xác nhận
- **completed**: Đã hoàn thành khám
- **cancelled**: Đã hủy bỏ

### Mức độ ưu tiên
- **low**: Ưu tiên thấp (màu xám)
- **normal**: Ưu tiên bình thường (màu xanh)
- **high**: Ưu tiên cao (màu cam/đỏ)

### Trạng thái bác sĩ
- **active**: Sẵn sàng nhận lịch hẹn mới
- **busy**: Đang bận, không thể nhận thêm lịch hẹn

## Customization

### 1. Thay đổi màu sắc chủ đạo
Chỉnh sửa trong file CSS:
```css
/* Thay đổi gradient chính */
.page-header-banner {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* Thay đổi màu accent */
.toggle-btn.active {
  background: linear-gradient(135deg, #your-accent-1 0%, #your-accent-2 100%);
}
```

### 2. Thêm chức năng mới
```jsx
// Thêm action buttons mới
const handleNewAction = (appointmentId) => {
  // Logic xử lý
};

// Thêm vào component
<button onClick={() => handleNewAction(appointment.id)}>
  New Action
</button>
```

### 3. Tùy chỉnh filter
```jsx
// Thêm filter mới
const [customFilter, setCustomFilter] = useState('');

// Thêm vào logic filtering
if (customFilter) {
  filtered = filtered.filter(apt => 
    // Logic filter custom
  );
}
```

## Dependencies cần thiết

```json
{
  "react": "^18.0.0",
  "bootstrap": "^5.3.0",
  "@fortawesome/fontawesome-free": "^6.0.0"
}
```

## Responsive Design

- **Desktop**: Layout 4 cột cho stats, grid responsive cho cards
- **Tablet**: Layout 2 cột, giữ nguyên chức năng
- **Mobile**: Layout 1 cột, toggle buttons dạng vertical

## Tips sử dụng

1. **Phân công hiệu quả**: Kiểm tra khối lượng công việc trước khi phân công
2. **Lọc thông minh**: Sử dụng combo filter để tìm nhanh lịch hẹn cần thiết
3. **Theo dõi trạng thái**: Màu sắc badge giúp nhận biết nhanh trạng thái
4. **Xem chi tiết**: Click vào nút "eye" để xem đầy đủ thông tin
5. **Cập nhật nhanh**: Sử dụng action buttons để cập nhật trạng thái ngay lập tức

## Kế hoạch phát triển

- [ ] Tích hợp calendar view đầy đủ
- [ ] Thêm notifications real-time
- [ ] Export/Import dữ liệu
- [ ] Advanced analytics và reports
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Drag & drop scheduling 