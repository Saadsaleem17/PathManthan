import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CourseRecommendationService } from './services/courseRecommendationService';
import { CourseRecommendationRequest } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const courseService = new CourseRecommendationService();

app.post('/api/recommendations', async (req, res) => {
  try {
    const request: CourseRecommendationRequest = req.body;
    const recommendations = await courseService.getRecommendations(request);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 