/**
 * ============================================================
 * DESIGN PATTERN #2: OBSERVER (Behavioral Pattern)
 * ============================================================
 * Category: Behavioral
 * Purpose: Defines a one-to-many dependency between objects so
 *          that when one object (the Subject) changes state,
 *          all its dependents (Observers) are notified and
 *          updated automatically.
 *
 * Implementation:
 *   - Subject  → EnrollmentContext (the shared state store)
 *   - Observers → Any React component that calls useEnrollment()
 *                 (CourseList, EnrollmentPage, Navbar badge, etc.)
 *   - Notification mechanism → React's built-in re-render
 *     triggered by useReducer's dispatch.
 *
 * When dispatch() is called (e.g. ENROLL, REMOVE, UPDATE),
 * every subscribed observer component automatically re-renders
 * with the latest state — exactly the Observer contract.
 * ============================================================
 */

import { createContext, useContext, useReducer } from 'react';

// ── Initial State ─────────────────────────────────────────────
const initialState = {
  enrollments: [],          // list of enrolled course objects
  confirmationData: null,   // summary returned after /confirm
};

// ── Action Types ──────────────────────────────────────────────
export const ACTIONS = {
  SET_ENROLLMENTS: 'SET_ENROLLMENTS',
  ADD_ENROLLMENT:  'ADD_ENROLLMENT',
  UPDATE_ENROLLMENT: 'UPDATE_ENROLLMENT',
  REMOVE_ENROLLMENT: 'REMOVE_ENROLLMENT',
  SET_CONFIRMATION: 'SET_CONFIRMATION',
  CLEAR_CONFIRMATION: 'CLEAR_CONFIRMATION',
};

// ── Reducer (pure function — no side effects) ─────────────────
const enrollmentReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ENROLLMENTS:
      return { ...state, enrollments: action.payload };

    case ACTIONS.ADD_ENROLLMENT:
      // Prevent duplicate enrollment of the same course
      if (state.enrollments.some((e) => e.course_id === action.payload.course_id)) {
        return state;
      }
      return { ...state, enrollments: [...state.enrollments, action.payload] };

    case ACTIONS.UPDATE_ENROLLMENT:
      return {
        ...state,
        enrollments: state.enrollments.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };

    case ACTIONS.REMOVE_ENROLLMENT:
      return {
        ...state,
        enrollments: state.enrollments.filter((e) => e.id !== action.payload),
      };

    case ACTIONS.SET_CONFIRMATION:
      return { ...state, confirmationData: action.payload, enrollments: [] };

    case ACTIONS.CLEAR_CONFIRMATION:
      return { ...state, confirmationData: null };

    default:
      return state;
  }
};

// ── Create Context (the "Subject" in Observer terms) ──────────
const EnrollmentContext = createContext(null);

/**
 * EnrollmentProvider wraps the whole app so every component
 * can subscribe (observe) enrollment state changes.
 */
export const EnrollmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(enrollmentReducer, initialState);

  return (
    <EnrollmentContext.Provider value={{ state, dispatch }}>
      {children}
    </EnrollmentContext.Provider>
  );
};

/**
 * useEnrollment — custom hook.
 * Any component calling this hook becomes an Observer:
 * it will re-render automatically whenever the shared state changes.
 */
export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used inside <EnrollmentProvider>');
  }
  return context;
};
