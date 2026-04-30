import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Activity, Target, Code, LogOut, ArrowRight, Lightbulb, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subRes, recRes] = await Promise.all([
          api.get('/users/me/submissions'),
          api.get('/users/me/recommendations')
        ]);
        setSubmissions(subRes.data);
        setRecommendations(recRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <div className="auth-container"><div className="text-gradient">Loading Dashboard...</div></div>;
  }

  // Calculate Stats
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(s => s.status === 'ACCEPTED').length;
  const accuracy = totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0;

  // Chart Data Preparation (Topic-wise submissions)
  const topicCounts = {};
  submissions.forEach(sub => {
    const topic = sub.question.category.name;
    if (!topicCounts[topic]) {
      topicCounts[topic] = { total: 0, accepted: 0 };
    }
    topicCounts[topic].total++;
    if (sub.status === 'ACCEPTED') topicCounts[topic].accepted++;
  });

  const topics = Object.keys(topicCounts);
  
  const barChartData = {
    labels: topics.length > 0 ? topics : ['No Data'],
    datasets: [
      {
        label: 'Attempted',
        data: topics.length > 0 ? topics.map(t => topicCounts[t].total) : [0],
        backgroundColor: 'rgba(236, 72, 153, 0.5)',
        borderColor: '#ec4899',
        borderWidth: 1,
      },
      {
        label: 'Accepted',
        data: topics.length > 0 ? topics.map(t => topicCounts[t].accepted) : [0],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: '#6366f1',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#f8fafc' } },
      title: { display: true, text: 'Topic Performance', color: '#f8fafc' }
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } }
    }
  };

  const pieChartData = {
    labels: ['Accepted', 'Failed/Errors'],
    datasets: [
      {
        data: totalSubmissions > 0 ? [acceptedSubmissions, totalSubmissions - acceptedSubmissions] : [0, 1],
        backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 1,
      }
    ]
  };

  const pieOptions = {
    plugins: { legend: { labels: { color: '#f8fafc' } } }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav glass-card">
        <h2 className="text-gradient">Smart Interview Prep</h2>
        <div className="nav-actions">
          <Link to="/problems" className="btn btn-primary btn-sm">Problem List</Link>
          <span className="user-badge">
            <User size={16} /> {user?.username}
          </span>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-grid mt-4">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card glass-card">
            <div className="stat-icon"><Activity size={24} color="#ec4899" /></div>
            <div className="stat-info">
              <p className="text-muted">Total Attempts</p>
              <h3>{totalSubmissions}</h3>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon"><Target size={24} color="#10b981" /></div>
            <div className="stat-info">
              <p className="text-muted">Accuracy</p>
              <h3>{accuracy}%</h3>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon"><Code size={24} color="#6366f1" /></div>
            <div className="stat-info">
              <p className="text-muted">Solved</p>
              <h3>{acceptedSubmissions}</h3>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="charts-row mt-4">
          <div className="chart-container glass-card">
            <Bar data={barChartData} options={chartOptions} />
          </div>
          <div className="chart-container glass-card pie-container">
             <h4 style={{textAlign:'center', marginBottom:'1rem', color:'#f8fafc'}}>Overall Accuracy</h4>
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="recommendations-section mt-4 glass-card">
          <div className="section-header">
            <h3><Lightbulb size={20} color="#f59e0b" style={{display:'inline', marginRight:'8px'}}/> AI Recommendations</h3>
            <p className="text-muted">Targeted practice based on your weak areas.</p>
          </div>
          
          <div className="recommendation-list mt-4">
            {recommendations.length > 0 ? (
              recommendations.map(question => (
                <div key={question.id} className="rec-card">
                  <div>
                    <h4>{question.title}</h4>
                    <span className={`difficulty-badge diff-${question.difficulty.toLowerCase()}`}>
                      {question.difficulty}
                    </span>
                    <span className="topic-badge">{question.category.name}</span>
                  </div>
                  <Link to={`/problems/${question.id}`} className="btn btn-primary btn-sm">
                    Solve <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-muted">Keep practicing! We need more data to recommend problems.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
