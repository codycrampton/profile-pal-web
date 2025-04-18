// Define API configuration that can be adjusted based on environment
const API_CONFIG = {
  // In development, connect to localhost
  // In production (Docker), this will be replaced with profiles-api:3000
  endpoint: 'http://localhost:3000',
};

export default API_CONFIG;
