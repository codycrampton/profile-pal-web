
# Profiles App

A web application for managing profiles with Docker deployment support.

## Features

- Profile management (create, read, update, delete)
- Search and filter profiles
- Responsive design
- Dark/light mode

## Technical Stack

- React + TypeScript
- Tailwind CSS & Shadcn UI
- Vite for building
- Docker for containerization

## Deployment Instructions

### Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Access the application at `http://localhost:3005`

The application will be available at `http://localhost:3005` and can be added to Portainer stacks for easy management.

## Data Storage

The profile data is stored in the repository in the `public/profiles-data.json` file. This file serves as the main data source for the application. When running the application, the data is loaded from this file and cached in the browser's local storage.

