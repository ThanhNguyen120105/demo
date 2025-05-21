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
    question: 'Nhiễm trùng rốn ở trẻ sơ sinh có nguy hiểm không?',
    content: 'Kính chào bác sĩ, con tôi 5 ngày tuổi, khu vực rốn đang có dấu hiệu đỏ và hơi sưng viêm. Khi tôi đưa con đi khám, bác sĩ nói bé bị nhiễm trùng rốn nhẹ, kê thuốc và hướng dẫn cách chăm sóc rốn. Bác sĩ cho hỏi nhiễm trùng rốn có nguy hiểm không ạ?',
    date: '20/06/2024',
    views: 352,
    likes: 24,
    answers: [
      {
        id: 101,
        doctor: {
          name: 'BS. TRỊNH THANH LAN',
          title: 'Bác sĩ',
          department: 'Trung tâm Sơ sinh',
          hospital: 'Bệnh viện Đa khoa Tâm Anh, TP.HCM',
          avatar: 'https://tamanhhospital.vn/wp-content/uploads/2022/03/bs-trinh-thanh-lan.jpg'
        },
        content: 'Nhiễm trùng rốn ở trẻ sơ sinh là tình trạng cuống rốn của bé bị nhiễm khuẩn do vi khuẩn xâm nhập trong giai đoạn sơ sinh (30 ngày đầu sau sinh). Tụ cầu vàng là tác nhân gây bệnh phổ biến nhất; ngoài ra còn có một số vi khuẩn gram âm và kỵ khí. Vậy nhiễm trùng rốn có nguy hiểm không? Nhiễm trùng rốn ở trẻ sơ sinh là tình trạng sức khỏe nguy hiểm cần được phát hiện sớm và điều trị kịp thời. Nguyên nhân chủ yếu là do vệ sinh không đúng cách hoặc sử dụng dụng cụ không vô trùng khi cắt rốn. Các dấu hiệu nhiễm trùng rốn cần quan tâm gồm: đỏ, có mủ, mùi hôi, và chất tiết bất thường. Nếu không được điều trị kịp thời, nhiễm trùng có thể lan rộng và gây ra các biến chứng nghiêm trọng như viêm phúc mạc, nhiễm trùng huyết, và áp xe gan.',
        date: '21/06/2024',
        likes: 18
      }
    ]
  },
  {
    id: 2,
    question: 'Triệu chứng và cách điều trị viêm xoang ở trẻ em?',
    content: 'Con trai tôi 7 tuổi thường xuyên bị chảy nước mũi, nghẹt mũi và đau đầu. Chúng tôi đã thử các loại thuốc thông thường nhưng không thấy cải thiện nhiều. Tôi nghi ngờ bé có thể bị viêm xoang. Bác sĩ có thể giải thích về các triệu chứng viêm xoang ở trẻ em và phương pháp điều trị hiệu quả không? Xin cảm ơn bác sĩ.',
    date: '18/06/2024',
    views: 286,
    likes: 19,
    answers: [
      {
        id: 201,
        doctor: {
          name: 'PGS.TS. LÊ MINH KHÁNH',
          title: 'Phó Giáo sư, Tiến sĩ',
          department: 'Khoa Tai Mũi Họng',
          hospital: 'Bệnh viện Đa khoa Tâm Anh, Hà Nội',
          avatar: 'https://tamanhhospital.vn/wp-content/uploads/2023/11/bs-le-minh-khanh.jpg'
        },
        content: 'Viêm xoang ở trẻ em có các triệu chứng chính bao gồm: ho kéo dài đặc biệt là vào ban đêm, chảy mũi đặc màu vàng hoặc xanh, nghẹt mũi, đau đầu (ở trẻ lớn), hơi thở có mùi hôi, và sốt nhẹ. Trẻ cũng có thể bị đau mặt, mệt mỏi và biếng ăn. Nguyên nhân thường do nhiễm virus, vi khuẩn, hoặc dị ứng. Điều trị viêm xoang ở trẻ em bao gồm: kháng sinh nếu do vi khuẩn, thuốc giảm đau, xịt mũi nước muối, sử dụng máy tạo độ ẩm, và đảm bảo trẻ uống nhiều nước. Phòng ngừa bao gồm dạy trẻ rửa tay thường xuyên, tránh khói thuốc lá, và tiêm phòng đầy đủ. Nếu triệu chứng kéo dài hoặc tái phát thường xuyên, nên đưa trẻ đến bác sĩ chuyên khoa Tai Mũi Họng để được khám kỹ lưỡng và điều trị chuyên sâu hơn.',
        date: '19/06/2024',
        likes: 14
      }
    ]
  },
  {
    id: 3,
    question: 'Đau lưng trong tháng thứ 8 của thai kỳ, tôi nên làm gì?',
    content: 'Tôi đang ở tháng thứ 8 của thai kỳ và gần đây đã bị đau lưng đáng kể, đặc biệt là vào buổi tối và khi ngồi trong thời gian dài. Tôi đã thử thay đổi tư thế ngủ và đi bộ nhẹ nhàng nhưng không thấy cải thiện. Bác sĩ có thể tư vấn về các cách giảm đau lưng an toàn ở giai đoạn này không? Tôi có nên đi khám bác sĩ, hay đây là tình trạng bình thường?',
    date: '15/06/2024',
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
      <h1 className="text-center mb-4">Hỏi Đáp Y Khoa</h1>
      <p className="text-center lead mb-5">
        Đặt câu hỏi và nhận câu trả lời từ các chuyên gia y tế hàng đầu
      </p>
      
      {/* Search Bar */}
      <Row className="mb-5 justify-content-center">
        <Col md={8}>
          <div className="search-box">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
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
            Đặt Câu Hỏi Mới
          </Button>
          <p className="mt-2 text-muted small">
            Câu hỏi của bạn sẽ được đăng ẩn danh
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
                          <span className="anonymous-user">Người dùng ẩn danh</span>
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
                        {qa.views} lượt xem
                      </span>
                      <span className="stat-item">
                        <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                        {qa.likes} lượt thích
                      </span>
                      <span className="stat-item">
                        <FontAwesomeIcon icon={faComment} className="me-1" />
                        {qa.answers.length} câu trả lời
                      </span>
                    </div>
                  </div>
                  
                  {/* Answers */}
                  {qa.answers.length > 0 && (
                    <div className="answers-section mt-4 pt-4">
                      <h5 className="answers-title mb-4">Câu Trả Lời Từ Chuyên Gia</h5>
                      
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
                              Hữu ích ({answer.likes})
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
                      <h5 className="waiting-title">Đang chờ câu trả lời từ bác sĩ</h5>
                      <p className="waiting-desc text-muted">
                        Câu hỏi này đang đợi phản hồi từ chuyên gia
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="no-results text-center py-5">
              <h4>Không tìm thấy câu hỏi nào</h4>
              <p className="text-muted">Vui lòng thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </Col>
      </Row>
      
      <QuestionModal 
        show={showModal} 
        handleClose={handleCloseModal} 
      />
    </Container>
  );
};

export default QnA; 