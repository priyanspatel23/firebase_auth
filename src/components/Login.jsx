import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creds, setCreds] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setError('');
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    const registeredEmail = localStorage.getItem('registeredEmail');
    const registeredPass = localStorage.getItem('registeredPassword');
    const role = localStorage.getItem('registeredRole') || 'user';

    setTimeout(() => {
      if (!registeredEmail || creds.email !== registeredEmail || creds.password !== registeredPass) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('role', role);
      localStorage.setItem('username', localStorage.getItem('registeredName') || 'User');
      localStorage.setItem('token', 'session_' + Math.random().toString(36).substr(2));

      // Navigate without reload — App re-reads role via route render
      navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    }, 800);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">App<span>Portal</span></div>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="name@company.com"
              value={creds.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={creds.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
          <div style={{ marginTop: '12px' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', opacity: 0.7 }}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
