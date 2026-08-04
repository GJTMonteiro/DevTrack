import './DashboardLayout.css';
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout () {
    return(
        <div className="dashboard-layout">
        <Sidebar/>

        <main className="dashboard-main">

            <Navbar/>
        <div className="dashboard-content">
            <Outlet/>
        </div>
        </main>
        </div>
    );
}

export default DashboardLayout;