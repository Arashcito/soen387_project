import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEnrollment } from '../context/EnrollmentContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { state } = useEnrollment();
  const { student, logout } = useAuth();
  const count    = state.enrollments.length;
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <span>Course Enrollment</span>
        </Link>

        <div className="navbar-right">
          {student && (
            <span className="navbar-student">👤 {student.name}</span>
          )}

          <Link
            to="/enrollment"
            className={`navbar-enrollment-link ${location.pathname === '/enrollment' ? 'active' : ''}`}
          >
            My Enrollment
            {count > 0 && <span className="enrollment-badge">{count}</span>}
          </Link>

          {student && (
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
