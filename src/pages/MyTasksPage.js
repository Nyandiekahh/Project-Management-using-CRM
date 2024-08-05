// src/pages/MyTasksPage.js
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout'; // Adjust the import path as needed
import TaskList from '../components/TaskList'; // Adjust the import based on your actual file structure
import { useAuth } from '../context/AuthProvider';

const MyTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks'); // Update the URL as needed
        const data = await response.json();
        const userTasks = data.filter(task => task.assignedOfficer.includes(user.username)); // Assuming 'assignedOfficer' is a field
        setTasks(userTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [user.username]);

  return (
    <DashboardLayout isOpen={isOpen} toggleSidebar={toggleSidebar}>
      <div>
        <h1>My Tasks</h1>
        <TaskList tasks={tasks} /> {/* Pass filtered tasks to TaskList component */}
      </div>
    </DashboardLayout>
  );
};

export default MyTasksPage;
