# 🧠 TaskBoard Pro

## Team Collaboration Platform

TaskBoard Pro is an advanced team collaboration platform built using the MERN stack. It empowers teams to create and manage projects, organize tasks in a Kanban-style board, and automate workflows with powerful backend logic.

---

## 🚀 Core Features

### ✅ User Authentication
- 🔐 Google OAuth via Firebase
- 📋 User profile storage (Name, Email)

### 📁 Project Management
- 🛠️ Create projects with title & description
- ✉️ Invite users via email
- 🔒 Access control for project members

### 📋 Task Management
- ➕ Create tasks with title, description, due date, assignee
- 🔄 Drag-and-drop tasks across statuses (To Do, In Progress, Done)
- 🧩 Custom statuses per project
- 📌 Kanban board view

### ⚙️ Workflow Automation
Project owners can define automation rules such as:
- When task moves to Done → assign badge
- When task assigned to user → move to In Progress
- When due date passes → send notification

### 💬 Bonus Features
- 📡 Real-time task updates via Socket.IO
- 💬 Task commenting system
- 🏅 Badge assignment based on completed tasks

---

## 🧰 Technology Stack

| Layer | Tech Used |
|-------|-----------|
| Frontend | React, TailwindCSS, Axios |
| Backend | Node.js, Express.js, Mongoose, JWT |
| Database | MongoDB |
| Auth | Firebase (OAuth), JWT for API security |
| Real-Time | Socket.IO |

---

## 🔐 Authentication Flow

1. **Login via Google (Frontend)**
   - Uses Firebase Google provider
   - Returns Firebase ID Token

2. **Backend Token Handling**
   - Frontend sends token to `/auth/login`
   - Server verifies with Firebase Admin SDK
   - If valid, server creates/updates user & returns JWT

```
POST /auth/login
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "name": "Annu",
    "email": "annu@example.com"
  }
}
```

---

## 🛠️ Local Setup

### 📦 Prerequisites
- Node.js v16+
- MongoDB (Local or Atlas)

### 🧰 Installation Steps
```bash
# 1. Clone repo
git clone https://github.com/your-username/taskboard-pro.git
cd taskboard-pro

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

### 📁 Setup .env files
**Backend:** `/server/.env`
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### ▶️ Run Application
```bash
# Start backend
cd server
npm start

# Start frontend
cd ../client
npm run dev
```
Visit: http://localhost:3000

---

## 🔗 API Endpoints

### 🔐 Auth
- `POST /auth/login` – Authenticate user and return JWT

### 📁 Projects
- `GET /projects` – Get user's projects
- `POST /projects` – Create new project
- `POST /projects/invite` – Invite user by email

### 📋 Tasks
- `GET /projects/:id/tasks` – Get tasks of project
- `POST /projects/:id/tasks` – Create task
- `PUT /tasks/:id` – Update task
- `PUT /tasks/:id/status` – Change task status

### ⚙️ Automations
- `GET /projects/:id/automations` – Get automation rules
- `POST /projects/:id/automations` – Create new rule

---

## 🗃️ Database Schemas

### 👤 User Schema
```json
{
  "name": "String",
  "email": "String",
  "firebaseUid": "String",
  "badges": ["String"]
}
```

### 📁 Project Schema
```json
{
  "title": "String",
  "description": "String",
  "members": ["ObjectId"]
}
```

### 📋 Task Schema
```json
{
  "projectId": "ObjectId",
  "title": "String",
  "description": "String",
  "dueDate": "Date",
  "assignee": "ObjectId",
  "status": "String",
  "comments": ["String"]
}
```

### ⚙️ Automation Schema
```json
{
  "projectId": "ObjectId",
  "trigger": { "event": "String", "from": "String", "to": "String" },
  "action": { "type": "String", "params": "Object" }
}
```

---

## 🧠 Automation Example
```json
{
  "trigger": {
    "event": "status_change",
    "from": "In Progress",
    "to": "Done"
  },
  "action": {
    "type": "assign_badge",
    "badge": "Finisher"
  }
}
```

---

## 📽️ Demo Requirements
Include a 3-5 minute video walkthrough showing:
- Google login
- Project creation
- Task creation & status change
- Automation trigger in action