import axios from 'axios';

// Create an instance of axios with the base URL of our backend
const API = axios.create({
  baseURL: 'http://localhost:5001/api'
});

// Define the function to handle user registration
export const registerUser = (userData) => API.post('/auth/register', userData);

// We will add the login function here later
export const loginUser = (userData) => API.post('/auth/login', userData);

export default API;