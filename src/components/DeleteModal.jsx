import React from 'react';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-card">
        <h2>Are you sure?</h2>
        <div className="delete-modal-buttons">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onConfirm} className="btn-confirm">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;