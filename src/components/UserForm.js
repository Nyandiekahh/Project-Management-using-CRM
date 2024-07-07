import React, { useState } from 'react';

const UserForm = ({ onSubmit, initialUser = {} }) => {
  const [username, setUsername] = useState(initialUser.username || '');
  const [role, setRole] = useState(initialUser.role || 'officer');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      id: initialUser.id || null,
      username,
      role,
    };
    onSubmit(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
        </select>
      </div>
      <button type="submit">Save User</button>
    </form>
  );
};

export default UserForm;
