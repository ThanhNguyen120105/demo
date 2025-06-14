import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';

const DoctorDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển Bác sĩ</h1>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng số bệnh nhân"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Lịch hẹn hôm nay"
              value={0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Lịch hẹn đã hoàn thành"
              value={0}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-8">
        <Card title="Lịch hẹn sắp tới">
          <p>Chưa có lịch hẹn nào</p>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard; 