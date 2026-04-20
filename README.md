# SnippetVault

A modern, full-stack code snippet management application that allows developers to store, organize, share, and discover code snippets with syntax highlighting and social features.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Database Models](#database-models)
- [Contributing](#contributing)

##  Overview

SnippetVault is a comprehensive platform for managing code snippets with features like:
- User authentication and authorization
- Public and private snippet visibility
- Syntax highlighting for multiple programming languages
- Like and favorite functionality
- Search and filter capabilities
- Responsive design with modern UI/UX

##  Features

### User Features
- **Authentication**: Secure signup/login with JWT tokens
- **Snippet Management**: Create, edit, delete, and organize code snippets
- **Visibility Control**: Set snippets as public or private
- **Social Interactions**: Like and favorite snippets
- **Search & Filter**: Find snippets by title, description, or language
- **Syntax Highlighting**: Beautiful code display with react-syntax-highlighter
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Swagger API documentation
- Modern React with hooks and context API
- Framer Motion animations
- Tailwind CSS styling

##  Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose v9.2.2
- **Authentication**: JWT (jsonwebtoken v9.0.3) + bcryptjs v3.0.3
- **API Documentation**: Swagger (swagger-jsdoc v6.2.8, swagger-ui-express v5.0.1)
- **CORS**: cors v2.8.6
- **Environment**: dotenv v17.3.1

### Frontend
- **Framework**: React v19.2.0
- **Build Tool**: Vite v7.3.1
- **Routing**: React Router DOM v7.13.0
- **Styling**: Tailwind CSS v4.2.0
- **Animations**: Framer Motion v12.34.3
- **HTTP Client**: Axios v1.13.5
- **Icons**: Lucide React v0.575.0
- **Code Highlighting**: react-syntax-highlighter v16.1.0
- **Lottie Animations**: @lottiefiles/dotlottie-react v0.18.3

##  Project Structure

```
snippetvault/
├── backend/                    # Backend API server
│   ├── config/                # Configuration files
│   │   ├── db.js             # MongoDB connection
│   │   └── swagger.js        # Swagger API documentation setup
│   ├── controllers/          # Request handlers
│   │   ├── authController.js # Authentication logic
│   │   ├── snippetController.js # Snippet CRUD operations
│   │   └── syntaxController.js  # Syntax management
│   ├── middleware/           # Custom middleware
│   │   └── authMiddleware.js # JWT authentication middleware
│   ├── models/               # Mongoose schemas
│   │   ├── User.js          # User model
│   │   ├── Snippet.js       # Snippet model
│   │   └── Syntax.js        # Syntax/Language model
│   ├── routes/              # API routes
│   │   ├── authRoutes.js    # Authentication endpoints
│   │   ├── snippetRoutes.js # Snippet endpoints
│   │   └── syntaxRoutes.js  # Syntax endpoints
│   ├── scripts/             # Utility scripts
│   │   └── seed.js         # Database seeding
│   ├── .env                # Environment variables
│   ├── .gitignore          # Git ignore rules
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server entry point
│
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   │   ├── DashboardHero.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── SnippetCard.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── explore/    # Explore page components
│   │   │   │   └── ExploreSnippetCard.jsx
│   │   │   ├── snippets/   # Snippet-related components
│   │   │   │   └── MockEditor.jsx
│   │   │   ├── Card.tsx    # Generic card component
│   │   │   └── Navbar.jsx  # Navigation bar
│   │   ├── constants/      # Application constants
│   │   │   └── languages.js # Programming language definitions
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   └── SnippetContext.jsx # Snippet state management
│   │   ├── pages/          # Page components
│   │   │   ├── CreateSnippetPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── EditSnippetPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── SnippetDetailPage.jsx
│   │   │   └── SnippetSearchPage.jsx
│   │   ├── public/         # Static assets
│   │   │   ├── backgroundImage.png
│   │   │   └── image.png
│   │   ├── services/       # API service layer
│   │   │   └── api.js     # Axios configuration
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Frontend environment variables
│   ├── .gitignore         # Git ignore rules
│   ├── eslint.config.js   # ESLint configuration
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── README.md          # Frontend documentation
│
├── node_modules/          # Root dependencies
├── package.json           # Root package configuration
├── package-lock.json      # Dependency lock file
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd snippetvault
```

2. **Install root dependencies**
```bash
npm install
```

3. **Setup Backend**
```bash
cd backend
npm install
```

4. **Setup Frontend**
```bash
cd frontend
npm install
```


5. **Seed the Database (Optional)**
```bash
cd backend
npm run seed
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Documentation: `http://localhost:5000/api-docs`

##  API Documentation

The API is documented using Swagger/OpenAPI. Once the backend server is running, visit:
```
http://localhost:5000/api-docs
```

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### Snippets
- `GET /api/snippets` - Get all public snippets
- `GET /api/snippets/:id` - Get snippet by ID
- `POST /api/snippets` - Create new snippet (protected)
- `PUT /api/snippets/:id` - Update snippet (protected)
- `DELETE /api/snippets/:id` - Delete snippet (protected)
- `PUT /api/snippets/:id/like` - Like/unlike snippet (protected)
- `PUT /api/snippets/:id/favorite` - Favorite/unfavorite snippet (protected)
- `GET /api/snippets/user/:userId` - Get user's snippets
- `GET /api/snippets/favorites` - Get user's favorite snippets (protected)

#### Syntaxes
- `GET /api/syntaxes` - Get all syntax definitions
- `POST /api/syntaxes` - Create syntax definition (protected)

## 📜 Available Scripts

### Backend
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run seed    # Seed database with sample data
```

### Frontend
```bash
npm run dev     # Start Vite development server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## 🗄 Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Snippet Model
```javascript
{
  title: String (required, max 100 chars),
  code: String (required),
  language: String (required),
  syntax: ObjectId (ref: Syntax, optional),
  syntaxCode: String (optional),
  description: String (max 500 chars),
  status: String (enum: ['public', 'private'], default: 'public'),
  likes: Number (default: 0),
  likedBy: [ObjectId] (ref: User),
  favoritedBy: [ObjectId] (ref: User),
  user: ObjectId (ref: User, required),
  createdAt: Date
}
```

### Syntax Model
```javascript
{
  name: String (required),
  code: String (required),
  // Additional syntax-related fields
}
```

## Key Features Implementation

### Authentication Flow
1. User registers/logs in
2. Backend generates JWT token
3. Token stored in localStorage
4. Token sent with protected requests via Authorization header
5. Backend middleware validates token

### Snippet Visibility
- **Public**: Visible to all users in explore/search pages
- **Private**: Only visible to the snippet owner

### Like System
- Users can like/unlike snippets
- Like count displayed on snippet cards
- Liked snippets tracked in `likedBy` array

### Favorite System
- Users can favorite snippets for quick access
- Favorites accessible from dedicated page
- Tracked in `favoritedBy` array

##  Acknowledgments

- React and Vite communities
- MongoDB and Mongoose documentation
- Tailwind CSS team
- All open-source contributors

--- 
