/**
 * CourseList Page
 * Fetches all courses from the backend and renders them as cards.
 * Also handles the "Enroll" action by posting to /api/enrollments.
 *
 * Observer role: subscribes to EnrollmentContext to know which
 * courses are already in the cart (shows "Already Enrolled" state).
 */

import { useEffect, useState } from 'react';
import { fetchCourses, enrollCourse } from '../services/api';
import { useEnrollment, ACTIONS } from '../context/EnrollmentContext';
import CourseCard from '../components/CourseCard';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [message, setMessage]     = useState(null); // success/error feedback
  const { state, dispatch }       = useEnrollment();

  // Load all courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchCourses();
        setCourses(res.data.data);
      } catch (err) {
        setError('Failed to load courses. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  // Auto-dismiss the feedback message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleEnroll = async ({ course_id, section, selected_credits }) => {
    // Guard: already enrolled
    if (state.enrollments.some((e) => e.course_id === course_id)) {
      setMessage({ type: 'warning', text: 'You are already enrolled in this course.' });
      return;
    }

    try {
      const res = await enrollCourse({ course_id, section, selected_credits });
      const newEnrollment = {
        id: res.data.id,
        course_id,
        section,
        selected_credits,
        total_cost: selected_credits * (res.data.cost_per_credit || 500),
        // Enrich with course metadata for display in EnrollmentPage
        ...courses.find((c) => c.id === course_id),
      };

      // Dispatch to context → notifies all Observer components
      dispatch({ type: ACTIONS.ADD_ENROLLMENT, payload: newEnrollment });

      const course = courses.find((c) => c.id === course_id);
      setMessage({
        type: 'success',
        text: `"${course?.title}" added to your enrollment! (${section} section)`,
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to enroll. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Loading courses…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  const enrolledIds = new Set(state.enrollments.map((e) => e.course_id));

  return (
    <main className="course-list-page">
      {/* Page heading */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Courses</h1>
          <p className="page-subtitle">
            Browse and enroll in courses for the upcoming semester.
          </p>
        </div>
        <div className="courses-count">
          {courses.length} course{courses.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Feedback message */}
      {message && (
        <div className={`feedback-message feedback-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Course grid */}
      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={handleEnroll}
            isEnrolled={enrolledIds.has(course.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default CourseList;
