
// Define API configuration that can be adjusted based on environment
const API_CONFIG = {
  // In development, connect to localhost
  // In production (Docker), this will be replaced with profiles-api:3000
  endpoint: 'http://localhost:3000',
  
  // Notion API configuration
  notion: {
    databaseId: '1d9b1628346f807196e9d5375dda4eab',
    apiKey: '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'
  }
};

export default API_CONFIG;
