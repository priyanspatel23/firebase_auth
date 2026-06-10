import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', status: 'active', progress: 0 });
  const user = localStorage.getItem('username') || 'Guest';

  useEffect(() => {
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const defaultProjects = [
        { id: 1, title: 'Auth Core Implementation', status: 'active', progress: 75 },
        { id: 2, title: 'User Interface Kit', status: 'completed', progress: 100 },
        { id: 3, title: 'Database Migration', status: 'pending', progress: 0 },
      ];
      setProjects(defaultProjects);
      localStorage.setItem('user_projects', JSON.stringify(defaultProjects));
    }

    const savedTasks = localStorage.getItem('user_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaultTasks = [
        { id: 1, title: 'Review pull requests', done: false, priority: 'high' },
        { id: 2, title: 'Update documentation', done: true, priority: 'medium' },
        { id: 3, title: 'Write unit tests', done: false, priority: 'high' },
        { id: 4, title: 'Code review session', done: false, priority: 'low' },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('user_tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    const projectToAdd = {
      ...newProject,
      id: Date.now(),
      progress: parseInt(newProject.progress) || 0,
    };
    const updated = [...projects, projectToAdd];
    setProjects(updated);
    localStorage.setItem('user_projects', JSON.stringify(updated));
    setShowAddModal(false);
    setNewProject({ title: '', status: 'active', progress: 0 });
  };

  const handleDeleteProject = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('user_projects', JSON.stringify(updated));
  };

  const handleToggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(updated);
    localStorage.setItem('user_tasks', JSON.stringify(updated));
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('user_tasks', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">User<span>Portal</span></div>
        <nav className="nav-menu">
          <div className={`nav-link ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
            <i className="bi bi-folder2"></i> Projects
          </div>
          <div className={`nav-link ${tab === 'tasks' ? 'active' : ''}`} onClick={() => setTab('tasks')}>
            <i className="bi bi-list-check"></i> Tasks
          </div>
          <div className={`nav-link ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
            <i className="bi bi-gear"></i> Settings
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="nav-link" onClick={handleLogout}>
            <i className="bi bi-power"></i> Logout
          </div>
        </div>
      </aside>

      <main className="main-view">
        <header className="page-header">
          <div className="page-info">
            <h1>
              {tab === 'projects' && 'My Projects'}
              {tab === 'tasks' && 'My Tasks'}
              {tab === 'settings' && 'Account Settings'}
            </h1>
            <p>Welcome back, {user}.</p>
          </div>
          {tab === 'projects' && (
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => setShowAddModal(true)}>
              + New Project
            </button>
          )}
        </header>

        {/* Stats Row */}
        {tab === 'projects' && (
          <>
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-label">Total Projects</div>
                <div className="stat-value">{projects.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Avg. Completion</div>
                <div className="stat-value" style={{ color: 'var(--accent)' }}>
                  {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1))}%
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Completed</div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>
                  {projects.filter(p => p.status === 'completed').length}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '24px' }}>Project List</h3>
              {projects.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No projects yet. Create one!</p>
              )}
              <div style={{ display: 'grid', gap: '16px' }}>
                {projects.map(project => (
                  <div key={project.id} style={{
                    padding: '20px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>{project.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, maxWidth: '220px', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '10px' }}>
                          <div style={{ width: `${project.progress}%`, height: '100%', background: 'var(--accent)', borderRadius: '10px', transition: 'width 0.3s' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{project.progress}%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span className={`user-badge ${project.status === 'completed' ? 'badge-user' : 'badge-admin'}`} style={{ minWidth: '80px', textAlign: 'center' }}>
                        {project.status}
                      </span>
                      <button className="action-btn" onClick={() => handleDeleteProject(project.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tasks Tab */}
        {tab === 'tasks' && (
          <>
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-label">Total Tasks</div>
                <div className="stat-value">{tasks.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Completed</div>
                <div className="stat-value" style={{ color: 'var(--success)' }}>{tasks.filter(t => t.done).length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pending</div>
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{tasks.filter(t => !t.done).length}</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '24px' }}>Task Checklist</h3>
              {tasks.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No tasks found.</p>
              )}
              <div style={{ display: 'grid', gap: '12px' }}>
                {tasks.map(task => (
                  <div key={task.id} style={{
                    padding: '16px 20px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    opacity: task.done ? 0.55 : 1,
                    transition: 'opacity 0.2s',
                  }}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => handleToggleTask(task.id)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</p>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '100px',
                      textTransform: 'uppercase',
                      background: `${priorityColor[task.priority]}18`,
                      color: priorityColor[task.priority],
                    }}>
                      {task.priority}
                    </span>
                    <button className="action-btn" onClick={() => handleDeleteTask(task.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="card" style={{ maxWidth: '520px' }}>
            <h3 style={{ marginBottom: '24px' }}>Account Settings</h3>

            <div style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Logged in as</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{user}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{localStorage.getItem('registeredEmail') || '—'}</div>
            </div>

            <div style={{ marginBottom: '20px', padding: '20px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>Change Password</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Update your login credentials</div>
              </div>
              <button className="btn-secondary" onClick={() => navigate('/change-password')} style={{ whiteSpace: 'nowrap' }}>
                Change
              </button>
            </div>

            <div style={{ padding: '20px', background: 'rgba(239,68,68,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px', color: '#ef4444' }}>Sign Out</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>End your current session</div>
              </div>
              <button className="btn-secondary" onClick={handleLogout} style={{ whiteSpace: 'nowrap', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '24px' }}>New Project</h2>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter project name"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Progress (%)</label>
                <input
                  type="number"
                  className="input-field"
                  value={newProject.progress}
                  onChange={(e) => setNewProject({ ...newProject, progress: e.target.value })}
                  min="0" max="100"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="input-field"
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button type="submit" className="btn-primary">Create Project</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;