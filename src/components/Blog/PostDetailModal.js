import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes, faCalendarAlt, faUser, faTag
} from '@fortawesome/free-solid-svg-icons';
import LazyImage from '../common/LazyImage';
import './PostDetailModal.css';

const PostDetailModal = ({ show, onHide, post }) => {
  if (!post) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className="post-detail-modal"
      centered={true}
      scrollable={false}
      aria-labelledby="post-modal-title"
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header className="post-modal-header">
        <div className="modal-header-content">
          {/* Author Info as Header */}
          <div className="header-author-section">
            <div className="author-avatar-large">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="author-main-info">
              <h5 className="author-name-large">{post.author}</h5>
              <p className="author-role">{post.authorTitle || 'Nhân viên y tế'}</p>
              <div className="post-meta-header">
                <span className="post-time">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                  {formatDate(post.publishDate)}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="link"
            className="modal-close-btn"
            onClick={onHide}
            aria-label="Đóng modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body className="post-modal-body">
        {/* Post Title */}
        <div className="post-title-section">
          <h2 className="post-main-title">{post.title}</h2>
        </div>

        {/* Post Content - Only API data */}
        <div className="post-content-section">
          {/* Main content from API */}
          {post.content ? (
            <div className="post-full-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <div className="post-excerpt">
              {post.excerpt}
            </div>
          )}
        </div>

        {/* Tags Section */}
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="post-tags-section">
            <h6 className="tags-title">
              <FontAwesomeIcon icon={faTag} className="me-2" />
              Từ khóa liên quan:
            </h6>
            <div className="tags-container">
              {post.tags.map((tag, index) => (
                <Badge key={index} bg="secondary" className="tag-badge">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Post Image - Only if exists in API */}
        {post.thumbnail && (
          <div className="post-image-container-bottom">
            <LazyImage
              src={post.thumbnail}
              alt={post.title}
              className="post-illustration-image"
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PostDetailModal;
