import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};
