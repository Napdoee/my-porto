import { Link, useOutletContext, useParams } from "react-router-dom";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import OSWindow from "../components/OSWindow";
import PixelButton from "../components/PixelButton";
import { getProjectCategory, getProjectKey } from "../lib/portfolioData";

const ProjectCaseFile = () => {
  const { projects } = useOutletContext();
  const { id } = useParams();
  const project =
    projects.find((item) => getProjectKey(item) === id) ||
    projects.find((item) => encodeURIComponent(getProjectKey(item)) === id);

  if (!project) {
    return (
      <div className="page-screen">
        <div className="container">
          <OSWindow title="CASE FILE MISSING" subtitle="404.LOG">
            <p className="font-retro-label">Project file tidak ditemukan.</p>
            <Link to="/projects" className="btn-pixel btn-pixel-orange">
              BACK TO EXPLORER
            </Link>
          </OSWindow>
        </div>
      </div>
    );
  }

  return (
    <div className="page-screen">
      <div className="container">
        <OSWindow
          title={`CASE FILE: ${project.title}`}
          subtitle={`STATUS: ${getProjectCategory(project)}`}
        >
          <div className="case-file-grid">
            <section className="case-panel main-case-panel">
              <span className="font-retro-label case-label">MISSION</span>
              {project.thumbnail && (
                <div className="case-thumbnail">
                  <img
                    className="thumbnail-img"
                    src={project.thumbnail}
                    alt={project.title}
                  />
                </div>
              )}
              <h1 className="font-retro-game">{project.title}</h1>
              <p className="font-retro-label">{project.description}</p>
            </section>
            <section className="case-panel">
              <span className="font-retro-label case-label">BUILD STACK</span>
              <div className="tag-row">
                {(project.tags || []).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </section>
            <section className="case-panel case-actions">
              <span className="font-retro-label case-label">NEXT ACTION</span>
              <div className="preview-actions">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-pixel btn-pixel-orange"
                  >
                    OPEN LIVE <ArrowUpRight size={14} />
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-pixel btn-pixel-gray"
                  >
                    OPEN REPO <ArrowUpRight size={14} />
                  </a>
                )}
                <Link
                  to={`/contact?project=${encodeURIComponent(project.title)}`}
                  className="preview-contact-link"
                >
                  <PixelButton variant="primary">
                    <MessageSquare size={14} /> DISCUSS SIMILAR
                  </PixelButton>
                </Link>
              </div>
            </section>
          </div>
        </OSWindow>
      </div>
    </div>
  );
};

export default ProjectCaseFile;
