
# Profiles App

A web application for managing profiles with GitHub integration and Docker deployment support.

## Features

- Profile management (create, read, update, delete)
- GitHub repository integration for data persistence
- Search and filter profiles
- Responsive design
- Dark/light mode
- Docker containerization for easy deployment

## Technical Stack

- React + TypeScript
- Tailwind CSS & Shadcn UI
- Vite for building
- Docker for containerization

## Setup Instructions

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/profiles-app.git
   cd profiles-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### GitHub Integration Setup

To enable live synchronization with GitHub (for production use):

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with `repo` permissions
   - Copy the token for the next step

2. Configure the GitHub repository in the API service:
   - Open `src/services/api.ts`
   - Update the `GITHUB_API_URL` constant with your repository details:
     ```javascript
     const GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO_NAME/contents/public/profiles-data.json';
     ```
   
3. Implement the GitHub API integration by uncommenting and configuring the code in the `persistChangesToRepository` function:
   - Add your GitHub token to the request headers
   - If deploying, it's recommended to store this token as an environment variable

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Access the application at `http://localhost:3005`

The application will be available at `http://localhost:3005` and can be added to Portainer stacks for easy management.

## Data Storage

The profile data is stored in the repository in the `public/profiles-data.json` file. This file serves as the main data source for the application. When running the application:

1. The data is loaded from this file on application startup
2. Changes (adding, editing, deleting profiles) update the local storage cache
3. When properly configured, changes are pushed back to the GitHub repository

## Production Deployment Considerations

For a fully functional production deployment:

1. **Server Backend**: Implement a simple backend service that handles GitHub API calls securely, keeping your GitHub token secure
2. **Webhook Integration**: Set up GitHub webhooks to keep the app in sync with repository changes
3. **Environment Variables**: Use environment variables for sensitive information like GitHub tokens
4. **HTTPS**: Configure SSL/TLS for secure communication
5. **Automated Deployment**: Set up CI/CD pipelines for automated testing and deployment

## License

MIT
