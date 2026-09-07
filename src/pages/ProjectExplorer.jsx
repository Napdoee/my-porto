import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import OSWindow from "../components/OSWindow";
import ProjectFileList from "../components/ProjectFileList";
import ProjectPreviewPanel from "../components/ProjectPreviewPanel";
import { getProjectCategory, getProjectKey } from "../lib/portfolioData";

const filters = ["ALL", "FEATURED", "CLIENT", "EXPERIMENT", "GAME"];

const ProjectExplorer = () => {
  const { projects } = useOutletContext();
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [selectedProjectKey, setSelectedProjectKey] = useState("");
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (projectFilter === "ALL") return true;
        if (projectFilter === "FEATURED") return Boolean(project.isFeatured);
        return getProjectCategory(project) === projectFilter;
      }),
    [projects, projectFilter],
  );

  const selectedProject =
    filteredProjects.find(
      (project) => getProjectKey(project) === selectedProjectKey,
    ) ||
    filteredProjects[0] ||
    null;

  return (
    <div className="page-screen">
      <div className="container">
        <OSWindow
          title="PROJECT EXPLORER"
          subtitle="C:\\PORTFOLIO\\PROJECTS"
          bodyStyle={{ padding: 0 }}
        >
          <div className="project-explorer-layout">
            <div className="explorer-desktop">
              <div className="font-retro-label address-bar">
                C:\PORTFOLIO\PROJECTS\{projectFilter}
              </div>
              <ProjectFileList
                projects={filteredProjects}
                selectedProject={selectedProject}
                onSelect={(project) =>
                  setSelectedProjectKey(getProjectKey(project))
                }
              />
            </div>
            <ProjectPreviewPanel project={selectedProject} />
          </div>
        </OSWindow>
      </div>
    </div>
  );
};

export default ProjectExplorer;
