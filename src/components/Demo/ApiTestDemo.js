import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ApiTestDemo = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    phoneNumber: '0123456789'
  });

  const API_BASE_URL = 'http://localhost:8080/api';

  const testAPI = async (endpoint, method = 'GET', data = null, testName) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    
    try {
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          status: response.status,
          data: response.data,
          message: 'API call successful'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          status: error.response?.status || 'Network Error',
          data: error.response?.data || error.message,
          message: error.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const handleRegisterTest = () => {
    const registerData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber
    };
    
    testAPI('/auth/register', 'POST', registerData, 'register');
  };

  const handleLoginTest = () => {
    const loginData = {
      email: formData.email,
      password: formData.password
    };
    
    testAPI('/auth/login', 'POST', loginData, 'login');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderTestResult = (testName, title) => {
    const result = testResults[testName];
    if (!result) return null;

    return (
      <Alert variant={result.success ? 'success' : 'danger'} className="mt-3">
        <Alert.Heading>{title}</Alert.Heading>
        <p><strong>Status:</strong> {result.status}</p>
        <p><strong>Message:</strong> {result.message}</p>
        <details>
          <summary>Response Data</summary>
          <pre className="mt-2" style={{ fontSize: '0.8em', maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </details>
      </Alert>
    );
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">API Test Demo</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h5>Test Data</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="mb-4">
                <h5>API Tests</h5>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="success" 
                    onClick={handleRegisterTest}
                    disabled={loading.register}
                  >
                    {loading.register ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Testing Register...
                      </>
                    ) : (
                      'Test Register API'
                    )}
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleLoginTest}
                    disabled={loading.login}
                  >
                    {loading.login ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Testing Login...
                      </>
                    ) : (
                      'Test Login API'
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h5>Test Results</h5>
                {renderTestResult('register', 'Register API Test')}
                {renderTestResult('login', 'Login API Test')}
                
                {Object.keys(testResults).length === 0 && (
                  <p className="text-muted">Chưa có kết quả test nào. Nhấn các nút test để bắt đầu.</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApiTestDemo; 