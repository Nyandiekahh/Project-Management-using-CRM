import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Clock from '../components/Clock';
import { 
  ClipboardList, 
  Clock as ClockIcon, 
  AlertTriangle,
  Search,
  Download,
  Filter,
  ChevronDown,
  CheckCircle,
  Bell,
  Calendar
} from 'lucide-react';

// Styled Components
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

const TopSection = styled.div`
  margin-bottom: 30px;
`;

const WelcomeMessage = styled.div`
  font-size: 32px;
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 10px;

  p {
    font-size: 16px;
    color: #64748b;
    margin-top: 8px;
    font-weight: normal;
    line-height: 1.5;
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
  max-width: 500px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.variant === 'secondary' ? '#64748b' : 'white'};
  background-color: ${props => props.variant === 'secondary' ? 'white' : '#3b82f6'};
  border: ${props => props.variant === 'secondary' ? '1px solid #e2e8f0' : 'none'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#f8fafc' : '#2563eb'};
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin: 30px 0;

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
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: ${props => props.bg || '#e2e8f0'};
  color: ${props => props.color || '#64748b'};
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0;
`;

const StatChange = styled.div`
  font-size: 14px;
  color: ${props => props.increase ? '#10b981' : '#64748b'};
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: ${props => props.increase ? '"↑"' : '""'};
  }
`;

const TasksContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TasksHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskTableWrapper = styled.div`
  overflow-x: auto;
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

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

const TaskRow = styled.tr`
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const TaskCell = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  vertical-align: middle;

  &:first-child {
    padding-left: 24px;
  }

  &:last-child {
    padding-right: 24px;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
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

const NoTasksMessage = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: #64748b;

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1e293b;
  }

  p {
    font-size: 16px;
    margin-bottom: 24px;
  }

  img {
    margin-top: 24px;
    width: 100%;
    max-width: 300px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #3b82f6;
`;

const SeniorOfficerDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const filtered = tasks.filter(task => 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [searchTerm, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    const pending = tasks.filter(task => task.status === 'Pending').length;
    
    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total ? ((completed / total) * 100).toFixed(1) : 0
    };
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
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
        <TopSection>
          <Clock />
          
          <WelcomeMessage>
            Welcome back, {user ? formatUsername(user.username) : 'Senior Officer'}
            <p>View and track your assigned tasks and their progress</p>
          </WelcomeMessage>

          <SearchSection>
            <SearchBar>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search tasks by name or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBar>
            <ButtonGroup>
              <Button variant="secondary">
                <Filter size={20} />
                Filter
                <ChevronDown size={16} />
              </Button>
              <Button variant="secondary">
                <Download size={20} />
                Export
              </Button>
            </ButtonGroup>
          </SearchSection>
        </TopSection>

        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatTitle>My Tasks</StatTitle>
              <StatIcon bg="#dbeafe" color="#3b82f6">
                <ClipboardList size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.total}</StatValue>
            <StatChange>Total assigned</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Completed</StatTitle>
              <StatIcon bg="#dcfce7" color="#10b981">
                <CheckCircle size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.completed}</StatValue>
            <StatChange increase>{stats.completionRate}% complete</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>In Progress</StatTitle>
              <StatIcon bg="#fef3c7" color="#f59e0b">
                <ClockIcon size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.inProgress}</StatValue>
            <StatChange>Active tasks</StatChange>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatTitle>Upcoming</StatTitle>
              <StatIcon bg="#fee2e2" color="#ef4444">
                <Calendar size={24} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stats.pending}</StatValue>
            <StatChange>Not started</StatChange>
          </StatCard>
        </StatsGrid>

        <TasksContainer>
          <TasksHeader>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>
              My Assigned Tasks
            </h2>
            <Bell size={24} color="#64748b" style={{ cursor: 'pointer' }} />
          </TasksHeader>

          <TaskTableWrapper>
            {isLoading ? (
              <LoadingSpinner>Loading tasks...</LoadingSpinner>
            ) : filteredTasks.length > 0 ? (
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
                  {filteredTasks.map((task, index) => (
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
                      <TaskCell>
                        {/* Placeholder for future actions if needed */}
                      </TaskCell>
                    </TaskRow>
                  ))}
                </tbody>
              </TaskTable>
            ) : (
              <NoTasksMessage>
                <h3>No Tasks Found</h3>
                <p>There are no tasks matching your search criteria.</p>
                {!searchTerm && (
                  <img 
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTFiNzVicXh1dHp2aWd3YnE4amZjcnIzdWl2NnBmY3h4engyOTN6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufnwz3wDUli7GU0/giphy.webp" 
                    alt="No tasks" 
                  />
                )}
              </NoTasksMessage>
            )}
          </TaskTableWrapper>
        </TasksContainer>
      </Content>
    </DashboardContainer>
  );
};

export default SeniorOfficerDashboard;