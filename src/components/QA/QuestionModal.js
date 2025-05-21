import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './QnA.css';

const QuestionModal = ({ show, handleClose }) => {
  const [question, setQuestion] = useState({
    title: '',
    content: '',
    category: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  
  const medicalCategories = [
    { value: 'general-health', label: 'Sức Khỏe Tổng Quát' },
    { value: 'hiv-aids', label: 'HIV/AIDS' },
    { value: 'sexual-health', label: 'Sức Khỏe Tình Dục' },
    { value: 'pregnancy', label: 'Thai Sản & Sinh Nở' },
    { value: 'children-health', label: 'Sức Khỏe Trẻ Em' },
    { value: 'mental-health', label: 'Sức Khỏe Tâm Thần' },
    { value: 'nutrition', label: 'Dinh Dưỡng' },
    { value: 'medication', label: 'Thuốc & Điều Trị' },
    { value: 'other', label: 'Vấn Đề Khác' }
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestion({
      ...question,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!question.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề câu hỏi';
    } else if (question.title.length < 10) {
      newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự';
    }
    
    if (!question.content.trim()) {
      newErrors.content = 'Vui lòng nhập nội dung câu hỏi';
    } else if (question.content.length < 30) {
      newErrors.content = 'Nội dung phải có ít nhất 30 ký tự';
    }
    
    if (!question.category) {
      newErrors.category = 'Vui lòng chọn một danh mục';
    }
    
    if (!question.acceptTerms) {
      newErrors.acceptTerms = 'Bạn cần đồng ý với điều khoản để tiếp tục';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: In a real application, we would submit the question to the backend
      console.log('Submitting question:', question);
      
      // Show success message
      alert('Câu hỏi của bạn đã được gửi thành công! Bác sĩ sẽ trả lời trong thời gian sớm nhất.');
      
      // Reset form and close modal
      setQuestion({
        title: '',
        content: '',
        category: '',
        acceptTerms: false
      });
      
      handleClose();
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Đặt Câu Hỏi Ẩn Danh</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="question-modal-info alert alert-info">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          Câu hỏi của bạn sẽ được đăng ẩn danh và chuyển đến các bác sĩ chuyên khoa phù hợp
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tiêu Đề Câu Hỏi <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={question.title}
              onChange={handleChange}
              placeholder="Viết tóm tắt ngắn gọn về vấn đề của bạn"
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Ví dụ: "Nhiễm trùng rốn ở trẻ sơ sinh có nguy hiểm không?" hoặc "Triệu chứng viêm xoang ở trẻ em?"
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Nội Dung Câu Hỏi <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={question.content}
              onChange={handleChange}
              placeholder="Mô tả chi tiết vấn đề sức khỏe, triệu chứng, tiền sử bệnh (nếu có), các phương pháp điều trị đã thử,..."
              isInvalid={!!errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Cung cấp thông tin chi tiết sẽ giúp bác sĩ đưa ra câu trả lời chính xác hơn
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Danh Mục <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="category"
              value={question.category}
              onChange={handleChange}
              isInvalid={!!errors.category}
            >
              <option value="">-- Chọn danh mục --</option>
              {medicalCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="acceptTerms"
              checked={question.acceptTerms}
              onChange={handleChange}
              label="Tôi đồng ý rằng câu hỏi của tôi có thể được hiển thị công khai (ẩn danh) và được các bác sĩ trên hệ thống trả lời"
              isInvalid={!!errors.acceptTerms}
              feedback={errors.acceptTerms}
              feedbackType="invalid"
              id="terms-checkbox"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
          Gửi Câu Hỏi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionModal; 