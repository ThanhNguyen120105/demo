import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="outline-primary" 
      onClick={() => navigate(-1)}
      className="mb-3"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
      Quay lại
    </Button>
  );
};

export default BackButton; 