import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout';
import { Editor } from '@tinymce/tinymce-react';
import { useAuth } from '../context/AuthProvider';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Save, 
  FileText, 
  Upload, 
  Play,
  Pause,
  RotateCw,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const TaskHeader = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const TaskTitle = styled.h1`
  font-size: 32px;
  color: #1a202c;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  background: ${props => {
    switch (props.status?.toLowerCase()) {
      case 'completed': return '#C6F6D5';
      case 'in progress': return '#BEE3F8';
      case 'pending': return '#FEEBC8';
      default: return '#E2E8F0';
    }
  }};
  color: ${props => {
    switch (props.status?.toLowerCase()) {
      case 'completed': return '#2F855A';
      case 'in progress': return '#2B6CB0';
      case 'pending': return '#C05621';
      default: return '#4A5568';
    }
  }};
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const TaskInfoCard = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  h3 {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 16px;
    color: #1e293b;
    margin: 0;
    font-weight: 500;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const WorkArea = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
    color: #1a202c;
    font-size: 24px;
    margin-bottom: 16px;
  }

  p {
    color: #4a5568;
    line-height: 1.6;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ProgressCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
    color: #1a202c;
    font-size: 18px;
    margin-bottom: 16px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  margin: 16px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary && `
    background: #3b82f6;
    color: white;
    border: none;
    &:hover {
      background: #2563eb;
    }
  `}
  
  ${props => props.success && `
    background: #10b981;
    color: white;
    border: none;
    &:hover {
      background: #059669;
    }
  `}

  ${props => props.danger && `
    background: #ef4444;
    color: white;
    border: none;
    &:hover {
      background: #dc2626;
    }
  `}

  ${props => props.outline && `
    background: transparent;
    border: 2px solid #e2e8f0;
    color: #64748b;
    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #64748b;
  margin: 16px 0;
