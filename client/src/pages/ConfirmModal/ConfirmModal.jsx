import React from "react";
import "./ConfirmModal.scss";

function ConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="confirmModal">
      <div className="modalContent">
        <p>Are you sure you want to delete this gig?</p>
        <div className="buttons">
          <button className="yes" onClick={onConfirm}>Yes</button>
          <button className="no" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
