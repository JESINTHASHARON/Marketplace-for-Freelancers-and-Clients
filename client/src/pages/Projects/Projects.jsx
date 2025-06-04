import React, { useState, useEffect, useRef } from "react";
import "./Projects.scss";
import ProjectCard2 from "../../components/ProjectCard2/ProjectCard2";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Projects() {
  const [sort, setSort] = useState("createdAt");
  const [open, setOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for selected category
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  // Extract category from URL query string (if any)
  const queryParams = new URLSearchParams(search);
  const categoryFilter = queryParams.get("cat");

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["projects", search, sort],
    queryFn: () =>
      newRequest
        .get(
          `/projects${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => res.data),
  });

  // Debug: Log the data and ensure it's populated
  console.log(data);

  useEffect(() => {
    if (data && data.length > 0) {
      // If category filter exists, filter projects by the category
      if (categoryFilter) {
        setFilteredProjects(data.filter((project) => project.category === categoryFilter));
      } else {
        setFilteredProjects(data);
      }
    }
  }, [data, categoryFilter]);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
    refetch();
  };

  const applyFilter = () => {
    // Apply local filter logic based on min/max values and category
    const minBudget = minRef.current.value ? parseInt(minRef.current.value) : 0;
    const maxBudget = maxRef.current.value ? parseInt(maxRef.current.value) : Infinity;

    console.log(minBudget, maxBudget); // Debug: Log min/max budget values

    // Filter by budget and category
    const filtered = data.filter(
      (project) =>
        project.budget >= minBudget &&
        project.budget <= maxBudget &&
        (!categoryFilter || project.category === categoryFilter) // Only apply category filter if it's present
    );

    setFilteredProjects(filtered);
  };

  const apply = () => {
    applyFilter(); // Apply the filter logic
    refetch(); // Refetch data to make sure it stays consistent with backend
  };

  return (
    <div className="projects">
      <div className="container">
        <span className="breadcrumbs">ProjectNest</span>
        <h1>Client Projects</h1>
        <p>Explore project opportunities tailored to your skills.</p>

        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>

          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "createdAt" ? "Newest" : "Popular"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "createdAt" ? (
                  <span onClick={() => reSort("sales")}>Popular</span>
                ) : (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : filteredProjects.length > 0
            ? filteredProjects.map((project) => (
                <ProjectCard2 key={project.id} item={project} />
              ))
            : "No projects found"}
        </div>
      </div>
    </div>
  );
}

export default Projects;
