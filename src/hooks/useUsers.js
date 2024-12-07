// src/hooks/useUsers.js
import { useState, useEffect } from 'react';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/user-management');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        
        // Transform the data for react-select format
        // Only include senior officers and principal officers
        const formattedUsers = data
          .filter(user => 
            user.role === 'seniorOfficer' || 
            user.role === 'principalOfficer'
          )
          .map(user => ({
            value: user.username,
            label: user.username,
            role: user.role
          }));
        
        setUsers(formattedUsers);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useUsers;