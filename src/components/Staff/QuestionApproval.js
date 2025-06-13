import React, { useState, useEffect } from 'react';
import './Staff.css';

const QuestionApproval = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      patientName: 'Nguyễn Văn A',
      question: 'Tôi có triệu chứng sốt nhẹ và đau họng, liệu có phải là dấu hiệu nhiễm HIV không?',
      questionDate: '2024-01-10',
      doctorName: 'BS. Trần Thị B',
      answer: 'Triệu chứng sốt và đau họng có thể do nhiều nguyên nhân khác nhau, không nhất thiết là HIV. Tuy nhiên, để chắc chắn, bạn nên đến cơ sở y tế để được khám và xét nghiệm cụ thể.',
      answerDate: '2024-01-11',
      status: 'pending_approval',
      category: 'tư vấn',
      priority: 'medium'
    },
    {
      id: 2,
      patientName: 'Trần Thị C',
      question: 'Thuốc ARV có tác dụng phụ gì? Tôi đang uống Efavirenz và cảm thấy chóng mặt.',
      questionDate: '2024-01-11',
      doctorName: 'BS. Lê Văn D',
      answer: 'Efavirenz có thể gây chóng mặt, đặc biệt trong giai đoạn đầu điều trị. Triệu chứng này thường giảm dần sau 2-4 tuần. Bạn nên uống thuốc trước khi đi ngủ để giảm tác động.',
      answerDate: '2024-01-12',
      status: 'pending_approval',
      category: 'thuốc',
      priority: 'high'
    },
    {
      id: 3,
      patientName: 'Phạm Văn E',
      question: 'Tôi có thể mang thai an toàn khi đang điều trị HIV không?',
      questionDate: '2024-01-12',
      doctorName: 'BS. Nguyễn Thị F',
      answer: 'Với điều trị ARV phù hợp và theo dõi chặt chẽ, phụ nữ nhiễm HIV hoàn toàn có thể mang thai an toàn và sinh con khỏe mạnh. Tỷ lệ lây truyền từ mẹ sang con có thể giảm xuống dưới 2%.',
      answerDate: '2024-01-13',
      status: 'approved',
      category: 'mang thai',
      priority: 'high'
    }
  ]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleApprove = (questionId) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, status: 'approved', approvalDate: new Date().toISOString().split('T')[0] }
          : q
      )
    );
    setShowModal(false);
  };

  const handleReject = (questionId, reason) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, status: 'rejected', rejectionReason: reason, approvalDate: new Date().toISOString().split('T')[0] }
          : q
      )
    );
    setShowModal(false);
  };

  const handleViewDetails = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_approval: { class: 'badge-warning', text: 'Chờ duyệt' },
      approved: { class: 'badge-success', text: 'Đã duyệt' },
      rejected: { class: 'badge-danger', text: 'Từ chối' }
    };
    
    const config = statusConfig[status] || statusConfig.pending_approval;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { class: 'priority-high', text: 'Cao' },
      medium: { class: 'priority-medium', text: 'Trung bình' },
      low: { class: 'priority-low', text: 'Thấp' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <span className={`priority-badge ${config.class}`}>{config.text}</span>;
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  return (
    <div className="question-approval">
      <div className="content-header">
        <h2>Duyệt câu hỏi & câu trả lời</h2>
        <p>Quản lý và duyệt các câu hỏi của bệnh nhân và câu trả lời của bác sĩ</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tất cả ({questions.length})
        </button>
        <button 
          className={filter === 'pending_approval' ? 'active' : ''}
          onClick={() => setFilter('pending_approval')}
        >
          Chờ duyệt ({questions.filter(q => q.status === 'pending_approval').length})
        </button>
        <button 
          className={filter === 'approved' ? 'active' : ''}
          onClick={() => setFilter('approved')}
        >
          Đã duyệt ({questions.filter(q => q.status === 'approved').length})
        </button>
        <button 
          className={filter === 'rejected' ? 'active' : ''}
          onClick={() => setFilter('rejected')}
        >
          Từ chối ({questions.filter(q => q.status === 'rejected').length})
        </button>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {filteredQuestions.map(question => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <div className="question-meta">
                <h4>Câu hỏi từ: {question.patientName}</h4>
                <div className="meta-info">
                  <span className="date">{new Date(question.questionDate).toLocaleDateString('vi-VN')}</span>
                  <span className="category">{question.category}</span>
                  {getPriorityBadge(question.priority)}
                  {getStatusBadge(question.status)}
                </div>
              </div>
              <div className="question-actions">
                <button 
                  className="btn btn-info btn-sm"
                  onClick={() => handleViewDetails(question)}
                >
                  <i className="fas fa-eye"></i> Chi tiết
                </button>
                {question.status === 'pending_approval' && (
                  <>
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(question.id)}
                    >
                      <i className="fas fa-check"></i> Duyệt
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(question.id, 'Nội dung không phù hợp')}
                    >
                      <i className="fas fa-times"></i> Từ chối
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="question-content">
              <div className="question-text">
                <h5><i className="fas fa-question-circle"></i> Câu hỏi:</h5>
                <p>{question.question}</p>
              </div>
              
              {question.answer && (
                <div className="answer-text">
                  <h5><i className="fas fa-reply"></i> Trả lời bởi {question.doctorName}:</h5>
                  <p>{question.answer}</p>
                  <small className="answer-date">
                    Trả lời ngày: {new Date(question.answerDate).toLocaleDateString('vi-VN')}
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for question details */}
      {showModal && selectedQuestion && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Chi tiết câu hỏi & câu trả lời</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin câu hỏi</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Bệnh nhân:</label>
                    <span>{selectedQuestion.patientName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày hỏi:</label>
                    <span>{new Date(selectedQuestion.questionDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Danh mục:</label>
                    <span>{selectedQuestion.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Độ ưu tiên:</label>
                    {getPriorityBadge(selectedQuestion.priority)}
                  </div>
                  <div className="detail-item full-width">
                    <label>Câu hỏi:</label>
                    <div className="question-content-detail">
                      {selectedQuestion.question}
                    </div>
                  </div>
                </div>
              </div>

              {selectedQuestion.answer && (
                <div className="detail-section">
                  <h4>Thông tin câu trả lời</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Bác sĩ trả lời:</label>
                      <span>{selectedQuestion.doctorName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Ngày trả lời:</label>
                      <span>{new Date(selectedQuestion.answerDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="detail-item">
                      <label>Trạng thái:</label>
                      {getStatusBadge(selectedQuestion.status)}
                    </div>
                    <div className="detail-item full-width">
                      <label>Câu trả lời:</label>
                      <div className="answer-content-detail">
                        {selectedQuestion.answer}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {selectedQuestion.status === 'pending_approval' && (
              <div className="modal-footer">
                <button 
                  className="btn btn-success"
                  onClick={() => handleApprove(selectedQuestion.id)}
                >
                  <i className="fas fa-check"></i> Duyệt
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleReject(selectedQuestion.id, 'Nội dung không phù hợp')}
                >
                  <i className="fas fa-times"></i> Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionApproval; 