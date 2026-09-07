import { ArrowUpRight, FolderGit2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import PixelButton from "./PixelButton";
import {
  getProjectCategory,
  getProjectHighlights,
  getProjectKey,
} from "../lib/portfolioData";
import { playClick, playSelect } from "../lib/soundEngine";

const ProjectPreviewPanel = ({ project }) => {
  if (!project) {
    return (
      <aside className="project-preview-panel empty">
        NO PROJECT SELECTED.
      </aside>
    );
  }

  const projectKey = getProjectKey(project);

  return (
    <aside className="project-preview-panel">
      <div className="preview-header">
        <div>
          <div className="font-retro-label">PREVIEW PANEL</div>
          <h2 className="font-retro-game">{project.title}</h2>
        </div>
        <span>{getProjectCategory(project)}</span>
      </div>
      <div className="preview-section">
        <h3 className="font-retro-label">README.TXT</h3>
        <p className="font-retro-label">{project.description}</p>
      </div>
      <div className="preview-section">
        <h3 className="font-retro-label">STACK.INDEX</h3>
        <div className="tag-row">
          {(project.tags || []).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="preview-actions">
        <Link
          to={`/projects/${projectKey}`}
          className="btn-pixel btn-pixel-orange"
          onClick={playClick}
        >
          VIEW CASE FILE <ArrowUpRight size={14} />
        </Link>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-pixel btn-pixel-gray"
            onClick={playSelect}
          >
            LIVE <ArrowUpRight size={14} />
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-pixel btn-pixel-gray"
            onClick={playSelect}
          >
            REPO <FolderGit2 size={14} />
          </a>
        )}
        <Link
          to={`/contact?project=${encodeURIComponent(project.title)}`}
          className="preview-contact-link"
          onClick={playClick}
        >
          <PixelButton variant="primary">
            <MessageSquare size={14} /> DISCUSS
          </PixelButton>
        </Link>
      </div>
    </aside>
  );
};

export default ProjectPreviewPanel;
