import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ old: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setError('');

    const storedPassword = localStorage.getItem('registeredPassword');

    if (data.old !== storedPassword) {
      setError('Current password is incorrect.');
      return;
    }
    if (data.new.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (data.new !== data.confirm) {
      setError("New passwords don't match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Update the password first, then clear session tokens
      localStorage.setItem('registeredPassword', data.new);
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login');
    }, 800);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">App<span>Portal</span></div>
          <p className="auth-subtitle">Update your security credentials</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="input-field"
              name="old"
              placeholder="••••••••"
              value={data.old}
              onChange={(e) => { setError(''); setData({ ...data, old: e.target.value }); }}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="input-field"
              name="new"
              placeholder="Min. 8 characters"
              value={data.new}
              onChange={(e) => { setError(''); setData({ ...data, new: e.target.value }); }}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="input-field"
              name="confirm"
              placeholder="••••••••"
              value={data.confirm}
              onChange={(e) => { setError(''); setData({ ...data, confirm: e.target.value }); }}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/user-dashboard">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;