import './Sidebar.css';
import logo from '../../assets/stussy-night.jpeg';
import { NavLink, useNavigate } from "react-router-dom";

import {
  MdDashboard,
  MdFolderOpen,
  MdTaskAlt,
  MdPerson,
  MdSettings,
  MdLogout,
} from 'react-icons/md';


function Sidebar() {
  const navigate = useNavigate();

  function handleLogout(){
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <NavLink className="sidebar-logo-link" to="/dashboard">
          <img src={logo} alt="DevTrack Logo" />
          <span>DevTrack</span>
        </NavLink>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/dashboard">
              <MdDashboard />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/projects">
              <MdFolderOpen />
              <span>Projects</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/tasks">
              <MdTaskAlt />
              <span>Tasks</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/profile">
              <MdPerson />
              <span>Profile</span>
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/settings">
              <MdSettings />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button 
        className="sidebar-logout"
        onClick={handleLogout}
        >
        <MdLogout/>
        <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
