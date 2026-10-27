# Spendora — Personal Finance Management

Spendora is a full-stack personal finance management application designed to help users track income and expenses, manage budgets, monitor savings goals, and customize their financial dashboard.

## Features

- **Dashboard:** View income, expenses, and financial summaries.
- **Transaction Management:** Add, view, edit, and delete income and expense records.
- **Budget Management:** Set spending limits for different categories.
- **Savings Goals:** Create financial goals and track savings progress.
- **Customizable Settings:** Change display currency and toggle dark mode.
- **Persistent Storage:** Store financial records using PostgreSQL through a Spring Boot backend.

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS
- Axios

**Backend**
- Java 17
- Spring Boot
- Maven
- REST APIs

**Database**
- PostgreSQL

**Development Tools**
- Visual Studio Code
- Git and GitHub
- Postman (optional for API testing)

## Project Structure

```text
Spendora/
├── frontend/       # React frontend
└── backend/        # Spring Boot REST API
```

## Prerequisites

Install the following before running the project:

- [Node.js and npm](https://nodejs.org/)
- [Java JDK 17](https://adoptium.net/)
- [PostgreSQL](https://www.postgresql.org/download/)
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Spendora
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Configure PostgreSQL

Start PostgreSQL and create a database for Spendora.

Open your PostgreSQL query tool and execute:

```sql
CREATE DATABASE spendora;
```

If your existing backend is configured to use a different database name, use that name instead.

Open the backend's `src/main/resources/application.properties` file and configure the datasource using your local PostgreSQL credentials.

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/spendora
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Set `DB_USERNAME` and `DB_PASSWORD` in your local environment before starting the backend, or configure them using your preferred local secrets-management approach.

The PostgreSQL JDBC driver must be available in the backend's Maven dependencies.

**Security:** Never commit real database passwords, API keys, or other secrets to GitHub.

### 3. Start the backend

Open a terminal in the project root and run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend will typically start at:

```text
http://localhost:8080
```

Keep this terminal running.

### 4. Start the frontend

Open a second terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal. The port may vary depending on availability.

### 5. Configure the API connection

The frontend uses a shared Axios configuration to communicate with the backend. Check `frontend/src/api/api.js` and ensure the base URL matches your running backend.

Example:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default api;
```

For local development, configure backend CORS to allow the frontend origin. For production, restrict allowed origins to your deployed frontend domain.

## API Endpoints

The backend provides REST endpoints for the following resources:

| Resource | Endpoint | Operations |
|---|---|---|
| Transactions | `/api/transactions` | GET, POST, PUT, DELETE |
| Budgets | `/api/budgets` | GET, POST, PUT, DELETE |
| Savings Goals | `/api/goals` | GET, POST, PUT, DELETE |
| Settings | `/api/settings` | GET, PUT |

Individual record operations use resource IDs where applicable.

## Running the Application

1. Start PostgreSQL.
2. Start the Spring Boot backend.
3. Start the React frontend.
4. Open the local frontend URL in your browser.
5. Add transactions, create budgets, and set savings goals to explore the application.

## Future Improvements

- User authentication and account management
- Improved validation and error handling
- Cloud deployment
- Automated tests

## Author

Developed as a full-stack personal finance management project using React, Java, Spring Boot, and PostgreSQL.
