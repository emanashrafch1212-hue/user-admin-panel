# User Management Dashboard (Express.js Backend )

A full-stack User Management Dashboard built using **React (Vite)**
 for the frontend and **Express.js** for the backend. This assignment
 focuses on building a proper REST API, connecting the frontend to the
 backend, and handling HTTP requests/responses correctly.

---

##  Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Middleware:** Express JSON parser, Custom Logger, CORS
- **Database:** Temporary In-Memory Data (Array)

---

##  Project Structure
  
    `````
	tailwind-dashboard/
│
├── backend/ # Express Backend
│ ├── controllers/
│ │ └── userController.js # Logic for handling user data (CRUD)
│ ├── routes/
│ │ └── userRoutes.js # API Route definitions
│ ├── .gitignore # Protects sensitive files from being pushed
│ └── server.js # Main Express Server
│
├── src/ # React Frontend
│ ├── components/
│ │ ├── AddUserForm.jsx
│ │ ├── EditModal.jsx
│ │ ├── Header.jsx
│ │ ├── SearchBar.jsx
│ │ ├── StatusMessage.jsx
│ │ └── UserList.jsx
│ └── App.jsx # Main React App
│
└── package.json

    `````
	

##  Installation & Setup

### 1. Install Frontend Dependencies
```bash
npm install
### 2. Install Backend Dependencies
cd backend
npm install
cd ..
###Start the Backend
cd backend
npx nodemon server.js
###Start the Frontend
npm run dev

 ----
 
 ### API Endpoints
| Method | Endpoint         | Description                     | Status Codes |
|--------|------------------|---------------------------------|--------------|
| GET    | `/`              | Welcome message                 | 200          |
| GET    | `/api/status`    | Check if the backend is running | 200          |
| GET    | `/api/users`     | Fetch all users (with search)   | 200          |
| GET    | `/api/users/:id` | Fetch a single user             | 200 / 404    |
| POST   | `/api/users`     | Create a new user               | 201 / 400    |
| PUT    | `/api/users/:id` | Update an existing user         | 200 / 404    |
| DELETE | `/api/users/:id` | Delete a user                   | 200 / 404    |

 ----
 
### Features & Concepts Implemented
REST API: GET, POST, PUT, DELETE requests implemented correctly.

Middleware: express.json(), Custom Logger Middleware, and CORS.

Error Handling: Proper error messages for duplicate emails, invalid data, and missing users.

Bonus Features: GET /api/users?search=ali and separated controllers from routes.

React Integration: Frontend sends POST, PUT, and DELETE requests to the backend.

Offline Detection: The frontend detects when the backend is offline and displays an error message.