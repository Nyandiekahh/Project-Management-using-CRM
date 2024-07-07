import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    transform: translateX(${props => (props.isOpen ? '0' : '-100%')});
  }
`;

const SidebarHeader = styled.div`
  padding: 15px;
  font-size: 1.2em;
  background-color: #1a252f;
`;

const SidebarLink = styled(Link)`
  text-decoration: none;
  color: white;
  display: block;
  padding: 10px 20px;
`;

const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #34495e;
  border: none;
  color: white;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const DropdownContent = styled.div`
  display: ${props => (props.open ? 'block' : 'none')};
  padding-left: 20px;
`;

const Sidebar = ({ isOpen }) => {
  const [openTasks, setOpenTasks] = useState(false);

  const handleClick = () => {
    setOpenTasks(!openTasks);
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>Admin Dashboard</SidebarHeader>
      <nav>
        <div>
          <DropdownButton onClick={handleClick}>
            <span>Tasks</span>
            <span>{openTasks ? '-' : '+'}</span>
          </DropdownButton>
          <DropdownContent open={openTasks}>
            <SidebarLink to="/pending-tasks">Pending Tasks</SidebarLink>
            <SidebarLink to="/assigned-tasks">Assigned Tasks</SidebarLink>
            <SidebarLink to="/urgent-tasks">Urgent Tasks</SidebarLink>
          </DropdownContent>
        </div>
        <SidebarLink to="/create-task">Create Task</SidebarLink>
        <SidebarLink to="/assign-task">Assign Task</SidebarLink>
        <SidebarLink to="/faqs">FAQs</SidebarLink>
        <SidebarLink to="/complaints">Complaints</SidebarLink>
      </nav>
    </SidebarContainer>
  );
};

export default Sidebar;
