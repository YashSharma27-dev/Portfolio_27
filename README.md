
# Me-API Playground

A personal API playground to showcase a candidate profile, skills, and projects. This project consists of a Node.js/Express backend with SQLite and a React frontend.

## 🚀 Live Demo

- **Frontend**: [http://localhost:5173](http://localhost:5173) (Local)
- **Backend API**: [http://localhost:3000](http://localhost:3000) (Local)

*(Note: To deploy, see the Deployment section below.)*

## 📚 Architecture

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (local file `me_api.db`)
- **Features**: 
  - RESTful API endpoints
  - CORS enabled
  - Automatic database seeding

### Frontend (`/frontend`)
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Variables, Glassmorphism, Responsive)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **HTTP Client**: Axios

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm

### Quick Start (Single Command)

1.  **Install Dependencies**
    ```bash
    npm install
    npm run install-all
    ```

2.  **Run Application**
    ```bash
    npm start
    ```
    This will start both the backend (http://localhost:3000) and frontend (http://localhost:5173) concurrently.

### Manual Setup (Alternative)

#### 1. Backend Setup

## 📖 API Documentation

### Base URL
`http://localhost:3000`

### Endpoints

| Method | Endpoint | Description | Params |
|--------|----------|-------------|--------|
| `GET` | `/health` | Check API status | - |
| `GET` | `/profile` | Get candidate profile | - |
| `PUT` | `/profile` | Update profile | Body: `{ name, email, ... }` |
| `GET` | `/projects` | List projects | `?skill=Python` (optional) |
| `POST` | `/projects` | Add a project | Body: `{ title, link, ... }` |
| `GET` | `/skills` | List all skills | - |
| `GET` | `/skills/top` | List top skills | - |
| `GET` | `/work` | List work experience | - |
| `GET` | `/search` | Search projects/skills | `?q=query` |

### Sample Curl Request
```bash
# Get Profile
curl http://localhost:3000/profile

# Search for "React"
curl "http://localhost:3000/search?q=React"
```

## 🗄️ Database Schema

```sql
CREATE TABLE profile (
    id INTEGER PRIMARY KEY,
    name TEXT, email TEXT, github TEXT, linkedin TEXT, portfolio TEXT, resume TEXT, bio TEXT
);

CREATE TABLE projects (
    id INTEGER PRIMARY KEY,
    title TEXT, description TEXT, link TEXT, skills_used TEXT
);

CREATE TABLE skills (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE, category TEXT
);

CREATE TABLE work (
    id INTEGER PRIMARY KEY,
    company TEXT, role TEXT, duration TEXT, description TEXT,
);
```

## 📄 Resume
[View My Resume](https://deepmind.google/resume)

## ⚠️ Known Limitations
- **Auth**: No authentication is implemented for write operations (PUT/POST).
- **Database**: Uses SQLite, which is great for local dev/small apps but not for high-concurrency production (though adequate for this use case).
- **Validation**: Minimal input validation on the backend.

## ☁️ Deployment

### Backend (Render/Railway/Fly.io)
1. Push code to GitHub.
2. Connect repo to hosting provider.
3. Set build command: `npm install`
4. Set start command: `node server.js`

### Frontend (Vercel/Netlify)
1. Push code to GitHub.
2. Connect repo.
3. Set build command: `npm run build`
4. Set output directory: `dist`

