import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout';

const TaskDetailsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskDetailsTitle = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
`;

const TaskDetail = styled.div`
  margin-bottom: 10px;
`;

const DocumentContainer = styled.div`
  margin-top: 20px;
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/tasks/${taskId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setTask(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching task:', error);
        setError(error);
        setLoading(false);
      });
  }, [taskId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!task) {
    return <div>No task found</div>;
  }

  return (
    <DashboardLayout>
      <TaskDetailsContainer>
        <TaskDetailsTitle>Task Details</TaskDetailsTitle>
        <TaskDetail><strong>ID:</strong> {task.id}</TaskDetail>
        <TaskDetail><strong>Name:</strong> {task.name}</TaskDetail>
        <TaskDetail><strong>Status:</strong> {task.status}</TaskDetail>
        <TaskDetail><strong>Deadline:</strong> {task.deadline}</TaskDetail>
        <TaskDetail><strong>Assigned To:</strong> {task.assignedOfficer}</TaskDetail>
        <TaskDetail><strong>Description:</strong> {task.description}</TaskDetail>
        <TaskDetail><strong>Assigned At:</strong> {formatDate(task.assignedAt)}</TaskDetail>
        <TaskDetail>
          <strong>Document:</strong> {task.documentUrl ? (
            <DocumentContainer>
              {task.documentUrl.endsWith('.pdf') ? (
                <iframe src={task.documentUrl} width="100%" height="500px" title="Document Viewer"></iframe>
              ) : (
                <img src={task.documentUrl} alt="Task Document" style={{ maxWidth: '100%', height: 'auto' }} />
              )}
            </DocumentContainer>
          ) : 'No document uploaded'}
        </TaskDetail>
        <TaskDetail>
          <strong>Completion Document:</strong> {task.completionDocumentUrl ? (
            <DocumentContainer>
              {task.completionDocumentUrl.endsWith('.pdf') ? (
                <iframe src={task.completionDocumentUrl} width="100%" height="500px" title="Completion Document Viewer"></iframe>
              ) : (
                <img src={task.completionDocumentUrl} alt="Completion Document" style={{ maxWidth: '100%', height: 'auto' }} />
              )}
            </DocumentContainer>
          ) : 'No completion document uploaded'}
        </TaskDetail>
      </TaskDetailsContainer>
    </DashboardLayout>
  );
};

export default TaskDetails;
