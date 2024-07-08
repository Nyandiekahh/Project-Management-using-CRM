import React, { useState } from 'react';
import styled from 'styled-components';

const ComplaintFormContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
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

const ComplaintForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const complaint = {
      title,
      description,
      category,
      priority,
      date: new Date().toISOString().split('T')[0],
      attachment,
    };
    onSubmit(complaint);
  };

  return (
    <ComplaintFormContainer>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Category</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="technical">Technical</option>
            <option value="customer_service">Customer Service</option>
            <option value="billing">Billing</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Priority</Label>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Attachment (Optional)</Label>
          <Input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
          />
        </FormGroup>
        <Button type="submit">Submit Complaint</Button>
      </form>
    </ComplaintFormContainer>
  );
};

export default ComplaintForm;
