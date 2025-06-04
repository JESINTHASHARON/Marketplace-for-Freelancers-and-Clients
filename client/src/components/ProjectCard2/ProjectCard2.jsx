import React from "react";
import "./ProjectCard2.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

// Component for displaying individual project cards
const ProjectCard2 = ({ item }) => {
  // Fetch user data based on userId of the project
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  return (
    <Link to={`/project/${item.id}`} className="link">
      <div className="projectCard2">
        {/* Display cover image from project images (assuming first image in array is the cover) */}
        <img src={item.images[0] || "/img/default-project.jpg"} alt={item.title} />
        
        <div className="info">
          {isLoading ? (
            <p>Loading...</p> // A more user-friendly message
          ) : error ? (
            <p>Something went wrong!</p> // Handling error gracefully
          ) : (
            <div className="user">
              {/* Check if images exists and is an array before accessing the first image */}
              <img src={Array.isArray(data?.images) && data.images[0] ? data.images[0] : "/img/noavatar.jpg"} alt={data?.username} />
              <span>{data?.username}</span>
            </div>
          )}

          {/* Display the project description (with truncation if it's too long) */}
          <p>
            {item.description.length > 60
              ? `${item.description.substring(0, 60)}...`
              : item.description}
          </p>
        </div>

        <hr />
        <div className="detail">
          <img src="/img/heart.png" alt="heart" />
          <div className="price">
            <span>BUDGET</span>
            <h2>Rs. {item.budget}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard2;
