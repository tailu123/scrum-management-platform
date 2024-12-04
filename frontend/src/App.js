import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import SprintBoard from './pages/SprintBoard';
import Forum from './pages/Forum';
import Retrospective from './pages/Retrospective';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sprint-board" element={<SprintBoard />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/retrospective" element={<Retrospective />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
