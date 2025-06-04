import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCatCard.scss";

function ProjectCatCard({ card }) {
  return (
    <Link to={`/projects?cat=${card.title}`}>
      <div className="projectCatCard">
        <img src={card.img} alt="" />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}

export default ProjectCatCard;
