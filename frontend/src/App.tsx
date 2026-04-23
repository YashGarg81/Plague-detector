import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AccessDenied from './pages/AccessDenied';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherPeerReview from './pages/TeacherPeerReview';
import TeacherFeedback from './pages/TeacherFeedback';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['teacher']}>
                <TeacherAssignments />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/peer-review"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['teacher']}>
                <TeacherPeerReview />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/feedback"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['teacher']}>
                <TeacherFeedback />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
