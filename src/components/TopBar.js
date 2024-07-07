import React, { useState } from 'react';
import styled from 'styled-components';

const TopBarContainer = styled.div`
  height: 60px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 250px;
  right: 0;

  @media (max-width: 768px) {
    left: 0;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  margin-right: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 20px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TopBar = ({ user, onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <TopBarContainer>
      <MenuButton onClick={onMenuClick}>&#9776;</MenuButton>
      <UserMenu>
        <UserName onClick={toggleDropdown}>Hi, {user}</UserName>
        {dropdownOpen && (
          <DropdownMenu>
            <DropdownItem onClick={toggleDropdown}>Profile</DropdownItem>
            <DropdownItem onClick={toggleDropdown}>Logout</DropdownItem>
          </DropdownMenu>
        )}
      </UserMenu>
    </TopBarContainer>
  );
};

export default TopBar;
