import axios from 'axios';

const api = axios.create({
  baseURL:'https://recipe-sharing-app-4.onrender.com' || 'http://localhost:5000',
});

export default api;

