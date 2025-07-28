import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, faEye, faEdit, faTrash, faPlus, faTimes, faCheck, faList, faUpload, faImage
} from '@fortawesome/free-solid-svg-icons';
import { doctorAPI } from '../../services/api';
import './DoctorManagement.css';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Update form data
  const [updateFormData, setUpdateFormData] = useState({
    email: '',
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
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const result = await doctorAPI.getAllDoctorsForStaff();
      
      if (result.success) {
        setDoctors(result.data);
        setMessage({ type: '', content: '' }); // Clear any error messages
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setMessage({ type: 'danger', content: 'Không thể tải danh sách bác sĩ' });
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = async (doctor) => {
    try {
      setLoading(true);
      const result = await doctorAPI.getDoctorDetailById(doctor.id);
      
      if (result.success) {
        setSelectedDoctor(result.data);
        setShowDetailModal(true);
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Error fetching doctor detail:', error);
      setMessage({ type: 'danger', content: 'Không thể tải chi tiết bác sĩ' });
    } finally {
      setLoading(false);
    }
  };

  const handleShowUpdate = async (doctor) => {
    try {
      setLoading(true);
      const result = await doctorAPI.getDoctorDetailById(doctor.id);
      
      if (result.success) {
        setSelectedDoctor(result.data);
        setUpdateFormData({
          email: result.data.email || '',
          fullName: result.data.fullName || '',
          phoneNumber: result.data.phoneNumber || '',
          birthdate: result.data.birthdate || '',
          gender: result.data.gender || '',
          avatarURL: result.data.avatarURL || '',
          specialization: result.data.specialization || '',
          hospital: result.data.hospital || '',
          description: result.data.description || '',
          awards: result.data.awards || ''
        });
        // Set preview image from existing avatarURL
        setPreviewImage(result.data.avatarURL || null);
        setShowUpdateModal(true);
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Error fetching doctor detail:', error);
      setMessage({ type: 'danger', content: 'Không thể tải thông tin bác sĩ' });
    } finally {
      setLoading(false);
    }
  };

  const handleShowDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      
      // Gọi API upload - sử dụng endpoint đúng như trong videoCallLogger.js
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
      
      // Thử nhiều format response khác nhau - giống như trong videoCallLogger.js
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
        setUpdateFormData(prev => ({
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const result = await doctorAPI.updateDoctor(selectedDoctor.id, updateFormData);
      
      if (result.success) {
        setMessage({ type: 'success', content: 'Cập nhật thông tin bác sĩ thành công' });
        setShowUpdateModal(false);
        
        // Clean up preview URL
        if (previewImage && previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setSelectedFile(null);
        
        fetchDoctors(); // Refresh list
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      setMessage({ type: 'danger', content: 'Không thể cập nhật thông tin bác sĩ' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const result = await doctorAPI.deleteDoctor(selectedDoctor.id);
      
      if (result.success) {
        setMessage({ type: 'success', content: 'Xóa bác sĩ thành công' });
        setShowDeleteModal(false);
        fetchDoctors(); // Refresh list
      } else {
        setMessage({ type: 'danger', content: result.message });
      }
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setMessage({ type: 'danger', content: 'Không thể xóa bác sĩ' });
    } finally {
      setLoading(false);
    }
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setSelectedDoctor(null);
    
    // Clean up preview URL
    if (previewImage && previewImage.startsWith('blob:')) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <FontAwesomeIcon icon={faList} className="me-2" />
                <strong>Danh sách bác sĩ</strong>
              </div>
              <Button variant="light" size="sm" onClick={fetchDoctors} disabled={loading}>
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Làm mới
              </Button>
            </Card.Header>
            
            <Card.Body>
              {message.content && (
                <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', content: '' })}>
                  {message.content}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Đang tải danh sách bác sĩ...</p>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Họ và tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Không có bác sĩ nào trong hệ thống
                        </td>
                      </tr>
                    ) : (
                      doctors.map((doctor, index) => (
                        <tr key={doctor.id}>
                          <td>{index + 1}</td>
                          <td>{doctor.fullName}</td>
                          <td>{doctor.email}</td>
                          <td>{doctor.phoneNumber}</td>
                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => handleShowDetail(doctor)}
                              title="Xem chi tiết"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-1"
                              onClick={() => handleShowUpdate(doctor)}
                              title="Cập nhật thông tin"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleShowDelete(doctor)}
                              title="Xóa"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detail Modal - Reusing Update Modal Layout */}
      <Modal 
        show={showDetailModal} 
        onHide={closeModals} 
        size="lg" 
        centered
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            Chi tiết bác sĩ
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.fullName || ''}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={selectedDoctor.email || ''}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      value={selectedDoctor.phoneNumber || ''}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ngày sinh</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.birthdate || 'Chưa có'}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        selectedDoctor.gender === 'MALE' ? 'Nam' : 
                        selectedDoctor.gender === 'FEMALE' ? 'Nữ' : 'Chưa có'
                      }
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chuyên khoa</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.specialization || 'Chưa có'}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bệnh viện</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedDoctor.hospital || 'Chưa có'}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    
                    {/* Image Preview */}
                    <div className="mt-2 text-center">
                      {selectedDoctor.avatarURL ? (
                        <img
                          src={selectedDoctor.avatarURL}
                          alt="Avatar"
                          className="img-thumbnail"
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          <FontAwesomeIcon icon={faUserMd} size="3x" />
                          <p>Chưa có ảnh đại diện</p>
                        </div>
                      )}
                      <div style={{ display: 'none' }} className="text-muted">
                        <small>Không thể tải ảnh</small>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={selectedDoctor.description || 'Chưa có'}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Giải thưởng</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={selectedDoctor.awards || 'Chưa có'}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <div className="modal-footer-custom">
          <Button 
            variant="secondary" 
            onClick={closeModals}
            className="button-uniform"
          >
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            Đóng
          </Button>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal 
        show={showUpdateModal} 
        onHide={closeModals} 
        size="lg" 
        centered
        dialogClassName="custom-modal-dialog"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faEdit} className="me-2" />
            Cập nhật thông tin bác sĩ
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên *</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={updateFormData.fullName}
                    onChange={handleUpdateInputChange}
                    required
                    disabled={updateLoading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={updateFormData.email}
                    onChange={handleUpdateInputChange}
                    required
                    disabled={updateLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={updateFormData.phoneNumber}
                    onChange={handleUpdateInputChange}
                    required
                    disabled={updateLoading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={updateFormData.birthdate}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    name="gender"
                    value={updateFormData.gender}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Chuyên khoa</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={updateFormData.specialization}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                    placeholder="VD: Điều trị HIV/AIDS"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bệnh viện</Form.Label>
                  <Form.Control
                    type="text"
                    name="hospital"
                    value={updateFormData.hospital}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                    placeholder="Tên bệnh viện nơi công tác"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <div className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={updateLoading || isUploading}
                      className="me-2"
                    />
                    <Button
                      variant="primary"
                      onClick={handleFileUpload}
                      disabled={!selectedFile || updateLoading || isUploading}
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
                    value={updateFormData.avatarURL}
                  />
                  
                  {/* Image Preview */}
                  {previewImage && (
                    <div className="mt-3 text-center file-upload-preview">
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

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={updateFormData.description}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                    placeholder="Mô tả kinh nghiệm, chuyên môn của bác sĩ..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Giải thưởng</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="awards"
                    value={updateFormData.awards}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                    placeholder="Các giải thưởng, thành tựu đã đạt được..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <div className="modal-footer-custom">
            <Button 
              variant="secondary" 
              onClick={closeModals} 
              disabled={updateLoading || isUploading}
              className="button-uniform"
            >
              <FontAwesomeIcon icon={faTimes} className="me-1" />
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={updateLoading || isUploading}
              className="button-uniform"
            >
              {updateLoading ? (
                <Spinner animation="border" size="sm" className="me-1" />
              ) : (
                <FontAwesomeIcon icon={faCheck} className="me-1" />
              )}
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faTrash} className="me-2 text-danger" />
            Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa bác sĩ này không?</p>
          {selectedDoctor && (
            <div className="bg-light p-3 rounded">
              <strong>{selectedDoctor.fullName}</strong><br />
              <small className="text-muted">{selectedDoctor.email}</small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModals} disabled={loading}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" className="me-1" />
            ) : (
              <FontAwesomeIcon icon={faTrash} className="me-1" />
            )}
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DoctorManagement;
