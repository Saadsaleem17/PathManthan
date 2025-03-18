import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'tutorial';
}

interface RoadmapStep {
  title: string;
  description: string;
  resources: Resource[];
}

interface CourseRoadmapProps {
  courseName: string;
}

const CourseRoadmap: React.FC<CourseRoadmapProps> = ({ courseName }) => {
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

  const generateRoadmap = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Create a detailed learning roadmap for ${courseName}. Format the response as a JSON array with the following structure:
      [
        {
          "title": "step title",
          "description": "step description",
          "keywords": ["keyword1", "keyword2"] // keywords for finding relevant resources
        }
      ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const roadmapData = JSON.parse(response.text());
      return roadmapData;
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw error;
    }
  };

  const fetchYouTubeResources = async (keywords: string[]) => {
    try {
      const searchQuery = keywords.join(' ');
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            q: searchQuery,
            type: 'video',
            maxResults: 3,
            key: YOUTUBE_API_KEY,
            relevanceLanguage: 'en',
            videoEmbeddable: true,
          },
        }
      );

      return response.data.items.map((item: any) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        type: 'video' as const,
      }));
    } catch (error) {
      console.error('Error fetching YouTube resources:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRoadmapAndResources = async () => {
      try {
        setLoading(true);
        setError(null);

        // Generate roadmap using Gemini
        const roadmapData = await generateRoadmap();

        // Fetch resources for each step
        const roadmapWithResources = await Promise.all(
          roadmapData.map(async (step: any) => {
            const resources = await fetchYouTubeResources(step.keywords);
            return {
              title: step.title,
              description: step.description,
              resources,
            };
          })
        );

        setRoadmap(roadmapWithResources);
      } catch (error) {
        setError('Failed to generate roadmap and resources. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapAndResources();
  }, [courseName]);

  if (loading) {
    return (
      <div className="roadmap-loading">
        <div className="loading-spinner"></div>
        <p>Generating your personalized learning roadmap...</p>
      </div>
    );
  }

  if (error) {
    return <div className="roadmap-error">{error}</div>;
  }

  return (
    <div className="roadmap-container">
      <h2 className="roadmap-title">Learning Roadmap for {courseName}</h2>
      <div className="roadmap-steps">
        {roadmap.map((step, index) => (
          <div key={index} className="roadmap-step">
            <div className="step-header">
              <div className="step-number">{index + 1}</div>
              <h3 className="step-title">{step.title}</h3>
            </div>
            <p className="step-description">{step.description}</p>
            <div className="step-resources">
              <h4>Recommended Resources:</h4>
              <ul>
                {step.resources.map((resource, resourceIndex) => (
                  <li key={resourceIndex}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRoadmap; 