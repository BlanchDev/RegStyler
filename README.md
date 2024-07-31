# RegStyler

RegStyler is a powerful web application designed to help users customize and optimize their Windows registry settings with ease. Built with React and leveraging modern web technologies, RegStyler offers a user-friendly interface for managing registry tweaks, creating custom packages, and sharing optimizations with the community.

[https://regstyler.blanch.dev](https://regstyler.blanch.dev)

## Features

- **Custom Registry Tweaks**: Create and manage your own registry optimizations.
- **Package Management**: Download and use pre-made optimization packages.
- **Community Sharing**: Share your custom packages with other users.
- **User Authentication**: Secure login and user management system.
- **Real-time Updates**: Live updates for package changes and user interactions.

## Technologies Used

- React
- Vite
- Firebase (Authentication and Database)
- SCSS for styling
- React Router for navigation
- Framer Motion for animations
- PHP for backend (but not shared code)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or Bun package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BlanchDev/RegStyler.git
   ```

2. Navigate to the project directory:

   ```bash
   # You are already in the project directory or
   cd regstyler
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or if using Bun:

   ```bash
   bun install
   ```

4. Create a `.env` file in the root directory and add your Firebase configuration:

   ```env
   VITE_API_KEY=
   VITE_AUTH_DOMAIN=
   VITE_PROJECT_ID=
   VITE_STORAGE_BUCKET=
   VITE_MESSAGING_SENDER_ID=
   VITE_APP_ID=
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   or with Bun:

   ```bash
   bun run dev
   ```

6. Open your browser and navigate to `http://localhost:5173` to view the application.
