import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Download.scss"; // Import the external style

const Download = () => {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["download", id],
    queryFn: async () => {
      const res = await newRequest.get(`/orders/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="download">Loading...</div>;
  if (error) return <div className="download">Something went wrong!</div>;

  const { workUrl, title } = data;

  return (
    <div className="download-container">
      <h2 className="download-title">
        Final Work for: <span className="download-title-highlight">{title}</span>
      </h2>

      {workUrl ? (
        <div className="download-link-wrapper">
          <a
            href={workUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            {workUrl}
          </a>
        </div>
      ) : (
        <p className="download-warning">Work is not yet uploaded.</p>
      )}
    </div>
  );
};

export default Download;
