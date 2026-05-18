import React from 'react';
import '../styles/spinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Procesando solicitud...</p>
    </div>
  );
};

export default LoadingSpinner;
