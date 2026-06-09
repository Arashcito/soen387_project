/**
 * CourseCard Component
 * Renders a single course card with all its details, a section dropdown,
 * and an Enroll button.
 *
 * Props:
 *   course       — course object from the database
 *   onEnroll     — callback({ course_id, section, selected_credits })
 *   isEnrolled   — boolean; true if this course is already in the cart
 */

import { useState } from 'react';
import './CourseCard.css';

const SECTIONS = ['Morning', 'Afternoon', 'Evening'];
const COST_PER_CREDIT = 500;

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const [selectedSection, setSelectedSection] = useState('Morning');

  const handleEnroll = () => {
    onEnroll({
      course_id: course.id,
      section: selectedSection,
      selected_credits: course.credit_hours,
    });
  };

  return (
    <div className={`course-card ${isEnrolled ? 'course-card--enrolled' : ''}`}>
      {/* Enrolled badge */}
      {isEnrolled && (
        <span className="enrolled-badge">✓ Enrolled</span>
      )}

      {/* Course title */}
      <h2 className="course-title">{course.title}</h2>

      {/* Course metadata */}
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
          <span className="meta-value">${COST_PER_CREDIT.toLocaleString()}</span>
        </div>
      </div>

      {/* Description */}
      <p className="course-description">{course.description}</p>

      {/* Enrollment controls */}
      <div className="enrollment-controls">
        <label className="section-label" htmlFor={`section-${course.id}`}>
          Select Section
        </label>
        <select
          id={`section-${course.id}`}
          className="section-select"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          disabled={isEnrolled}
        >
          {SECTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          className={`enroll-btn ${isEnrolled ? 'enroll-btn--enrolled' : ''}`}
          onClick={handleEnroll}
          disabled={isEnrolled}
        >
          {isEnrolled ? '✓ Already Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
