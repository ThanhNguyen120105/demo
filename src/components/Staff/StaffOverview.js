import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Staff.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StaffOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 1245,
    newPatientsThisMonth: 87,
    totalAppointments: 234,
    pendingApprovals: 12
  });

  // Dữ liệu mẫu cho biểu đồ bệnh nhân mới theo tháng
  const monthlyPatientsData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Bệnh nhân mới',
        data: [65, 59, 80, 81, 56, 87, 78, 92, 85, 76, 89, 87],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Dữ liệu cho biểu đồ loại bệnh
  const diseaseTypeData = {
    labels: ['HIV/AIDS', 'Bệnh lây truyền qua đường tình dục', 'Tư vấn sức khỏe', 'Khác'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Số lượng bệnh nhân mới theo tháng',
      },
    },
  };

  return (
    <div className="staff-overview">
      <div className="content-header">
        <h2>Tổng quan Dashboard</h2>
        <p>Thống kê tổng quan hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-patients">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardData.totalPatients}</h3>
            <p>Tổng số bệnh nhân</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon new-patients">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardData.newPatientsThisMonth}</h3>
            <p>Bệnh nhân mới tháng này</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total-appointments">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardData.totalAppointments}</h3>
            <p>Lịch hẹn tổng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-approvals">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardData.pendingApprovals}</h3>
            <p>Chờ duyệt</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Bệnh nhân mới theo tháng</h3>
          </div>
          <Line data={monthlyPatientsData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Phân loại bệnh nhân</h3>
          </div>
          <Doughnut data={diseaseTypeData} />
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h3>Hoạt động gần đây</h3>
        <div className="activity-list">
          <div className="activity-item">
            <i className="fas fa-user-plus text-success"></i>
            <div className="activity-content">
              <span>Bệnh nhân mới đăng ký: Nguyễn Văn A</span>
              <small>2 giờ trước</small>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-calendar-check text-primary"></i>
            <div className="activity-content">
              <span>Lịch hẹn được duyệt cho bệnh nhân Trần Thị B</span>
              <small>4 giờ trước</small>
            </div>
          </div>
          <div className="activity-item">
            <i className="fas fa-question-circle text-warning"></i>
            <div className="activity-content">
              <span>Câu hỏi mới cần được duyệt</span>
              <small>6 giờ trước</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOverview; 