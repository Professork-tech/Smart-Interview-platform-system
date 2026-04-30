import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../api/axiosConfig';
import { ArrowLeft, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './CodeEditor.css';

const CodeEditor = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await api.get(`/questions/${id}`);
        setQuestion(res.data);
        setCode(res.data.starterCode || '// Write your code here...');
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.post(`/questions/${id}/submit`, {
        code,
        language
      });
      setResult(res.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      setResult({ status: 'ERROR', message: 'Failed to submit code.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="auth-container"><div className="text-gradient">Loading Editor...</div></div>;
  if (!question) return <div className="auth-container"><div className="text-gradient">Question not found.</div></div>;

  return (
    <div className="editor-layout">
      {/* Left Panel: Problem Description */}
      <div className="problem-panel glass-card">
        <div className="panel-header">
          <Link to="/problems" className="back-link text-muted">
            <ArrowLeft size={16} /> Back to List
          </Link>
          <div className="mt-2">
            <h2>{question.title}</h2>
            <div className="problem-tags mt-2">
              <span className={`difficulty-badge diff-${question.difficulty.toLowerCase()}`}>
                {question.difficulty}
              </span>
              <span className="topic-badge">{question.category.name}</span>
            </div>
          </div>
        </div>
        
        <div className="panel-content custom-scrollbar">
          <div className="description-text mt-4">
            {question.description}
          </div>
          
          {question.constraints && (
            <div className="constraints-section mt-4">
              <h4>Constraints:</h4>
              <pre className="constraint-box mt-2">{question.constraints}</pre>
            </div>
          )}

          {question.examples && (
            <div className="examples-section mt-4">
              <h4>Examples:</h4>
              <pre className="example-box mt-2">{question.examples}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="code-panel glass-card">
        <div className="editor-toolbar">
          <select 
            className="form-input select-input" 
            style={{ width: '150px', margin: 0, padding: '0.4rem 1rem' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleSubmit} 
            disabled={submitting}
          >
            {submitting ? 'Evaluating...' : <><Play size={14} /> Submit Code</>}
          </button>
        </div>

        <div className="monaco-container">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'Consolas, monospace',
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Output Console */}
        {result && (
          <div className="output-console custom-scrollbar">
            <div className={`status-header result-${result.status.toLowerCase()}`}>
              {result.status === 'ACCEPTED' && <CheckCircle size={20} />}
              {result.status === 'WRONG_ANSWER' && <XCircle size={20} />}
              {(result.status !== 'ACCEPTED' && result.status !== 'WRONG_ANSWER') && <AlertCircle size={20} />}
              <h3 style={{ marginLeft: '8px' }}>{result.status.replace(/_/g, ' ')}</h3>
            </div>
            
            {result.status === 'ACCEPTED' && (
              <div className="stats-details mt-2">
                <p>Execution Time: <span className="highlight">{result.executionTimeMs} ms</span></p>
                <p>Memory Used: <span className="highlight">{result.memoryUsedKb} KB</span></p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
