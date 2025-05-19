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
    { value: 'general-health', label: 'General Health' },
    { value: 'hiv-aids', label: 'HIV/AIDS' },
    { value: 'sexual-health', label: 'Sexual Health' },
    { value: 'pregnancy', label: 'Pregnancy & Childbirth' },
    { value: 'children-health', label: 'Children\'s Health' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'medication', label: 'Medication & Treatment' },
    { value: 'other', label: 'Other Issues' }
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
      newErrors.title = 'Please enter a question title';
    } else if (question.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }
    
    if (!question.content.trim()) {
      newErrors.content = 'Please enter question content';
    } else if (question.content.length < 30) {
      newErrors.content = 'Content must be at least 30 characters';
    }
    
    if (!question.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!question.acceptTerms) {
      newErrors.acceptTerms = 'You need to agree to the terms to continue';
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
      alert('Your question has been successfully submitted! Doctors will answer as soon as possible.');
      
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
        <Modal.Title>Ask an Anonymous Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="question-modal-info alert alert-info">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          Your question will be posted anonymously and forwarded to appropriate specialist doctors
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Question Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={question.title}
              onChange={handleChange}
              placeholder="Write a concise summary of your issue"
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Example: "Is umbilical cord infection dangerous?" or "Symptoms of sinusitis in children?"
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Question Content <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={question.content}
              onChange={handleChange}
              placeholder="Describe in detail your health issue, symptoms, medical history (if any), treatments you've tried,..."
              isInvalid={!!errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Providing detailed information will help doctors give more accurate answers
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="category"
              value={question.category}
              onChange={handleChange}
              isInvalid={!!errors.category}
            >
              <option value="">-- Select category --</option>
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
              label="I agree that my question may be publicly displayed (anonymously) and answered by doctors on the system"
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
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
          Submit Question
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuestionModal; 