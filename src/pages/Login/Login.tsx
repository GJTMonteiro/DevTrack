import '../Auth/Auth.css';

import { Link, useNavigate } from 'react-router-dom';

import {
  MdPerson,
  MdFolderOpen,
  MdTaskAlt,
  MdTrendingUp,
} from 'react-icons/md';

import apiFetch from '../../services/api';

function Login() {
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Guardar JWT
      localStorage.setItem('token', data.token);

      // Guardar utilizador
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Unable to connect to server');
      }
    }
  }

  return (
    <section className="auth">
      <div className="auth-container">
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
              <MdPerson />
              <span>Profile Page</span>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>

            <p>Sign in to continue to DevTrack</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
            />

            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
            />

            <Link to="/forgot-password" className="auth-forgot">
              Forgot your password?
            </Link>

            <button type="submit">Sign In</button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
