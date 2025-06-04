import React, { useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./SubmitRequirements.scss";

const SubmitRequirements = () => {
  const { id } = useParams(); // orderId
  const [requirements, setRequirements] = useState("");
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // 👈 added

  const handleSubmit = async () => {
    if (!requirements) {
      setError("Please enter your project requirements.");
      return;
    }

    try {
      await newRequest.put(`/orders/requirements/${id}`, {
        requirements,
      });

      setSubmitted(true); // 👈 show success message instead of navigating
    } catch (err) {
      setError("Failed to submit requirements. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="submitRequirements">
        <div className="container">
          <h2>🎉 Requirements Submitted Successfully!</h2>
          <p>Your order ID is <strong>{id}</strong>.</p>
          <p>The seller will begin working on your project shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="submitRequirements">
      <div className="container">
        <h2>Submit Project Requirements</h2>
        <textarea
          placeholder="Describe what you need from the seller..."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default SubmitRequirements;
