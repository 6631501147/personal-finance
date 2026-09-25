# Personal Finance Dashboard Interview Prep

## "Tell me about your project" (30-60 Seconds)
"I built a full-stack Personal Finance Dashboard that allows users to track their income, expenses, and savings rate. The frontend is a Single Page Application built with Vue 3 and Vite, providing a fast and responsive user experience. It communicates with a REST API backend I built using Node.js and Express. The data is securely stored in a MySQL database. I built this project to deepen my understanding of modern component-based frontend architecture and how to properly connect it to a relational database through a secure API layer."

## General
**What is the project?**
A full-stack web application for personal financial tracking and management.

**Why did you build it?**
To gain practical experience building a complete full-stack application from scratch without relying on heavy starter kits, focusing on understanding how Vue, Node, and MySQL interact.

**What problem does it solve?**
It gives users a clear, visual overview of their financial health, helping them track where their money goes so they can improve their savings rate.

**What technologies did you use?**
Frontend: Vue.js 3, JavaScript, HTML, CSS. Backend: Node.js, Express.js. Database: MySQL.

## Frontend
**Why Vue?**
Vue provides a very approachable, component-based architecture. Its Composition API makes it easy to organize logic (like transactions and calculations) into reusable pieces without the boilerplate required by older frameworks.

**What is a component?**
A reusable, independent block of code containing its own HTML, CSS, and JS logic (e.g., the Sidebar or a Summary Card).

**What are props?**
Data passed from a parent component down to a child component.

**What is v-model?**
Vue's directive for two-way data binding. If the user types in an input, the JS variable updates instantly, and vice versa.

**What is Vue Router?**
A library that manages navigation in a Single Page Application, swapping components in and out of the view without reloading the web page.

**How does Vue communicate with the backend?**
Using the browser's native `fetch` API to make HTTP requests (GET, POST, PUT, DELETE) to the Express REST API endpoints.

## Backend
**What is Node.js?**
A runtime that executes JavaScript on the server.

**What is Express?**
A minimal framework for Node that simplifies routing and handling HTTP requests.

**What is a REST API?**
An architecture that uses standard HTTP methods to perform CRUD operations on resources (like a transaction).

**GET vs POST vs PUT vs DELETE**
GET reads data, POST creates new data, PUT updates existing data, and DELETE removes data.

**What is middleware?**
Functions that execute between receiving a request and returning a response. I used it to validate incoming transaction data before saving it to the database.

## Database
**Why MySQL?**
It is a robust, widely-used relational database. Since financial data (users, budgets, transactions) has strict relationships, a relational database is a perfect fit.

**What is a primary key?**
A unique identifier for every row in a table (like `id`).

**What is a foreign key?**
A column that links to the primary key of another table, creating a relationship (like `user_id` in the `transactions` table).

**How are users and transactions related?**
A One-to-Many relationship. One user can have many transactions, but a transaction belongs to exactly one user.

## Problem Solving
**What was difficult?**
Moving from a monolithic Vanilla JS file to a decoupled Vue architecture required shifting my mindset from manual DOM manipulation to data-driven reactivity.

**How were bugs fixed?**
By using browser developer tools to inspect network requests and ensuring the JSON payloads matched the backend validation middleware exactly.
