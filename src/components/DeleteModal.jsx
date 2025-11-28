import React from 'react';
import Button from './Button';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure?</p>
        <div className="modal-buttons">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={onConfirm}>Yes</Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;