# SmartSpend Backend

The backend server for the SmartSpend PWA, a premium fintech budget and expense tracking application.

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **TypeScript**: A superset of JavaScript that adds static types.
- **MongoDB**: NoSQL database used to store users, budgets, and transactions.
- **Mongoose**: ODM library for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **Jest**: Testing framework.

## Structure and Architecture
The project follows a Domain-Driven Design / Clean Architecture approach ensuring separation of concerns:
- **Controllers**: Handle HTTP requests and responses.
- **Routes**: Map endpoints to controllers.
- **Services**: Contain business logic (if extracted).
- **Models**: Defines MongoDB schemas.
- **Middlewares**: Custom middleware functions (e.g. for authentication, rate-limiting, error handling).

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hiravpatel/budget-tracker-backend.git
   cd budget-tracker-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file based on the provided `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Make sure to update the environment variables with your own MongoDB URI and secret keys.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run the tests:**
   ```bash
   npm test
   ```

The server should run on `http://localhost:5000/api/v1`.

## Core Features
- REST API for User Authentication (Register/Login/Refresh Token/Logout).
- Categories, Budgets, and Transactions tracking.
- Secured via JWT tokens configured to use HttpOnly cookies.
- Comprehensive Error Handling & Rate Limiting protection.
