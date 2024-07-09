import React from 'react'; // Removed useState import
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const TaskManagementPage = () => {
  const officers = [
    { id: 1, name: 'Officer 1' },
    { id: 2, name: 'Officer 2' },
    { id: 3, name: 'Officer 3' },
  ];

  const handleTaskSubmit = (task) => {
    console.log('Task submitted:', task);
    // Any additional logic after task submission can be added here
  };

  return (
    <div>
      <h1>Task Management</h1>
      <TaskForm officers={officers} onSubmit={handleTaskSubmit} />
      <TaskList />
    </div>
  );
};

export default TaskManagementPage;
