# Mini Laundry Order Management System

A robust, production-ready full-stack application for managing a dry cleaning/laundry store. 
Built with a sleek, premium React frontend using a custom design system, and powered by a scalable Node.js + Express backend with MongoDB.

## Features Included 🚀

### Backend
- **Authentication**: JWT-based secure user authentication and bcrypt password hashing.
- **Order Management**: Create, update, filter, and view orders.
- **Automated Bills**: Auto-calculates total bill based on garment items and quantities.
- **Dashboard API**: Provides an overview (Total Orders, Total Revenue, Order breakdown by Status).
- **Clean Architecture**: Follows the MVC pattern with separated Routes, Controllers, Models, and Middlewares.
- **Estimated Delivery**: Automatically assigns a default estimated delivery date.

### Frontend
- **Aesthetic Design**: Uses Vanilla CSS with glassmorphism, modern typography (Inter, Outfit), and subtle micro-animations for a rich user experience.
- **Dashboard**: Visual tracking of top-level metrics.
- **Order creation & interaction**: Form with dynamic row additions for garments and immediate status changes directly from the order list.
- **Protected Routes**: React front-end prevents access to the dashboard and orders unauthenticated.

## Setup Instructions 🛠️

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB URI via MongoDB Atlas.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   Copy `.env.example` to `.env` and adjust the variables.
   ```bash
   # Windows
   copy .env.example .env
   # Ensure MONGO_URI connects to an active DB server instance.
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. The React application should now be accessible at `http://localhost:5173`. 
*(Note: To login initially, use Postman to hit the Register Endpoint, then use the credentials in the beautiful React UI!)*

---

## AI Usage Report 🤖

As requested, here is a detailed log of AI-assistance used during this project's generation.

### Example Prompts Used
1. "Act as a senior full-stack developer and help me build a complete Mini Laundry Order Management System..." (Primary Prompt)
2. "Set up the backend file structure using MVC with express, mongoose, cors, dotenv."
3. "Generate a complete Postman collection for testing the laundry system."
4. "Create a visually stunning React UI matching modern glassmorphism criteria without using Tailwind, using instead a rich aesthetic Vanilla CSS implementation."

### Where AI Helped
- **Architecture design and scaffolding**: Fast-tracking the boilerplate Node.JS / Express MVC setup, saving hours of configuration.
- **Frontend aesthetics**: Setting up complicated custom CSS tokens (glassmorphism rules, CSS animated gradient backgrounds, generic color assignments) natively without an external framework config.
- **Documentation**: Instantly structuring markdown for clear README files and Postman config exports.

### Common AI Mistakes in this type of project
- **Authentication gaps**: AI sometimes forgets to guard every single route, or forgets token validation (which was handled appropriately via `authMiddleware.js`).
- **Path Resolution Errors**: Sometimes AI hardcodes paths into the frontend UI or Vite config that only work locally. (Adjustments in `frontend/src/utils/api.js` use the proper absolute localhost URL).
- **Silent failures**: Not wrapping asynchronous MongoDB logic inside generic error handlers or `try/catch` blocks.

### Improvements Done Manually
- **Error Middleware**: Structured a centralized custom Error Middleware capturing the stack trace only in dev environments (`errorMiddleware.js`).
- **Dynamic Garments Table**: Custom React logic managing the garments array state with adding/removing item capabilities cleanly.
- **Custom Scrollbars & Alerts**: Adding visually distinct React Toastify notifications and matching styled scrollbars to ensure everything matches beautifully.

---

## APIs Quick Guide

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register an admin | No |
| `POST` | `/api/auth/login` | Login | No |
| `POST` | `/api/orders` | Create order | Yes |
| `GET` | `/api/orders` | View & filter orders | Yes |
| `PUT` | `/api/orders/:id/status` | Update status | Yes |
| `GET` | `/api/dashboard` | Dashboard Metrics | Yes |

*See `postman_collection.json` in the root folder to import everything directly.*
