import { useEffect, useState } from 'react';
import { fetchCourses, enrollCourse } from '../services/api';
import { useEnrollment, ACTIONS } from '../context/EnrollmentContext';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [message, setMessage] = useState(null);
  const { state, dispatch }   = useEnrollment();
  const { student }           = useAuth();

  useEffect(() => {
    fetchCourses()
      .then((res) => setCourses(res.data.data))
      .catch(() => setError('Failed to load courses. Please make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleEnroll = async ({ course_id, section, selected_credits }) => {
    if (state.enrollments.some((e) => e.course_id === course_id)) {
      setMessage({ type: 'warning', text: 'You are already enrolled in this course.' });
      return;
    }

    try {
      const res = await enrollCourse({ student_id: student.id, course_id, section, selected_credits });
      const course = courses.find((c) => c.id === course_id);

      dispatch({
        type: ACTIONS.ADD_ENROLLMENT,
        payload: {
          id: res.data.id,
          course_id,
          section,
          selected_credits,
          total_cost: selected_credits * (res.data.cost_per_credit || state.costPerCredit),
          ...course,
        },
      });

      setCourses((prev) =>
        prev.map((c) => (c.id === course_id ? { ...c, seats: c.seats - 1 } : c))
      );

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
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Courses</h1>
          <p className="page-subtitle">Browse and enroll in courses for the upcoming semester.</p>
        </div>
        <div className="courses-count">
          {courses.length} course{courses.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {message && (
        <div className={`feedback-message feedback-${message.type}`}>
          {message.text}
        </div>
      )}

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
