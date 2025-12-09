# 🌐 Fubotics AI Chat Application

This project is developed as part of the **Fubotics Software & AI Internship Assignment – December 2025**.  
It is a full AI chat system where the **user can chat with an AI assistant**, and the **entire conversation history is stored on the backend** and persists even after page refresh.

---

## 🚀 Features
- 💬 Interactive AI-powered chat interface
- 🔄 Full chat history stored and returned from backend
- 🤖 OpenAI GPT-4o-mini integrated
- ♻ Persistent conversation reload
- 🎨 Modern responsive UI with advanced styling
- 🌍 Fully deployed frontend & backend

---

## 🛠 Tech Stack
**Frontend**
- React + Vite
- Axios
- Custom UI / CSS

**Backend**
- Node.js + Express
- OpenAI API
- CORS + dotenv

---

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Fetch complete chat history |
| POST | `/api/messages` | Send a user message & receive AI response |

---

## ▶ Running Locally

### Backend
```bash
cd backend
npm install
node server.js

Frontend
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173


Backend runs at:

http://localhost:5000

🔐 Environment Variables

Create a .env in backend:

OPENAI_API_KEY=your-secret-api-key
