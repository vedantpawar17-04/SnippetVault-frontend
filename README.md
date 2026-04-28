# SnippetVault

SnippetVault is a modern, full-stack code snippet manager for storing, organizing, and discovering code snippets with syntax highlighting and social/workflow features.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Data Models](#data-models)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Overview

SnippetVault helps you manage snippets end-to-end:
- Create/edit/delete snippets with language + syntax highlighting
- Run AI Review on snippet drafts before saving
- Unlock AI Fix suggestions only when review finds issues
- Keep snippets public or private
- Search, filter, and sort snippets (including tag filtering)
- Save snippets to favorites and collections
- Track changes via version history and restore older versions

## Features

### User Features
- **Authentication**: JWT-based signup/login
- **Snippets**: Create, edit, delete, and view snippets with syntax highlighting
- **AI Review**: Review draft code + syntax examples with Gemini before saving
- **AI Fix Suggestions**: Generate corrected code and corrected syntax examples when review finds bugs
- **Tags**: Add tags to snippets and filter/search by tags
- **Collections**: Create collections, add snippets to collections, and remove them later
- **Favorites**: Favorite snippets for quick access
- **Likes**: Like public snippets
- **Version History**: View previous versions of your snippets and restore a version
- **Share Links**: Share public snippets via a link (private snippets cannot be shared)

### Technical Features
- REST API with Express + MongoDB (Mongoose)
- JWT auth middleware
- Gemini-powered draft review and code-fix suggestions
- Swagger/OpenAPI docs at `http://localhost:5000/api-docs`
- React (Vite) frontend with Context API
- Tailwind CSS + Framer Motion UI polish

## Tech Stack

### Backend
- Node.js, Express, MongoDB, Mongoose
- JWT (`jsonwebtoken`) + password hashing (`bcryptjs`)
- Google Gen AI SDK (`@google/genai`)
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)

### Frontend
- React, Vite, React Router
- Tailwind CSS, Framer Motion
- Axios, Lucide icons
- `react-syntax-highlighter` (code highlighting)
- Recharts (dashboard charts)

## Project Structure

```text
SnippetVault/
  backend/
    config/
    controllers/
    middleware/
    models/
      Collection.js
      Snippet.js
      Syntax.js
      User.js
      Version.js
    routes/
      authRoutes.js
      collectionRoutes.js
      snippetRoutes.js
      syntaxRoutes.js
    scripts/
      seed.js
    .env
    package.json
    server.js
  frontend/
    src/
      components/
      constants/
      context/
      pages/
      services/
      App.jsx
      main.jsx
      index.css
    .env
    package.json
    vite.config.js
    README.md
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- MongoDB (local or Atlas)
- npm

### Installation

1. **Clone**
```bash
git clone <repository-url>
cd SnippetVault
```

2. **Backend dependencies**
```bash
cd backend
npm install
```

3. **Frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the App (Dev)

Run these in two separate terminals.

1. **Start backend**
```bash
cd backend
npm run dev
```
Backend: `http://localhost:5000`

2. **Start frontend**
```bash
cd frontend
npm run dev
```
Frontend: `http://localhost:5173`

3. **Swagger docs**
- `http://localhost:5000/api-docs`

## AI Review Flow

Create and edit pages now use a gated AI flow:

1. Add title, language, code, and optional syntax example
2. Click `AI Review`
3. If the latest reviewed draft is bug-free, save is enabled
4. If review finds issues, save stays disabled and `Suggest Fix` appears in the AI review card
5. Apply the suggested fix, then run `AI Review` again until the draft is bug-free
6. Save the snippet

The page automatically scrolls to the AI review result after each review completes.

## Environment Variables

### Backend (`backend/.env`)
- `PORT` (default: `5000`)
- `MONGO_URI` (example: `mongodb://localhost:27017/SnippetVault`)
- `JWT_SECRET` (set your own secret for real deployments)
- `GEMINI_API_KEY` (required for AI review/fix features)
- `GEMINI_MODEL` (optional; default: `gemini-2.5-flash`)

### Frontend (`frontend/.env`)
- `VITE_API_URL` (example: `http://localhost:5000/api`)

## API Documentation

Swagger is available at `http://localhost:5000/api-docs` when the backend is running.

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Snippets
- `GET /api/snippets` (public, paginated)
  - Query params: `q`, `language`, `tags` (comma-separated), `status`, `sort`, `page`, `limit`
- `GET /api/snippets/:id`
- `POST /api/snippets` (protected)
- `PUT /api/snippets/:id` (protected; stores a version before updating)
- `DELETE /api/snippets/:id` (protected)
- `GET /api/snippets/my` (protected)
- `GET /api/snippets/favorites` (protected)
- `POST /api/snippets/review` (protected; AI review on draft code before save)
- `POST /api/snippets/assist` (protected; AI fix suggestions for draft code)
- `POST /api/snippets/:id/like` (protected)
- `POST /api/snippets/:id/favorite` (protected)
- `GET /api/snippets/:id/history` (protected)
- `POST /api/snippets/:id/restore/:versionId` (protected)

### Collections (protected)
- `POST /api/collections` (create)
- `GET /api/collections` (list, includes snippets)
- `POST /api/collections/:id/add` (add snippet)
- `DELETE /api/collections/:id/remove/:snippetId` (remove snippet)

### Syntaxes
- `GET /api/syntaxes`
- `POST /api/syntaxes` (protected)

## Available Scripts

### Backend (`backend/`)
```bash
npm start
npm run dev
npm run seed
```

### Frontend (`frontend/`)
```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Data Models

### User
```js
{
  username: String,
  email: String,
  password: String, // hashed
  createdAt: Date
}
```

### Snippet
```js
{
  title: String,
  code: String,
  language: String,
  tags: [String],
  syntax: ObjectId, // ref: Syntax
  description: String,
  analysis: {
    status: "pending" | "completed" | "failed" | "skipped",
    isBugFree: Boolean | null,
    summary: String,
    issues: [{ severity: "high" | "medium" | "low", message: String }],
    suggestions: [String],
    checkedAt: Date,
    model: String,
    error: String
  },
  status: "public" | "private",
  likes: Number,
  likedBy: [ObjectId], // ref: User
  favoritedBy: [ObjectId], // ref: User
  user: ObjectId, // ref: User
  createdAt: Date
}
```

### Syntax
```js
{
  name: String,
  id: String,        // e.g. "javascript"
  syntaxCode: String // optional usage/call syntax
}
```

### Collection
```js
{
  name: String,
  userId: ObjectId,    // ref: User
  snippets: [ObjectId] // ref: Snippet
}
```

### Version
```js
{
  snippetId: ObjectId, // ref: Snippet
  title: String,
  code: String,
  language: String,
  updatedAt: Date
}
```

## Contributing

- Fork the repo, create a feature branch, and open a PR.
- Keep changes focused and update docs when behavior changes.

## Acknowledgments

- React + Vite ecosystem
- MongoDB + Mongoose docs
- Tailwind CSS + Framer Motion communities
