# Hotel Management System

A full-stack Hotel Management System built using Spring Boot, React, and MySQL.

## Technologies Used

- **Backend:** Java, Spring Boot, Spring Data JPA
- **Frontend:** React, Vite, JavaScript, CSS
- **Database:** MySQL
- **API Testing:** Postman
- **Version Control:** Git and GitHub

## Features

- Manage customer details
- View hotel rooms and prices
- Create hotel bookings
- View booking records
- Cancel bookings
- Connect the React frontend to the Spring Boot REST API
- Store hotel data in MySQL

## Project Structure

```text
hotel-management/
├── src/                  # Spring Boot backend
├── pom.xml               # Maven configuration
├── mvnw
├── mvnw.cmd
└── hotel-frontend/       # React frontend
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Prerequisites

- Java JDK 21
- Node.js and npm
- MySQL
- Git

## How to Run

### 1. Start the Backend

Configure your MySQL database connection in `src/main/resources/application.properties`.

From the project root, run:

```bash
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`.

### 2. Start the Frontend

Open a new terminal and run:

```bash
cd hotel-frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

### 3. Database

Create the `hotel_management` database in MySQL and configure the database connection before starting the backend.

**Security:** Do not commit database passwords, API keys, or other secrets to GitHub.

## Author

**Prashanth**

GitHub: [@prashanth9895](https://github.com/prashanth9895)
