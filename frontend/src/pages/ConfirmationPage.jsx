/**
 * ConfirmationPage
 * Shown after the user clicks "Confirm Enrollment".
 * Displays a success summary using the confirmationData from context.
 *
 * If the user lands here without confirmation data (e.g. direct URL),
 * redirect them back to the home page.
 */

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEnrollment, ACTIONS } from '../context/EnrollmentContext';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { state, dispatch } = useEnrollment();
  const navigate            = useNavigate();
  const data                = state.confirmationData;

  // Guard: must arrive from a real confirmation, not a direct URL visit
  useEffect(() => {
    if (!data) {
      navigate('/', { replace: true });
    }
  }, [data, navigate]);

  if (!data) return null;

  const handleStartOver = () => {
    dispatch({ type: ACTIONS.CLEAR_CONFIRMATION });
    navigate('/');
  };

  return (
    <main className="confirmation-page">
      <div className="confirmation-box">
        {/* Success icon */}
        <div className="success-icon">✓</div>

        {/* Main heading */}
        <h1 className="confirmation-title">Enrollment Confirmed!</h1>
        <p className="confirmation-subtitle">
          Your course registration has been submitted successfully.
        </p>

        {/* Stats */}
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

        {/* Thank you message */}
        <p className="thank-you-message">
          Thank you for enrolling! A confirmation receipt has been recorded.
          Please check with the registrar for any further steps.
        </p>

        {/* Action */}
        <button className="btn btn-primary" onClick={handleStartOver}>
          Enroll in More Courses
        </button>
      </div>
    </main>
  );
};

export default ConfirmationPage;
