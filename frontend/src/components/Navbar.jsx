/**
 * Navbar Component
 * Displays the site title and a link to the enrollment page with a badge
 * showing the number of currently enrolled courses.
 *
 * This component is an Observer — it subscribes to EnrollmentContext
 * and re-renders whenever the enrollment count changes.
 */

import { Link, useLocation } from 'react-router-dom';
import { useEnrollment } from '../context/EnrollmentContext';
import './Navbar.css';

const Navbar = () => {
  const { state } = useEnrollment(); // Observer: subscribed to global state
  const count = state.enrollments.length;
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Site Title */}
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <span>Course Enrollment</span>
        </Link>

        {/* My Enrollment link with badge */}
        <Link
          to="/enrollment"
          className={`navbar-enrollment-link ${
            location.pathname === '/enrollment' ? 'active' : ''
          }`}
        >
          My Enrollment
          {count > 0 && (
            <span className="enrollment-badge">{count}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
