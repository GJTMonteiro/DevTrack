import "./Settings.css";

import { useNavigate } from "react-router-dom";

import {
    MdLogout,
    MdDarkMode,
    MdNotifications,
    MdPerson,
} from "react-icons/md";


function Settings() {

    const navigate = useNavigate();


    function handleLogout() {

        localStorage.removeItem("token");

        navigate("/login");

    }


    function handleThemeToggle() {

        document.body.classList.toggle("light-mode");

    }



    return (

        <div className="settings-page">


            <div className="settings-header">

                <h1>
                    Settings
                </h1>

                <p>
                    Manage your account preferences and application settings.
                </p>

            </div>



            {/* ACCOUNT SETTINGS */}

            <section className="settings-card">

                <div className="settings-card-title">

                    <MdPerson />

                    <h2>
                        Account Settings
                    </h2>

                </div>



                <div className="settings-form">


                    <div className="settings-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            value="Guilherme Monteiro"
                            readOnly
                        />

                    </div>



                    <div className="settings-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value="GJTMonteiro"
                            readOnly
                        />

                    </div>



                    <div className="settings-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value="user@email.com"
                            readOnly
                        />

                    </div>



                    <div className="settings-group">

                        <label>
                            Role
                        </label>

                        <input
                            type="text"
                            value="Front & Back Developer"
                            readOnly
                        />

                    </div>


                </div>


            </section>





            {/* APPEARANCE */}

            <section className="settings-card">


                <div className="settings-card-title">

                    <MdDarkMode />

                    <h2>
                        Appearance
                    </h2>

                </div>



                <div className="settings-option">

                    <span>
                        Toggle Theme
                    </span>


                    <button
                        onClick={handleThemeToggle}
                    >
                        Change Theme
                    </button>


                </div>


            </section>






            {/* NOTIFICATIONS */}

            <section className="settings-card">


                <div className="settings-card-title">

                    <MdNotifications />

                    <h2>
                        Notifications
                    </h2>

                </div>



                <div className="settings-option">

                    <span>
                        Email Notifications
                    </span>


                    <input
                        type="checkbox"
                        defaultChecked
                    />

                </div>



                <div className="settings-option">

                    <span>
                        Task Reminders
                    </span>


                    <input
                        type="checkbox"
                        defaultChecked
                    />

                </div>


            </section>






            {/* ACCOUNT ACTIONS */}

            <section className="settings-card">


                <div className="settings-card-title">

                    <MdLogout />

                    <h2>
                        Account
                    </h2>

                </div>




                <button
                    className="logout-button"
                    onClick={handleLogout}
                >

                    Logout

                </button>


            </section>



        </div>

    );

}


export default Settings;