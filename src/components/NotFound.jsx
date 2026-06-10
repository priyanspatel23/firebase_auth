import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', color: 'var(--accent)', marginBottom: '16px' }}>404</h1>
        <h2 style={{ marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          The page you are looking for doesn't exist or has been moved to another location.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '12px 32px' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;