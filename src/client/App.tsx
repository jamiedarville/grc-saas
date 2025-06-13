import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';

// Import components
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ComplianceManagement from './components/Compliance/ComplianceManagement';
import RiskManagement from './components/Risk/RiskManagement';
import VendorManagement from './components/Vendor/VendorManagement';
import AuditManagement from './components/Audit/AuditManagement';
import TaskManagement from './components/Task/TaskManagement';
import Settings from './components/Settings/Settings';

// Import hooks
import { useAuth } from './hooks/useAuth';

// Global styles
const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
    color: #1a202c;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppContainer>
      <Global styles={globalStyles} />
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/compliance/*" element={<ComplianceManagement />} />
                  <Route path="/risks/*" element={<RiskManagement />} />
                  <Route path="/vendors/*" element={<VendorManagement />} />
                  <Route path="/audits/*" element={<AuditManagement />} />
                  <Route path="/tasks/*" element={<TaskManagement />} />
                  <Route path="/settings/*" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppContainer>
  );
};

export default App;