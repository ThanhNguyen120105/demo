import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle, faSearch, faLightbulb, faUserMd, faFilter,
  faCalendarAlt, faSave, faTimes, faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import DoctorSidebar from './DoctorSidebar';
import './Doctor.css';

// Dữ liệu mẫu cho câu hỏi chưa trả lời
const unansweredQuestionsData = [
  {
    id: 1,
    question: 'Is umbilical cord infection dangerous?',
    content: 'Hello doctor, my baby is 5 days old, and the umbilical cord area is showing signs of redness and slight inflammation. When I took my baby for a check-up, the doctor said the baby has a mild umbilical cord infection, prescribed medication, and provided instructions on cord care. Doctor, I would like to ask if umbilical cord infection is dangerous?',
    date: '06/20/2024',
    category: 'Sức khỏe trẻ em',
    daysOld: 3,
    views: 352
  },
  {
    id: 2,
    question: 'Back pain during 8th month of pregnancy, what should I do?',
    content: 'I\'m in my 8th month of pregnancy and have been experiencing significant back pain recently, especially in the evening and when sitting for long periods. I\'ve tried changing sleeping positions and light walking but haven\'t seen improvement. Doctor, could you advise on safe ways to relieve back pain at this stage? Should I see a doctor, or is this a normal condition?',
    date: '06/15/2024',
    category: 'Thai sản & Sinh nở',
    daysOld: 8,
    views: 412
  },
  {
    id: 3,
    question: 'HIV medication side effects - when to be concerned?',
    content: 'I recently started a new HIV medication regimen (Biktarvy) about 3 weeks ago. I\'m experiencing some side effects including nausea, occasional headaches, and fatigue that hasn\'t improved. My doctor said these are normal initial side effects, but I\'m wondering when I should be concerned? How long should I wait for these side effects to subside before considering a medication change? Are there any warning signs that would indicate I need immediate medical attention?',
    date: '06/18/2024',
    category: 'HIV/AIDS',
    daysOld: 5,
    views: 289
  },
  {
    id: 4,
    question: 'Can persistent cough be a symptom of HIV?',
    content: 'I\'ve had a persistent dry cough for about 6 weeks that doesn\'t seem to be improving despite using over-the-counter medications. I know that respiratory symptoms can be associated with HIV but I\'m not sure if a cough alone is something to be concerned about. I haven\'t had any other significant symptoms except occasional night sweats. I had a potential exposure about 3 months ago. Should I get tested for HIV based on just these symptoms? Is a persistent cough a common early symptom?',
    date: '06/22/2024',
    category: 'HIV/AIDS',
    daysOld: 1,
    views: 178
  },
  {
    id: 5,
    question: 'Weight loss with new ARV treatment - normal or concerning?',
    content: 'I switched to a new ARV regimen (Dovato) about 2 months ago, and I\'ve noticed I\'ve lost about 10 pounds without trying. My appetite is normal, I\'m not having any GI issues, and I feel generally well otherwise. My last viral load was undetectable. Is weight loss a known side effect of this medication? At what point should I be concerned about the weight loss? Should I schedule an appointment with my HIV specialist to discuss this?',
    date: '06/19/2024',
    category: 'HIV/AIDS',
    daysOld: 4,
    views: 231
  }
];

