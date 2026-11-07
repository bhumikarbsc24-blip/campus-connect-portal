
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Deployed Render Backend URL
const API_URL = 'https://campus-connect-portal-2205.onrender.com/api';

export default function StudentPortal({ onBackToHome }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const [noticeError, setNoticeError] = useState('');
  const [assignmentError, setAssignmentError] = useState('');

  // Fetch notices from MongoDB Atlas
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_URL}/notices`);

        if (!response.ok) {
          throw new Error('Unable to load notices');
        }

        const data = await response.json();
        setNotices(data);
      } catch (error) {
        setNoticeError(error.message);
      } finally {
        setLoadingNotices(false);
      }
    };

    fetchNotices();
  }, []);

  // Fetch assignments from MongoDB Atlas
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API_URL}/assignments`);

        if (!response.ok) {
          throw new Error('Unable to load assignments');
        }

        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        setAssignmentError(error.message);
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, []);

  // Submit assignment and update MongoDB
  const handleAssignmentSubmit = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/assignments/${id}/submit`,
        {
          method: 'PUT'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setAssignments((previous) =>
        previous.map((item) =>
          item._id === id ? data : item
        )
      );

      alert('Assignment submitted successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  // Select current tab
  const currentPath = location.pathname;

  const activePage = currentPath.includes('/assignments')
    ? 'assignments'
    : currentPath.includes('/attendance')
    ? 'attendance'
    : currentPath.includes('/profile')
    ? 'profile'
    : 'notices';

  return (
    <div style={styles.container}>

      {/* Header */}
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0, color: '#F2A900' }}>
            👨‍🎓 Student Portal View
          </h2>

          <span style={{ fontSize: '13px', color: '#e0e0e0' }}>
            Welcome, RVU Student
          </span>
        </div>

        <button onClick={onBackToHome} style={styles.backBtn}>
          ← Back to Main Campus View
        </button>
      </header>

      {/* Navigation Tabs */}
      <div style={styles.tabContainer}>

        <button
          onClick={() => navigate('/student/notices')}
          style={activePage === 'notices' ? styles.activeTab : styles.tab}
        >
          Notices & Events
        </button>

        <button
          onClick={() => navigate('/student/assignments')}
          style={activePage === 'assignments' ? styles.activeTab : styles.tab}
        >
          Assignments
        </button>

        <button
          onClick={() => navigate('/student/attendance')}
          style={activePage === 'attendance' ? styles.activeTab : styles.tab}
        >
          Track Attendance
        </button>

        <button
          onClick={() => navigate('/student/profile')}
          style={activePage === 'profile' ? styles.activeTab : styles.tab}
        >
          Profile
        </button>

      </div>

      {/* Content Section */}
      <div style={styles.contentCard}>

        {/* Notices Section */}
        {activePage === 'notices' && (
          <div>
            <h3>📢 Campus Notices & Events</h3>

            {loadingNotices && <p>Loading notices...</p>}

            {noticeError && (
              <p style={styles.errorText}>{noticeError}</p>
            )}

            {!loadingNotices && !noticeError && notices.length === 0 && (
              <p>No notices available.</p>
            )}

            {!loadingNotices && !noticeError && (
              <ul style={styles.list}>
                {notices.map((item) => (
                  <li key={item._id} style={styles.listItem}>
                    <div>
                      <strong>{item.title}</strong>

                      <p style={styles.subText}>
                        {item.department} • {item.date}
                      </p>

                      <p style={styles.description}>
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Assignments Section */}
        {activePage === 'assignments' && (
          <div>
            <h3>📝 Assignments & Submissions</h3>

            {loadingAssignments && <p>Loading assignments...</p>}

            {assignmentError && (
              <p style={styles.errorText}>{assignmentError}</p>
            )}

            {!loadingAssignments &&
              !assignmentError &&
              assignments.length === 0 && (
                <p>No assignments available yet.</p>
              )}

            {!loadingAssignments && !assignmentError && (
              <ul style={styles.list}>
                {assignments.map((item) => (
                  <li key={item._id} style={styles.listItem}>
                    <div>
                      <strong>{item.title}</strong>

                      <p style={styles.subText}>
                        {item.subject} • Due: {item.dueDate}
                      </p>

                      <p style={styles.description}>
                        {item.description}
                      </p>
                    </div>

                    {item.status === 'Submitted' ? (
                      <span style={styles.badgeSuccess}>
                        Submitted
                      </span>
                    ) : (
                      <button
                        style={styles.actionBtn}
                        onClick={() => handleAssignmentSubmit(item._id)}
                      >
                        Submit Assignment
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Attendance Section */}
        {activePage === 'attendance' && (
          <div>
            <h3>📊 Attendance Tracker</h3>

            <div style={styles.grid}>
              <div style={styles.metricCard}>
                <h4>CS3301 - Full Stack</h4>
                <p style={styles.metricText}>88% Attendance</p>
              </div>

              <div style={styles.metricCard}>
                <h4>CS3302 - DBMS</h4>
                <p style={styles.metricText}>92% Attendance</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activePage === 'profile' && (
          <div>
            <h3>👤 Student Profile</h3>

            <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <p><strong>Name:</strong> RVU Student</p>

              <p>
                <strong>Department:</strong> School of Computer Science & Engineering (SOCSE)
              </p>

              <p><strong>Course:</strong> CS3301 - Full Stack Development</p>

              <p><strong>Status:</strong> Active Enrolled</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// RVU University Styling
const styles = {
  container: {
    maxWidth: '850px',
    margin: '30px auto',
    fontFamily: 'Arial, sans-serif'
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A2240',
    padding: '15px 20px',
    borderRadius: '8px 8px 0 0',
    color: '#fff'
  },

  backBtn: {
    backgroundColor: '#F2A900',
    border: 'none',
    padding: '8px 14px',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#0A2240'
  },

  tabContainer: {
    display: 'flex',
    backgroundColor: '#e0e0e0',
    borderBottom: '2px solid #0A2240'
  },

  tab: {
    flex: 1,
    padding: '12px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#333'
  },

  activeTab: {
    flex: 1,
    padding: '12px',
    border: 'none',
    backgroundColor: '#ffffff',
    color: '#0A2240',
    fontWeight: 'bold',
    borderTop: '3px solid #0A2240',
    cursor: 'pointer'
  },

  contentCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '0 0 8px 8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    minHeight: '200px'
  },

  list: {
    listStyle: 'none',
    padding: 0
  },

  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    padding: '12px',
    borderBottom: '1px solid #eee'
  },

  subText: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: '#666'
  },

  description: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#444'
  },

  actionBtn: {
    backgroundColor: '#0A2240',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },

  badgeSuccess: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },

  errorText: {
    color: 'red',
    fontSize: '14px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },

  metricCard: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center'
  },

  metricText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0A2240'
  }
};
