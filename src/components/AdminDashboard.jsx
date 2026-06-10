import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  // Load users from localStorage or use defaults
  useEffect(() => {
    const savedUsers = localStorage.getItem('app_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Mike Ross', email: 'mike@example.com', role: 'user' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    const userToAdd = {
      ...newUser,
      id: Date.now(),
    };
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'user' });
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">Admin<span>Panel</span></div>
        <nav className="nav-menu">
          <div className={`nav-link ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
            <i className="bi bi-grid-1x2"></i> Overview
          </div>
          <div className={`nav-link ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <i className="bi bi-people"></i> Users
          </div>
          <div className={`nav-link`} onClick={() => navigate('/user-dashboard')}>
            <i className="bi bi-person-badge"></i> User View
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="nav-link" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i> Logout
          </div>
        </div>
      </aside>

      <main className="main-view">
        <header className="page-header">
          <div className="page-info">
            <h1>{tab === 'users' ? 'User Management' : 'System Overview'}</h1>
            <p>Welcome back, Admin. Here is what's happening.</p>
          </div>
          {tab === 'users' && (
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setShowAddModal(true)}>
              + Add New User
            </button>
          )}
        </header>

        {tab === 'overview' ? (
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{users.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">System Health</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>98%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Active Sessions</div>
              <div className="stat-value">24</div>
            </div>
          </div>
        ) : (
          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`user-badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => handleDeleteUser(user.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '24px' }}>Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="input-field"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="submit" className="btn-primary">Add User</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;