
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CharactersPage from './pages/CharactersPage';
import AbyssPage from './pages/AbyssPage';
import TheaterPage from './pages/TheaterPage';
import OnslaughtPage from './pages/OnslaughtPage';
import ExplorationPage from './pages/ExplorationPage';
import RegionDetailPage from './pages/RegionDetailPage';
import AchievementsPage from './pages/AchievementsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Inject user data into children (pages)
  // This preserves the existing page component signatures: ({ data }) => ...
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { data: user } as any);
    }
    return child;
  });

  return <Layout>{childrenWithProps}</Layout>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard data={null as any} /> {/* Data injected by ProtectedRoute */}
        </ProtectedRoute>
      } />
      
      <Route path="/characters" element={
        <ProtectedRoute>
          <CharactersPage data={null as any} />
        </ProtectedRoute>
      } />
      
      <Route path="/abyss" element={
        <ProtectedRoute>
          <AbyssPage data={null as any} />
        </ProtectedRoute>
      } />

      <Route path="/theater" element={
        <ProtectedRoute>
          <TheaterPage data={null as any} />
        </ProtectedRoute>
      } />

      <Route path="/onslaught" element={
        <ProtectedRoute>
          <OnslaughtPage data={null as any} />
        </ProtectedRoute>
      } />
      
      <Route path="/exploration" element={
        <ProtectedRoute>
          <ExplorationPage data={null as any} />
        </ProtectedRoute>
      } />

      <Route path="/exploration/:id" element={
        <ProtectedRoute>
          <RegionDetailPage data={null as any} />
        </ProtectedRoute>
      } />

      <Route path="/achievements" element={
        <ProtectedRoute>
          <AchievementsPage data={null as any} />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
