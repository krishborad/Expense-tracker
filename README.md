# 💰 FinanceFlow – Full-Stack Expense Tracker

A professional, full-stack expense tracker built with **Angular**, **Node.js/Express**, and **MongoDB**.

---

## 🏗️ Project Structure

```
expense-tracker/
├── backend/                  # Node.js + Express API
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── transaction.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── transaction.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── transaction.routes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/                 # Angular 19 App
    └── src/
        └── app/
            ├── core/
            │   ├── guards/auth.guard.ts
            │   ├── interceptors/auth.interceptor.ts
            │   ├── models/models.ts
            │   └── services/
            │       ├── auth.service.ts
            │       ├── transaction.service.ts
            │       └── toast.service.ts
            ├── features/
            │   ├── auth/
            │   │   ├── login/login.component.ts
            │   │   └── register/register.component.ts
            │   └── dashboard/
            │       ├── dashboard-shell/dashboard-shell.component.ts
            │       └── dashboard-home/dashboard-home.component.ts
            └── shared/
                ├── confirm-dialog/confirm-dialog.component.ts
                └── toast-container/toast-container.component.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or MongoDB Atlas)
- **Angular CLI** v19+

---

### 1. Start MongoDB

Make sure MongoDB is running locally:
```bash
mongod
```
Or update `.env` to use your Atlas connection string.

---

### 2. Start the Backend

```bash
cd backend
npm install        # (already done)
npm run dev        # Starts on http://localhost:5000
```

---

### 3. Start the Frontend

```bash
cd frontend
npm run start      # Starts on http://localhost:4200
```

Open your browser at **http://localhost:4200**

---

## 🔑 API Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/transactions` | Get all transactions | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| DELETE | `/api/transactions/:id` | Delete transaction | ✅ |

### Query Parameters for GET /api/transactions
- `type` – Filter by `income` or `expense`
- `sortBy` – Sort field (default: `date`)
- `order` – `asc` or `desc` (default: `desc`)

---

## 🧪 Sample Test Data

### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Add Income
```json
POST /api/transactions
Headers: Authorization: Bearer <token>
{
  "type": "income",
  "amount": 75000,
  "category": "Salary",
  "description": "Monthly salary",
  "date": "2026-04-01"
}
```

### Add Expense
```json
POST /api/transactions
Headers: Authorization: Bearer <token>
{
  "type": "expense",
  "amount": 12000,
  "category": "Rent",
  "description": "April rent",
  "date": "2026-04-05"
}
```

---

## 🎨 Features

- ✅ JWT Authentication (Register / Login)
- ✅ Add, View, Delete Transactions
- ✅ Dashboard with Balance, Income, Expense cards
- ✅ Filter by type (All / Income / Expense)
- ✅ Confirmation dialog before delete
- ✅ Toast notifications for all actions
- ✅ Responsive design (mobile + desktop)
- ✅ Empty state when no transactions
- ✅ Angular lazy-loaded modules
- ✅ Reactive state with Angular Signals
- ✅ Form validation on all inputs

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, Angular Material, SCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| State | Angular Signals |
| Styling | Angular Material + Custom SCSS |
| Typography | Inter (Google Fonts) |
