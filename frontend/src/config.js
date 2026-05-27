// API Configuration
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://spylink-backend.onrender.com/api' 
  : 'http://127.0.0.1:8000/api';