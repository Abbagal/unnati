# Engineering Career Guide Platform

A modern, futuristic full-stack web application for engineering student career guidance with 3D animations and AI-powered features.

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **React Three Fiber** - 3D graphics and animations
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication

## Features

- 🚀 **Landing Page** - Futuristic design with 3D animations
- 🔐 **Authentication** - Login/Register system
- 🤖 **AI Chatbot** - Career guidance assistant
- 🗺️ **Roadmaps** - Personalized learning paths
- 📚 **Courses** - Engineering course catalog
- 👤 **Profile** - User management
- 📊 **Dashboard** - Progress tracking
- 📝 **Assessment** - Career aptitude test

## Project Structure

```
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   └── ...
├── backend/          # Express.js API
│   ├── src/         # Source code
│   ├── prisma/      # Database schema
│   └── ...
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials.

4. Set up database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `GET /api/courses` - Get courses
- `GET /api/roadmaps` - Get roadmaps
- `POST /api/chat` - AI chat interaction

## Development

The application runs on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Design Features

- Dark theme with neon accents (cyan, purple, pink)
- 3D animated components using Three.js
- Glass morphism effects
- Smooth animations with Framer Motion
- Responsive design
- Futuristic UI elements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License