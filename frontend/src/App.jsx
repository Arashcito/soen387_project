import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnrollmentProvider, useEnrollment, ACTIONS } from './context/EnrollmentContext';
import { fetchConfig } from './services/api';
import Navbar           from './components/Navbar';
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
  <EnrollmentProvider>
    <BrowserRouter>
      <AppInit />
      <Navbar />
      <Routes>
        <Route path="/"             element={<CourseList />} />
        <Route path="/enrollment"   element={<EnrollmentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*"             element={<CourseList />} />
      </Routes>
    </BrowserRouter>
  </EnrollmentProvider>
);

export default App;
