
import { useEffect, useState } from 'react';

const API_URL = 'https://campus-connect-portal-2205.onrender.com/api';

export default function StudentPortal({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('notices');

  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    department: '',
    date: ''
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: ''
  });

  const [saving, setSaving] = useState(false);

  // Fetch notices
  const fetchNotices = async () => {
    const response = await fetch(`${API_URL}/notices`);

    if (!response.ok) {
      throw new Error('Unable to fetch notices');
    }

    return response.json();
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    const response = await fetch(`${API_URL}/assignments`);

    if (!response.ok) {
      throw new Error('Unable to fetch assignments');
    }

    return response.json();
  };

  // Load portal data
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [noticeData, assignmentData] = await Promise.all([
          fetchNotices(),
          fetchAssignments()
        ]);

        if (!cancelled) {
          setNotices(noticeData);
          setAssignments(assignmentData);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setError(
            'Unable to load data. Please check your internet connection and try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Add notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noticeForm)
      });

      if (!response.ok) {
        throw new Error('Failed to add notice');
      }

      const newNotice = await response.json();

      setNotices((prev) => [...prev, newNotice]);

      setNoticeForm({
        title: '',
        description: '',
        department: '',
        date: ''
      });

      setShowNoticeForm(false);
      alert('Notice added successfully!');
    } catch {
      alert('Unable to add notice. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete notice
  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notices/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete notice');
      }

      setNotices((prev) => prev.filter((notice) => notice._id !== id));
      alert('Notice deleted successfully!');
    } catch {
      alert('Unable to delete notice.');
    }
  };

  // Add assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentForm)
      });

      if (!response.ok) {
        throw new Error('Failed to add assignment');
      }

      const newAssignment = await response.json();

      setAssignments((prev) => [...prev, newAssignment]);

      setAssignmentForm({
        title: '',
        subject: '',
        description: '',
        dueDate: ''
      });

      setShowAssignmentForm(false);
      alert('Assignment added successfully!');
    } catch {
      alert('Unable to add assignment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Submit assignment
  const handleSubmitAssignment = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/assignments/${id}/submit`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }

      const updatedAssignment = await response.json();

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment._id === id
            ? {
                ...assignment,
                ...updatedAssignment,
                status: 'Submitted'
              }
            : assignment
        )
      );

      alert('Assignment submitted successfully!');
    } catch {
      alert('Unable to submit assignment.');
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      setAssignments((prev) =>
        prev.filter((assignment) => assignment._id !== id)
      );

      alert('Assignment deleted successfully!');
    } catch {
      alert('Unable to delete assignment.');
    }
  };

  // Styles
  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f4f6fb',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      color: '#24304a'
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto'
    },
    header: {
      background: '#172554',
      color: 'white',
      padding: '30px',
      borderRadius: '14px',
      marginBottom: '25px'
    },
    heading: {
      margin: '0 0 10px',
      fontSize: '28px'
    },
    subtitle: {
      margin: 0,
      color: '#dbeafe'
    },
    backBtn: {
      marginTop: '18px',
      padding: '10px 18px',
      background: 'white',
      color: '#172554',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    tabs: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '25px'
    },
    tab: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '7px',
      cursor: 'pointer',
      fontWeight: 'bold',
      background: 'white',
      color: '#24304a'
    },
    activeTab: {
      background: '#2563eb',
      color: 'white'
    },
    section: {
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
      fontSize: '22px',
      marginTop: 0,
      marginBottom: '20px'
    },
    card: {
      border: '1px solid #e2e8f0',
      borderRadius: '9px',
      padding: '18px',
      marginBottom: '15px'
    },
    cardTitle: {
      margin: '0 0 10px',
      color: '#1e3a8a',
      fontSize: '18px'
    },
    description: {
      color: '#64748b',
      lineHeight: '1.6'
    },
    primaryBtn: {
      padding: '11px 18px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    deleteBtn: {
      padding: '9px 14px',
      background: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    submitBtn: {
      padding: '9px 14px',
      background: '#16a34a',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '10px',
      marginRight: '10px'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '14px',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      boxSizing: 'border-box',
      fontSize: '14px'
    },
    form: {
      background: '#f8fafc',
      padding: '20px',
      borderRadius: '9px',
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '7px',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    status: {
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '20px',
      background: '#fef3c7',
      color: '#92400e',
      fontSize: '13px',
      fontWeight: 'bold'
    },
    empty: {
      color: '#64748b',
      padding: '15px 0'
    }
  };

  const tabButtonStyle = (tab) => ({
    ...styles.tab,
    ...(activeTab === tab ? styles.activeTab : {})
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.heading}>Welcome, RVU Student!</h1>
          <p style={styles.subtitle}>
            Your Campus Connect Student Portal
          </p>

          <button
            style={styles.backBtn}
            onClick={onBackToHome}
          >
            Back to Main Campus View
          </button>
        </header>

        {/* Navigation Tabs */}
        <div style={styles.tabs}>
          <button
            style={tabButtonStyle('notices')}
            onClick={() => setActiveTab('notices')}
          >
            Notices & Events
          </button>

          <button
            style={tabButtonStyle('assignments')}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>

          <button
            style={tabButtonStyle('attendance')}
            onClick={() => setActiveTab('attendance')}
          >
            Track Attendance
          </button>

          <button
            style={tabButtonStyle('profile')}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

        {loading && (
          <div style={styles.section}>
            Loading portal data...
          </div>
        )}

        {error && (
          <div style={styles.section}>
            <p style={{ color: '#dc2626' }}>{error}</p>
            <button
              style={styles.primaryBtn}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Notices Tab */}
        {!loading && activeTab === 'notices' && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Notices & Events</h2>

            <button
              style={styles.primaryBtn}
              onClick={() => setShowNoticeForm(!showNoticeForm)}
            >
              {showNoticeForm ? 'Cancel' : '+ Add New Notice'}
            </button>

            {showNoticeForm && (
              <form style={styles.form} onSubmit={handleAddNotice}>
                <h3>Add Notice</h3>

                <label style={styles.label}>Notice Title</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter notice title"
                  value={noticeForm.title}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, title: e.target.value })
                  }
                  required
                />

                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.input}
                  placeholder="Enter notice description"
                  value={noticeForm.description}
                  onChange={(e) =>
                    setNoticeForm({
                      ...noticeForm,
                      description: e.target.value
                    })
                  }
                  required
                />

                <label style={styles.label}>Department</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter department"
                  value={noticeForm.department}
                  onChange={(e) =>
                    setNoticeForm({
                      ...noticeForm,
                      department: e.target.value
                    })
                  }
                  required
                />

                <label style={styles.label}>Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={noticeForm.date}
                  onChange={(e) =>
                    setNoticeForm({ ...noticeForm, date: e.target.value })
                  }
                  required
                />

                <button
                  style={styles.primaryBtn}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Save Notice'}
                </button>
              </form>
            )}

            {notices.length === 0 ? (
              <p style={styles.empty}>No notices available.</p>
            ) : (
              notices.map((notice) => (
                <div style={styles.card} key={notice._id}>
                  <h3 style={styles.cardTitle}>{notice.title}</h3>
                  <p style={styles.description}>{notice.description}</p>
                  <p><strong>Department:</strong> {notice.department}</p>
                  <p><strong>Date:</strong> {notice.date}</p>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDeleteNotice(notice._id)}
                  >
                    Remove Notice
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {/* Assignments Tab */}
        {!loading && activeTab === 'assignments' && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>My Assignments</h2>

            <button
              style={styles.primaryBtn}
              onClick={() =>
                setShowAssignmentForm(!showAssignmentForm)
              }
            >
              {showAssignmentForm ? 'Cancel' : '+ Add Assignment'}
            </button>

            {showAssignmentForm && (
              <form
                style={styles.form}
                onSubmit={handleAddAssignment}
              >
                <h3>Add Assignment</h3>

                <label style={styles.label}>Assignment Title</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter assignment title"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      title: e.target.value
                    })
                  }
                  required
                />

                <label style={styles.label}>Subject</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter subject"
                  value={assignmentForm.subject}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      subject: e.target.value
                    })
                  }
                  required
                />

                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.input}
                  placeholder="Enter assignment description"
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      description: e.target.value
                    })
                  }
                  required
                />

                <label style={styles.label}>Due Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      dueDate: e.target.value
                    })
                  }
                  required
                />

                <button
                  style={styles.primaryBtn}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Save Assignment'}
                </button>
              </form>
            )}

            {assignments.length === 0 ? (
              <p style={styles.empty}>No assignments available.</p>
            ) : (
              assignments.map((assignment) => (
                <div style={styles.card} key={assignment._id}>
                  <h3 style={styles.cardTitle}>{assignment.title}</h3>
                  <p><strong>Subject:</strong> {assignment.subject}</p>
                  <p style={styles.description}>
                    {assignment.description}
                  </p>
                  <p><strong>Due Date:</strong> {assignment.dueDate}</p>

                  <p>
                    <strong>Status: </strong>
                    <span style={styles.status}>
                      {assignment.status || 'Pending'}
                    </span>
                  </p>

                  {assignment.status !== 'Submitted' && (
                    <button
                      style={styles.submitBtn}
                      onClick={() =>
                        handleSubmitAssignment(assignment._id)
                      }
                    >
                      Submit Assignment
                    </button>
                  )}

                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      handleDeleteAssignment(assignment._id)
                    }
                  >
                    Remove Assignment
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Track Attendance</h2>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Attendance Overview</h3>
              <p><strong>Course:</strong> BSc Computer Science</p>
              <p><strong>Department:</strong> SOCSE</p>
              <p><strong>Attendance:</strong> 85%</p>

              <div
                style={{
                  width: '100%',
                  height: '12px',
                  background: '#e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: '85%',
                    height: '100%',
                    background: '#16a34a'
                  }}
                />
              </div>

              <p style={styles.description}>
                Your attendance is above the required 75%.
              </p>
            </div>
          </section>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Student Profile</h2>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Student Information</h3>
              <p><strong>Name:</strong> Bhumika R</p>
              <p><strong>USN:</strong> 1RUA24SCS0018</p>
              <p><strong>University:</strong> RV University</p>
              <p><strong>School:</strong> School of Computer Science & Engineering</p>
              <p><strong>Course:</strong> BSc Computer Science</p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
