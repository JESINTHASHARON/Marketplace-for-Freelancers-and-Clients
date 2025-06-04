import React from "react";
import "./AuthModal.scss";
import { useNavigate } from "react-router-dom";

function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sign In or Register</h2>
        <p>You need to sign in or register to continue.</p>
        <div className="buttons">
          <button onClick={() => navigate("/login")}>Sign In</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
        <button className="close" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default AuthModal;
