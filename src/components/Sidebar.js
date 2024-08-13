import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaTasks, FaQuestionCircle, FaFileAlt, FaClipboardList, FaBars, FaSignOutAlt } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: ${props => (props.isOpen ? '250px' : '60px')};
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
`;

const SidebarHeader = styled.div`
  padding: 15px;
  font-size: 1.2em;
  background-color: #1a252f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const SidebarLink = styled(Link)`
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  &:hover {
    background-color: #34495e;
  }
`;

const SidebarIcon = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
`;

const SidebarText = styled.span`
  display: ${props => (props.isOpen ? 'inline' : 'none')};
  margin-left: 10px;
  transition: display 0.3s;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: #34495e;
  }
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data (e.g., from localStorage or sessionStorage)
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to login page
    navigate('/');
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader onClick={toggleSidebar}>
        <SidebarIcon>
          <FaBars />
        </SidebarIcon>
        <SidebarText isOpen={isOpen}>Admin Dashboard</SidebarText>
      </SidebarHeader>
      <nav>
        <SidebarLink to="/admin-dashboard">
          <SidebarIcon><FaTachometerAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Dashboard</SidebarText>
        </SidebarLink>
        <SidebarLink to="/my-tasks">
          <SidebarIcon><FaTasks /></SidebarIcon>
          <SidebarText isOpen={isOpen}>My Tasks</SidebarText>
        </SidebarLink>
        {/* <SidebarLink to="/user-management">
          <SidebarIcon><FaUser /></SidebarIcon>
          <SidebarText isOpen={isOpen}>User Management</SidebarText>
        </SidebarLink> */}
        {/* <SidebarLink to="/faqs">
          <SidebarIcon><FaQuestionCircle /></SidebarIcon>
          <SidebarText isOpen={isOpen}>FAQs</SidebarText>
        </SidebarLink> */}
        <SidebarLink to="/complaints">
          <SidebarIcon><FaClipboardList /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Complaints</SidebarText>
        </SidebarLink>
        <SidebarLink to="/reports">
          <SidebarIcon><FaFileAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Reports</SidebarText>
        </SidebarLink>
        <LogoutButton onClick={handleLogout}>
          <SidebarIcon><FaSignOutAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Logout</SidebarText>
        </LogoutButton>
      </nav>
    </SidebarContainer>
  );
};

export default Sidebar;
