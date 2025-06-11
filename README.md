
![Static Badge](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Static Badge](https://img.shields.io/badge/Fiber-6C4DFF?style=for-the-badge&logo=fiber)
![Static Badge](https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white)
![Static Badge](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white&style=for-the-badge)

# Task Manager with Real-Time Updates 🚀

# Description
Hello! My name is Vasilkov Arseniy, and this project is a simple task manager built using Go.  
Task manager is a project task from Rostelecom

# 🌟 Key features
1. CRUD for tasks (create, read, update, delete)
2. Real-time notifications via Centrifugo (changes are visible to all clients at once)
3. REST API (documented endpoints)
4. Docker deployment (PostgreSQL + Go backend + Centrifugo)

# 🛠 Technologies
Technology component
Go - backend (fiber)
HTML/CSS/JS - frontend
Real-time - Centrifuge
Docker - infrastructure

# Launch Instructions
1. Clone the repository
```
git clone https://github.com/LeeNDyy/tasks_list
```
```
tasks_list
```
2. Set up environment variables 
```
cp .env.example .env 
```
Edit .env (passwords, keys) 
3. Start services 
This project has a taskfile, to run the project it is enough to enter the command:
```
task up
```
But if you don't have the task utility, you can use
```
docker compose up --build
```
This command allows you to collect all containers and immediately launch them for further work

After launch:
API: http://localhost:7080/api/task
Frontend: http://localhost:8080
Centrifugo Console: http://localhost:8000 (login: admin, password from .env)

# 📚 API Documentation
Endpoints
Method Path Description
GET /api/task - List all tasks
POST /api/task - Create a task
GET /api/task/:id - Get a task by ID
PUT /api/task/:id - Update a task
DELETE /api/task/:id - Delete a task

# Example request on Postman
Create task
```
POST http://localhost:7080/api/task  
Content-Type: application/json  

{  
  "title": "Fix bugs",  
  "description": "Critical bug in auth module"  
}  
```
Answer
```
{  
  "id": 1,  
  "title": "Fix bugs",  
  "description": "Critical bug in auth module"  
}  
```
# 🔧 Testing
1. Manual testing
Open 2+ browser tabs with the frontend — changes are synced instantly.
2. Use Postman (examples above).

# 🐛 Debugging
Backend logs
```
docker-compose logs -f backend  
```
Centrifugo logs
```
docker-compose logs -f centrifugo  
```
# 📌 Features
✅ Real-time updates without page reload
✅ Ready Docker image for production
✅ Easy integration with frontend (Vanilla JS)

✨ Ready to use! For questions, write to Issues.

