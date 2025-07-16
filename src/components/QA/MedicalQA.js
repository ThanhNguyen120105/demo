import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEye, faComments, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import QuestionModal from './QuestionModal';
import QuestionDetailModal from './QuestionDetailModal';
import api from '../../services/api';
import './MedicalQA.css';

const MedicalQA = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // Giả lập dữ liệu trong khi chờ API
      setTimeout(() => {
        const mockQuestions = [
          {
            id: 1,
            title: "Tác dụng phụ của thuốc ARV có nguy hiểm không?",
            content: "Tôi vừa bắt đầu điều trị ARV được 2 tuần, cảm thấy buồn nôn và mệt mỏi. Các tác dụng phụ này có nguy hiểm không và sẽ kéo dài bao lâu? Tôi có nên tiếp tục uống thuốc không?",
            createdAt: "2025-07-10T10:30:00Z",
            views: 156,
            answersCount: 2,
            status: "answered"
          },
          {
            id: 2,
            title: "Khi nào cần xét nghiệm CD4?",
            content: "Bác sĩ cho em hỏi, sau khi điều trị ARV được 6 tháng thì cần xét nghiệm CD4 thường xuyên như thế nào? Và kết quả CD4 bao nhiêu là tốt?",
            createdAt: "2025-07-09T14:20:00Z",
            views: 89,
            answersCount: 1,
            status: "answered"
          },
          {
            id: 3,
            title: "Chế độ dinh dưỡng cho người nhiễm HIV",
            content: "Em muốn hỏi về chế độ ăn uống phù hợp cho người nhiễm HIV. Có thực phẩm nào cần tránh không? Và nên bổ sung vitamin gì?",
            createdAt: "2025-07-08T09:15:00Z",
            views: 234,
            answersCount: 3,
            status: "answered"
          },
          {
            id: 4,
            title: "Có thể mang thai khi điều trị ARV không?",
            content: "Em đang điều trị ARV được 1 năm, viral load không phát hiện được. Em có thể mang thai không? Có rủi ro gì cho con không?",
            createdAt: "2025-07-07T16:45:00Z",
            views: 312,
            answersCount: 2,
            status: "answered"
          },
          {
            id: 5,
            title: "Triệu chứng nhiễm trùng cơ hội cần chú ý",
            content: "Những triệu chứng nào cần đi khám ngay lập tức? Em đang có CD4 thấp và lo lắng về các bệnh nhiễm trùng cơ hội.",
            createdAt: "2025-07-06T11:30:00Z",
            views: 178,
            answersCount: 1,
            status: "answered"
          },
          {
            id: 6,
            title: "Thuốc ARV có tương tác với thuốc khác không?",
            content: "Em đang uống thuốc ARV và cần uống thuốc điều trị viêm gan B. Có bị tương tác thuốc không ạ?",
            createdAt: "2025-07-05T13:20:00Z",
            views: 67,
            answersCount: 0,
            status: "pending"
          }
        ];

        // Filter questions based on search term
        const filtered = searchTerm 
          ? mockQuestions.filter(q => 
              q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : mockQuestions;

        setQuestions(filtered);
        setTotalPages(Math.ceil(filtered.length / 9));
        setLoading(false);
        setError('');
      }, 1000);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Không thể tải danh sách câu hỏi');
      setQuestions([]);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQuestions();
  };

  const handleQuestionClick = async (questionId) => {
    try {
      // Giả lập chi tiết câu hỏi
      const mockQuestionDetail = {
        id: questionId,
        title: "Tác dụng phụ của thuốc ARV có nguy hiểm không?",
        content: "Tôi vừa bắt đầu điều trị ARV được 2 tuần, cảm thấy buồn nôn và mệt mỏi. Các tác dụng phụ này có nguy hiểm không và sẽ kéo dài bao lâu? Tôi có nên tiếp tục uống thuốc không? Hiện tại tôi đang uống phác đồ TDF + 3TC + EFV theo chỉ định của bác sĩ.",
        createdAt: "2025-07-10T10:30:00Z",
        views: 156,
        status: "answered",
        answers: [
          {
            id: 1,
            content: "Tác dụng phụ bạn đang gặp là hoàn toàn bình thường khi bắt đầu điều trị ARV. Buồn nôn và mệt mỏi thường xuất hiện trong 2-4 tuần đầu và sẽ giảm dần khi cơ thể thích nghi với thuốc. Tuyệt đối không được tự ý ngừng thuốc. Một số lời khuyên: 1) Uống thuốc sau bữa ăn để giảm buồn nôn 2) Chia nhỏ bữa ăn trong ngày 3) Uống đủ nước 4) Tránh rượu bia. Nếu triệu chứng nghiêm trọng hoặc kéo dài quá 4 tuần, hãy liên hệ bác sĩ để điều chỉnh phác đồ.",
            doctorName: "BS. Nguyễn Văn An",
            doctorSpecialty: "Chuyên khoa Nhiễm - HIV/AIDS",
            createdAt: "2025-07-10T15:20:00Z"
          },
          {
            id: 2,
            content: "Bổ sung thêm ý kiến của đồng nghiệp, tôi khuyên bạn nên theo dõi thêm các dấu hiệu như phát ban, vàng da, đau bụng dữ dội. Những triệu chứng này cần được báo ngay cho bác sĩ. Việc tuân thủ điều trị ARV rất quan trọng để đạt được viral load không phát hiện được.",
            doctorName: "BS. Trần Thị Bình",
            doctorSpecialty: "Phó Trưởng khoa Nhiễm",
            createdAt: "2025-07-11T09:45:00Z"
          }
        ]
      };
      
      setSelectedQuestion(mockQuestionDetail);
      setShowDetailModal(true);
      
      // Tăng lượt xem
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, views: q.views + 1 } : q
      ));
    } catch (error) {
      console.error('Error fetching question details:', error);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Container fluid className="medical-qa-container py-4">
      {/* Simple Header */}
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h2 className="simple-qa-title">HỎI ĐÁP</h2>
          </div>
        </Col>
      </Row>

      {/* Search and Actions */}
      <Row className="mb-4">
        <Col lg={8}>
          <Form onSubmit={handleSearch}>
            <div className="search-container">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm câu hỏi y khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Button type="submit" variant="primary" className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </Form>
        </Col>
        <Col lg={4} className="text-end">
          <Button 
            variant="success" 
            onClick={() => setShowQuestionModal(true)}
            className="ask-question-btn"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Đặt câu hỏi mới
          </Button>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Questions Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Đang tải danh sách câu hỏi...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state text-center py-5">
          <FontAwesomeIcon icon={faComments} size="3x" className="text-muted mb-3" />
          <h4 className="text-muted">Chưa có câu hỏi nào</h4>
          <p className="text-muted mb-4">Hãy là người đầu tiên đặt câu hỏi!</p>
          <Button 
            variant="primary" 
            onClick={() => setShowQuestionModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Đặt câu hỏi đầu tiên
          </Button>
        </div>
      ) : (
        <>
          <Row>
            {questions.map((question) => (
              <Col lg={4} md={6} className="mb-4" key={question.id}>
                <Card 
                  className="question-card h-100"
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="question-header mb-3">
                      <h5 className="question-title">{question.title}</h5>
                      <div className="question-meta">
                        <small className="text-muted">
                          <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                          {formatDate(question.createdAt)}
                        </small>
                      </div>
                    </div>
                    
                    <div className="question-content flex-grow-1 mb-3">
                      <p className="text-muted mb-0">
                        {truncateText(question.content)}
                      </p>
                    </div>

                    <div className="question-stats d-flex justify-content-between align-items-center">
                      <div className="stats-left">
                        <Badge bg="light" text="dark" className="me-2">
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          {question.views || 0}
                        </Badge>
                        <Badge bg="primary">
                          <FontAwesomeIcon icon={faComments} className="me-1" />
                          {question.answersCount || 0} trả lời
                        </Badge>
                      </div>
                      
                      <div className="stats-right">
                        {question.status === 'answered' ? (
                          <Badge bg="success">Đã trả lời</Badge>
                        ) : (
                          <Badge bg="warning">Chờ trả lời</Badge>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row className="mt-4">
              <Col>
                <div className="pagination-container d-flex justify-content-center">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="me-2"
                  >
                    Trang trước
                  </Button>
                  
                  <span className="page-info d-flex align-items-center mx-3">
                    Trang {currentPage} / {totalPages}
                  </span>
                  
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="ms-2"
                  >
                    Trang sau
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </>
      )}

      {/* Modals */}
      <QuestionModal
        show={showQuestionModal}
        onHide={() => setShowQuestionModal(false)}
        onSuccess={() => {
          setShowQuestionModal(false);
          fetchQuestions();
        }}
      />

      <QuestionDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        question={selectedQuestion}
      />
    </Container>
  );
};

export default MedicalQA;
