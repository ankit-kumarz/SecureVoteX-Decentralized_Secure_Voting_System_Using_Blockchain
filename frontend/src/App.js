import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginSelection from './pages/LoginSelection';
import Login from './pages/Login';
import Register from './pages/Register';
import BiometricRegistration from './pages/BiometricRegistration';
import AdminDashboard from './pages/AdminDashboard';
import VoterDashboard from './pages/VoterDashboard';
import ElectionPage from './pages/ElectionPage';
import CandidatePage from './pages/CandidatePage';
import ResultsPage from './pages/ResultsPage';
import OTPPage from './pages/OTPPage';
import EncryptedVotePage from './pages/EncryptedVotePage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import TransparencyDashboard from './pages/TransparencyDashboard';
import AboutSystemPage from './pages/voter/AboutSystemPage';
import ElectionResultDetailPage from './pages/voter/ElectionResultDetailPage';
import ChangePassword from './pages/ChangePassword';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginSelection />} />
          <Route path="/login-selection" element={<LoginSelection />} />
          <Route path="/voter-login" element={<Login />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/biometric-registration" element={<BiometricRegistration />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/about-system" element={<AboutSystemPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/voter/*" element={<VoterDashboard />} />
          <Route path="/election/:id" element={<ElectionPage />} />
          <Route path="/vote-encrypted/:id" element={<EncryptedVotePage />} />
          <Route path="/analytics/:electionId" element={<AnalyticsDashboard />} />
          <Route path="/transparency" element={<TransparencyDashboard />} />
          <Route path="/candidates/:electionId" element={<CandidatePage />} />
          <Route path="/results/:electionId" element={<ResultsPage />} />
          <Route path="/voter/results/:electionId" element={<ElectionResultDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
