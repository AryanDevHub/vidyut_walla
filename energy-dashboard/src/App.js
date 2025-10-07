import React from 'react';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import Layout from './components/Layout';
import LoginPage from './components/pages/LoginPage';
import './style.css';

// A simple component to handle the authenticated routing logic
const AppRouter = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Layout /> : <LoginPage />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ModalProvider>
          <AppRouter />
        </ModalProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;