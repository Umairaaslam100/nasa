// API configuration for development and production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, use relative URLs since frontend and backend are served from same domain
  : 'http://localhost:5000'; // In development, use localhost

export default API_BASE_URL; 