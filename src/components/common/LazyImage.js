import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <div className="lazy-image-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <div 
          className="lazy-image-loading"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}
        >
          <Spinner animation="border" size="sm" variant="primary" />
        </div>
      )}
      <img
        src={error ? defaultImage : src}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: loading ? 0.3 : 1,
          transition: 'opacity 0.3s ease',
          ...props.style
        }}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
