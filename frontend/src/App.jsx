import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnrollmentProvider, useEnrollment, ACTIONS } from './context/EnrollmentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchConfig, fetchEnrollments } from './services/api';
import ProtectedRoute   from './components/ProtectedRoute';
import Navbar           from './components/Navbar';
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import CourseList       from './pages/CourseList';
import EnrollmentPage   from './pages/EnrollmentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import './index.css';

const AppInit = () => {
  const { dispatch }  = useEnrollment();
  const { student }   = useAuth();

  // Fetch config (cost per credit) once on startup
  useEffect(() => {
    fetchConfig()
      .then((res) => dispatch({ type: ACTIONS.SET_CONFIG, payload: res.data }))
      .catch(() => {});
  }, []);

  // Whenever a student logs in, reload their existing enrollments from the DB
  useEffect(() => {
    if (!student) return;
    fetchEnrollments(student.id)
      .then((res) => dispatch({ type: ACTIONS.SET_ENROLLMENTS, payload: res.data.data }))
      .catch(() => {});
  }, [student]);

  return null;
};

const App = () => (
  <AuthProvider>
    <EnrollmentProvider>
      <BrowserRouter>
        <AppInit />
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/"             element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
                <Route path="/enrollment"   element={<ProtectedRoute><EnrollmentPage /></ProtectedRoute>} />
                <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
                <Route path="*"             element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </EnrollmentProvider>
  </AuthProvider>
);

export default App;
