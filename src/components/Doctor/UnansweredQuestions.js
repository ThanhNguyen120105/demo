import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle, faSearch, faLightbulb, faUserMd, faFilter,
  faCalendarAlt, faSave, faTimes, faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import DoctorSidebar from './DoctorSidebar';
import './Doctor.css';

// Sample data for unanswered questions
const unansweredQuestionsData = [
  {
    id: 1,
    question: 'Is umbilical cord infection dangerous?',
    content: 'Hello doctor, my baby is 5 days old, and the umbilical cord area is showing signs of redness and slight inflammation. When I took my baby for a check-up, the doctor said the baby has a mild umbilical cord infection, prescribed medication, and provided instructions on cord care. Doctor, I would like to ask if umbilical cord infection is dangerous?',
    date: '06/20/2024',
    category: 'Children\'s Health',
    daysOld: 3,
    views: 352
  },
  {
    id: 2,
    question: 'Back pain during 8th month of pregnancy, what should I do?',
    content: 'I\'m in my 8th month of pregnancy and have been experiencing significant back pain recently, especially in the evening and when sitting for long periods. I\'ve tried changing sleeping positions and light walking but haven\'t seen improvement. Doctor, could you advise on safe ways to relieve back pain at this stage? Should I see a doctor, or is this a normal condition?',
    date: '06/15/2024',
    category: 'Pregnancy & Childbirth',
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Filter questions based on search term and category
  const filteredQuestions = unansweredQuestionsData.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Categories for filter dropdown
  const categories = ['All', 'HIV/AIDS', 'Children\'s Health', 'Pregnancy & Childbirth', 'General Health', 'Medication & Treatment'];
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim().length < 50) {
      alert('Please provide a more detailed answer (at least 50 characters)');
      return;
    }
    
    console.log('Submitting answer:', { questionId: selectedQuestion.id, answer });
    // In a real app, you would make an API call here to save the answer
    setSubmitted(true);
    
    // Close the question form after a delay
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
              Unanswered Questions
            </h2>
            <p>Review and answer patient questions anonymously submitted through the Q&A portal</p>
          </div>
          
          {/* Search and Filter */}
          <Row className="mb-4">
            <Col md={7}>
              <div className="search-box position-relative">
                <Form.Control 
                  type="search" 
                  placeholder="Search questions..." 
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
          
          {/* Questions List */}
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
                            {question.views} views
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
                            <Badge bg="danger" className="me-2 pulse-badge">New</Badge>
                          )}
                          <Badge bg="secondary" style={{ opacity: 0.7 }}>
                            {question.daysOld === 1 
                              ? 'Posted today' 
                              : `${question.daysOld} days ago`}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => setSelectedQuestion(question)}
                        >
                          <FontAwesomeIcon icon={faLightbulb} className="me-1" />
                          Answer Question
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info" className="text-center py-5">
                  <FontAwesomeIcon icon={faSearch} size="2x" className="mb-3 text-muted" />
                  <h5>No questions found</h5>
                  <p className="mb-0">Try adjusting your search or filter criteria</p>
                </Alert>
              )}
            </Col>
            
            {/* Answer Form */}
            {selectedQuestion && (
              <Col md={6}>
                <Card className="answer-card shadow border-0">
                  <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FontAwesomeIcon icon={faUserMd} className="me-2" />
                        Provide Your Answer
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
                        <h5 className="alert-heading">Answer Submitted Successfully!</h5>
                        <p>Your response has been published to the Q&A section. Thank you for contributing your expertise.</p>
                      </Alert>
                    ) : (
                      <Form onSubmit={handleSubmit}>
                        <div className="question-preview mb-4">
                          <h6 className="text-primary mb-3">Question:</h6>
                          <Card className="bg-light border-0">
                            <Card.Body>
                              <h5>{selectedQuestion.question}</h5>
                              <p className="mb-0">{selectedQuestion.content}</p>
                            </Card.Body>
                          </Card>
                        </div>
                        
                        <Form.Group className="mb-4">
                          <Form.Label>
                            <h6 className="text-primary mb-2">Your Answer:</h6>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={10}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Provide a comprehensive answer based on medical evidence. Include any relevant advice, recommendations, or resources that may be helpful."
                            required
                            className="answer-textarea"
                          />
                          <Form.Text className="text-muted">
                            Your answer will be posted anonymously as a medical professional from HIV Treatment Center.
                          </Form.Text>
                        </Form.Group>
                        
                        <div className="d-flex justify-content-end">
                          <Button variant="outline-secondary" className="me-2" onClick={() => setSelectedQuestion(null)}>
                            Cancel
                          </Button>
                          <Button variant="primary" type="submit">
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Submit Answer
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