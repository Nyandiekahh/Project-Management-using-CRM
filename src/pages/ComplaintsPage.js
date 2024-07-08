import React, { useState } from 'react';
import styled from 'styled-components';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintList from '../components/ComplaintList';
import ComplaintDetails from '../components/ComplaintDetails';

const PageContainer = styled.div`
  background-color: #e9ecef;
  padding: 20px;
  min-height: 100vh;
`;

const NoComplaintsMessage = styled.div`
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  color: #333;
`;

const Section = styled.div`
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
`;

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [comments, setComments] = useState({});
  const [showForm, setShowForm] = useState(false);

  const handleComplaintSubmit = (complaint) => {
    setComplaints([...complaints, { ...complaint, id: complaints.length + 1, status: 'open' }]);
    setShowForm(false);
  };

  const handleComplaintClick = (id) => {
    const complaint = complaints.find((comp) => comp.id === id);
    setSelectedComplaint(complaint);
  };

  const handleAddComment = (id, comment) => {
    setComments({
      ...comments,
      [id]: [...(comments[id] || []), comment],
    });
  };

  const handleFilterChange = (filters) => {
    // Handle filtering logic here
  };

  return (
    <PageContainer>
      {!showForm && (
        <Section>
          <Button onClick={() => setShowForm(true)}>Create and Submit a Complaint</Button>
        </Section>
      )}
      {showForm && (
        <Section>
          <ComplaintForm onSubmit={handleComplaintSubmit} />
        </Section>
      )}
      <Section>
        {complaints.length === 0 ? (
          <NoComplaintsMessage>
            There are no complaints to show. All clear!
          </NoComplaintsMessage>
        ) : (
          <ComplaintList
            complaints={complaints}
            onComplaintClick={handleComplaintClick}
            onFilterChange={handleFilterChange}
          />
        )}
      </Section>
      {selectedComplaint && (
        <Section>
          <ComplaintDetails
            complaint={selectedComplaint}
            comments={comments[selectedComplaint.id] || []}
            onAddComment={handleAddComment}
          />
        </Section>
      )}
    </PageContainer>
  );
};

export default ComplaintsPage;
