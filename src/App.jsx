import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Timetables from './pages/Timetables';
import Home from './pages/Home';
import Departments from './pages/Departments';
import Subjects from './pages/Subjects';
import FacultyDashboard from './pages/FacultyDashboard';
import SemesterPage from './pages/SemesterPage';
import QuestionBankPage from './pages/QuestionBankPage';
import MockExamPage from './pages/MockExamPage';
import PreviousPapersPage from './pages/PreviousPapersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';

// Dashboard / Management (Placeholders)
import { Typography, Box } from '@mui/material';


const Placeholder = ({ title }) => (
  <Box>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    <Typography variant="body1">Management module for {title.toLowerCase()} will appear here.</Typography>
  </Box>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/departments" element={<ProtectedRoute><Layout><Departments /></Layout></ProtectedRoute>} />
          <Route path="/subjects" element={<Layout><Subjects /></Layout>} />
          <Route path="/faculty" element={<ProtectedRoute><Layout><FacultyDashboard /></Layout></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><Layout><Placeholder title="Rooms" /></Layout></ProtectedRoute>} />
          <Route path="/timetables" element={<ProtectedRoute><Layout><Timetables /></Layout></ProtectedRoute>} />
          
          {/* New Portal Routes */}
          <Route path="/:reg/:sem" element={<Layout><SemesterPage /></Layout>} />
          <Route path="/subject/:code/qb" element={<Layout><QuestionBankPage /></Layout>} />
          <Route path="/subject/:code/mock" element={<ProtectedRoute><Layout><MockExamPage /></Layout></ProtectedRoute>} />
          <Route path="/previous-papers" element={<Layout><PreviousPapersPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
