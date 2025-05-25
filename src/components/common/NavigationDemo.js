import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import NavigationCard from './NavigationCard';
import './NavigationDemo.css';

const NavigationDemo = () => {
  return (
    <div className="navigation-demo">
      <Container>
        <div className="demo-header">
          <h1>Hệ thống Quản lý Y tế HIV</h1>
          <p className="lead">Chọn chức năng bạn muốn sử dụng</p>
        </div>

        <Alert variant="info" className="demo-alert">
          <strong>🎯 Chức năng mới:</strong> Màn hình <strong>Quản lý Bác sĩ & Lịch hẹn</strong> đã được thêm vào! 
          Staff có thể phân công bác sĩ và quản lý lịch hẹn một cách hiệu quả.
        </Alert>

        <NavigationCard title="Dành cho Bệnh nhân & Người dùng" showStaffOptions={false} />
        
        <NavigationCard title="Dành cho Nhân viên Y tế & Quản lý" showStaffOptions={true} />

        <div className="demo-footer">
          <div className="demo-info">
            <h5>Hướng dẫn sử dụng:</h5>
            <ul>
              <li><strong>Bệnh nhân:</strong> Sử dụng các chức năng ở phần trên để đặt lịch hẹn và theo dõi</li>
              <li><strong>Staff:</strong> Truy cập "Quản lý Bác sĩ & Lịch hẹn" để phân công và quản lý</li>
              <li><strong>Bác sĩ:</strong> Sử dụng Dashboard để theo dõi bệnh nhân và lịch hẹn</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NavigationDemo; 