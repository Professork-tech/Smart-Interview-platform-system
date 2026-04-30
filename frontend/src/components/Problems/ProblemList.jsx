import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Search, Filter, Play, CheckCircle } from 'lucide-react';
import './ProblemList.css';

const ProblemList = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, cRes] = await Promise.all([
          api.get('/questions'),
          api.get('/categories')
        ]);
        setQuestions(qRes.data);
        setCategories(cRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = selectedDifficulty ? q.difficulty === selectedDifficulty : true;
    const matchesCat = selectedCategory ? q.category.id.toString() === selectedCategory : true;
    return matchesSearch && matchesDiff && matchesCat;
  });

  if (loading) {
    return <div className="auth-container"><div className="text-gradient">Loading Problems...</div></div>;
  }

  return (
    <div className="problems-container">
      <div className="problems-header glass-card">
        <div>
          <h2 className="text-gradient">Problem Repository</h2>
          <p className="text-muted mt-2">Practice coding problems to enhance your skills.</p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="filters-section glass-card mt-4">
        <div className="search-box form-group mb-0" style={{ flex: 1, margin: 0 }}>
          <div className="flex items-center" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select 
            className="form-input select-input" 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div className="filter-group">
          <select 
            className="form-input select-input" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Topics</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="problems-list mt-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map(q => (
            <div key={q.id} className="problem-card glass-card">
              <div className="problem-info">
                <h3>{q.title}</h3>
                <div className="problem-tags mt-2">
                  <span className={`difficulty-badge diff-${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                  <span className="topic-badge">{q.category.name}</span>
                </div>
              </div>
              <div className="problem-action">
                <Link to={`/problems/${q.id}`} className="btn btn-primary">
                  <Play size={16} /> Solve Challenge
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card text-center" style={{ padding: '3rem' }}>
            <p className="text-muted">No problems found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
