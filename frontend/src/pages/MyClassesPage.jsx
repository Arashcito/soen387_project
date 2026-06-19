import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEnrollments, removeEnrollment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyClassesPage.css';

const MyClassesPage = () => {
  const { student }             = useAuth();
  const [classes, setClasses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [removing, setRemoving] = useState(null);
  const [message, setMessage]   = useState(null);

  const load = async () => {
    try {
      const res = await fetchEnrollments(student.id, 'confirmed');
      setClasses(res.data.data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load your classes.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const handleRemove = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from your classes?`)) return;
    setRemoving(id);
    try {
      await removeEnrollment(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      setMessage({ type: 'success', text: `"${title}" has been removed from your classes.` });
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove the class. Please try again.' });
    } finally {
      setRemoving(null);
    }
  };

  const total = classes.reduce((sum, c) => sum + parseFloat(c.total_cost || 0), 0);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
        <p>Loading your classes…</p>
      </div>
    );
  }

  return (
    <main className="myclasses-page">
      <div className="myclasses-header">
        <div>
          <h1 className="page-title">My Classes</h1>
          <p className="page-subtitle">Your confirmed course registrations</p>
        </div>
        <Link to="/" className="btn btn-secondary">Browse More Courses</Link>
      </div>

      {message && (
        <div className={`feedback-message feedback-${message.type}`}>{message.text}</div>
      )}

      {classes.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📚</p>
          <h2>No confirmed classes yet.</h2>
          <p>Enroll in courses and confirm your enrollment to see them here.</p>
          <Link to="/" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="myclasses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Code</th>
                  <th>Instructor</th>
                  <th>Section</th>
                  <th>Credits</th>
                  <th>Tuition</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td className="course-name-cell">{c.title}</td>
                    <td><span className="code-pill">{c.code}</span></td>
                    <td>{c.instructor}</td>
                    <td><span className="section-tag">{c.section}</span></td>
                    <td>{c.selected_credits}</td>
                    <td className="cost-cell">${parseFloat(c.total_cost).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(c.id, c.title)}
                        disabled={removing === c.id}
                      >
                        {removing === c.id ? 'Removing…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="myclasses-footer">
            <span className="total-label">
              {classes.length} class{classes.length !== 1 ? 'es' : ''} registered
            </span>
            <span className="total-amount">Total: ${total.toLocaleString()}</span>
          </div>
        </>
      )}
    </main>
  );
};

export default MyClassesPage;
