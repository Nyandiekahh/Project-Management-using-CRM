import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../context/AuthProvider';

const TaskDetailsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TaskDetailsTitle = styled.h1`
  margin-bottom: 20px;
  font-size: 28px;
  color: #343a40;
`;

const TaskDetail = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  color: #495057;
`;

const DocumentContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  overflow: hidden;
  background-color: #ffffff;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;
  margin-right: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 20px;
`;

const ProgressBar = styled.input`
  width: 100%;
  margin-top: 10px;
`;

const ProgressLabel = styled.label`
  font-size: 16px;
  color: #495057;
`;

const Message = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

const ProgressPercentage = styled.div`
  font-size: 16px;
  color: #495057;
  margin-top: 10px;
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
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const saveInterval = useRef(null);

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
        setEditorContent(data.content || ''); // Load saved content
        setProgress(data.progress || 0); // Load saved progress
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching task:', error);
        setError(error);
        setLoading(false);
      });

    // Cleanup interval on component unmount
    return () => {
      clearInterval(saveInterval.current);
    };
  }, [taskId]);

  const handleEditorButtonClick = (isContinue = false) => {
    setShowEditor(true);
    if (isContinue) {
      setEditorContent(task.content || ''); // Load saved content if continuing
    }
    // Start auto-saving every second
    saveInterval.current = setInterval(() => {
      handleSave();
    }, 1000);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSave = () => {
    fetch(`http://localhost:5000/tasks/${task.id}/save-content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: editorContent })
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTask(updatedTask);
      })
      .catch(error => console.error('Error saving content:', error));
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    fetch(`http://localhost:5000/tasks/${task.id}/save-progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ progress: newProgress })
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTask(updatedTask);
      })
      .catch(error => console.error('Error saving progress:', error));
  };

  const formatUsername = (username) => {
    return username
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([0-9])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const isUserAssigned = (assignedOfficer) => {
    const assignedOfficers = assignedOfficer.split(', ');
    return assignedOfficers.includes(formatUsername(user.username));
  };

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
        <ProgressContainer>
          <ProgressLabel>
            <strong>Progress:</strong>
            {isUserAssigned(task.assignedOfficer) ? (
              <>
                <Message>It is good to update your progress bar regularly.</Message>
                <ProgressBar
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                />
                <ProgressPercentage>{progress}%</ProgressPercentage>
              </>
            ) : (
              <>
                <ProgressBar
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  readOnly
                />
                <ProgressPercentage>{progress}%</ProgressPercentage>
              </>
            )}
          </ProgressLabel>
        </ProgressContainer>
        {isUserAssigned(task.assignedOfficer) && (
          <>
            {!showEditor && (
              <>
                <Button onClick={() => handleEditorButtonClick(false)}>Start task here</Button>
                {task.content && <Button onClick={() => handleEditorButtonClick(true)}>Continue from where you left</Button>}
              </>
            )}
            {showEditor && (
              <>
                <Editor
                  apiKey="lz7c3bkxd3jk907smlhgwf1s70yqdbckdjdjdehbg48h5x8y"  // Replace with your TinyMCE API key if needed
                  value={editorContent}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help',
                    setup: (editor) => {
                      editor.on('init', () => {
                        if (!task.content) {
                          editor.setContent('<p style="color: #888;">Start typing here...</p>');
                        }
                      });
                      editor.on('focus', () => {
                        const content = editor.getContent({ format: 'text' });
                        if (content === 'Start typing here...') {
                          editor.setContent('');
                        }
                      });
                      editor.on('blur', () => {
                        const content = editor.getContent({ format: 'text' });
                        if (content === '') {
                          editor.setContent('<p style="color: #888;">Start typing here...</p>');
                        }
                      });
                    }
                  }}
                />
              </>
            )}
          </>
        )}
      </TaskDetailsContainer>
    </DashboardLayout>
  );
};

export default TaskDetails;
