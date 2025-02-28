import React from 'react';
import CourseRecommendations from './components/CourseRecommendations';
import ChatBot from './components/ChatBot';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>PathManthan</h1>
          </div>
          <nav className="header-nav">
            <a href="#features">Features</a>
            <a href="#recommendations">Courses</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h2>Discover Your Perfect Learning Path</h2>
            <p>Get personalized course recommendations powered by AI across multiple platforms</p>
          </div>
        </section>

        <section id="features" className="features-section">
          <h2>Why Choose PathManthan?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3>Personalized Recommendations</h3>
              <p>Get course suggestions tailored to your goals and skill level</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>AI-Powered Guidance</h3>
              <p>Benefit from intelligent course matching and learning path suggestions</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌐</span>
              <h3>Multi-Platform Integration</h3>
              <p>Access courses from top platforms like Udemy, Coursera, and more</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💬</span>
              <h3>24/7 AI Assistant</h3>
              <p>Get instant help and guidance whenever you need it</p>
            </div>
          </div>
        </section>

        <section id="recommendations" className="recommendations-section">
          <CourseRecommendations />
        </section>

        <section id="about" className="about-section">
          <h2>About PathManthan</h2>
          <p>PathManthan combines the power of artificial intelligence with comprehensive course data to help you find the perfect learning path. Whether you're starting your journey or advancing your skills, we're here to guide you every step of the way.</p>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PathManthan</h3>
            <p>Your AI-Powered Learning Journey Guide</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#features">Features</a>
            <a href="#recommendations">Courses</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/rajmridul/PathManthan" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 PathManthan. All rights reserved.</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default App; 