`;

const PopupModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DocumentViewer = styled.div`
  margin-top: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;

  iframe, img {
    width: 100%;
    height: 400px;
    border: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #3b82f6;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [progress, setProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);
  const saveInterval = useRef(null);

  useEffect(() => {
    console.log('Fetching task with ID:', taskId);
    fetch(`http://localhost:5000/tasks/${taskId}`)
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched task data:', data);
        setTask(data);
        setEditorContent(data.content || '');
        setProgress(data.progress || 0);
        setTimeSpent(data.timeSpent || 0);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching task:', error);
        setError(error.message);
        setLoading(false);
      });

    return () => {
      clearInterval(timerRef.current);
      clearInterval(saveInterval.current);
    };
  }, [taskId]);

  const formatUsername = (username) => {
    if (!username) return '';
    return username
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([0-9])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const isUserAssigned = (assignedOfficer) => {
    if (!assignedOfficer || !user?.username) return false;
    const assignedOfficers = assignedOfficer.split(', ');
    return assignedOfficers.includes(formatUsername(user.username));
  };

  const startWorking = () => {
    setIsWorking(true);
    setShowEditor(true);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    // Start auto-saving
    saveInterval.current = setInterval(() => {
      handleSave();
    }, 30000); // Auto-save every 30 seconds
  };

  const pauseWork = () => {
    setIsWorking(false);
    clearInterval(timerRef.current);
    clearInterval(saveInterval.current);
    handleSave(); // Save when pausing
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}/save`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editorContent,
          timeSpent,
          progress
        })
      });

      if (!response.ok) throw new Error('Failed to save progress');

      const updatedTask = await response.json();
      setTask(updatedTask);
    } catch (err) {
      console.error('Error saving progress:', err);
      // Optionally show a save error notification
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}/submit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editorContent,
          timeSpent,
          progress: 100
        })
      });

      if (!response.ok) throw new Error('Failed to submit task');

      const updatedTask = await response.json();
      setTask(updatedTask);
      setProgress(100);
      setShowSubmitModal(false);
      setShowEditor(false);
      pauseWork();
    } catch (err) {
      console.error('Error submitting task:', err);
      setError('Failed to submit task. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner>Loading task details...</LoadingSpinner>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage>
          <AlertCircle size={20} />
          {error}
        </ErrorMessage>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <TaskHeader>
          <HeaderTop>
            <TaskTitle>{task?.name}</TaskTitle>
            <StatusBadge status={task?.status}>{task?.status}</StatusBadge>
          </HeaderTop>
          
          <TaskGrid>
            <TaskInfoCard>
              <h3>Deadline</h3>
              <p>{new Date(task?.deadline).toLocaleDateString()}</p>
            </TaskInfoCard>
            <TaskInfoCard>
              <h3>Assigned To</h3>
              <p>{task?.assignedOfficer}</p>
            </TaskInfoCard>
            <TaskInfoCard>
              <h3>Time Spent</h3>
              <p>{formatTime(timeSpent)}</p>
            </TaskInfoCard>
            <TaskInfoCard>
              <h3>Progress</h3>
              <p>{progress}%</p>
            </TaskInfoCard>
          </TaskGrid>
        </TaskHeader>

        <MainContent>
          <WorkArea>
            <h2>Task Description</h2>
            <p>{task?.description}</p>

            {!showEditor && isUserAssigned(task?.assignedOfficer) && task?.status !== 'Completed' && (
              <ButtonGroup>
                <Button primary onClick={startWorking}>
                  <Play size={18} />
                  Start Working
                </Button>
              </ButtonGroup>
            )}

            {showEditor && (
              <>
                <ButtonGroup>
                  {isWorking ? (
                    <Button outline onClick={pauseWork}>
                      <Pause size={18} />
                      Pause
                      </Button>
                  ) : (
                    <Button primary onClick={startWorking}>
                      <Play size={18} />
                      Resume
                    </Button>
                  )}
                  <Button success onClick={() => setShowSubmitModal(true)}>
                    <Check size={18} />
                    Submit Work
                  </Button>
                  <Button outline onClick={handleSave}>
                    <Save size={18} />
                    Save Progress
                  </Button>
                </ButtonGroup>

                <Timer>
                  <Clock size={18} />
                  {formatTime(timeSpent)}
                </Timer>

                <Editor
                  apiKey="your-api-key-here"
                  value={editorContent}
                  onEditorChange={setEditorContent}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: `
                      undo redo | formatselect | bold italic backcolor | 
                      alignleft aligncenter alignright alignjustify | 
                      bullist numlist outdent indent | removeformat | help
                    `,
                    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
                  }}
                />
              </>
            )}
          </WorkArea>

          <Sidebar>
            <ProgressCard>
              <h3>Progress Tracker</h3>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              {isUserAssigned(task?.assignedOfficer) && task?.status !== 'Completed' && (
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  style={{ width: '100%', marginTop: '12px' }}
                />
              )}
              <p style={{ marginTop: '12px', color: '#4a5568' }}>{progress}% Complete</p>
            </ProgressCard>

            {task?.documentUrl && (
              <ProgressCard>
                <h3>Attached Documents</h3>
                <DocumentViewer>
                  {task.documentUrl.endsWith('.pdf') ? (
                    <iframe 
                      src={task.documentUrl} 
                      title="Task Document" 
                      width="100%" 
                      height="400px"
                    />
                  ) : (
                    <img 
                      src={task.documentUrl} 
                      alt="Task Document" 
                      style={{ objectFit: 'contain' }} 
                    />
                  )}
                </DocumentViewer>
              </ProgressCard>
            )}

            {task?.completionDocumentUrl && (
              <ProgressCard>
                <h3>Completion Documents</h3>
                <DocumentViewer>
                  {task.completionDocumentUrl.endsWith('.pdf') ? (
                    <iframe 
                      src={task.completionDocumentUrl} 
                      title="Completion Document" 
                      width="100%" 
                      height="400px"
                    />
                  ) : (
                    <img 
                      src={task.completionDocumentUrl} 
                      alt="Completion Document" 
                      style={{ objectFit: 'contain' }} 
                    />
                  )}
                </DocumentViewer>
              </ProgressCard>
            )}
          </Sidebar>
        </MainContent>

        {showSubmitModal && (
          <>
            <Overlay onClick={() => setShowSubmitModal(false)} />
            <PopupModal>
              <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Submit Task</h2>
              <p style={{ marginBottom: '24px', color: '#4a5568' }}>
                Are you sure you want to submit your work? This will mark the task as completed.
              </p>
              <ButtonGroup>
                <Button danger onClick={() => setShowSubmitModal(false)}>
                  <X size={18} />
                  Cancel
                </Button>
                <Button success onClick={handleSubmit}>
                  <Check size={18} />
                  Confirm Submission
                </Button>
              </ButtonGroup>
            </PopupModal>
          </>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}

export default TaskDetails;