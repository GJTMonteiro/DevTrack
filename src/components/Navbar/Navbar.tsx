import { useTheme } from '../context/ThemeContext';

import './Navbar.css';

import {
  MdNotificationsNone,
  MdPerson,
  MdSearch,
  MdDarkMode,
  MdLightMode,
} from 'react-icons/md';


function Navbar () {
    const {theme, toggleTheme} = useTheme();
    return(
        <header className="navbar">
            <div className="navbar-center">
                <div className="navbar-search">
                    <MdSearch/>
                    <input type="text"
                     placeholder="Search projects..." 
                     aria-label="Search projects"
                     />
                </div>
            </div>
            <div className="navbar-right">
                <div className="navbar-notifications">
                    <MdNotificationsNone/>
                </div>
                <button 
                    className="navbar-dark-mode"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"

                    >
                    {theme === "dark" ? <MdLightMode/> : <MdDarkMode />}
                </button>
                <div className="navbar-avatar">
                    <MdPerson/>
                </div>
            </div>
        </header>
    );
}

export default Navbar;