const UnansweredQuestions = () => {
  const [activeTab, setActiveTab] = useState('unanswered-questions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Lọc câu hỏi dựa trên từ khóa tìm kiếm và danh mục
  const filteredQuestions = unansweredQuestionsData.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Danh mục cho dropdown lọc
  const categories = ['Tất cả', 'HIV/AIDS', 'Sức khỏe trẻ em', 'Thai sản & Sinh nở', 'Sức khỏe tổng quát', 'Thuốc & Điều trị'];
  
  // Xử lý gửi biểu mẫu
  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim().length < 50) {
      alert('Vui lòng cung cấp câu trả lời chi tiết hơn (ít nhất 50 ký tự)');
      return;
    }
    
    console.log('Đang gửi câu trả lời:', { questionId: selectedQuestion.id, answer });
    // Trong ứng dụng thực tế, bạn sẽ gọi API ở đây để lưu câu trả lời
    setSubmitted(true);
    
    // Đóng biểu mẫu câu hỏi sau một khoảng thời gian
    setTimeout(() => {
      setSelectedQuestion(null);
      setAnswer('');
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <Container fluid className="doctor-dashboard p-0">
      <Row className="g-0">
        <DoctorSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          unansweredCount={unansweredQuestionsData.length}
        />
        
        <Col md={9} lg={10} className="main-content">
          <div className="content-header">
            <h2>
              <FontAwesomeIcon icon={faQuestionCircle} className="me-2 text-danger" />
              Câu hỏi chưa trả lời
            </h2>
            <p>Xem xét và trả lời các câu hỏi của bệnh nhân được gửi ẩn danh qua cổng Hỏi & Đáp</p>
          </div>
          
          {/* Tìm kiếm và Lọc */}
          <Row className="mb-4">
            <Col md={7}>
              <div className="search-box position-relative">
                <Form.Control 
                  type="search" 
                  placeholder="Tìm kiếm câu hỏi..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pe-5"
                />
                <FontAwesomeIcon icon={faSearch} className="position-absolute top-50 translate-middle-y" style={{ right: '15px', opacity: 0.5 }} />
              </div>
            </Col>
            <Col md={5}>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faFilter} className="me-2 text-muted" />
                <Form.Select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </div>
            </Col>
          </Row>
          
          {/* Danh sách câu hỏi */}
          <Row>
            <Col md={selectedQuestion ? 6 : 12}>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(question => (
                  <Card key={question.id} className="mb-3 question-card shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <Badge bg="info" className="category-badge">{question.category}</Badge>
                        <div className="question-meta">
                          <small className="text-muted me-3">
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                            {question.date}
                          </small>
                          <small className="text-muted">
                            <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                            {question.views} lượt xem
                          </small>
                        </div>
                      </div>
                      
                      <h5 className="question-title">{question.question}</h5>
                      <p className="question-excerpt">
                        {question.content.length > 200 
                          ? `${question.content.substring(0, 200)}...` 
                          : question.content}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {question.daysOld <= 2 && (
                            <Badge bg="danger" className="me-2 pulse-badge">Mới</Badge>
                          )}
                          <Badge bg="secondary" style={{ opacity: 0.7 }}>
                            {question.daysOld === 1 
                              ? 'Đăng hôm nay' 
                              : `${question.daysOld} ngày trước`}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <FontAwesomeIcon icon={faLightbulb} className="me-1" />
                          Trả lời câu hỏi
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info" className="text-center py-5">
                  <FontAwesomeIcon icon={faSearch} size="2x" className="mb-3 text-muted" />
                  <h5>Không tìm thấy câu hỏi nào</h5>
                  <p className="mb-0">Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc</p>
                </Alert>
              )}
            </Col>
            
            {/* Biểu mẫu trả lời */}
            {selectedQuestion && (
              <Col md={6}>
                <Card className="answer-card shadow border-0">
                  <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FontAwesomeIcon icon={faUserMd} className="me-2" />
                        Cung cấp câu trả lời của bạn
                      </h5>
                      <Button 
                        variant="link" 
                        className="text-white p-0" 
                        onClick={() => setSelectedQuestion(null)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {submitted ? (
                      <Alert variant="success" className="mb-0">
                        <h5 className="alert-heading">Đã gửi câu trả lời thành công!</h5>
                        <p>Câu trả lời của bạn đã được đăng lên mục Hỏi & Đáp. Cảm ơn bạn đã đóng góp chuyên môn của mình.</p>
                      </Alert>
                    ) : (
                      <Form onSubmit={handleSubmit}>
                        <div className="question-preview mb-4">
                          <h6 className="text-primary mb-3">Câu hỏi:</h6>
                          <Card className="bg-light border-0">
                            <Card.Body>
                              <h5>{selectedQuestion.question}</h5>
                              <p className="mb-0">{selectedQuestion.content}</p>
                            </Card.Body>
                          </Card>
                        </div>
                        
                        <Form.Group className="mb-4">
                          <Form.Label>
                            <h6 className="text-primary mb-2">Câu trả lời của bạn:</h6>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={10}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Cung cấp câu trả lời toàn diện dựa trên bằng chứng y khoa. Bao gồm bất kỳ lời khuyên, đề xuất hoặc tài nguyên liên quan có thể hữu ích."
                            required
                            className="answer-textarea"
                          />
                          <Form.Text className="text-muted">
                            Câu trả lời của bạn sẽ được đăng ẩn danh với tư cách là chuyên gia y tế từ Trung tâm Điều trị HIV.
                          </Form.Text>
                        </Form.Group>
                        
                        <div className="d-flex justify-content-end">
                          <Button variant="outline-secondary" className="me-2" onClick={() => setSelectedQuestion(null)}>
                            Hủy
                          </Button>
                          <Button variant="primary" type="submit">
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Gửi câu trả lời
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default UnansweredQuestions;