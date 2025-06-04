import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./UploadWork.scss";

const UploadWork = () => {
  const { id } = useParams(); // order ID
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("finalWork", file);
    formData.append("note", note);

    try {
      await newRequest.put(`/orders/${id}/upload-work`, formData);
      navigate("/orders");
    } catch (err) {
      setError("Upload failed. Try again.");
    }
  };

  return (
    <div className="uploadWork">
      <div className="container">
        <h2>Deliver Final Work</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <textarea
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Deliver Work</button>
      </div>
    </div>
  );
};

export default UploadWork;
