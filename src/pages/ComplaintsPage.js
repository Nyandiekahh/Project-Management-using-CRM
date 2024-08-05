// src/components/ComplaintForm.js
import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout';

const FormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Notification = styled.div`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ComplaintForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [urgency, setUrgency] = useState('');
  const [document, setDocument] = useState(null);
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('department', department);
    formData.append('urgency', urgency);
    if (document) {
      formData.append('document', document);
    }

    try {
      await fetch('http://localhost:5000/complaints', {
        method: 'POST',
        body: formData,
      });

      // Display success message
      setNotification('Complaint submitted successfully');

      // Clear form fields
      setTitle('');
      setDescription('');
      setCategory('');
      setDepartment('');
      setUrgency('');
      setDocument(null);

      // Hide notification after 3 seconds
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <DashboardLayout isOpen={true} toggleSidebar={() => {}}>
      <FormContainer>
        <h2>Submit a Complaint</h2>
        {notification && (
          <Notification>
            {notification}
          </Notification>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Salary and Remuneration">Salary and Remuneration</option>
            <option value="Promotion and Career Progression">Promotion and Career Progression</option>
            <option value="Work Environment">Work Environment</option>
            <option value="Performance Management">Performance Management</option>
            <option value="Organizational Support">Organizational Support</option>
            <option value="Employee Morale and Engagement">Employee Morale and Engagement</option>
            <option value="Discrimination and Harassment">Discrimination and Harassment</option>
            <option value="Communication and Transparency">Communication and Transparency</option>
          </Select>
          <Input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <Select value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
            <option value="">Select Urgency Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          <Input
            type="file"
            onChange={(e) => setDocument(e.target.files[0])}
          />
          <Button type="submit">Submit</Button>
        </form>
      </FormContainer>
    </DashboardLayout>
  );
};

export default ComplaintForm;
