import axios from 'axios';

// Prefer environment base URL, fallback to localhost in dev
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
