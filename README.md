# MyBank - Digital Banking Solution 

MyBank is a modern, full-stack digital banking application built with **Laravel 11** and **React JS**. It features a robust authentication system, role-based access control (RBAC), and a premium user interface.


## 🚀 Features

### Core Banking
- **Multi-Account Management:** Users can view and manage multiple bank accounts (Current, Savings, etc.).
- **Real-time Transactions:** Secure money transfers (Virements) between accounts using RIB.
- **Transaction History:** Detailed logs of all activities (Deposits, Withdrawals, Transfers).
- **PDF Receipts:** Generate and download professional PDF receipts for every transaction.

### Security & Auth
- **JWT Authentication:** Powered by Laravel Sanctum for secure API communication.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Manage users, accounts, and monitor all transactions.
  - **Client:** Access personal dashboard, manage accounts, and perform transfers.
- **Form Validation:** Strict client and server-side validation.

### UI/UX
- **Premium Design:** Modern, dark-themed interface built with Tailwind CSS.
- **Fluid Animations:** Smooth transitions using Framer Motion.
- **Responsive:** Fully optimized for mobile and desktop screens.

## 🛠️ Tech Stack

**Backend:**
- Laravel 11 (PHP 8.2+)
- SQLite (Database)
- Laravel Sanctum (Auth)
- DomPDF (PDF Generation)

**Frontend:**
- React JS (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Framer Motion (Animations)
- Axios (API Client)

## 📦 Installation & Setup

### Prerequisites
- PHP 8.2+ & Composer
- Node.js & NPM

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd myBank
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
5. Start the server:
   ```bash
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd myBank-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 👤 Author
- **Mouad Kawmi** - [GitHub](https://github.com/mouad-kawmi)

---
*Developed as a portfolio project to demonstrate Full-Stack capabilities.*
