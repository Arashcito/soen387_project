/**
 * App.jsx — Root component
 * Sets up React Router routes and wraps the entire app
 * in the EnrollmentProvider (Observer pattern Subject).
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EnrollmentProvider } from './context/EnrollmentContext';
import Navbar            from './components/Navbar';
import CourseList        from './pages/CourseList';
import EnrollmentPage    from './pages/EnrollmentPage';
import ConfirmationPage  from './pages/ConfirmationPage';
import './index.css';

const App = () => {
  return (
    // EnrollmentProvider makes the enrollment state available to ALL child components.
    // This is the "Subject" in the Observer pattern.
    <EnrollmentProvider>
      <BrowserRouter>
        {/* Navbar is always visible — it observes enrollment count for the badge */}
        <Navbar />

        <Routes>
          {/* Course listing page */}
          <Route path="/"             element={<CourseList />} />

          {/* Enrollment summary / cart page */}
          <Route path="/enrollment"   element={<EnrollmentPage />} />

          {/* Post-confirmation success page */}
          <Route path="/confirmation" element={<ConfirmationPage />} />

          {/* Catch-all: redirect to home */}
          <Route path="*"             element={<CourseList />} />
        </Routes>
      </BrowserRouter>
    </EnrollmentProvider>
  );
};

export default App;
