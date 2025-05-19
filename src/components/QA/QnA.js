import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faComment, faThumbsUp, faEye, faUserMd, faHospital, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import './QnA.css';
import QuestionModal from './QuestionModal';

// Dummy data for questions and answers
const qaData = [
  {
    id: 1,
    question: 'Is umbilical cord infection dangerous?',
    content: 'Hello doctor, my baby is 5 days old, and the umbilical cord area is showing signs of redness and slight inflammation. When I took my baby for a check-up, the doctor said the baby has a mild umbilical cord infection, prescribed medication, and provided instructions on cord care. Doctor, I would like to ask if umbilical cord infection is dangerous?',
    date: '06/20/2024',
    views: 352,
    likes: 24,
    answers: [
      {
        id: 101,
        doctor: {
          name: 'DR. TRINH THANH LAN',
          title: 'Doctor',
          department: 'Neonatal Center',
          hospital: 'Tam Anh General Hospital, HCMC',
          avatar: 'https://tamanhhospital.vn/wp-content/uploads/2022/03/bs-trinh-thanh-lan.jpg'
        },
        content: 'Neonatal umbilical cord infection is a condition where the baby\'s umbilical cord becomes infected due to bacterial invasion during the neonatal period (the first 30 days after birth). Staphylococcus aureus is the most common pathogen; additionally, there are several gram-negative and anaerobic bacteria. So, is umbilical cord infection dangerous? Neonatal umbilical cord infection is a dangerous health condition that requires early detection and prompt treatment. The main causes are improper hygiene or the use of non-sterile instruments when cutting the umbilical cord. Signs of umbilical cord infection to watch for include: redness, pus, foul odor, and abnormal discharge. If not treated promptly, the infection can spread and cause serious complications such as peritonitis, sepsis, and liver abscess.',
        date: '06/21/2024',
        likes: 18
      }
    ]
  },
  {
    id: 2,
    question: 'Symptoms and treatment of sinusitis in children?',
    content: 'My 7-year-old son frequently experiences runny nose, nasal congestion, and headaches. We\'ve tried common medications but haven\'t seen much improvement. I suspect he might have sinusitis. Could you please explain the symptoms of sinusitis in children and effective treatment methods? Thank you, doctor.',
    date: '06/18/2024',
    views: 286,
    likes: 19,
    answers: [
      {
        id: 201,
        doctor: {
          name: 'ASSOC. PROF. LE MINH KHANH',
          title: 'Associate Professor, PhD',
          department: 'ENT Department',
          hospital: 'Tam Anh General Hospital, Hanoi',
          avatar: 'https://tamanhhospital.vn/wp-content/uploads/2023/11/bs-le-minh-khanh.jpg'
        },
        content: 'Sinusitis in children presents with main symptoms including: prolonged cough especially at night, thick yellow or green nasal discharge, nasal congestion, headaches (in older children), bad breath, and mild fever. Children may also experience facial pain, fatigue, and poor appetite. Causes usually include viral, bacterial infections, or allergies. Treatment for sinusitis in children includes: antibiotics if caused by bacteria, pain relievers, saline nasal spray, using a humidifier, and ensuring the child drinks plenty of fluids. Prevention involves teaching children frequent handwashing, avoiding secondhand smoke, and keeping vaccinations up to date. If symptoms persist or recur frequently, the child should be taken to an ENT specialist for a thorough examination and more specialized treatment.',
        date: '06/19/2024',
        likes: 14
      }
    ]
  },
  {
    id: 3,
    question: 'Back pain during 8th month of pregnancy, what should I do?',
    content: 'I\'m in my 8th month of pregnancy and have been experiencing significant back pain recently, especially in the evening and when sitting for long periods. I\'ve tried changing sleeping positions and light walking but haven\'t seen improvement. Doctor, could you advise on safe ways to relieve back pain at this stage? Should I see a doctor, or is this a normal condition?',
    date: '06/15/2024',
    views: 412,
    likes: 31,
    answers: []
  }
];

