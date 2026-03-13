import React, { useState } from 'react';
import axios from 'axios';
import './Recommendation.css';

function Recommendations() {
  const [history, setHistory] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loading state

  const getRecommendations = async () => {
    setLoading(true); // ✅ start loading
    setRecommendations('');
    try {
      const res = await axios.post('http://localhost:5000/api/ai/recommend', {
        userHistory: history,
      });
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="recommend-container">
      <h2>AI Book Recommendations</h2>
      <textarea
        rows={4}
        className="recommend-textarea"
        value={history}
        onChange={(e) => setHistory(e.target.value)}
        placeholder="Enter favorite books (e.g., Harry Potter, Atomic Habits)"
      />
      <br />
      <button onClick={getRecommendations} className="recommend-button">
        {loading ? 'Thinking...' : 'Get Recommendations'}
      </button>

      {loading && <div className="spinner">⏳ Loading recommendations...</div>}

      {recommendations && (
        <div className="recommend-result">
          <h3>Recommended Books:</h3>
          <ul className="recommend-list">
  {recommendations.split('\n').map((rec, idx) => (
    <li key={idx}>{rec}</li>
  ))}
</ul>

        </div>
      )}
    </div>
  );
}

export default Recommendations;
