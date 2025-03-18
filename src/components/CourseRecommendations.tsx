import React, { useState } from 'react';
import axios from 'axios';
import { Course, CourseRecommendationResponse } from '../backend/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <div className="course-card">
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    <div className="course-details">
      <span className="platform">{course.platform}</span>
      {course.price && <span className="price">${course.price}</span>}
      <span className="duration">{course.duration}</span>
    </div>
    <div className="skills">
      {course.skills.map((skill, index) => (
        <span key={index} className="skill-tag">{skill}</span>
      ))}
    </div>
    <a href={course.url} target="_blank" rel="noopener noreferrer" className="course-link">
      View Course
    </a>
  </div>
);

const CourseRecommendations: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['youtube', 'udemy', 'coursera', 'linkedin']);
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [recommendations, setRecommendations] = useState<CourseRecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/recommendations`, {
        topic,
        platform: platforms,
        maxPrice
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-recommendations">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to learn?"
            required
          />
        </div>

        <div className="form-group">
          <label>Platforms:</label>
          {['youtube', 'udemy', 'coursera', 'linkedin'].map((platform) => (
            <label key={platform} className="checkbox-label">
              <input
                type="checkbox"
                checked={platforms.includes(platform)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPlatforms([...platforms, platform]);
                  } else {
                    setPlatforms(platforms.filter(p => p !== platform));
                  }
                }}
              />
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </label>
          ))}
        </div>



        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find Courses'}
        </button>
      </form>

      {recommendations && (
        <div className="recommendations-results">
          <div className="trending-section">
            <h2>Trending Topics</h2>
            <div className="trending-topics">
              {recommendations.trending_topics.map((topic, index) => (
                <span key={index} className="trending-tag">{topic}</span>
              ))}
            </div>
          </div>

          <div className="career-insights">
            <h2>Career Insights</h2>
            <div className="insights-container">
              <div className="skills-section">
                <h3>In-Demand Skills</h3>
                <ul>
                  {recommendations.career_insights.in_demand_skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="trends-section">
                <h3>Job Market Trends</h3>
                <ul>
                  {recommendations.career_insights.job_market_trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="courses-section">
            <h2>Recommended Courses</h2>
            <div className="courses-grid">
              {recommendations.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRecommendations; 