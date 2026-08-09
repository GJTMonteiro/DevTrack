import '../Auth/Auth.css';

import { Link, useNavigate } from 'react-router-dom';

import {
  MdCheckCircle,
  MdFolderOpen,
  MdTaskAlt,
  MdTrendingUp,
} from 'react-icons/md';

function ForgotPassword() {
  const navigate = useNavigate();

  function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    alert('If an account exists, a reset link was sent.');

    navigate('/login');
  }

  return (
    <section className="auth">
      <div className="auth-container">
        {/* =========================
            BRAND
        ========================= */}

        <div className="auth-brand">
          <h1>DevTrack</h1>

          <p>
            Manage your projects, organize your tasks and boost your
            productivity with a modern workspace.
          </p>

          <div className="auth-features">
            <div>
              <MdFolderOpen />

              <span>Project Management</span>
            </div>

            <div>
              <MdTaskAlt />

              <span>Task Tracking</span>
            </div>

            <div>
              <MdTrendingUp />

              <span>Productivity Dashboard</span>
            </div>

            <div>
              <MdCheckCircle />

              <span>Team Collaboration</span>
            </div>
          </div>
        </div>

        {/* =========================
            RESET PASSWORD CARD
        ========================= */}

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Reset Password</h2>

            <p>Enter your email to receive password reset instructions.</p>
          </div>

          <form className="auth-form" onSubmit={handleReset}>
            <label htmlFor="forgot-password-email" className="sr-only">
              Email
            </label>

            <input
              id="forgot-password-email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
            />

            <button type="submit">Send Reset Link</button>
          </form>

          <p className="auth-footer">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
