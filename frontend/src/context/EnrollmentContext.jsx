/**
 * DESIGN PATTERN #2 — OBSERVER (Behavioral)
 *
 * Subject  → EnrollmentContext (the shared state store)
 * Observers → Any component that calls useEnrollment()
 *             (CourseList, EnrollmentPage, Navbar, etc.)
 *
 * When dispatch() is called, every subscribed component
 * automatically re-renders with the latest state —
 * exactly the Observer contract.
 */

import { createContext, useContext, useReducer } from 'react';

const initialState = {
  enrollments: [],
  confirmationData: null,
  costPerCredit: 500,
};

export const ACTIONS = {
  SET_ENROLLMENTS:    'SET_ENROLLMENTS',
  ADD_ENROLLMENT:     'ADD_ENROLLMENT',
  UPDATE_ENROLLMENT:  'UPDATE_ENROLLMENT',
  REMOVE_ENROLLMENT:  'REMOVE_ENROLLMENT',
  SET_CONFIRMATION:   'SET_CONFIRMATION',
  CLEAR_CONFIRMATION: 'CLEAR_CONFIRMATION',
  SET_CONFIG:         'SET_CONFIG',
};

const enrollmentReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONFIG:
      return { ...state, costPerCredit: action.payload.cost_per_credit };

    case ACTIONS.SET_ENROLLMENTS:
      return { ...state, enrollments: action.payload };

    case ACTIONS.ADD_ENROLLMENT:
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

const EnrollmentContext = createContext(null);

export const EnrollmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(enrollmentReducer, initialState);

  return (
    <EnrollmentContext.Provider value={{ state, dispatch }}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used inside <EnrollmentProvider>');
  }
  return context;
};
