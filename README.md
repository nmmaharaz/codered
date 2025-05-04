# Code Red Message

A modern developer forum and collaboration platform built with Next.js that enables developers to share knowledge, ask questions, and collaborate in real-time.

🌐 **Live Demo**: https://dev-message.onrender.com

## Features

- 🔐 **Authentication System**
  - Secure user registration and login
  - Password reset functionality
  - Profile management with customizable avatars
  - Social authentication options

- 💬 **Developer Forum**
  - Create and share technical blog posts
  - Ask and answer programming questions
  - Upvote/downvote posts and answers
  - Comment on posts and discussions
  - Rich text formatting with code snippets
  - Image upload support

- 👥 **Real-time Communication**
  - One-on-one messaging
  - Group chat functionality
  - Real-time notifications
  - Online/offline status indicators
  - Message history and search

- 👨‍💻 **Code Collaboration**
  - Integrated Monaco code editor
  - Syntax highlighting for multiple languages
  - Code formatting and linting
  - Share code snippets in messages
  - Collaborative code editing

- 🎨 **Modern UI**
  - Clean and intuitive interface
  - Built with Tailwind CSS
  - Fully responsive design
  - Beautiful animations and transitions
  - Dark/Light mode support
  - Mobile-friendly layout

## Tech Stack

- **Frontend**
  - Next.js 15.3.0
  - React 19
  - Tailwind CSS
  - Radix UI Components
  - Tiptap Editor
  - Socket.IO Client

- **Backend**
  - Next.js API Routes
  - MongoDB
  - NextAuth.js
  - Nodemailer

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd code-red-message
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:
```env
MONGODB_URI= # MongoDB Connection String
DB_NAME= # Database Name
NEXTAUTH_URL= # Application URL for NextAuth Authentication
NEXT_PUBLIC_IMGBB_API_KEY= # API Key for Image Upload (IMGBB)
NEXTAUTH_SECRET= # Secret Key for NextAuth Authentication
GOOGLE_CLIENT_ID= # Google OAuth Client ID
GOOGLE_CLIENT_SECRET= # Google OAuth Client Secret
GITHUB_ID= # GitHub OAuth Client ID
GITHUB_SECRET= # GitHub OAuth Client Secret
EMAIL_USER= # Email Address for Sending Emails
EMAIL_PASS= # Email Password or App-Specific Password
NEXT_PUBLIC_CHAT_EXPRESS_SERVER= # Chat Server URL (Express.js)
GEMINI_API_KEY= # API Key for Gemini Service
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
code-red-message/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (message)/         # Message and chat routes
│   ├── (LogInAndRegister)/# Authentication routes
│   ├── code-editor/       # Code editor feature
│   ├── qus-ans/          # Question and answer section
│   ├── profile/          # User profile management
│   └── ...
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
├── messages/              # Message-related components
├── Providers/             # Context providers
└── public/                # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
