import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, Bell, Search, User, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Clock from './Clock';

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MobileOverlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  margin-left: ${props => props.isSidebarOpen ? '240px' : '0'};
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 30;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.375rem;
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: #f1f5f9;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;

  @media (max-width: 640px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  width: 1.25rem;
  height: 1.25rem;
`;

const NotificationButton = styled.button`
  position: relative;
  padding: 0.5rem;
  border-radius: 0.375rem;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #ef4444;
  border-radius: 9999px;
  border: 2px solid white;
`;

const UserProfile = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.375rem;

  &:hover {
    background-color: #f1f5f9;
  }

  @media (max-width: 640px) {
    .user-name {
      display: none;
    }
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageContent = styled.main`
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Implement search functionality
  };

  return (
    <DashboardContainer>
      <MobileOverlay isOpen={isSidebarOpen} onClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <MainContent isSidebarOpen={isSidebarOpen}>
        <Header>
          <HeaderContent>
            <LeftSection>
              <MenuButton onClick={toggleSidebar}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </MenuButton>
              
              <SearchContainer>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchContainer>
            </LeftSection>

            <Clock />

            <RightSection>
              <NotificationButton>
                <Bell size={20} />
                <NotificationBadge />
              </NotificationButton>

              <UserProfile>
                <UserAvatar>
                  <User size={20} />
                </UserAvatar>
                <span className="user-name">
                  {user?.name || 'User'}
                </span>
              </UserProfile>
            </RightSection>
          </HeaderContent>
        </Header>

        <PageContent>
          {children}
        </PageContent>
      </MainContent>
    </DashboardContainer>
  );
};

export default DashboardLayout;