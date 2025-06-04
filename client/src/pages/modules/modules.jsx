import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { CheckCircle, Undo2, X } from "lucide-react";
import "./modules.scss";

const Modules = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();  // Using useNavigate hook for navigation
  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [bidAmount, setBidAmount] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [approveInputs, setApproveInputs] = useState({});
  const [visibleApproveInput, setVisibleApproveInput] = useState(null); // NEW

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProject = await newRequest.get(`/projects/${projectId}`);
        const projectData = resProject.data;
        setProject(projectData);

        const resBid = await newRequest.get(`/projects/${projectId}/bids`);
        const acceptedBid = resBid.data.find((bid) => bid.status === "ACCEPTED");
        if (acceptedBid) setBidAmount(acceptedBid.amount);

        const resModules = await newRequest.get(`/modules/project/${projectId}`);
        const existingModules = resModules.data;
        const filledModules = [...existingModules];

        const remaining = projectData.numberOfModules - existingModules.length;
        for (let i = 0; i < remaining; i++) {
          filledModules.push({
            name: "",
            details: "",
            deadlineDays: "",
            projectURL: "",
            status: "WAITING",
            updateCount: 0,
            images: [],
          });
        }

        setModules(filledModules);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [projectId]);

  const handleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleAssignOrUpdate = async (index) => {
    const mod = modules[index];
    const payload = {
      name: mod.name,
      details: mod.details,
      deadlineDays: parseInt(mod.deadlineDays),
      projectId: parseInt(projectId),
    };

    try {
      if (mod.id) {
        const res = await newRequest.put(`/modules/${mod.id}`, payload);
        const updated = [...modules];
        updated[index] = res.data;
        alert(`Module ${index + 1} updated.`);
        setModules(updated);
      } else {
        const res = await newRequest.post(`/modules`, payload);
        const updated = [...modules];
        updated[index] = res.data;
        alert(`Module ${index + 1} assigned.`);
        setModules(updated);
      }
    } catch (err) {
      console.error("Error assigning/updating module:", err);
      alert("Failed to assign/update module.");
    }
  };

  const handleRework = async (moduleId) => {
    try {
      await newRequest.put(`/modules/${moduleId}/status`, { status: "REWORK" });
      const res = await newRequest.get(`/modules/project/${projectId}`);
      setModules(res.data);
      setApproveInputs({});
      setVisibleApproveInput(null);
    } catch (err) {
      console.error(err);
      alert("Failed to mark for rework.");
    }
  };

  const handleApproveClick = (moduleId) => {
    setVisibleApproveInput(moduleId);
    setApproveInputs((prev) => ({ ...prev, [moduleId]: "" }));
  };

  const handleAmountChange = (moduleId, value) => {
    setApproveInputs((prev) => ({ ...prev, [moduleId]: value }));
  };

  const handleSubmitAmount = async (moduleId) => {
    const amount = approveInputs[moduleId];
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await newRequest.put(`/modules/${moduleId}/status`, {
        status: "OK",
        amount: parseFloat(amount),
      });
      const res = await newRequest.get(`/modules/project/${projectId}`);
      setModules(res.data);
      setApproveInputs({});
      setVisibleApproveInput(null);
    } catch (err) {
      console.error(err);
      alert("Failed to mark as OK.");
    }
  };

  const handlePay = (moduleId) => {
    // Navigate to the payment page for the specific module
    navigate(`/payment/${moduleId}`);
  };

  return (
    <div className="assign-work-container">
      <h1>Assign Work Modules</h1>
      {modules.map((mod, index) => {
        const estimatedAmount =
          bidAmount && project?.numberOfModules
            ? Math.round(bidAmount / project.numberOfModules)
            : "";

        return (
          <div className="module-box" key={index}>
            <div className="module-header">
              <h2>Module {index + 1}</h2>
              <span className="status-badge">{mod.status}</span>
            </div>

            <label>Module Name *</label>
            <input
              type="text"
              value={mod.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              disabled={mod.updateCount >= 1}
              placeholder="Enter module name"
            />

            <label>Details *</label>
            <textarea
              rows={4}
              value={mod.details}
              onChange={(e) => handleChange(index, "details", e.target.value)}
              disabled={mod.updateCount >= 1}
              placeholder="Enter module details"
            />

            <label>Deadline (Days) *</label>
            <input
              type="number"
              value={mod.deadlineDays}
              onChange={(e) => handleChange(index, "deadlineDays", e.target.value)}
              disabled={mod.updateCount >= 1}
              placeholder="e.g., 7"
            />

            <div className="project-url">
              <label>Project URL</label>
              <p><i>{mod.projectURL || "Not yet submitted"}</i></p>
            </div>

            {mod.images && mod.images.length > 0 && (
              <div className="submitted-images">
                <label>Submitted Images</label>
                <div className="image-list">
                  {mod.images.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt={`Module ${index + 1} image ${i + 1}`}
                      onClick={() => setEnlargedImage(imgUrl)}
                    />
                  ))}
                </div>
              </div>
            )}

            {mod.status === "SUBMITTED" && (
              <div className="icon-actions">
                {visibleApproveInput !== mod.id ? (
                  <CheckCircle
                    className="icon ok"
                    title="Mark as OK"
                    onClick={() => handleApproveClick(mod.id)}
                  />
                ) : (
                  <div className="amount-approval">
                    <input
                      type="number"
                      value={approveInputs[mod.id] || ""}
                      onChange={(e) => handleAmountChange(mod.id, e.target.value)}
                      placeholder={`Est: ₹${estimatedAmount}`}
                    />
                    <button onClick={() => handleSubmitAmount(mod.id)}>
                      Submit
                    </button>
                  </div>
                )}
                <Undo2
                  className="icon rework"
                  title="Request Rework"
                  onClick={() => handleRework(mod.id)}
                />
              </div>
            )}

            {mod.status === "PAY" && (
              <button className="pay-btn" onClick={() => handlePay(mod.id)}>
                Pay ₹{mod.amount}
              </button>
            )}

            <button
              className="assign-btn"
              onClick={() => handleAssignOrUpdate(index)}
              disabled={mod.updateCount >= 1}
            >
              {mod.id ? (mod.updateCount >= 1 ? "Locked" : "Update") : "Assign"}
            </button>
          </div>
        );
      })}

      {enlargedImage && (
        <div className="image-modal" onClick={() => setEnlargedImage(null)}>
          <img src={enlargedImage} alt="Enlarged" />
          <X className="close-btn" />
        </div>
      )}
    </div>
  );
};

export default Modules;
