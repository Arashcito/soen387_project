import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnrollmentProvider, useEnrollment, ACTIONS } from './context/EnrollmentContext';
import { AuthProvider } from './context/AuthContext';
import { fetchConfig } from './services/api';
import ProtectedRoute   from './components/ProtectedRoute';
import Navbar           from './components/Navbar';
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import CourseList       from './pages/CourseList';
import EnrollmentPage   from './pages/EnrollmentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import './index.css';

const AppInit = () => {
  const { dispatch } = useEnrollment();
  useEffect(() => {
    fetchConfig()
      .then((res) => dispatch({ type: ACTIONS.SET_CONFIG, payload: res.data }))
      .catch(() => {});
  }, []);
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
                <Route path="/" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
                <Route path="/enrollment" element={<ProtectedRoute><EnrollmentPage /></ProtectedRoute>} />
                <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
                <Route path="*" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </EnrollmentProvider>
  </AuthProvider>
);

export default App;
