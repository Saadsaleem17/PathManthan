import React from 'react';
import CourseRoadmap from './CourseRoadmap';

interface CourseDetailsProps {
  courseName: string;
  // ... other props
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseName }) => {
  return (
    <div className="course-details">
      <h1>{courseName}</h1>
      {/* ... other course details ... */}
      
      <CourseRoadmap courseName={courseName} />
    </div>
  );
};

export default CourseDetails; 