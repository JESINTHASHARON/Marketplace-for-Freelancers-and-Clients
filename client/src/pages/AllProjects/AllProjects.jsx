import React from "react";
import "./AllProject.scss";
import ProjectCard2 from "../../components/ProjectCard2/ProjectCard2";
import { projects } from "../../data";

function AllProjects() {
  return (
    <div className="allProjects">
      <div className="container">
        <h1>All Projects</h1>
        <div className="cards">
          {projects.map((card) => (
            <ProjectCard2 key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllProjects;
