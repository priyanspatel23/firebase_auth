import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [creds, setCreds] = useState({ email: '', newPass: '', confirm: '' });

  const handleChange = (e) => {
    setError('');
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleReset = (e) => {
    e.preventDefault();

    if (creds.newPass.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    if (creds.newPass !== creds.confirm) {
      return setError('Passwords do not match.');
    }

    const registeredEmail = localStorage.getItem('registeredEmail');
    if (!registeredEmail || creds.email.toLowerCase() !== registeredEmail.toLowerCase()) {
      return setError('No account found with this email address.');
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('registeredPassword', creds.newPass);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }, 1000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">App<span>Portal</span></div>
          <p className="auth-subtitle">Regain access to your account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            ✓ Password updated successfully! Redirecting to login...
          </div>
        )}

        {!success && (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label className="form-label">Registered Email</label>
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
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPass"
                className="input-field"
                placeholder="Min. 8 characters"
                value={creds.newPass}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirm"
                className="input-field"
                placeholder="••••••••"
                value={creds.confirm}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">← Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;