import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        alert('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleUpdate = async (userId) => {
    try {
      const res = await api.put(`/api/users/${userId}`, editForm);
      setUsers(users.map(user => user._id === userId ? res.data : user));
      setEditingUser(null);
      alert('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error updating user');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '' });
  };

  if (loading) {
    return (
      <div className="glass-card p-5 text-center">
        <div className="loading-spinner mb-3"></div>
        <h4 className="fw-bold mb-2">Loading Users</h4>
        <p className="text-muted mb-0">Fetching user data...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="display-6 fw-bold gradient-text mb-2">User Management</h2>
          <p className="text-muted">Manage all registered users</p>
        </div>
        <div className="badge bg-primary px-3 py-2">
          <i className="bi bi-people me-2"></i>
          {users.length} Users
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-people display-4 text-muted mb-3"></i>
          <h4 className="text-muted">No users found</h4>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">
                  <i className="bi bi-person me-2"></i>Name
                </th>
                <th scope="col">
                  <i className="bi bi-envelope me-2"></i>Email
                </th>
                <th scope="col">
                  <i className="bi bi-calendar me-2"></i>Joined
                </th>
                <th scope="col" className="text-center">
                  <i className="bi bi-gear me-2"></i>Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px', fontSize: '1.2rem', color: 'white' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold">{user.name}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    ) : (
                      <span className="text-muted">{user.email}</span>
                    )}
                  </td>
                  <td>
                    <small className="text-muted">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      {editingUser === user._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdate(user._id)}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleCancel}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(user)}
                            title="Edit User"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(user._id)}
                            title="Delete User"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
