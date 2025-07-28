import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, faEnvelope, faLock, faPhone, faUser, faCalendarAlt, 
  faVenusMars, faImage, faHospital, faStethoscope, faAward, faFileText,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { doctorAPI } from '../../services/api';

const CreateDoctorAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    birthdate: '',
    gender: '',
    avatarURL: '',
    specialization: '',
    hospital: '',
    description: '',
    awards: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [validated, setValidated] = useState(false);
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.content) {
      setMessage({ type: '', content: '' });
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for the selected image
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn một ảnh để tải lên');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      console.log('Bắt đầu upload ảnh:', selectedFile.name, 'kích thước:', selectedFile.size, 'loại:', selectedFile.type);

      // Create FormData object
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('filePath', 'doctorImage');
      formData.append('bucketName', 'document');

      // Log FormData content for debugging
      console.log('FormData được tạo với các trường:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Get auth token
      const token = localStorage.getItem('token');
      console.log('Token xác thực có sẵn:', !!token);
      
      // Hiển thị thông báo đang xử lý
      setMessage({ type: 'info', content: 'Đang tải ảnh lên server...' });
      
      // Gọi API upload
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      
      console.log('Server response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Upload thất bại với mã lỗi: ${response.status}. ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Upload successful, server response:', result);
      console.log('Response structure:', Object.keys(result || {}));
      
      // Thử nhiều format response khác nhau
      let uploadUrl = null;
      
      // Format 1: {status: {code: 200}, data: {url: "..."}}
      if (result.status?.code === 200 && result.data?.url) {
        uploadUrl = result.data.url;
        console.log('✅ Format 1 - Found URL:', uploadUrl);
      }
      // Format 2: {success: true, data: {url: "..."}}
      else if (result.success && result.data?.url) {
        uploadUrl = result.data.url;
        console.log('✅ Format 2 - Found URL:', uploadUrl);
      }
      // Format 3: {url: "..."}
      else if (result.url) {
        uploadUrl = result.url;
        console.log('✅ Format 3 - Found URL:', uploadUrl);
      }
      // Format 4: {data: "url_string"}
      else if (typeof result.data === 'string' && result.data.startsWith('http')) {
        uploadUrl = result.data;
        console.log('✅ Format 4 - Found URL:', uploadUrl);
      }
      // Format 5: {fileUrl: "..."}
      else if (result.fileUrl) {
        uploadUrl = result.fileUrl;
        console.log('✅ Format 5 - Found URL:', uploadUrl);
      }
      
      if (uploadUrl) {
        // Update form data with the new image URL
        setFormData(prev => ({
          ...prev,
          avatarURL: uploadUrl
        }));
        
        setMessage({ type: 'success', content: 'Tải ảnh lên thành công' });
      } else {
        console.error('❌ No URL found in response:', result);
        setMessage({ 
          type: 'warning', 
          content: 'Tải ảnh lên thành công nhưng không nhận được URL. Vui lòng liên hệ quản trị viên.' 
        });
      }
      
      setUploadProgress(100);
      setTimeout(() => setIsUploading(false), 500); // Giữ thanh tiến trình 100% trong nửa giây

    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ 
        type: 'danger', 
        content: `Không thể tải ảnh lên: ${error.message}. Vui lòng thử lại hoặc liên hệ quản trị viên.` 
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const validateForm = () => {
    const { email, password, fullName, phoneNumber } = formData;
    
    if (!email || !password || !fullName || !phoneNumber) {
      setMessage({ type: 'danger', content: 'Vui lòng điền đầy đủ thông tin' });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'danger', content: 'Email không hợp lệ' });
      return false;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage({ type: 'danger', content: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return false;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setMessage({ type: 'danger', content: 'Số điện thoại không hợp lệ (10-11 số)' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const result = await doctorAPI.createDoctor(formData);
      
      if (result.success) {
        setMessage({ type: 'success', content: result.message });
        // Reset form after successful creation
        setFormData({
          email: '',
          password: '',
          fullName: '',
          phoneNumber: '',
          birthdate: '',
          gender: '',
          avatarURL: '',
          specialization: '',
          hospital: '',
          description: '',
          awards: ''
        });
        
        // Clean up preview URL
        if (previewImage && previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setSelectedFile(null);
        setUploadProgress(0);
        
        setValidated(false);
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Create doctor account error:', error);
      setMessage({ 
        type: 'danger', 
        content: 'Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      birthdate: '',
      gender: '',
      avatarURL: '',
      specialization: '',
      hospital: '',
      description: '',
      awards: ''
    });
    
    // Clean up preview URL
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    setUploadProgress(0);
    
    setMessage({ type: '', content: '' });
    setValidated(false);
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <FontAwesomeIcon icon={faUserMd} size="2x" className="mb-2" />
              <h3 className="mb-0">Tạo Tài Khoản Bác Sĩ</h3>
              <p className="mb-0 mt-2">Tạo tài khoản mới cho bác sĩ trong hệ thống</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {message.content && (
                <Alert variant={message.type} className="mb-4">
                  {message.content}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Họ và tên <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nhập họ và tên đầy đủ"
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập họ và tên
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="doctor@example.com"
                        required
                        disabled={loading}
                        autoComplete="off"
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập email hợp lệ
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faPhone} className="me-2" />
                        Số điện thoại <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="0901234567"
                        required
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        Vui lòng nhập số điện thoại hợp lệ
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faLock} className="me-2" />
                        Mật khẩu <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                        required
                        disabled={loading}
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Thông tin cá nhân */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Ngày sinh
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faVenusMars} className="me-2" />
                        Giới tính
                      </Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                        Chuyên khoa
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="VD: Điều trị HIV/AIDS"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Thông tin công việc */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faHospital} className="me-2" />
                        Bệnh viện
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        placeholder="Tên bệnh viện nơi công tác"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faImage} className="me-2" />
                        Ảnh đại diện
                      </Form.Label>
                      <div className="d-flex align-items-center mb-2">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={loading || isUploading}
                          className="me-2"
                        />
                        <Button
                          variant="primary"
                          onClick={handleFileUpload}
                          disabled={!selectedFile || loading || isUploading}
                          title="Tải ảnh lên"
                        >
                          {isUploading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FontAwesomeIcon icon={faUpload} />
                          )}
                        </Button>
                      </div>
                      
                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="mb-2">
                          <div className="progress">
                            <div 
                              className="progress-bar progress-bar-striped progress-bar-animated" 
                              role="progressbar" 
                              style={{ width: `${uploadProgress}%` }}
                              aria-valuenow={uploadProgress} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >
                              {uploadProgress}%
                            </div>
                          </div>
                          <div className="text-center mt-1">
                            <small>Đang tải lên... vui lòng đợi</small>
                          </div>
                        </div>
                      )}
                      
                      {/* Hidden field to store the image URL */}
                      <Form.Control
                        type="hidden"
                        name="avatarURL"
                        value={formData.avatarURL}
                      />
                      
                      {/* Image Preview */}
                      {previewImage && (
                        <div className="mt-3 text-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                              console.error('Không thể tải ảnh từ URL:', previewImage);
                            }}
                          />
                          <div style={{ display: 'none' }} className="text-muted">
                            <small>Không thể tải ảnh</small>
                          </div>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Mô tả chi tiết */}
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faFileText} className="me-2" />
                        Mô tả
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả kinh nghiệm, chuyên môn của bác sĩ..."
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faAward} className="me-2" />
                        Giải thưởng & Thành tựu
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="awards"
                        value={formData.awards}
                        onChange={handleInputChange}
                        placeholder="Các giải thưởng, thành tựu đã đạt được..."
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleReset}
                    disabled={loading}
                    className="me-md-2"
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Reset
                  </Button>
                  
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUserMd} className="me-2" />
                        Tạo Tài Khoản
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateDoctorAccount;
