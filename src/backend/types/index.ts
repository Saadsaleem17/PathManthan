export interface Course {
  id: string;
  title: string;
  platform: 'youtube' | 'udemy' | 'coursera' | 'linkedin';
  url: string;
  description: string;
  rating?: number;
  price?: number;
  trending_score?: number;
  skills: string[];
  duration: string;
}

export interface CourseRecommendationRequest {
  topic: string;
  platform?: string[];
  maxPrice?: number;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CourseRecommendationResponse {
  courses: Course[];
  trending_topics: string[];
  career_insights: {
    in_demand_skills: string[];
    job_market_trends: string[];
  };
} 