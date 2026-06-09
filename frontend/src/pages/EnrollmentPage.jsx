/**
 * EnrollmentPage
 * Displays the current enrollment "cart" in a table.
 * Allows the user to:
 *   - Update credit hours per course
 *   - Remove a course from the cart
 *   - Confirm all enrollments
 *
 * Observer role: reads from and dispatches to EnrollmentContext.
 * On mount it also fetches enrollments from the backend to stay in sync.
 */

import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchEnrollments,
  updateEnrollment as apiUpdateEnrollment,
  removeEnrollment as apiRemoveEnrollment,
  confirmEnrollments as apiConfirmEnrollments,
} from '../services/api';
import { useEnrollment, ACTIONS } from '../context/EnrollmentContext';
import './EnrollmentPage.css';

const COST_PER_CREDIT = 500;

const EnrollmentPage = () => {
  const { state, dispatch } = useEnrollment();
  const navigate            = useNavigate();
  const [loading, setLoading]     = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [warnings, setWarnings]   = useState({}); // { [enrollmentId]: message }

  // Sync enrollments from DB on mount (handles page refresh)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEnrollments();
        dispatch({ type: ACTIONS.SET_ENROLLMENTS, payload: res.data.data });
      } catch {
        // silently ignore — local context state will be used
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Update credit hours ────────────────────────────────────
  const handleCreditChange = async (enrollment, newCredits) => {
    const credits = parseInt(newCredits, 10);

    // Prevent negative values silently
    if (credits < 0) return;

    // Warn if 0 but do NOT remove automatically
    if (credits === 0) {
      setWarnings((prev) => ({
        ...prev,
        [enrollment.id]: 'Credit hours are set to 0. The course will have no cost but stays enrolled.',
      }));
    } else {
      setWarnings((prev) => {
        const updated = { ...prev };
        delete updated[enrollment.id];
        return updated;
      });
    }

    // Optimistic UI update
    dispatch({
      type: ACTIONS.UPDATE_ENROLLMENT,
      payload: {
        id: enrollment.id,
        selected_credits: credits,
        total_cost: credits * COST_PER_CREDIT,
      },
    });

    try {
      await apiUpdateEnrollment(enrollment.id, { selected_credits: credits });
    } catch {
      // Revert on failure
      dispatch({
        type: ACTIONS.UPDATE_ENROLLMENT,
        payload: {
          id: enrollment.id,
          selected_credits: enrollment.selected_credits,
          total_cost: enrollment.total_cost,
        },
      });
    }
  };

  // ── Remove course ──────────────────────────────────────────
  const handleRemove = async (id) => {
    dispatch({ type: ACTIONS.REMOVE_ENROLLMENT, payload: id });
    setWarnings((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    try {
      await apiRemoveEnrollment(id);
    } catch {
      // If the API call fails, re-sync from server
      const res = await fetchEnrollments();
      dispatch({ type: ACTIONS.SET_ENROLLMENTS, payload: res.data.data });
    }
  };

  // ── Confirm enrollment ─────────────────────────────────────
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const res = await apiConfirmEnrollments();
      dispatch({
        type: ACTIONS.SET_CONFIRMATION,
        payload: {
          total_courses: res.data.total_courses,
          total_cost:    res.data.total_cost,
        },
      });
      navigate('/confirmation');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm enrollment.');
    } finally {
      setConfirming(false);
    }
  };

  // ── Derived values ─────────────────────────────────────────
  const enrollments  = state.enrollments;
  const grandTotal   = enrollments.reduce(
    (sum, e) => sum + parseFloat(e.total_cost || 0),
    0
  );

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Loading your enrollments…</p>
      </div>
    );
  }

  return (
    <main className="enrollment-page">
      <div className="enrollment-header">
        <h1 className="page-title">My Enrollment</h1>
        <Link to="/" className="continue-link">← Continue Browsing</Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <h2>Your enrollment cart is empty.</h2>
          <p>Browse available courses and click <strong>Enroll Now</strong> to add them here.</p>
          <Link to="/" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <>
          {/* Enrollment table */}
          <div className="table-wrap">
            <table className="enrollment-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th>Section</th>
                  <th>Credits</th>
                  <th>Cost / Credit</th>
                  <th>Total Cost</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <Fragment key={enrollment.id}>
                    <tr className="enrollment-row">
                      <td className="course-name-cell">{enrollment.title}</td>
                      <td>
                        <span className="code-pill">{enrollment.code}</span>
                      </td>
                      <td>
                        <span className="section-tag">{enrollment.section}</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="credits-input"
                          value={enrollment.selected_credits}
                          min="0"
                          max="6"
                          onChange={(e) => handleCreditChange(enrollment, e.target.value)}
                        />
                      </td>
                      <td>${COST_PER_CREDIT.toLocaleString()}</td>
                      <td className="cost-cell">
                        ${parseFloat(enrollment.total_cost || 0).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemove(enrollment.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>

                    {/* Zero-credit warning row */}
                    {warnings[enrollment.id] && (
                      <tr className="warning-row">
                        <td colSpan={7}>
                          <div className="inline-warning">
                            ⚠️ {warnings[enrollment.id]}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="enrollment-footer">
            <div className="grand-total">
              <span>Total Tuition Cost:</span>
              <span className="total-amount">${grandTotal.toLocaleString()}</span>
            </div>
            <div className="footer-actions">
              <Link to="/" className="btn btn-secondary">← Continue Browsing</Link>
              <button
                className="btn btn-primary btn-confirm"
                onClick={handleConfirm}
                disabled={confirming}
              >
                {confirming ? 'Confirming…' : 'Confirm Enrollment'}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default EnrollmentPage;
