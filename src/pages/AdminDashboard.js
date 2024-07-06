import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Content = styled.div`
  margin-left: 250px;
  margin-top: 60px;
  padding: 20px;
  background-color: #f1f1f1;
  height: calc(100vh - 60px);
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
`;

const TaskRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TaskCell = styled.td`
  padding: 8px;
  text-align: left;
`;

const NoTasksMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
`;

const AdminDashboard = () => {
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
            {/* Replace the condition below with your actual task fetching logic */}
            {false ? (
              <TaskTable>
                <thead>
                  <TaskRow>
                    <th>TASK ID</th>
                    <th>TASK NAME</th>
                    <th>TASK STATUS</th>
                  </TaskRow>
                </thead>
                <tbody>
                  {/* Replace the tasks below with your actual tasks */}
                  <TaskRow>
                    <TaskCell>1</TaskCell>
                    <TaskCell>Task 1</TaskCell>
                    <TaskCell>Pending</TaskCell>
                  </TaskRow>
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
