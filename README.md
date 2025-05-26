# TaskFlow

Where productivity meets creativity — a task manager built like an anime story.

---

## 🚀 Overview

**TaskFlow** is a productivity hub that fuses classic task management with anime-inspired storytelling. Plan your day like you're building an epic saga, complete with thematic arcs and nested tasks.

---

## ✨ Features

- 🧠 Deep task creation with custom themes and images  
- 🪄 Nested subtasks and arcs  
- 🔀 Dual navigation views (vertical & horizontal)  
- ⭐ Favorite tasks and user profiles  
- 🔍 Live search and sorting  
- 💬 Real-time chat system (timestamps, alerts, visibility toggle)  
- 📚 Forum for sharing posts (vote, reply, pagination)  
- 🔐 Auth system with landing page and smooth login/sign-up  
- 🎬 Bonus tracker to rate and track anime/movies  

---

## 🛠️ Tech Stack

- **Frontend:** React (Create React App)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (via Mongoose)  
- **Other:** Socket.IO (chat), JWT (auth)  

---

## 🗂️ Folder Structure

```bash
/
├── todo-backend/     # Express server + MongoDB  
├── todo-frontend/    # React client  
├── README.md         # Main project documentation
```

---

## 🔧 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/IscaRiot6/taskflow.git
cd todo-backend && npm install
cd ../todo-frontend && npm install

🔨 Running the App
Option 1: Manual (two terminals)

cd todo-backend
node server.js

cd ../todo-frontend
npm start

Option 2: Using concurrently (recommended)
cd ./  # project root
npm install concurrently --save-dev

Make sure your root-level package.json includes this in the scripts section:

"scripts": {
  "start": "concurrently \"npm run server\" \"npm run client\"",
  "server": "cd todo-backend && node server.js",
  "client": "cd todo-frontend && npm start"
}

Now you can run both with:
npm start

---

🔧 Planned Features: Admin moderation tools for forum posts.

----

📜 License
© 2025 TaskFlow App. All rights reserved.