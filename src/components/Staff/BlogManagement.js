import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faEdit, faTrash, faBlog,
  faCalendarAlt, faUser, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { blogAPI } from '../../services/api';
import CreateBlogPost from './CreateBlogPost';
import './Staff.css';

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Load posts from API
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogAPI.getAllPosts();
      
      if (response.success) {
        setPosts(response.data || []);
      } else {
        throw new Error(response.message || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowCreateModal(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowCreateModal(true);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        // TODO: Implement delete API call
        console.log('Delete post:', postId);
        // For now, just remove from local state
        setPosts(prev => prev.filter(p => p.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Có lỗi xảy ra khi xóa bài viết');
      }
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setShowCreateModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PUBLISHED: { variant: 'success', text: 'Đã xuất bản' },
      DRAFT: { variant: 'warning', text: 'Bản nháp' },
      ARCHIVED: { variant: 'secondary', text: 'Đã lưu trữ' }
    };
    
    const config = statusConfig[status] || statusConfig.DRAFT;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="blog-management">
      <div className="content-header">
        <Row className="align-items-center">
          <Col>
            <h2>
              <FontAwesomeIcon icon={faBlog} className="me-2" />
              Quản lý Blog
            </h2>
            <p className="text-muted">Tạo và quản lý các bài viết blog phòng ngừa HIV</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleCreatePost}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Tạo bài viết mới
            </Button>
          </Col>
        </Row>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{posts.length}</h3>
              <p className="text-muted mb-0">Tổng bài viết</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">
                {posts.filter(p => p.status === 'PUBLISHED').length}
              </h3>
              <p className="text-muted mb-0">Đã xuất bản</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">
                {posts.filter(p => p.status === 'DRAFT').length}
              </h3>
              <p className="text-muted mb-0">Bản nháp</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Posts Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Danh sách bài viết</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {posts.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faBlog} size="3x" className="text-muted mb-3" />
              <h5>Chưa có bài viết nào</h5>
              <p className="text-muted">Hãy tạo bài viết đầu tiên của bạn!</p>
              <Button variant="primary" onClick={handleCreatePost}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Tạo bài viết mới
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '35%', textAlign: 'left'}}>Tiêu đề</th>
                    <th style={{width: '12%', textAlign: 'center'}}>Tác giả</th>
                    <th style={{width: '10%', textAlign: 'center'}}>Trạng thái</th>
                    <th style={{width: '15%', textAlign: 'center'}}>Ngày tạo</th>
                    <th style={{width: '28%', textAlign: 'center'}}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td style={{verticalAlign: 'middle'}}>
                        <div>
                          <strong>{post.title || 'Chưa có tiêu đề'}</strong>
                          {post.summary && (
                            <div className="text-muted small mt-1">
                              {post.summary.substring(0, 100)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        {post.author || 'Ẩn danh'}
                      </td>
                      <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                        {getStatusBadge(post.status)}
                      </td>
                      <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                        {formatDate(post.createdAt || post.createdDate)}
                      </td>
                      <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                        <div className="btn-group">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                            title="Chỉnh sửa"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            title="Xóa"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit Blog Post Modal */}
      {showCreateModal && (
        <CreateBlogPost
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          post={selectedPost}
          onPostCreated={handlePostCreated}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
};

export default BlogManagement;
