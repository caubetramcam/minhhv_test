# MinhHV

## Overview

This project consists of a **backend** built with **NestJS** and **Microsoft SQL Server (MSSQL)** and a **frontend** built with **ReactJS**. The entire application is containerized using **Docker Compose** for easy setup and deployment.

## Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Test User Credentials

To log in and test the application, use the following credentials:

- **Username:** `admin`
- **Password:** `admin@123`

📌 _Note:_ These credentials are for testing purposes only. Please update them for production.

## Installation

### 1. Clone the Repository

```sh
git clone <your-repository-url>
cd <your-repository-name>
```
### 2. Start the Application

📌 Docker Compose will now use the correct image automatically! 🎉


```sh
cp .env.example .env
docker-compose up -d --build
```

This will build and start all services in detached mode.

### 3. Verify Services

- **Backend API** should be available at: [http://localhost:3000](http://localhost:3000)
- **Frontend** should be available at: [http://localhost:8080](http://localhost:8080)
- **MSSQL Database** should be running and accessible via port **1333**

## Project Structure

```
project-root/
├── backend/        # NestJS Backend
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── frontend/       # ReactJS Frontend
│   ├── src/
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Running in Development Mode

If you want to run the application in development mode without Docker, you can manually start each service:

### Backend (NestJS):

```sh
cd backend
npm install
npm run migration:dev:run
npm run start:dev
```

### Frontend (ReactJS):

```sh
cd frontend
npm install
npm start
```

## Stopping the Application

To stop all containers, run:

```sh
docker-compose down
```

## Database Migration Commands
#### Create new migration file
All migration files should store in `src/database/migrations`
```sh
npm run migration:create src/database/migrations/add_new_column_to_users
```

#### Run migration
```sh
npm run migration:dev:run

# Production (dist folder)
npx typeorm migration:run -d database/data-source
```

#### Revert migration
```sh
npm run migration:dev:revert

# Production (dist folder)
npx typeorm migration:revert -d database/data-source
```

## Useful Commands

- Rebuild images:
  ```sh
  docker-compose up -d --build
  ```
- View running containers:
  ```sh
  docker ps
  ```
- View logs for a specific service:
  ```sh
  docker-compose logs -f backend
  ```
