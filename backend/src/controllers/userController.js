// src/controllers/userController.js
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

const ensureUsersFile = async () => {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
};

const readUsers = async () => {
  await ensureUsersFile();
  const data = await fs.readFile(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

const writeUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await readUsers();
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const validRoles = ['deputyDirector', 'principalOfficer', 'seniorOfficer', 'officer'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const users = await readUsers();

      if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role: role || 'officer',
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      users.push(newUser);
      await writeUsers(users);

      const { password: _, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, role, status } = req.body;

      const users = await readUsers();
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (username && username !== users[userIndex].username) {
        const usernameExists = users.some(
          (user, index) => index !== userIndex && 
          user.username.toLowerCase() === username.toLowerCase()
        );
        if (usernameExists) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }

      const updatedUser = {
        ...users[userIndex],
        username: username || users[userIndex].username,
        role: role || users[userIndex].role,
        status: status || users[userIndex].status,
        updatedAt: new Date().toISOString()
      };

      if (password) {
        updatedUser.password = await bcrypt.hash(password, 10);
      }

      users[userIndex] = updatedUser;
      await writeUsers(users);

      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const users = await readUsers();
      
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      users.splice(userIndex, 1);
      await writeUsers(users);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const users = await readUsers();
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An error occurred during login' });
    }
  },

  getRoles: async (req, res) => {
    try {
      const roles = ['deputyDirector', 'principalOfficer', 'seniorOfficer', 'officer'];
      res.json(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ message: 'Failed to fetch roles' });
    }
  }
};

module.exports = userController;