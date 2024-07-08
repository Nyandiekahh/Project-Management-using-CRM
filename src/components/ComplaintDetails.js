import React, { useState } from 'react';
import styled from 'styled-components';

const ComplaintDetailsContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Detail = styled.p`
  margin-bottom: 10px;
`;

const CommentsSection = styled.div`
  margin-top: 20px;
`;

const Comment = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
`;

const AddCommentForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 10px;
`;

const Button = styled.button`
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

const ComplaintDetails = ({ complaint, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();
    onAddComment(complaint.id, newComment);
    setNewComment('');
  };

  return (
    <ComplaintDetailsContainer>
      <Title>{complaint.title}</Title>
      <Detail><strong>Description:</strong> {complaint.description}</Detail>
      <Detail><strong>Category:</strong> {complaint.category}</Detail>
      <Detail><strong>Priority:</strong> {complaint.priority}</Detail>
      <Detail><strong>Status:</strong> {complaint.status}</Detail>
      <Detail><strong>Date Submitted:</strong> {complaint.date}</Detail>
      {complaint.attachment && <Detail><strong>Attachment:</strong> {complaint.attachment.name}</Detail>}
      <CommentsSection>
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <Comment key={index}>
            {comment}
          </Comment>
        ))}
        <AddCommentForm onSubmit={handleAddComment}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <Button type="submit">Add Comment</Button>
        </AddCommentForm>
      </CommentsSection>
    </ComplaintDetailsContainer>
  );
};

export default ComplaintDetails;
