import React from 'react';
import CourseRecommendations from './components/CourseRecommendations';
import './styles/CourseRecommendations.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Course Recommendations</h1>
        <p>Find the best courses across multiple platforms</p>
      </header>
      <main>
        <CourseRecommendations />
      </main>
      <footer className="app-footer">
        <p>Powered by AI - Get personalized course recommendations from multiple platforms</p>
      </footer>
    </div>
  );
};

export default App; 