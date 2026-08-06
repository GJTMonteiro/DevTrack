import '../Auth/Auth.css';

import { Link, useNavigate } from 'react-router-dom';

import {
  MdPerson,
  MdFolderOpen,
  MdTaskAlt,
  MdTrendingUp,
} from 'react-icons/md';

function Register() {
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (form.elements.namedItem('name') as HTMLInputElement).value;

    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;

    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    const confirmPassword = (
      form.elements.namedItem('confirmPassword') as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Guardar dados básicos do utilizador
      localStorage.setItem('userName', data.user.name);

      localStorage.setItem('username', data.user.username);

      alert('Account created successfully!');

      navigate('/dashboard');
    } catch (error) {
      console.error('REGISTER ERROR:', error);

      alert('Unable to connect to server');
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
            <h2>Create Account</h2>

            <p>Join DevTrack and manage your projects</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              required
            />

            <label htmlFor="username" className="sr-only">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              autoComplete="username"
              spellCheck={false}
              required
            />

            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
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
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
            />

            <button type="submit">Create Account</button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
