# AI Skill Check Generator

This is a Next.js application that generates skill check questions using Google's Generative AI (Gemini). It includes user authentication, a dashboard, and result tracking.

## Features

- **User Authentication**: Register and login functionality with secure password hashing.
- **AI Question Generation**: Generates questions based on topics using Google Gemini AI.
- **Dashboard**: View past results and track progress.
- **Admin Role**: Special access for admin users.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

1. Create a `.env.local` file in the root directory.
2. Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs linter.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-glass-ui
- **AI**: Google Generative AI SDK
- **Validation**: Zod

## admin password 1234!