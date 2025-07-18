import React, { useState, useEffect } from 'react';
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
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Implement image upload to server
      // For now, just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
    }
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
                      onChange={handleImageUpload}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {formData.imageUrl && (
                <div className="mb-3">
                  <img 
                    src={formData.imageUrl} 
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
