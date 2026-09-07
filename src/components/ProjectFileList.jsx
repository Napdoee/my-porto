import { getProjectCategory, getProjectKey } from '../lib/portfolioData';
import { playSelect } from '../lib/soundEngine';

const ProjectFileList = ({ projects, selectedProject, onSelect }) => (
  <div className="project-file-list">
    {projects.map((project, index) => {
      const key = getProjectKey(project);
      const selectedKey = selectedProject ? getProjectKey(selectedProject) : '';
      const isSelected = key === selectedKey;

      return (
        <button key={key} type="button" className={`project-file ${isSelected ? 'active' : ''}`} onClick={() => { playSelect(); onSelect(project); }}>
          <div className="project-folder-icon" aria-hidden="true"><span /></div>
          <h3 className="font-retro-game">{project.title}</h3>
          <p className="font-retro-label">{getProjectCategory(project)} / {project.isFeatured ? 'TOP BUILD' : String(index + 1).padStart(2, '0')}</p>
        </button>
      );
    })}
  </div>
);

export default ProjectFileList;
