import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEnrollment, ACTIONS } from '../context/EnrollmentContext';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { state, dispatch } = useEnrollment();
  const navigate            = useNavigate();
  const data                = state.confirmationData;

  useEffect(() => {
    if (!data) navigate('/', { replace: true });
  }, [data, navigate]);

  if (!data) return null;

  const handleStartOver = () => {
    dispatch({ type: ACTIONS.CLEAR_CONFIRMATION });
    navigate('/');
  };

  return (
    <main className="confirmation-page">
      <div className="confirmation-box">
        <div className="success-icon">✓</div>

        <h1 className="confirmation-title">Enrollment Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your course registration has been submitted successfully.
        </p>

        <div className="confirmation-stats">
          <div className="stat-card">
            <span className="stat-label">Courses Enrolled</span>
            <span className="stat-value">{data.total_courses}</span>
          </div>
          <div className="stat-card stat-card--accent">
            <span className="stat-label">Total Tuition</span>
            <span className="stat-value">${parseFloat(data.total_cost).toLocaleString()}</span>
          </div>
        </div>

        {data.courses && data.courses.length > 0 && (
          <div className="confirmation-courses">
            <h3 className="confirmation-courses-title">Enrolled Courses</h3>
            <table className="confirmation-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th>Section</th>
                  <th>Credits</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.title}</td>
                    <td><span className="code-pill">{c.code}</span></td>
                    <td>{c.section}</td>
                    <td>{c.selected_credits}</td>
                    <td>${parseFloat(c.total_cost).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="thank-you-message">
          Thank you for enrolling! Please check with the registrar for any further steps.
        </p>

        <button className="btn btn-primary" onClick={handleStartOver}>
          Enroll in More Courses
        </button>
      </div>
    </main>
  );
};

export default ConfirmationPage;
