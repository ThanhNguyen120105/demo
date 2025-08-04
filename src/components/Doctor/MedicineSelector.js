import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faSearch, faPills } from '@fortawesome/free-solid-svg-icons';
import { medicineAPI } from '../../services/api';
import './MedicineSelector.css';
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

      if (newMedicine.name.length < 2) {
        setAlert({
          show: true,
          variant: 'warning',
          message: 'Tên thuốc phải có ít nhất 2 ký tự'
        });
        return;
      }

      // Kiểm tra xem thuốc đã tồn tại chưa
      const existingMedicine = availableMedicines.find(med => med.name.toLowerCase() === newMedicine.name.toLowerCase());
      if (existingMedicine) {
        setAlert({
          show: true,
          variant: 'warning',
          message: `Thuốc "${newMedicine.name}" đã tồn tại`
        });
        return;
      }

      // Tạo thuốc mới
      setLoading(true);
      const result = await medicineAPI.createMedicine({
        name: newMedicine.name.trim(),
        description: newMedicine.description.trim() || null,
        imgURL: null // Có thể thêm sau nếu cần
      });

      if (result.success) {
        setAlert({
          show: true,
          variant: 'success',
          message: `Tạo thuốc "${newMedicine.name}" thành công`
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

    // Kiểm tra xem thuốc đã được chọn chưa
    const isAlreadySelected = medicines.some(med => 
      med.medicineId === medicineId || med.name.toLowerCase() === medicineName.toLowerCase()
    );

    if (isAlreadySelected) {
      setAlert({
        show: true,
        variant: 'warning',
        message: `Thuốc "${medicineName}" đã được chọn`
      });
      return;
    }

    // Thêm thuốc mới vào danh sách
    const newMedicine = {
      medicineId: medicineId,
      name: medicineName,
      dosage: '',
      amount: 0,
      note: ''
    };
    onAddMedicine(newMedicine);
  };

  // Lọc thuốc theo search term
  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicine.description && medicine.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      centered
      className="medicine-selector-modal"
    >
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              Thuốc đã chọn: 
              <span className="badge bg-primary ms-2">
                {medicines.length} thuốc
              </span>
            </h6>
            {!readOnly && medicines.length > 0 && (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => {
                  if (window.confirm(`Bạn có chắc chắn muốn xóa tất cả ${medicines.length} thuốc đã chọn không?`)) {
                    // Xóa tất cả thuốc bằng cách gọi onRemoveMedicine cho từng thuốc từ cuối lên đầu
                    for (let i = medicines.length - 1; i >= 0; i--) {
                      onRemoveMedicine(i);
                    }
                  }
                }}
                title="Xóa tất cả thuốc đã chọn"
              >
                <FontAwesomeIcon icon={faTimes} className="me-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
          {medicines && medicines.length > 0 ? (
            <div>
              {/* Header cho bảng thuốc */}
              <Row className="mb-2 p-2 bg-light border rounded">
                <Col md={2}>
                  <strong className="small">Tên thuốc</strong>
                </Col>
                <Col md={2}>
                  <strong className="small">Liều lượng</strong>
                </Col>
                <Col md={2}>
                  <strong className="small">Số lượng</strong>
                </Col>
                <Col md={5}>
                  <strong className="small">Ghi chú</strong>
                </Col>
                {!readOnly && (
                  <Col md={1} className="text-center">
                    <strong className="small">Xóa</strong>
                  </Col>
                )}
              </Row>
              
              {/* Danh sách thuốc */}
              {medicines.map((med, index) => (
              <Row 
                key={index} 
                className="mb-2 align-items-center p-2 border rounded medicine-row"
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="small">Tên thuốc *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={med.name || ''}
                      onChange={(e) => onMedicineChange(index, 'name', e.target.value)}
                      readOnly={readOnly}
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
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
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="small">Số lượng</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={med.amount || 0}
                      onChange={(e) => onMedicineChange(index, 'amount', e.target.value)}
                      readOnly={readOnly}
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label className="small">Ghi chú</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={med.note || ''}
                      onChange={(e) => onMedicineChange(index, 'note', e.target.value)}
                      readOnly={readOnly}
                      size="sm"
                      placeholder="VD: Uống sau ăn"
                    />
                  </Form.Group>
                </Col>
                {!readOnly && (
                  <Col md={1} className="d-flex align-items-end justify-content-center">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa thuốc "${med.name || 'này'}" khỏi danh sách không?`)) {
                          onRemoveMedicine(index);
                        }
                      }}
                      title={`Xóa thuốc "${med.name || 'này'}" khỏi danh sách`}
                      style={{
                        padding: '4px 8px',
                        minWidth: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        marginBottom: '1.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#dc3545';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} style={{ fontSize: '12px' }} />
                    </Button>
                  </Col>
                )}
              </Row>
            ))}
            </div>
          ) : (
            <div className="text-muted text-center py-4 border rounded bg-light">
              <FontAwesomeIcon icon={faPills} size="2x" className="mb-2 text-secondary" />
              <div className="mb-1">Chưa có thuốc nào được chọn</div>
              <small>Tìm kiếm và chọn thuốc từ danh sách bên dưới</small>
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">
                    <FontAwesomeIcon icon={faPlus} className="me-2 text-primary" />
                    Tạo thuốc mới
                  </h6>
                <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewMedicine({ name: '', description: '' });
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label className="small fw-bold">
                            Tên thuốc *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={newMedicine.name}
                            onChange={(e) => setNewMedicine(prev => ({ 
                              ...prev, 
                              name: e.target.value 
                            }))}
                            placeholder="VD: Thuốc Tenofovir"
                            size="sm"
                            maxLength={100}
                          />
                          <Form.Text className="text-muted">
                            {newMedicine.name.length}/100 ký tự
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label className="small fw-bold">
                            Mô tả
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            value={newMedicine.description}
                            onChange={(e) => setNewMedicine(prev => ({ 
                              ...prev, 
                              description: e.target.value 
                            }))}
                            placeholder="VD: Thuốc thuốc này hoạt động bằng cách ngăn chặn enzyme sao chép ngược ..."
                            size="sm"
                            maxLength={200}
                          />
                          <Form.Text className="text-muted">
                            {newMedicine.description.length}/200 ký tự
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={2} className="d-flex align-items-end">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleCreateMedicine}
                          disabled={loading || !newMedicine.name.trim()}
                          className="w-100"
                          style={{ marginBottom: '1.5rem' }}
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" className="me-1" />
                              Đang tạo...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faPlus} className="me-1" />
                              Tạo
                            </>
                          )}
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
