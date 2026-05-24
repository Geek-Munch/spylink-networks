// API configuration
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.up.railway.app/api'  // Update after deployment
  : 'http://127.0.0.1:8000/api';