import React, { useState } from 'react';
import styled from 'styled-components';
import DashboardLayout from '../components/DashboardLayout';

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

const ComplaintForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [file, setFile] = useState(null);

  return (
    <DashboardLayout> {/* Wrap with DashboardLayout */}
      <ComplaintFormContainer>
        <h2>Submit a Complaint</h2>
        <form
          target="_blank"
          action="https://formsubmit.co/einsteinmokua100@gmail.com"
          method="POST"
        >
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Subject</Label>
            <Input
              type="text"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Description</Label>
            <Textarea
              name="message"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Category</Label>
            <Select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="Feedback">Feedback</option>
              <option value="Support">Support</option>
              <option value="Inquiry">Inquiry</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Urgency</Label>
            <Select
              name="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
            >
              <option value="" disabled>Select Urgency Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Attachment (Optional)</Label>
            <Input
              type="file"
              name="attachment"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </FormGroup>
          <Button type="submit">Submit</Button>
        </form>
      </ComplaintFormContainer>
    </DashboardLayout>
  );
};

export default ComplaintForm;
