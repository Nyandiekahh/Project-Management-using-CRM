import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTachometerAlt, FaTasks, FaQuestionCircle, FaFileAlt, FaClipboardList, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider';

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
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #34495e;
  }
`;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Function to determine dashboard route based on user role
  const getDashboardRoute = () => {
    switch(user?.role) {
      case 'deputyDirector':
        return '/admin-dashboard';
      case 'principalOfficer':
        return '/principal-officer-dashboard';
      case 'seniorOfficer':
        return '/senior-officer-dashboard';
      case 'officer':
        return '/officer-dashboard';
      default:
        return '/login';
    }
  };

  const handleLogout = () => {
    logout();
  };

  const dashboardRoute = getDashboardRoute();

  // Early return if no user
  if (!user) {
    navigate('/login');
    return null;
  }

  // Console log for debugging
  console.log('Current user:', user);
  console.log('Dashboard route:', dashboardRoute);

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader onClick={toggleSidebar}>
        <SidebarIcon>
          <FaBars />
        </SidebarIcon>
        <SidebarText isOpen={isOpen}>
          {user.role === 'deputyDirector' ? 'Admin Dashboard' : 'User Dashboard'}
        </SidebarText>
      </SidebarHeader>
      <nav>
        <SidebarLink to={dashboardRoute}>
          <SidebarIcon><FaTachometerAlt /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Dashboard</SidebarText>
        </SidebarLink>
        
        <SidebarLink to="/my-tasks">
          <SidebarIcon><FaTasks /></SidebarIcon>
          <SidebarText isOpen={isOpen}>My Tasks</SidebarText>
        </SidebarLink>

        {/* Show User Management only for deputyDirector */}
        {user.role === 'deputyDirector' && (
          <SidebarLink to="/user-management">
            <SidebarIcon><FaQuestionCircle /></SidebarIcon>
            <SidebarText isOpen={isOpen}>User Management</SidebarText>
          </SidebarLink>
        )}

        <SidebarLink to="/complaints">
          <SidebarIcon><FaClipboardList /></SidebarIcon>
          <SidebarText isOpen={isOpen}>Complaints</SidebarText>
        </SidebarLink>

        {/* Show Reports for all roles */}
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