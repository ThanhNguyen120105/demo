import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faCalendarDay, 
  faUsers, 
  faUserTie, 
  faUserMd,
  faChartLine,
  faRefresh,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { managerAPI } from '../../services/api';

const ManagerOverview = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayCompletedAppointments: 0,
    totalPatients: 0,
    totalStaff: 0,
    totalDoctors: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const fetchManagerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await managerAPI.getDashboardStats();
      
      if (result.success) {
        setStats(result.data);
        setLastUpdated(new Date());
      } else {
        setError(result.message || 'Không thể tải thống kê');
      }
      
    } catch (error) {
      console.error('Error fetching manager stats:', error);
      setError('Không thể tải thống kê. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, description, subtext, badge }) => (
    <Col md={6} lg={4} className="mb-4">
      <Card className="h-100 stat-card shadow-sm border-0">
        <Card.Body className="d-flex align-items-center p-4">
          <div className={`stat-icon bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm`}>
            <FontAwesomeIcon icon={icon} size="lg" />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h6 className="text-muted mb-0 small text-uppercase fw-bold">{title}</h6>
              {badge && <Badge bg={badge.color} className="small">{badge.text}</Badge>}
            </div>
            <h2 className="mb-1 fw-bold text-dark">
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                value.toLocaleString()
              )}
            </h2>
            {description && <small className="text-muted d-block">{description}</small>}
            {subtext && <small className="text-info d-block mt-1">{subtext}</small>}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  if (error) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger" className="d-flex align-items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <div className="flex-grow-1">
            <strong>Lỗi tải dữ liệu:</strong> {error}
          </div>
          <button 
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={fetchManagerStats}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faRefresh} className="me-1" />
            Thử lại
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">
            <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
            Manager Dashboard
          </h2>
          <p className="text-muted mb-0">Tổng quan hệ thống quản lý HIV Treatment Center</p>
        </div>
        <div className="text-end">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={fetchManagerStats}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faRefresh} className={`me-1 ${loading ? 'fa-spin' : ''}`} />
            Cập nhật
          </button>
          {lastUpdated && (
            <small className="text-muted d-block mt-1">
              Cập nhật: {lastUpdated.toLocaleString('vi-VN')}
            </small>
          )}
        </div>
      </div>

      {loading && !lastUpdated ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Đang tải thống kê từ hệ thống...</p>
        </div>
      ) : (
        <Row>
          <StatCard
            title="Tổng số lịch hẹn"
            value={stats.totalAppointments}
            icon={faCalendarCheck}
            color="primary"
            description="Tất cả lịch hẹn trong hệ thống"
            subtext="Bao gồm tất cả trạng thái"
          />
          
          <StatCard
            title="Lịch hẹn hoàn thành hôm nay"
            value={stats.todayCompletedAppointments}
            icon={faCalendarDay}
            color="success"
            description={`Ngày ${new Date().toLocaleDateString('vi-VN')}`}
            subtext="Chỉ tính trạng thái COMPLETED"
            badge={{ color: 'success', text: 'Hôm nay' }}
          />
          
          <StatCard
            title="Tổng số bệnh nhân"
            value={stats.totalPatients}
            icon={faUsers}
            color="info"
            description="Bệnh nhân duy nhất trong hệ thống"
            subtext="Tính theo userName"
          />
          
          <StatCard
            title="Tổng số Doctor"
            value={stats.totalDoctors}
            icon={faUserMd}
            color="danger"
            description="Bác sĩ chuyên khoa HIV/AIDS"
            subtext="Đang hoạt động"
          />
          
          <StatCard
            title="Tổng số Staff"
            value={stats.totalStaff}
            icon={faUserTie}
            color="warning"
            description="Nhân viên hỗ trợ"
            subtext="Từ API backend"
          />

          {/* Summary Card */}
          <Col md={6} lg={4} className="mb-4">
            <Card className="h-100 border-0 bg-light">
              <Card.Body className="p-4">
                <h6 className="text-muted mb-3 small text-uppercase fw-bold">
                  <FontAwesomeIcon icon={faChartLine} className="me-2" />
                  Tóm tắt hệ thống
                </h6>
                <div className="mb-2">
                  <small className="text-muted">Hiệu suất hôm nay:</small>
                  <div className="progress mt-1" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ 
                        width: stats.totalAppointments > 0 ? 
                          `${(stats.todayCompletedAppointments / stats.totalAppointments * 100).toFixed(1)}%` : 
                          '0%' 
                      }}
                    ></div>
                  </div>
                  <small className="text-success">
                    {stats.totalAppointments > 0 ? 
                      `${(stats.todayCompletedAppointments / stats.totalAppointments * 100).toFixed(1)}%` : 
                      '0%'
                    } hoàn thành
                  </small>
                </div>
                
                <div className="row text-center mt-3">
                  <div className="col-6">
                    <div className="text-primary fw-bold">{stats.totalDoctors}</div>
                    <small className="text-muted">Bác sĩ</small>
                  </div>
                  <div className="col-6">
                    <div className="text-info fw-bold">{stats.totalPatients}</div>
                    <small className="text-muted">Bệnh nhân</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <style jsx>{`
        .stat-card {
          border: none;
          transition: all 0.2s ease;
          border-left: 4px solid transparent;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .stat-icon {
          width: 60px;
          height: 60px;
          font-size: 1.2rem;
        }
        .progress {
          border-radius: 10px;
        }
        .progress-bar {
          border-radius: 10px;
        }
      `}</style>
    </Container>
  );
};

export default ManagerOverview;
