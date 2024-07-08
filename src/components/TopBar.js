import React from 'react';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';

const TopBarContainer = styled.div`
  width: calc(100% - ${props => (props.isSidebarOpen ? '250px' : '60px')});
  height: 60px;
  background-color: #34495e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: ${props => (props.isSidebarOpen ? '250px' : '60px')};
  transition: left 0.3s, width 0.3s;
  z-index: 1000;

  @media (max-width: 768px) {
    left: 0;
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: white;
  margin-right: 20px;
`;

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover .dropdown-content {
    display: block;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  right: 0;
  background-color: white;
  color: black;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

  a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  a:hover {
    background-color: #f1f1f1;
  }
`;

const TopBar = ({ user, toggleSidebar, isSidebarOpen }) => {
  return (
    <TopBarContainer isSidebarOpen={isSidebarOpen}>
      <ToggleButton onClick={toggleSidebar}>
        <FaBars />
      </ToggleButton>
      <div>Dashboard</div>
      <UserDropdown>
        <div>Hi, {user}</div>
        <DropdownContent className="dropdown-content">
          <a href="/profile">Profile</a>
          <a href="/logout">Logout</a>
        </DropdownContent>
      </UserDropdown>
    </TopBarContainer>
  );
};

export default TopBar;
