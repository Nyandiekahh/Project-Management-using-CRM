import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Content = styled.div`
  margin-left: 250px;
  margin-top: 60px;
  padding: 20px;
  background-color: #f1f1f1;
  height: calc(100vh - 60px);

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const WelcomeMessage = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CurrentTasks = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskList = styled.div`
  margin-top: 20px;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TaskTableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TaskRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TaskCell = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const StatusCell = styled(TaskCell)`
  background-color: ${(props) => {
    switch (props.status) {
      case 'Not Done':
        return '#e74c3c'; // Red for Not Done
      case 'Pending':
        return '#f39c12'; // Orange for Pending
      case 'Completed':
        return '#2ecc71'; // Green for Completed
      default:
        return 'transparent';
    }
  }};
  color: white;
`;

const NoTasksMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;

  img {
    margin-top: 10px;
    max-width: 150px;
  }
`;

const AdminDashboard = () => {
  // Mock data for tasks. Replace this with your actual task fetching logic.
  const tasks = [
    { id: 1, name: 'Circular on Priority Allowances for Other Public Officers', status: 'Pending' },
    { id: 2, name: 'REVIEW OF RATES AND CLUSTER CLASSIFICATION FOR PURPOSES OF PAYMENT OF DAILY SUBSISTENCE ALLOWANCE (DSA) – LOCAL TRAVEL', status: 'Completed' },
    { id: 3, name: 'Salary survey for 2021-2025', status: 'Not Done' },
  ];

  return (
    <div>
      <Sidebar />
      <TopBar user="Admin" />
      <Content>
        <WelcomeMessage>
          Welcome back, Admin
          <p>We're delighted to have you. Need help on system walk through? Navigate to virtual assistant on the side menu.</p>
        </WelcomeMessage>
        <CurrentTasks>
          <h2>Current Assigned Tasks</h2>
          <TaskList>
            {tasks.length > 0 ? (
              <TaskTable>
                <thead>
                  <tr>
                    <TaskTableHeader>TASK ID</TaskTableHeader>
                    <TaskTableHeader>TASK NAME</TaskTableHeader>
                    <TaskTableHeader>TASK STATUS</TaskTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <TaskRow key={task.id}>
                      <TaskCell>{task.id}</TaskCell>
                      <TaskCell>{task.name}</TaskCell>
                      <StatusCell status={task.status}>{task.status}</StatusCell>
                    </TaskRow>
                  ))}
                </tbody>
              </TaskTable>
            ) : (
              <NoTasksMessage>
                Hooray! No pending task.
                <img src="/path-to-your-image.png" alt="No tasks" />
              </NoTasksMessage>
            )}
          </TaskList>
        </CurrentTasks>
      </Content>
    </div>
  );
};

export default AdminDashboard;
