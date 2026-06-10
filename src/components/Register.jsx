import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

    const handleChange = (e) => {
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e) => {
        e.preventDefault();

        if (formData.name.trim().length < 2) {
            return setError('Full name must be at least 2 characters.');
        }
        if (formData.password.length < 8) {
            return setError('Password must be at least 8 characters.');
        }

        setLoading(true);
        localStorage.setItem('registeredEmail', formData.email);
        localStorage.setItem('registeredPassword', formData.password);
        localStorage.setItem('registeredRole', formData.role);
        localStorage.setItem('registeredName', formData.name.trim());

        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="brand-logo">App<span>Portal</span></div>
                    <p className="auth-subtitle">Create a new account</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            placeholder="name@company.com"
                            value={formData.email}
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
                            placeholder="Min. 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Account Type</label>
                        <select name="role" className="input-field" value={formData.role} onChange={handleChange}>
                            <option value="user">Standard User</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
