import React from 'react';
import { Modal, Card, Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faStethoscope, 
  faCalendarAlt, 
  faEye, 
  faReply,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const QuestionDetailModal = ({ show, onHide, question }) => {
  if (!question) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered 
      scrollable
      backdrop="static"
      className="question-detail-modal"
      dialogClassName="modal-dialog-centered"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="text-primary">
          <FontAwesomeIcon icon={faStethoscope} className="me-2" />
          Chi tiết câu hỏi y khoa
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {/* Question Section */}
        <Card className="question-detail-card border-0 shadow-sm mb-4">
          <Card.Header className="bg-light border-0">
            <div className="d-flex justify-content-between align-items-start">
              <div className="question-meta">
                <h4 className="question-title mb-2">{question.title}</h4>
                <div className="meta-info text-muted">
                  <span className="me-3">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                    Bệnh nhân ẩn danh
                  </span>
                  <span className="me-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                    {formatDate(question.createdAt)}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faEye} className="me-1" />
                    {question.views || 0} lượt xem
                  </span>
                </div>
              </div>
              <div className="question-status">
                {question.status === 'answered' ? (
                  <Badge bg="success" className="fs-6">
                    <FontAwesomeIcon icon={faReply} className="me-1" />
                    Đã trả lời
                  </Badge>
                ) : (
                  <Badge bg="warning" className="fs-6">
                    Chờ trả lời
                  </Badge>
                )}
              </div>
            </div>
          </Card.Header>
          
          <Card.Body>
            <div className="question-content">
              <p className="mb-3" style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>
                {question.content}
              </p>
              
              {question.imageUrl && (
                <div className="question-image text-center mt-3">
                  <img 
                    src={question.imageUrl} 
                    alt="Hình ảnh minh họa" 
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Answers Section */}
        {question.answers && question.answers.length > 0 ? (
          <div className="answers-section">
            <h5 className="answers-title mb-3">
              <FontAwesomeIcon icon={faReply} className="me-2 text-primary" />
              Câu trả lời từ bác sĩ ({question.answers.length})
            </h5>
            
            {question.answers.map((answer, index) => (
              <Card key={index} className="answer-card border-start border-primary border-4 mb-3">
                <Card.Body>
                  <div className="answer-header d-flex justify-content-between align-items-start mb-3">
                    <div className="doctor-info">
                      <h6 className="doctor-name mb-1">
                        <FontAwesomeIcon icon={faStethoscope} className="me-2 text-primary" />
                        {answer.doctorName || 'Bác sĩ chuyên khoa'}
                      </h6>
                      <small className="text-muted">
                        {answer.doctorSpecialty || 'Chuyên khoa HIV/AIDS'}
                      </small>
                    </div>
                    <small className="text-muted">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                      {formatDate(answer.createdAt)}
                    </small>
                  </div>
                  
                  <div className="answer-content">
                    <p style={{ lineHeight: '1.6' }}>{answer.content}</p>
                  </div>
                  
                  {answer.imageUrl && (
                    <div className="answer-image text-center mt-3">
                      <img 
                        src={answer.imageUrl} 
                        alt="Hình ảnh trả lời" 
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '250px' }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-4 border-dashed">
            <Card.Body>
              <FontAwesomeIcon icon={faReply} size="2x" className="text-muted mb-3" />
              <h6 className="text-muted">Chưa có câu trả lời</h6>
              <p className="text-muted mb-0">
                Câu hỏi đang được xem xét và sẽ được bác sĩ trả lời sớm nhất có thể.
              </p>
            </Card.Body>
          </Card>
        )}

        {/* Medical Disclaimer */}
        <div className="medical-disclaimer mt-4">
          <Card className="border-warning">
            <Card.Body className="py-3">
              <small className="text-warning">
                <strong>Lưu ý y khoa:</strong> Thông tin tư vấn chỉ mang tính chất tham khảo. 
                Vui lòng đến cơ sở y tế để được khám và điều trị chính xác.
              </small>
            </Card.Body>
          </Card>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionDetailModal;
