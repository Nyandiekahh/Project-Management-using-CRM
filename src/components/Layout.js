import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => (props.isSidebarOpen ? '250px' : '60px')}; /* Adjust margin when sidebar is open/closed */
  margin-top: 60px; /* Offset for the top bar */
  transition: margin-left 0.3s;
  padding: 20px;
  background-color: #f8f9fa;
`;

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div style={{ flex: 1 }}>
        <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} user="Admin" />
        <MainContent isSidebarOpen={isSidebarOpen}>
          {children}
        </MainContent>
      </div>
    </LayoutContainer>
  );
};

export default Layout;
