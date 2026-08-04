import './ProjectCard.css';

type ProjectCardProps = {
    name: string;
    description: string;
    status: string;
}


function ProjectCard({name, description, status} : ProjectCardProps) {
  return (
    <div className="project-card">
      <div className="project-info">
        <h3 className="project-name">{name}</h3>
        <p className="project-description">{description}</p>
      </div>
      <div className="project-status">
        <span className="project-badge">{status}</span>
      </div>
    </div>
  );
}

export default ProjectCard;
