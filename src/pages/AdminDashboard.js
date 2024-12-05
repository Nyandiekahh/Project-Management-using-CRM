import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import Clock from '../components/Clock';
import { 
  BarChart3, 
  Users, 
  Clock as ClockIcon, 
  AlertTriangle,
  Edit2,
  Trash2,
  Plus,
  CheckCircle
} from 'lucide-react';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const Content = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8fafc;
  margin-left: ${props => (props.isSidebarOpen ? '250px' : '60px')};
  transition: margin-left 0.3s;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
  }
`;

const WelcomeMessage = styled.div`
  font-size: 28px;
  margin-bottom: 30px;
  color: #1e293b;
  font-weight: 600;

  p {
    font-size: 16px;
    color: #64748b;
    margin-top: 8px;
    font-weight: normal;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  margin-bottom: 30px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${props => props.bg || '#e2e8f0'};
  color: ${props => props.color || '#64748b'};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #1e293b;
`;

const StatChange = styled.div`
  font-size: 14px;
  color: ${props => props.increase ? '#10b981' : '#64748b'};
  margin-top: 8px;
`;

const TasksContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TaskTableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 16px;
`;

const TaskTableHeader = styled.th`
  background-color: #f8fafc;
  color: #475569;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
`;

const TaskRow = styled.tr`
  &:hover {
    background-color: #f8fafc;
  }
  cursor: pointer;
`;

const TaskCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'Not Done': return '#fee2e2';
      case 'Pending': return '#fef3c7';
      case 'Completed': return '#dcfce7';
      case 'Assigned': return '#dbeafe';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Not Done': return '#991b1b';
      case 'Pending': return '#92400e';
      case 'Completed': return '#166534';
      case 'Assigned': return '#1e40af';
      default: return '#475569';
    }
  }};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;

  &:hover {
    background-color: #2563eb;
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${props => props.variant === 'edit' ? '#10b981' : '#ef4444'};
  cursor: pointer;
  margin-right: ${props => props.variant === 'edit' ? '8px' : '0'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'edit' ? '#059669' : '#dc2626'};
  }
