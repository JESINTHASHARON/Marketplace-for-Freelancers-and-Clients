import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest"; // Axios instance
import "./MyProjects.scss";

const MyProjects = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await newRequest.get(`/projects/user/${currentUser.user.id}`);
      return res.data;
    },
  });

  const handleViewBids = (projectId, projectTitle) => {
    navigate(`/project/${projectId}/bids`, { state: { title: projectTitle } } );
  };

  return (
    <div className="projects-page">
      <h1>Your Projects</h1>
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>
                  {project.isCompleted ? (
                    <span>✅ Completed</span>
                  ) : (
                    <button onClick={() => handleViewBids(project.id, project.title)}>
                      View Bids
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {(data?.length === 0 || !data) && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyProjects;
