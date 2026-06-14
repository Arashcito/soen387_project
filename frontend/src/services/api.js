import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const fetchConfig      = ()          => api.get('/config');
export const fetchCourses     = ()          => api.get('/courses');
export const fetchEnrollments = ()          => api.get('/enrollments');
export const enrollCourse     = (payload)   => api.post('/enrollments', payload);
export const updateEnrollment = (id, data)  => api.put(`/enrollments/${id}`, data);
export const removeEnrollment = (id)        => api.delete(`/enrollments/${id}`);
export const confirmEnrollments = ()        => api.post('/enrollments/confirm');
