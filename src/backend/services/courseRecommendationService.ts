import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { Course, CourseRecommendationRequest, CourseRecommendationResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export class CourseRecommendationService {
  private async getYouTubeCourses(topic: string): Promise<Course[]> {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: `${topic} course tutorial`,
          type: 'video',
          maxResults: 5,
          key: process.env.YOUTUBE_API_KEY
        }
      });

      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        platform: 'youtube',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        description: item.snippet.description,
        skills: [],
        duration: 'varies'
      }));
    } catch (error) {
      console.error('Error fetching YouTube courses:', error);
      return [];
    }
  }

  private async getUdemyCourses(topic: string): Promise<Course[]> {
    // Note: Udemy API requires client credentials
    // This is a placeholder for the actual implementation
    return [];
  }

  private async getCourseraCourses(topic: string): Promise<Course[]> {
    // Note: Coursera API requires partner credentials
    // This is a placeholder for the actual implementation
    return [];
  }

  private async getLinkedInCourses(topic: string): Promise<Course[]> {
    // Note: LinkedIn Learning API requires partner credentials
    // This is a placeholder for the actual implementation
    return [];
  }

  private async getGeminiInsights(topic: string): Promise<{
    trending_topics: string[];
    career_insights: { in_demand_skills: string[]; job_market_trends: string[] };
  }> {
    try {
      const prompt = `Analyze the following topic: "${topic}"
      1. List 5 trending related topics that are currently in-demand in the job market
      2. List 5 specific skills that employers are looking for related to this topic
      3. List 3 job market trends related to this topic
      Format the response as JSON with keys: trending_topics, in_demand_skills, job_market_trends`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      try {
        const parsedResponse = JSON.parse(text);
        return {
          trending_topics: parsedResponse.trending_topics || [],
          career_insights: {
            in_demand_skills: parsedResponse.in_demand_skills || [],
            job_market_trends: parsedResponse.job_market_trends || []
          }
        };
      } catch (error) {
        console.error('Error parsing Gemini response:', error);
        return {
          trending_topics: [],
          career_insights: {
            in_demand_skills: [],
            job_market_trends: []
          }
        };
      }
    } catch (error) {
      console.error('Error getting Gemini insights:', error);
      return {
        trending_topics: [],
        career_insights: {
          in_demand_skills: [],
          job_market_trends: []
        }
      };
    }
  }

  public async getRecommendations(request: CourseRecommendationRequest): Promise<CourseRecommendationResponse> {
    const { topic, platform = ['youtube', 'udemy', 'coursera', 'linkedin'], maxPrice } = request;
    
    const coursesPromises: Promise<Course[]>[] = [];
    
    if (platform.includes('youtube')) {
      coursesPromises.push(this.getYouTubeCourses(topic));
    }
    if (platform.includes('udemy')) {
      coursesPromises.push(this.getUdemyCourses(topic));
    }
    if (platform.includes('coursera')) {
      coursesPromises.push(this.getCourseraCourses(topic));
    }
    if (platform.includes('linkedin')) {
      coursesPromises.push(this.getLinkedInCourses(topic));
    }

    const [courses, insights] = await Promise.all([
      Promise.all(coursesPromises).then(results => results.flat()),
      this.getGeminiInsights(topic)
    ]);

    // Filter by maxPrice if specified
    const filteredCourses = maxPrice
      ? courses.filter(course => !course.price || course.price <= maxPrice)
      : courses;

    return {
      courses: filteredCourses,
      trending_topics: insights.trending_topics,
      career_insights: insights.career_insights
    };
  }
} 