const QnA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const toggleExpand = (id) => {
    if (expandedQuestions.includes(id)) {
      setExpandedQuestions(expandedQuestions.filter(qId => qId !== id));
    } else {
      setExpandedQuestions([...expandedQuestions, id]);
    }
  };
  
  const isExpanded = (id) => {
    return expandedQuestions.includes(id);
  };
  
  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const filteredQuestions = qaData.filter(qa => 
    qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qa.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5 qa-container">
      <h1 className="text-center mb-4">Medical Q&A</h1>
      <p className="text-center lead mb-5">
        Ask questions and receive answers from top medical specialists
      </p>
      
      {/* Search Bar */}
      <Row className="mb-5 justify-content-center">
        <Col md={8}>
          <div className="search-box">
            <Form.Control
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Button variant="primary" className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* Ask Question Button */}
      <Row className="mb-4 justify-content-center">
        <Col md={8} className="text-center">
          <Button 
            variant="success" 
            size="lg" 
            className="ask-btn"
            onClick={handleOpenModal}
          >
            <FontAwesomeIcon icon={faComment} className="me-2" />
            Ask a New Question
          </Button>
          <p className="mt-2 text-muted small">
            Your question will be posted anonymously
          </p>
        </Col>
      </Row>
      
      {/* Questions List */}
      <Row className="justify-content-center">
        <Col md={10}>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map(qa => (
              <Card key={qa.id} className="mb-4 qa-card">
                <Card.Body>
                  {/* Question */}
                  <div className="question-section">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <span className="anonymous-user">Anonymous User</span>
                          <span className="dot-separator">•</span>
                          <span className="question-date">{qa.date}</span>
                        </div>
                        <h3 className="question-title">{qa.question}</h3>
                      </div>
                      <Button 
                        variant="light" 
                        className="expand-btn"
                        onClick={() => toggleExpand(qa.id)}
                      >
                        <FontAwesomeIcon icon={isExpanded(qa.id) ? faChevronUp : faChevronDown} />
                      </Button>
                    </div>
                    
                    {isExpanded(qa.id) && (
                      <div className="question-content mt-3">
                        {qa.content}
                      </div>
                    )}
                    
                    <div className="question-stats mt-3">
                      <span className="stat-item">
                        <FontAwesomeIcon icon={faEye} className="me-1" />
                        {qa.views} views
                      </span>
                      <span className="stat-item">
                        <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                        {qa.likes} likes
                      </span>
                      <span className="stat-item">
                        <FontAwesomeIcon icon={faComment} className="me-1" />
                        {qa.answers.length} answers
                      </span>
                    </div>
                  </div>
                  
                  {/* Answers */}
                  {qa.answers.length > 0 && (
                    <div className="answers-section mt-4 pt-4">
                      <h5 className="answers-title mb-4">Expert Answers</h5>
                      
                      {qa.answers.map(answer => (
                        <div key={answer.id} className="answer-item">
                          <div className="doctor-info d-flex">
                            <div className="doctor-avatar">
                              <Image 
                                src={answer.doctor.avatar} 
                                roundedCircle 
                                className="avatar-img"
                              />
                            </div>
                            <div className="doctor-details">
                              <h5 className="doctor-name">{answer.doctor.name}</h5>
                              <div className="doctor-titles">
                                <span>{answer.doctor.title}</span>
                                <span className="dot-separator">•</span>
                                <span>{answer.doctor.department}</span>
                              </div>
                              <div className="doctor-hospital">
                                <FontAwesomeIcon icon={faHospital} className="me-1" /> 
                                {answer.doctor.hospital}
                              </div>
                            </div>
                          </div>
                          
                          <div className="answer-content mt-3">
                            {answer.content}
                          </div>
                          
                          <div className="answer-footer mt-3">
                            <div className="answer-date">{answer.date}</div>
                            <Button variant="outline-primary" size="sm" className="like-btn">
                              <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                              Helpful ({answer.likes})
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No Answers Message */}
                  {qa.answers.length === 0 && (
                    <div className="no-answers mt-4 pt-4 text-center">
                      <div className="waiting-icon mb-3">
                        <FontAwesomeIcon icon={faUserMd} size="2x" />
                      </div>
                      <h5 className="waiting-title">Waiting for doctor's answer</h5>
                      <p className="waiting-desc text-muted">
                        This question is waiting for a specialist's response
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="no-results text-center py-5">
              <div className="no-results-icon mb-3">
                <FontAwesomeIcon icon={faSearch} size="3x" opacity="0.2" />
              </div>
              <h4>No results found</h4>
              <p className="text-muted">
                No questions match the keyword "{searchTerm}"
              </p>
              <Button variant="primary" onClick={() => setSearchTerm('')}>
                View all questions
              </Button>
            </div>
          )}
        </Col>
      </Row>
      
      {/* More Questions Button */}
      {filteredQuestions.length > 0 && (
        <Row className="justify-content-center mt-4">
          <Col md={6} className="text-center">
            <Button variant="outline-primary" className="load-more-btn">
              Load more questions
            </Button>
          </Col>
        </Row>
      )}
      
      {/* Question Modal */}
      <QuestionModal show={showModal} handleClose={handleCloseModal} />
    </Container>
  );
};

export default QnA; 