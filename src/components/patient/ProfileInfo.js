import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { patientAPI } from '../../data/mockPatientData';

const ProfileInfo = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Email không hợp lệ');
      }

      // Validate phone number format (Vietnamese format)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Số điện thoại không hợp lệ (10 số)');
      }

      // Call API to update profile
      const updatedProfile = await patientAPI.updateProfile(formData);
      onUpdateProfile(updatedProfile);
      setIsEditing(false);
      setSuccess('Cập nhật thông tin thành công');
    } catch (err) {
      setError(err.message);
    }
  };

  const renderViewMode = () => (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Thông tin cá nhân</h5>
          <Button
            variant="outline-primary"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        </div>

        <div className="profile-details">
          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="mb-1 text-muted">Họ và tên</p>
              <p className="mb-3">{profile.fullName}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="mb-1 text-muted">Email</p>
              <p className="mb-3">{profile.email}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="mb-1 text-muted">Số điện thoại</p>
              <p className="mb-3">{profile.phone}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="mb-1 text-muted">Ngày sinh</p>
              <p className="mb-3">{profile.dateOfBirth}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="mb-1 text-muted">Giới tính</p>
              <p className="mb-3">{profile.gender}</p>
            </div>
            <div className="col-12 mb-3">
              <p className="mb-1 text-muted">Địa chỉ</p>
              <p className="mb-3">{profile.address}</p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderEditMode = () => (
    <Card>
      <Card.Body>
        <h5 className="mb-4">Chỉnh sửa thông tin</h5>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày sinh</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setFormData(profile);
                setError(null);
                setSuccess(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );

  return (
    <div className="profile-info">
      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
};

export default ProfileInfo; 