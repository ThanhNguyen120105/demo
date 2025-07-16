import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, faEye, faEdit, faTrash, faPlus, faTimes, faCheck, faList
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
  
  // File upload states (kept for preview functionality)
  const [previewImage, setPreviewImage] = useState(null);

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
        // Reset preview state
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
    
    // Update preview when avatarURL changes
    if (name === 'avatarURL') {
      setPreviewImage(value);
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
        setPreviewImage(null);
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
    setPreviewImage(null);
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
                    <Form.Control
                      type="text"
                      value={selectedDoctor.avatarURL || 'Chưa có'}
                      readOnly
                      className="bg-light"
                    />
                    
                    {/* Image Preview */}
                    {selectedDoctor.avatarURL && (
                      <div className="mt-3 text-center">
                        <img
                          src={selectedDoctor.avatarURL}
                          alt="Avatar"
                          className="img-thumbnail"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{ display: 'none' }} className="text-muted">
                          <small>Không thể tải ảnh từ URL này</small>
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
                  <Form.Control
                    type="url"
                    name="avatarURL"
                    value={updateFormData.avatarURL}
                    onChange={handleUpdateInputChange}
                    disabled={updateLoading}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  
                  {/* Image Preview */}
                  {previewImage && (
                    <div className="mt-3 text-center">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="text-muted">
                        <small>Không thể tải ảnh từ URL này</small>
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
              disabled={updateLoading}
              className="button-uniform"
            >
              <FontAwesomeIcon icon={faTimes} className="me-1" />
              Hủy
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={updateLoading}
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
