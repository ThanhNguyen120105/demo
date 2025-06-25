import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faSearch, faPills } from '@fortawesome/free-solid-svg-icons';
import { medicineAPI } from '../../services/api';

const MedicineSelector = ({ 
  show, 
  onHide, 
  medicines = [], 
  onMedicineChange, 
  onAddMedicine, 
  onRemoveMedicine, 
  readOnly = false 
}) => {
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    description: ''
  });
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  // Load danh sách thuốc khi component mount
  useEffect(() => {
    if (show) {
      loadMedicines();
    }
  }, [show]);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const result = await medicineAPI.getAllMedicines();
      
      if (result.success) {
        setAvailableMedicines(result.data || []);
      } else {
        setAlert({
          show: true,
          variant: 'danger',
          message: result.message || 'Không thể tải danh sách thuốc'
        });
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
      setAlert({
        show: true,
        variant: 'danger',
        message: 'Đã xảy ra lỗi khi tải danh sách thuốc'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMedicine = async () => {
    try {
      if (!newMedicine.name.trim()) {
        setAlert({
          show: true,
          variant: 'warning',
          message: 'Vui lòng nhập tên thuốc'
        });
        return;
      }

      setLoading(true);
      const result = await medicineAPI.createMedicine({
        name: newMedicine.name.trim(),
        description: newMedicine.description.trim() || null
      });

      if (result.success) {
        setAlert({
          show: true,
          variant: 'success',
          message: 'Tạo thuốc mới thành công'
        });
        
        // Reset form
        setNewMedicine({ name: '', description: '' });
        setShowCreateForm(false);
        
        // Reload danh sách thuốc
        await loadMedicines();
      } else {
        setAlert({
          show: true,
          variant: 'danger',
          message: result.message || 'Không thể tạo thuốc mới'
        });
      }
    } catch (error) {
      console.error('Error creating medicine:', error);
      setAlert({
        show: true,
        variant: 'danger',
        message: 'Đã xảy ra lỗi khi tạo thuốc mới'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMedicineSelect = (medicineId, medicineName) => {
    // Thêm thuốc mới vào danh sách
    const newMedicine = {
      medicineId: medicineId,
      medicineName: medicineName,
      dosage: '',
      status: 'Mới'
    };
    onAddMedicine(newMedicine);
  };

  // Lọc thuốc theo search term
  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicine.description && medicine.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faPills} className="me-2" />
          Quản lý thuốc điều trị
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alert.show && (
          <Alert 
            variant={alert.variant} 
            onClose={() => setAlert({ show: false, variant: '', message: '' })} 
            dismissible
            className="mb-3"
          >
            {alert.message}
          </Alert>
        )}

        {/* Thuốc hiện tại */}
        <div className="mb-4">
          <h6 className="mb-3">Thuốc đã chọn:</h6>
          {medicines && medicines.length > 0 ? (
            medicines.map((med, index) => (
              <Row key={index} className="mb-2 align-items-center p-2 border rounded">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small">Tên thuốc *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={med.medicineName || ''}
                      onChange={(e) => onMedicineChange(index, 'medicineName', e.target.value)}
                      readOnly={readOnly}
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small">Liều lượng *</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="vd: 1 viên/ngày"
                      value={med.dosage || ''}
                      onChange={(e) => onMedicineChange(index, 'dosage', e.target.value)}
                      readOnly={readOnly}
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small">Trạng thái *</Form.Label>
                    <Form.Select 
                      value={med.status || 'Mới'}
                      onChange={(e) => onMedicineChange(index, 'status', e.target.value)}
                      disabled={readOnly}
                      size="sm"
                    >
                      <option value="Mới">Mới</option>
                      <option value="Tiếp tục">Tiếp tục</option>
                      <option value="Đã thay đổi">Đã thay đổi</option>
                      <option value="Đã ngừng">Đã ngừng</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                {!readOnly && (
                  <Col md={2} className="d-flex align-items-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => onRemoveMedicine(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  </Col>
                )}
              </Row>
            ))
          ) : (
            <div className="text-muted text-center py-3 border rounded">
              Chưa có thuốc nào được chọn
            </div>
          )}
        </div>

        {!readOnly && (
          <>
            {/* Tìm kiếm và chọn thuốc */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Chọn thuốc từ danh sách:</h6>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Tạo thuốc mới
                </Button>
              </div>

              {/* Form tạo thuốc mới */}
              {showCreateForm && (
                <div className="mb-3 p-3 border rounded bg-light">
                  <h6>Tạo thuốc mới:</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small">Tên thuốc *</Form.Label>
                        <Form.Control
                          type="text"
                          value={newMedicine.name}
                          onChange={(e) => setNewMedicine(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nhập tên thuốc"
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small">Mô tả</Form.Label>
                        <Form.Control
                          type="text"
                          value={newMedicine.description}
                          onChange={(e) => setNewMedicine(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Mô tả thuốc (tùy chọn)"
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleCreateMedicine}
                        disabled={loading}
                        className="w-100"
                      >
                        {loading ? <Spinner size="sm" /> : 'Tạo'}
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Tìm kiếm */}
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm thuốc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                />
              </Form.Group>

              {/* Danh sách thuốc */}
              <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="border rounded">
                {loading ? (
                  <div className="text-center py-3">
                    <Spinner size="sm" className="me-2" />
                    Đang tải danh sách thuốc...
                  </div>
                ) : filteredMedicines.length > 0 ? (
                  filteredMedicines.map((medicine) => (
                    <div 
                      key={medicine.id} 
                      className="p-2 border-bottom d-flex justify-content-between align-items-center medicine-item"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMedicineSelect(medicine.id, medicine.name)}
                    >
                      <div>
                        <div className="fw-bold">{medicine.name}</div>
                        {medicine.description && (
                          <div className="text-muted small">{medicine.description}</div>
                        )}
                      </div>
                      <Button variant="outline-primary" size="sm">
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-3 text-muted">
                    {searchTerm ? 'Không tìm thấy thuốc phù hợp' : 'Không có thuốc nào'}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicineSelector;
