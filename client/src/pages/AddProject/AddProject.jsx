import React, { useState } from "react";
import "./AddProject.scss";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    category: "",
    budget: 0,
    images: [],
    numberOfModules: 0,
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: name === "budget" || name === "numberOfModules" ? parseInt(value) : value,
    }));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        [...files].map((file) => upload(file))
      );
      setProject((prev) => ({
        ...prev,
        images: uploaded,
      }));
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const finalProject = {
        ...project,
        userId: currentUser.user.id,
      };
  
      await newRequest.post("/projects", finalProject);
      navigate("/myprojects");
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="addProject">
      <div className="container">
        <h1>Post a New Project</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Need a website redesign"
            onChange={handleChange}
            required
          />


          <label>Category</label>
          <select name="category" onChange={handleChange} required>
            <option value="other">Select a Category</option>
            <option value="Design">Design</option>
            <option value="AI Artists">AI Artist</option>
            <option value="Web Development">Web Development</option>
            <option value="Voice Over">Voice Over</option>
            <option value="Video Explainer">Video Explainer</option>
            <option value="Animation">Animation</option>
            <option value="Music">Music</option>
          </select>

          <label>Budget (₹)</label>
          <input
            type="number"
            name="budget"
            onChange={handleChange}
            required
          />

          <label>Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <button type="button" onClick={handleUpload}>
            {uploading ? "Uploading..." : "Upload Images"}
          </button>

          <label>Description</label>
          <textarea
            name="description"
            rows={6}
            onChange={handleChange}
            placeholder="Detailed description of the project"
            required
          />

          <label>Number of Modules</label>
          <input
            type="number"
            name="numberOfModules"
            placeholder="e.g. 3"
            onChange={handleChange}
            required
          />

          <button type="submit">Create Project</button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
