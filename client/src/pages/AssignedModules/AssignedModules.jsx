import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import upload from "../../utils/upload";
import "./AssignedModules.scss";

const urlPatterns = [
  /^https:\/\/(drive\.google\.com)\/.+$/,
  /^https:\/\/(www\.)?dropbox\.com\/.+$/,
  /^https:\/\/(www\.)?youtube\.com\/watch\?v=.+$/,
  /^https:\/\/(www\.)?youtu\.be\/.+$/,
  /^https:\/\/(www\.)?github\.com\/.+$/,
  /^https:\/\/(www\.)?figma\.com\/.+$/,
  /^https:\/\/(www\.)?notion\.so\/.+$/,
  /^https:\/\/.+\..+$/,
];

const AssignedModules = () => {
  const { projectId } = useParams();
  const [modules, setModules] = useState([]);
  const [urlInputs, setUrlInputs] = useState({});
  const [images, setImages] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [uploading, setUploading] = useState(false);

  const fetchModules = async () => {
    try {
      const res = await newRequest.get(`/modules/project/${projectId}`);
      setModules([...res.data]); // ✅ CHANGED: forces React to detect new state

      const submittedFlags = {};
      res.data.forEach((mod) => {
        submittedFlags[mod.id] = mod.status === "SUBMITTED";
      });
      setSubmitted(submittedFlags);
    } catch (err) {
      console.error("Failed to load modules", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [projectId]);

  const handleUrlChange = (moduleId, value) => {
    setUrlInputs({ ...urlInputs, [moduleId]: value });

    if (!value) {
      setErrors({ ...errors, [moduleId]: "URL cannot be empty" });
      return;
    }

    const valid = urlPatterns.some((pattern) => pattern.test(value));
    if (!valid) {
      setErrors({ ...errors, [moduleId]: "Invalid URL format" });
    } else {
      setErrors({ ...errors, [moduleId]: "" });
    }
  };

  const handleImageChange = (moduleId, files) => {
    if (files.length > 2) {
      alert("You can only upload up to 2 images.");
      return;
    }
    setImages({ ...images, [moduleId]: Array.from(files) });
  };

  const handleSubmit = async (moduleId) => {
    const url = urlInputs[moduleId];

    if (!url) {
      setErrors({ ...errors, [moduleId]: "URL cannot be empty" });
      return;
    }

    const valid = urlPatterns.some((pattern) => pattern.test(url));
    if (!valid) {
      setErrors({ ...errors, [moduleId]: "Invalid URL format" });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("projectURL", url);

      if (images[moduleId]) {
        const uploadedImageUrls = await Promise.all(
          images[moduleId].map((file) => upload(file))
        );
        uploadedImageUrls.forEach((url) => {
          formData.append("images", url);
        });
      }

      await newRequest.put(`/modules/${moduleId}/freelancer`, formData);
      setSubmitted({ ...submitted, [moduleId]: true });

      await fetchModules();
      alert("Submitted successfully!");
    } catch (err) {
      console.error("Submission failed", err);
      alert("Image upload or submission failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (moduleId, newStatus) => {
    try {
      await newRequest.put(`/modules/${moduleId}/status`, { status: newStatus });
      await fetchModules();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="assigned-modules">
      <h1>Assign Work Modules</h1>

      {modules.map((mod, index) => (
        <div className="module-card" key={mod.id}>
          <div className="header">
            <h2>Module {index + 1}</h2>
            <span className={`status-badge ${mod.status.toLowerCase()}`}>
              {mod.status}
            </span>
          </div>

          <label>Module Name *</label>
          <input type="text" value={mod.name} disabled />

          <label>Details *</label>
          <textarea value={mod.details} disabled />

          <label>Deadline (Days) *</label>
          <input type="number" value={mod.deadlineDays} disabled />

          <div className="submission">
  <label>Project URL</label>

  {mod.status === "COMPLETED" ? (
    <div className="completed-view">
      <p className="submitted-url">{mod.projectURL}</p>
      <div className="completed-indicator">
        <span role="img" aria-label="completed" style={{ fontSize: "2.5rem", color: "green" }}>
          ✅
        </span>
        <p style={{ color: "green", fontWeight: "bold", marginTop: "0.5rem" }}>Module Completed</p>
      </div>
    </div>
  ) : submitted[mod.id] ? (
    <>
      <p className="submitted-url">{mod.projectURL}</p>
      <button
        className="edit-btn"
        onClick={() => setSubmitted({ ...submitted, [mod.id]: false })}
      >
        Edit Submission
      </button>
    </>
  ) : (
    <>
      <input
        type="text"
        placeholder="Enter submission URL"
        value={urlInputs[mod.id] || ""}
        onChange={(e) => handleUrlChange(mod.id, e.target.value)}
      />
      {errors[mod.id] && (
        <span style={{ color: "red", fontSize: "0.9rem" }}>
          {errors[mod.id]}
        </span>
      )}

      <label>Upload up to 2 images (optional)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleImageChange(mod.id, e.target.files)}
      />

      <button
        onClick={() => handleSubmit(mod.id)}
        className="submit-btn"
        disabled={uploading}
      >
        {uploading ? "Submitting..." : "Submit"}
      </button>

      {mod.status === "OK" && (
        <div className="approval-section">
          <p>Amount: ₹{mod.amount}</p>
          <span
            className="action-icon tick"
            onClick={() => updateStatus(mod.id, "PAY")}
            title="Approve and Pay"
            style={{
              cursor: "pointer",
              marginRight: "1rem",
              fontSize: "1.5rem",
            }}
          >
            ✅
          </span>
          <span
            className="action-icon cross"
            onClick={() => updateStatus(mod.id, "SUBMITTED")}
            title="Reject or Keep as OK"
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
          >
            ❌
          </span>
        </div>
      )}
    </>
  )}
</div>

        </div>
      ))}
    </div>
  );
};

export default AssignedModules;
