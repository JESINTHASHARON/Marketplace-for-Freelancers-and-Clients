import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyWorks.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const MyWorks = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data: projectBids = [] } = useQuery({
    queryKey: ["projectsByBidder", currentUser.user.id],
    queryFn: async () => {
      const res = await newRequest.get(`/bids/user/${currentUser.user.id}/projects`);
      return res.data.projectBids || [];
    },
  });

  const handleClickTitle = (project) => {
    navigate(`/project/${project.id}`);
  };

  const handleContact = async (projectOwnerId) => {
    const buyerId = currentUser.user.id;
    const sellerId = projectOwnerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="myworks">
      <div className="container">
        <h1>Your Bidded Projects</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message || "Something went wrong!"}</p>
        ) : projectBids.length > 0 ? (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Project Title</th>
                <th>Your Bid</th>
                <th>Status</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {projectBids.map(({ project, bid }) => (
                <tr key={project.id}>
                  <td>
                    <img
                      src={(project.images && project.images[0]) || "/img/noavatar.jpg"}
                      alt="Project"
                      className="project-img"
                    />
                  </td>
                  <td
                    onClick={() => handleClickTitle(project)}
                    className="clickable-title"
                  >
                    {project.title || "Untitled Project"}
                  </td>
                  <td>Rs. {bid?.amount || "—"}</td>
                  <td>
                    {bid?.status === "ACCEPT" ? (
                      <button
                        className="show-modules-btn"
                        onClick={() => navigate(`/assignedModule/${project.id}`)}
                      >
                        Show Modules
                      </button>
                    ) : (
                      <span className={`status ${bid?.status?.toLowerCase() || "pending"}`}>
                        {bid?.status || "Pending"}
                      </span>
                    )}
                  </td>
                  <td>
                    <img
                      className="message"
                      src="/img/message.png"
                      alt="message"
                      title="Message Project Owner"
                      style={{ cursor: "pointer", width: "24px" }}
                      onClick={() => handleContact(project.userId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default MyWorks;
