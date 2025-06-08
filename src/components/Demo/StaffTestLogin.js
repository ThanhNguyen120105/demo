import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { authAPI } from '../../services/api';

const StaffTestLogin = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const testStaffLogin = async () => {
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const result = await authAPI.login({
        email: 'test@gmail.com',
        password: '123456'
      });

      if (result.success) {
        setMessage({ 
          type: 'success', 
          content: 'Đăng nhập staff thành công! Bạn có thể vào trang Staff để tạo tài khoản doctor.' 
        });
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          window.location.href = '/staff/dashboard';
        }, 2000);
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        content: 'Lỗi khi đăng nhập: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-info text-white text-center">
              <h4>Test Đăng Nhập Staff</h4>
            </Card.Header>
            <Card.Body>
              {message.content && (
                <Alert variant={message.type} className="mb-3">
                  {message.content}
                </Alert>
              )}
              
              <div className="text-center">
                <p>Tài khoản staff test có sẵn:</p>
                <ul className="list-unstyled">
                  <li><strong>Email:</strong> test@gmail.com</li>
                  <li><strong>Password:</strong> 123456</li>
                </ul>
                
                <Button 
                  variant="primary" 
                  onClick={testStaffLogin}
                  disabled={loading}
                  size="lg"
                  className="mt-3"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập Staff'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffTestLogin;
