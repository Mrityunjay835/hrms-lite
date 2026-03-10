# HRMS Lite – Human Resource Management System

A lightweight full-stack HRMS application that enables administrators to manage employees and track daily attendance.

This project was developed as a full-stack coding assignment to demonstrate backend API design, frontend development, and database persistence.

---

## Live Demo

**Frontend:**  
[https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)

**Backend API Docs:**  
[https://your-backend-url.onrender.com/docs](https://your-backend-url.onrender.com/docs)

---

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Query
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## Features

### Employee Management
- Add new employees
- View employee list
- Update employee details
- Delete employees
- Filter employees

### Attendance Management
- Mark daily attendance
- Prevent duplicate attendance entries
- View employee attendance history
- Generate attendance summaries per employee

### Dashboard
- Display total employees
- Show present and absent counts for today
- GitHub-style attendance heatmap
- Clickable heatmap with daily attendance counts

---

## Project Structure
```
hrms
│
├── backend
│ ├── app
│ │ ├── api
│ │ ├── db
│ │ ├── models
│ │ ├── schemas
│ │ └── main.py
│ │
│ └── requirements.txt
│
├── frontend
│ ├── src
│ ├── public
│ └── package.json
│
└── README.md


---

## Running the Project Locally

### 1. Clone Repository
```bash
git clone https://github.com/mrityunjay835/hrms-lite.git
cd hrms-lite
---

### 2. Backend Setup


cd backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt


Create `.env`:


DATABASE_URL=postgresql://username:password@localhost:5432/hrms_db


Run backend:


uvicorn app.main:app --reload


Backend runs at:


http://localhost:8000


Swagger docs:


http://localhost:8000/docs


---

### 3. Frontend Setup


cd frontend

npm install
npm run dev


Frontend runs at:


http://localhost:5173


---

## API Endpoints

### Employee

POST /employees
GET /employees
GET /employees/{id}
PUT /employees/{id}
DELETE /employees/{id}


### Attendance

POST /attendance
GET /attendance/{employee_id}
GET /attendance/summary/{employee_id}


### Dashboard

GET /dashboard
GET /dashboard/attendance-heatmap


---

## Validation & Error Handling

- Duplicate employee detection
- Email validation
- Duplicate attendance prevention
- Proper HTTP status codes
- User-friendly error messages

---

## Bonus Features Implemented

- Attendance filter by employee
- Total present days per employee
- GitHub-style attendance tracking calendar
- Clickable heatmap for daily attendance insights

---

## Future Improvements

- Authentication & role management
- Leave management
- Monthly attendance reports
- Data visualization charts
- Email notifications

---

## Author

Mrityunjay  Kumar
AI / ML Engineer & Full-Stack Developer