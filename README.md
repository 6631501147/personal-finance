🌐 Live Demo: https://personal-finance-xxxx.onrender.com


# Personal Finance Dashboard

## Project Overview
A modern, full-stack Personal Finance Dashboard designed to help users track their income, expenses, and savings rate through an intuitive interface.

## Problem Solved
Managing personal finances across spreadsheets or complex apps can be overwhelming. This project provides a simplified, highly visual dashboard that instantly calculates critical metrics like Total Balance and Savings Rate.

## Features
- **Dashboard Interface**: Quick overview of balance, income, expenses, and savings rate.
- **Transaction Management**: Full CRUD (Create, Read, Update, Delete) functionality for financial records.
- **Dynamic Search & Filtering**: Instantly search transactions by description or filter by type (Income/Expense) and category.
- **Database Persistence**: Securely stores all transactions in a relational MySQL database.

## Technology Stack
- **Frontend**: Vue.js 3, JavaScript, HTML, CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2` connection pool)

## Architecture
The application follows a standard 3-tier architecture:
1. **Presentation Layer (Vue.js)**: Handles UI, routing, and client-side form validation.
2. **Logic Layer (Express API)**: Processes requests, applies business rules, and structures database queries.
3. **Data Layer (MySQL)**: Maintains persistent, relational data.

## Installation & Setup

1. **Database Setup**
   - Ensure MySQL is installed and running.
   - Run the SQL script located in `database/schema.sql` to create the database and tables.
   - (Optional) Run `database/seed.sql` to insert sample data.

2. **Backend Setup**
   - Navigate to the `backend/` folder.
   - Run `npm install`
   - Copy `.env.example` to `.env` and configure your database credentials.
   - Run `npm run dev` to start the API server on port 3000.

3. **Frontend Setup**
   - Navigate to the `frontend/` folder.
   - Run `npm install`
   - Run `npm run dev` to start the Vite development server.

## Learning Outcomes
This project was built progressively (from Vanilla JS to a Vue SPA connected to a Node/MySQL backend) to deeply understand the mechanics of full-stack data flow, component reactivity, and API design without relying on heavy abstraction layers.
