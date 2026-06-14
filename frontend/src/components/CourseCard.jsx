import { useState } from 'react';
import { useEnrollment } from '../context/EnrollmentContext';
import './CourseCard.css';

const SECTIONS = ['Morning', 'Afternoon', 'Evening'];

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const [selectedSection, setSelectedSection] = useState('Morning');
  const { state } = useEnrollment();
  const costPerCredit = state.costPerCredit;

  const noSeats = course.seats <= 0;
  const disabled = isEnrolled || noSeats;

  const handleEnroll = () => {
    onEnroll({
      course_id:        course.id,
      section:          selectedSection,
      selected_credits: course.credit_hours,
    });
  };

  return (
    <div className={`course-card ${isEnrolled ? 'course-card--enrolled' : ''}`}>
      {isEnrolled && <span className="enrolled-badge">✓ Enrolled</span>}
      {noSeats && !isEnrolled && <span className="enrolled-badge enrolled-badge--full">Full</span>}

      <h2 className="course-title">{course.title}</h2>

      <div className="course-meta">
        <div className="course-meta-item">
          <span className="meta-label">Course Code</span>
          <span className="meta-value code-pill">{course.code}</span>
        </div>
        <div className="course-meta-item">
          <span className="meta-label">Instructor</span>
          <span className="meta-value">{course.instructor}</span>
        </div>
        <div className="course-meta-item">
          <span className="meta-label">Available Seats</span>
          <span className={`meta-value seats-value ${course.seats < 5 ? 'seats-low' : ''}`}>
            {course.seats}
          </span>
        </div>
        <div className="course-meta-item">
          <span className="meta-label">Credit Hours</span>
          <span className="meta-value">{course.credit_hours} credits</span>
        </div>
        <div className="course-meta-item">
          <span className="meta-label">Cost / Credit</span>
          <span className="meta-value">${costPerCredit.toLocaleString()}</span>
        </div>
      </div>

      <p className="course-description">{course.description}</p>

      <div className="enrollment-controls">
        <label className="section-label" htmlFor={`section-${course.id}`}>
          Select Section
        </label>
        <select
          id={`section-${course.id}`}
          className="section-select"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          disabled={disabled}
        >
          {SECTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          className={`enroll-btn ${disabled ? 'enroll-btn--enrolled' : ''}`}
          onClick={handleEnroll}
          disabled={disabled}
        >
          {isEnrolled ? '✓ Already Enrolled' : noSeats ? 'No Seats Available' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
