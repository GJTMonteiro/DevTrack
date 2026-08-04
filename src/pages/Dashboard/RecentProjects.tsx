import ProjectCard from '../Project/ProjectCard';
import './RecentProjects.css';


function RecentProjects () {
    return(
        <section className="recent-projects-section">
        <div className="recent-projects">
        <div className="recent-projects-header">
            <h2 className="recent-projects-title">Recent Projects</h2>
            <button className="project-viewall-btn">View All</button>
        </div>
            <ProjectCard 
            name="Devtrack"
            description="Developer productivity platform"
            status="In Progress"
            />
            <ProjectCard 
            name="Portfolio"
            description="Personal website"
            status="Completed"
            />
            <ProjectCard 
            name="Coffee Shop"
            description="React coffee shop website"
            status="Planning"
            />
        </div>
        </section>
    );
}

export default RecentProjects;