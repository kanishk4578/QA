# 🇮🇳 RashtrSetu – A Citizen Feedback & Participation Platform

**RashtrSetu** is a full-stack web application designed to bridge the gap between the Government of India and its citizens. The platform enables real-time public feedback, structured participation, and transparent communication. Built using modern web technologies and AI capabilities, it empowers administrators to collect, manage, and summarize opinions directly from verified users.

---

## 🔗 Live Preview

> _Coming Soon_

---

## 🧐 Key Features

- ✅ **Secure User Authentication** (Login/Register)
- ✅ **Admin-Only Question Posting**
- ✅ **Real-Time Question Distribution**
- ✅ **Answer Submission by All Logged-in Users**
- ✅ **AI-Powered Summarization of Responses**
- ✅ **Role-Based Header (Login/Profile/Logout)**
- ✅ **Mobile-Responsive UI** with Tailwind CSS
- ✅ **MongoDB-Based Storage and Querying**

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React.js
- Axios
- React Router DOM
- Tailwind CSS
- Socket.io-client

### 🛠️ Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- OpenAI API for summarizing user responses

---

## 📂 Project Structure

```
RashtrSetu/
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── api.js
│
├── server/                  # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── server.js
│   └── config/
│
└── README.md
```

---

## 🔧 Setup Instructions

### Prerequisites

- Node.js v16 or higher
- MongoDB Atlas account or local MongoDB server
- OpenAI API Key for summarization

---

### 1. Clone the Repository

```bash
git clone https://github.com/kanishk4578/RashtrSetu.git
cd RashtrSetu
```

---

### 2. Configure Backend

```bash
cd server
npm install
touch .env
```

Create a `.env` file with the following content:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Start the backend server:

```bash
npm start
```

---

### 3. Configure Frontend

```bash
cd ../client
npm install
npm start
```

The React frontend will now run on `http://localhost:3000`.

---

## 👥 Contributors

- [Kanishk Singh Rajput](https://github.com/kanishk4578) – Full-stack Developer

---

## 📃 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgements

- OpenAI for enabling GPT-based summarization
- Socket.io for enabling real-time question updates
- Inspired by India's commitment to e-governance and democratic participation

---

> Made with ❤️ and 🇮🇳 for India. _RashtrSetu connects citizens and governance through technology._
