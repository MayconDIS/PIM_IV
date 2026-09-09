import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'login'

  if (currentPage === 'login') {
    return <LoginPage onLoginSuccess={() => setCurrentPage('dashboard')} />;
  }

  return (
    <StudyProvider>
      <DashboardPage onNavigateLogin={() => setCurrentPage('login')} />
    </StudyProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
