import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave, faTimes, faTag,
  faEye, faEdit
} from '@fortawesome/free-solid-svg-icons';
import { blogAPI } from '../../services/api';

const CreateBlogPost = ({ show, onHide, post, onPostCreated, onPostUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    tags: '',
    status: 'DRAFT'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(false);
  
  // Image upload states
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);

  // Initialize form data when editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        summary: post.summary || post.excerpt || '',
        imageUrl: post.imageUrl || post.thumbnail || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        status: post.status || 'DRAFT'
      });
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        content: '',
        summary: '',
        imageUrl: '',
        tags: '',
        status: 'DRAFT'
      });
    }
  }, [post]);

  // Handle image file selection and auto upload
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploadError('');
    
    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Auto upload using fetch API (similar to VideoCallLogger)
    try {
      setUploadingImage(true);
      
      console.log('Starting upload process...');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Create FormData like VideoCallLogger
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filePath', 'img');
      formData.append('bucketName', 'document');

      // Get token for authorization
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Use fetch API like VideoCallLogger
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: headers,
        body: formData
      });

      console.log('Upload response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload result received:', result);

        // Parse URL from response (should be in result.data)
        const imageUrl = result.data; // Direct URL from backend
        
        console.log('Setting imageUrl to:', imageUrl);
        
        setFormData(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));
        
        setUploadError('');
        
        // Clear file input but keep preview
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        console.log('Image uploaded successfully!');
        
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        console.error('Upload failed:', errorData);
        setUploadError(errorData.message || 'Không thể tải ảnh lên');
        setImagePreview(''); // Clear preview on error
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Có lỗi xảy ra khi tải ảnh lên');
      setImagePreview(''); // Clear preview on error
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data for API
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || formData.content.substring(0, 200) + '...',
        imageUrl: formData.imageUrl.trim() || null,
        tags: formData.tags.trim()
      };

      let response;
      if (post) {
        // TODO: Implement update API call
        response = { success: true, data: { ...post, ...postData, id: post.id } };
      } else {
        // Create new post
        response = await blogAPI.createPost(postData);
      }

      if (response.success) {
        if (post) {
          onPostUpdated?.(response.data);
        } else {
          onPostCreated?.(response.data);
        }
        onHide();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.message || 'Có lỗi xảy ra khi lưu bài viết');
    } finally {
      setLoading(false);
    }
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      backdrop="static"
      keyboard={false}
      className="create-blog-modal"
      animation={true}
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="d-flex align-items-center">
          <FontAwesomeIcon icon={faEdit} className="me-2 text-primary" />
          {post ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Row>
            <Col md={preview ? 6 : 12}>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Tiêu đề bài viết *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Nhập tiêu đề bài viết..."
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PUBLISHED">Xuất bản</option>
                      <option value="ARCHIVED">Lưu trữ</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tóm tắt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                />
              </Form.Group>

              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>URL hình ảnh</Form.Label>
                    <Form.Control
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Hoặc tải ảnh lên</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    {uploadingImage && (
                      <small className="text-info">
                        <Spinner size="sm" className="me-1" />
                        Đang tải lên...
                      </small>
                    )}
                    {uploadError && (
                      <small className="text-danger d-block">{uploadError}</small>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {(imagePreview || formData.imageUrl) && (
                <div className="mb-3">
                  <img 
                    src={imagePreview || formData.imageUrl} 
                    alt="Preview" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>
                  <FontAwesomeIcon icon={faTag} className="me-1" />
                  Tags (phân cách bằng dấu phẩy)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: HIV, phòng ngừa, sức khỏe, ARV"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nội dung bài viết *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={preview ? 10 : 15}
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung bài viết... Bạn có thể sử dụng Markdown hoặc HTML cơ bản."
                  required
                />
                <Form.Text className="text-muted">
                  Hỗ trợ HTML cơ bản: &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;
                </Form.Text>
              </Form.Group>
            </Col>

            {preview && (
              <Col md={6}>
                <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa', height: 'fit-content' }}>
                  <h5 className="text-primary mb-3">
                    <FontAwesomeIcon icon={faEye} className="me-2" />
                    Xem trước
                  </h5>
                  
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="img-fluid mb-3 rounded"
                      style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                    />
                  )}
                  
                  <h3>{formData.title || 'Tiêu đề bài viết'}</h3>
                  
                  {formData.summary && (
                    <p className="text-muted fst-italic">{formData.summary}</p>
                  )}
                  
                  {formData.tags && (
                    <div className="mb-3">
                      {formData.tags.split(',').map((tag, index) => (
                        <span key={index} className="badge bg-secondary me-1">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    className="content-preview"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.content.replace(/\n/g, '<br>') 
                    }}
                  />
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={togglePreview}
          >
            <FontAwesomeIcon icon={faEye} className="me-2" />
            {preview ? 'Ẩn xem trước' : 'Xem trước'}
          </Button>
          
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Hủy
          </Button>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !formData.title.trim() || !formData.content.trim()}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {post ? 'Cập nhật' : 'Tạo bài viết'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateBlogPost;