`;

const NoTasksMessage = styled.div`
  text-align: center;
  padding: 48px 20px;
  font-size: 20px;
  color: #64748b;

  img {
    margin-top: 24px;
    width: 100%;
    max-width: 300px;
    border-radius: 12px;
  }
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setTasks(data);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    const pending = tasks.filter(task => task.status === 'Pending').length;
    const notDone = tasks.filter(task => task.status === 'Not Done').length;
    
    return {
      total,
      completed,
      pending,
      notDone,
      completionRate: total ? ((completed / total) * 100).toFixed(1) : 0
    };
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCreateTask = (task) => {
    const formData = new FormData();
    formData.append('name', task.name);
    formData.append('description', task.description);
    formData.append('deadline', task.deadline);
    formData.append('assignedOfficer', task.assignedOfficer);
    if (task.document) {
      formData.append('document', task.document);
    }

    if (task.id) {
      // If task ID exists, update the existing task
      fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        body: formData
      })
        .then(response => response.json())
        .then(updatedTask => {
          setTasks(prevTasks => prevTasks.map(t => 
            t.id === updatedTask.id ? updatedTask : t
          ));
          setShowTaskForm(false);
          setEditingTask(null);
        })
        .catch(error => console.error('Error updating task:', error));
    } else {
      // If no task ID, create a new task
      fetch('http://localhost:5000/tasks', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          setTasks(prevTasks => [...prevTasks, data]);
          setShowTaskForm(false);
        })
        .catch(error => console.error('Error creating task:', error));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete task');
          }
          return response.json();
        })
        .then(() => {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    setEditingTask(null);
  };

  const formatUsername = (username) => {
    return username
      ?.replace(/([a-z])([A-Z])/g, '$1 $2')
      ?.replace(/([0-9])/g, ' $1')
      ?.replace(/^./, str => str.toUpperCase());
  };

  const stats = calculateStats();

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Content isSidebarOpen={isSidebarOpen}>
        <Clock />
        
        <WelcomeMessage>
          Welcome back, {user ? formatUsername(user.username) : 'Admin'}
          <p>We're delighted to have you. Need help with the system? Navigate to virtual assistant on the side menu.</p>
        </WelcomeMessage>

        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatTitle>Total Tasks</StatTitle>
              <StatIcon bg="#dbeafe" color="#3b82f6">
                <BarChart3 size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.total}</StatValue>
            <StatChange>Tasks in system</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Completed</StatTitle>
              <StatIcon bg="#dcfce7" color="#10b981">
                <CheckCircle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.completed}</StatValue>
            <StatChange increase>{stats.completionRate}% completion rate</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Pending</StatTitle>
              <StatIcon bg="#fef3c7" color="#f59e0b">
                <ClockIcon size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.pending}</StatValue>
            <StatChange>Awaiting completion</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Not Started</StatTitle>
              <StatIcon bg="#fee2e2" color="#ef4444">
                <AlertTriangle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.notDone}</StatValue>
            <StatChange>Require attention</StatChange>
          </StatCard>
        </StatsGrid>

        <Button onClick={toggleTaskForm}>
          <Plus size={20} />
          {showTaskForm ? 'Hide Task Form' : 'Create New Task'}
        </Button>

        {showTaskForm && (
          <TaskForm
            officers={[
              { id: 1, name: 'Principal Officer 1' },
              { id: 2, name: 'Principal Officer 2' },
              { id: 3, name: 'Principal Officer 3' },
              { id: 4, name: 'Principal Officer 4' },
              { id: 5, name: 'Principal Officer 5' },
              { id: 6, name: 'Senior Officer 1' },
              { id: 7, name: 'Senior Officer 2' },
              { id: 8, name: 'Senior Officer 3' },
              { id: 9, name: 'Senior Officer 4' },
              { id: 10, name: 'Senior Officer 5' },
            ]}
            onSubmit={handleCreateTask}
            initialTask={editingTask}
          />
        )}

        <TasksContainer>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
            Tasks List
          </h2>

          <TaskTableWrapper>
            {tasks.length > 0 ? (
              <TaskTable>
                <thead>
                  <tr>
                    <TaskTableHeader>S/No</TaskTableHeader>
                    <TaskTableHeader>TASK ID</TaskTableHeader>
                    <TaskTableHeader>TASK NAME</TaskTableHeader>
                    <TaskTableHeader>STATUS</TaskTableHeader>
                    <TaskTableHeader>DEADLINE</TaskTableHeader>
                    <TaskTableHeader>ASSIGNED TO</TaskTableHeader>
                    <TaskTableHeader>ACTIONS</TaskTableHeader>
                  </tr>
                </thead>
                <tbody>
                {tasks.map((task, index) => (
                    <TaskRow 
                      key={task.id} 
                      onClick={() => handleTaskClick(task)}
                    >
                      <TaskCell>{index + 1}</TaskCell>
                      <TaskCell>{task.id}</TaskCell>
                      <TaskCell>{task.name}</TaskCell>
                      <TaskCell>
                        <StatusBadge status={task.status}>
                          {task.status}
                        </StatusBadge>
                      </TaskCell>
                      <TaskCell>{task.deadline}</TaskCell>
                      <TaskCell>
                        {task.collaborators && task.collaborators.length > 0 
                          ? task.collaborators.join(', ') 
                          : task.assignedOfficer}
                      </TaskCell>
                      <TaskCell onClick={(e) => e.stopPropagation()}>
                        <ActionButton 
                          variant="edit" 
                          onClick={(e) => { 
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          <Edit2 size={16} />
                          Edit
                        </ActionButton>
                        <ActionButton 
                          variant="delete" 
                          onClick={(e) => { 
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </ActionButton>
                      </TaskCell>
                    </TaskRow>
                  ))}
                </tbody>
              </TaskTable>
            ) : (
              <NoTasksMessage>
                <div>Hooray! No pending task.</div>
                <img 
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTFiNzVicXh1dHp2aWd3YnE4amZjcnIzdWl2NnBmY3h4engyOTN6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufnwz3wDUli7GU0/giphy.webp" 
                  alt="No tasks" 
                />
              </NoTasksMessage>
            )}
          </TaskTableWrapper>
        </TasksContainer>
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboard;