import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faCalendarAlt, faUser, faHeart, faEye,
  faFilter, faArrowUp, faArrowDown, faShieldAlt,
  faExclamationTriangle, faRedo
} from '@fortawesome/free-solid-svg-icons';
import { blogAPI } from '../../services/api';
import LazyImage from '../common/LazyImage';
import PostDetailModal from './PostDetailModal';
import './HIVPreventionBlog.css';

const HIVPreventionBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  
  // Modal state
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Data mapping function to normalize API response
  const mapApiDataToUIFormat = (apiPost) => {
    return {
      id: apiPost.id || Math.random(),
      title: apiPost.title || 'Chưa có tiêu đề',
      excerpt: apiPost.excerpt || apiPost.summary || apiPost.content?.substring(0, 200) + '...' || 'Chưa có nội dung',
      content: apiPost.content || null,
      author: apiPost.author || 'Tác giả ẩn danh',
      authorTitle: apiPost.authorTitle || 'Nhân viên y tế',
      publishDate: apiPost.publishDate || apiPost.createdDate || new Date().toISOString(),
      thumbnail: apiPost.imageUrl || apiPost.thumbnail || apiPost.image || null,
      likes: apiPost.likes || 0,
      views: apiPost.views || apiPost.viewCount || 0,
      comments: apiPost.comments || 0,
      category: apiPost.category || null,
      readTime: apiPost.readTime || '5 phút đọc',
      featured: apiPost.featured || false,
      tags: Array.isArray(apiPost.tags) ? apiPost.tags : (apiPost.tags ? apiPost.tags.split(',').map(tag => tag.trim()) : [])
    };
  };

  // Load posts from API
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogAPI.getAllPosts();
      
      if (response.success) {
        const mappedPosts = response.data.map(mapApiDataToUIFormat);
        setPosts(mappedPosts);
      } else {
        throw new Error(response.message || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải bài viết');
      
      // Fallback to empty array instead of mock data
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Filter and sort posts using debounced search term
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())));
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.publishDate) - new Date(b.publishDate);
          break;
        case 'likes':
          comparison = a.likes - b.likes;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title, 'vi');
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Handle post click to open modal
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="hiv-blog-loading">
        <Container className="text-center py-5">
          <div className="loading-spinner">
            <Spinner animation="border" variant="primary" size="lg" />
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <h4 className="mt-4 text-muted">Đang tải bài viết...</h4>
          <p className="text-muted">Vui lòng chờ trong giây lát</p>
        </Container>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="hiv-prevention-blog">
        <Container className="text-center py-5">
          <Alert variant="danger" className="error-state">
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-3 text-danger" />
            <h4>Có lỗi xảy ra</h4>
            <p className="mb-3">{error}</p>
            <Button 
              variant="outline-primary"
              onClick={loadPosts}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faRedo} className="me-2" />
              {loading ? 'Đang tải...' : 'Thử lại'}
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="hiv-prevention-blog">
      {/* Hero Section */}
      <section className="hiv-blog-hero">
        <Container>
          <Row className="justify-content-center text-center py-4">
            <Col lg={8}>
              <h1 className="hero-title">Blog Phòng Ngừa HIV</h1>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search and Sort Section */}
      <section className="search-sort-section">
        <Container>
          <Card className="search-sort-card">
            <Card.Body>
              <Row className="g-3 align-items-center">
                <Col lg={6} md={8}>
                  <div className="search-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm bài viết, tác giả, từ khóa..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="search-input"
                    />
                    {searchTerm && (
                      <button 
                        className="search-clear"
                        onClick={() => setSearchTerm('')}
                        aria-label="Xóa tìm kiếm"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </Col>
                <Col lg={6} md={4}>
                  <div className="sort-controls">
                    <span className="sort-label d-none d-md-inline">
                      <FontAwesomeIcon icon={faFilter} className="me-2" />
                      Sắp xếp:
                    </span>
                    <div className="sort-buttons">
                      {[
                        { key: 'date', label: 'Mới nhất', icon: faCalendarAlt },
                        { key: 'likes', label: 'Yêu thích', icon: faHeart },
                        { key: 'views', label: 'Xem nhiều', icon: faEye }
                      ].map(({ key, label, icon }) => (
                        <Button
                          key={key}
                          variant={sortBy === key ? 'primary' : 'outline-secondary'}
                          size="sm"
                          onClick={() => handleSortChange(key)}
                          className="sort-btn"
                        >
                          <FontAwesomeIcon icon={icon} className="me-1" />
                          <span className="d-none d-sm-inline">{label}</span>
                          {sortBy === key && (
                            <FontAwesomeIcon 
                              icon={sortOrder === 'asc' ? faArrowUp : faArrowDown} 
                              className="ms-1" 
                            />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
              
              {/* Search Results Info */}
              {debouncedSearchTerm && (
                <Row className="mt-3">
                  <Col>
                    <div className="search-results-info">
                      <FontAwesomeIcon icon={faSearch} className="me-2 text-primary" />
                      Tìm thấy <strong>{filteredAndSortedPosts.length}</strong> kết quả cho 
                      "<strong>{debouncedSearchTerm}</strong>"
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* Main Content */}
      <section className="main-content">
        <Container>
          <Row>
            {/* Main Posts Area */}
            <Col lg={12}>
              {filteredAndSortedPosts.length === 0 ? (
                <Alert variant="info" className="empty-state">
                  <div className="text-center py-4">
                    <FontAwesomeIcon icon={faSearch} size="3x" className="mb-3 text-muted" />
                    <h5>Không tìm thấy bài viết nào</h5>
                    <p className="mb-3">
                      {debouncedSearchTerm 
                        ? `Không có kết quả cho "${debouncedSearchTerm}"`
                        : 'Hãy thử tìm kiếm với từ khóa khác.'
                      }
                    </p>
                    {debouncedSearchTerm && (
                      <Button 
                        variant="outline-primary"
                        onClick={() => {
                          setSearchTerm('');
                          setCurrentPage(1);
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </Alert>
              ) : (
                <>
                  {/* Posts Grid */}
                  <div className="posts-grid">
                    {currentPosts.map((post, index) => (
                      <Card key={post.id} className={`post-card ${post.featured ? 'featured' : ''}`}>
                        <div className="post-thumbnail">
                          <LazyImage 
                            src={post.thumbnail} 
                            alt={post.title}
                            className="post-image"
                          />
                          <div className="post-overlay">
                            <div className="post-category">
                              {post.category}
                            </div>
                            {post.featured && (
                              <div className="featured-badge">
                                <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                                Nổi bật
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Card.Body className="post-body">
                          <div className="post-meta">
                            <div className="meta-item">
                              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                              <small>{formatDate(post.publishDate)}</small>
                            </div>
                          </div>
                          
                          <Card.Title className="post-title">
                            <button 
                              className="title-link-btn"
                              onClick={() => handlePostClick(post)}
                              aria-label={`Xem chi tiết bài viết: ${post.title}`}
                            >
                              {post.title}
                            </button>
                          </Card.Title>
                          
                          <Card.Text className="post-excerpt">
                            {post.excerpt}
                          </Card.Text>
                          
                          <div className="post-tags">
                            {post.tags && Array.isArray(post.tags) && post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="post-footer">
                            <div className="author-info">
                              <div className="author-avatar">
                                <FontAwesomeIcon icon={faUser} />
                              </div>
                              <div className="author-details">
                                <div className="author-name">{post.author}</div>
                                <div className="author-title">{post.authorTitle}</div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-wrapper">
                      <Pagination className="custom-pagination justify-content-center">
                        <Pagination.First 
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                        />
                        <Pagination.Prev 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                        
                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Pagination.Item>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return <Pagination.Ellipsis key={page} />;
                          }
                          return null;
                        })}
                        
                        <Pagination.Next 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                        <Pagination.Last 
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                      
                      <div className="pagination-info text-center mt-3">
                        <small className="text-muted">
                          Hiển thị {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredAndSortedPosts.length)} 
                          trong tổng số {filteredAndSortedPosts.length} bài viết
                        </small>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Post Detail Modal */}
      <PostDetailModal
        show={showModal}
        onHide={handleModalClose}
        post={selectedPost}
      />
    </div>
  );
};

export default HIVPreventionBlog;
