# Personal Finance Dashboard — Learning Notes

## Stage 3 — Convert to Vue.js

### What I built
Converted the Vanilla JS application into a Single Page Application (SPA) using Vue 3 and Vite. Split the monolithic HTML and JS into reusable Vue components (Sidebar, Header, SummaryCard) and separate pages (Dashboard, Transactions) managed by Vue Router.

### Technologies used
* Vue.js 3 (Composition API)
* Vite (Build tool)
* Vue Router (Navigation)
* JavaScript
* HTML/CSS

### Important concepts
* **Vue.js**: A progressive JavaScript framework for building user interfaces. It makes building complex, interactive UIs easier by keeping the UI in sync with the underlying data automatically.
* **Components**: Independent, reusable pieces of a UI. Think of them as custom HTML tags (e.g., `<Sidebar />` or `<SummaryCard />`) that contain their own structure, styling, and logic.
* **Props**: Custom attributes you can register on a component to pass data from a parent component down to a child component (like passing a title and amount to a SummaryCard).
* **Events**: Actions that happen in the app (like clicks). In Vue, a child component can "emit" an event to tell its parent that something happened (like the Sidebar telling the App it wants to close).
* **Reactive data**: Data that Vue actively watches. When reactive data changes, Vue automatically updates the parts of the HTML that depend on it, without us having to write DOM manipulation code.
* **Computed properties**: Reactive variables that derive their value from other reactive data. They automatically recalculate when their dependencies change (like updating Total Balance automatically when Transactions change).
* **Vue Router**: The official router for Vue.js. It allows you to switch between different "pages" (Views) in a single-page application without reloading the entire browser window.

### How it works
1. The app starts in `index.html` and mounts the Vue application in `main.js`.
2. `App.vue` serves as the layout wrapper, containing the `Sidebar` and `Header` components.
3. Depending on the URL, Vue Router injects either the `Dashboard.vue` or `Transactions.vue` component into the center area (`<router-view>`).
4. The transaction logic is stored in a composable file (`useTransactions.js`). This file reads/writes to `localStorage` and provides reactive arrays and computed totals to any component that needs them.

### Important files
* `frontend/index.html`: The main entry point.
* `frontend/src/main.js`: Initializes the Vue app and Router.
* `frontend/src/App.vue`: The root layout component.
* `frontend/src/router/index.js`: Defines the routes (/ and /transactions).
* `frontend/src/composables/useTransactions.js`: Shared business logic.
* `frontend/src/views/Transactions.vue`: The page to manage transactions.

### Example
**Reactive Data and Computed Properties**
```javascript
import { ref, computed } from 'vue'

// Reactive data
const transactions = ref([])

// Computed property: automatically updates if transactions changes
const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
})
```

### What I should be able to explain in an interview
1. **Why use Vue instead of vanilla JS?** It eliminates manual DOM manipulation and makes code modular, reusable, and easier to maintain.
2. **What is a component?** A self-contained, reusable block of UI (HTML, CSS, JS).
3. **What are props?** A way to pass data downwards from parent to child components.
4. **What is a computed property?** A value derived from reactive data that automatically recalculates when its dependencies change.
5. **How does Vue Router work?** It maps URLs to specific Vue components, allowing navigation without page reloads.

### Things I should practice myself
* Create a new route and view component called `Budgets.vue`.
* Pass a new prop to the `SummaryCard` component to change its text color.
* Add a `console.log()` inside the `totalIncome` computed property to see exactly when it runs.

### How to run this stage
```bash
cd frontend
npm run dev
```

## Stage 4 — Node.js + Express Backend

### What I built
Created a robust backend REST API using Node.js and Express.js to handle HTTP requests for transactions.

### Technologies used
* Node.js (Runtime)
* Express.js (Web framework)
* JavaScript (ES Modules)

### Important concepts
* **Node.js**: A JavaScript runtime that allows you to run JS on the server instead of just in the browser.
* **Express**: A fast, minimal web framework for Node.js that makes it easy to handle HTTP requests and routes.
* **REST API**: An architectural style for an API that uses HTTP requests to access and use data. It treats data as "resources" (like a transaction).
* **HTTP Methods**: 
  * `GET`: Fetch data (Read)
  * `POST`: Send new data (Create)
  * `PUT`: Update existing data completely
  * `DELETE`: Remove data
* **Routes**: URLs that map to specific actions in our code (e.g., `/api/transactions`).
* **Controllers**: The actual logic functions that run when a route is matched. They take the request (`req`), process it, and send a response (`res`).
* **Middleware**: Functions that run "in the middle" of a request before it reaches the controller. We used it for validation (checking if the user sent a description) and error handling.
* **JSON**: JavaScript Object Notation. The standard format for sending data across the web.
* **HTTP Status Codes**: Numbers that tell the browser what happened. 
  * `200` OK
  * `201` Created
  * `400` Bad Request (e.g. missing fields)
  * `404` Not Found
  * `500` Internal Server Error

### How it works
1. The server starts in `app.js` and listens on Port 3000.
2. A request (like `POST /api/transactions`) hits the server.
3. Express passes the request to the router (`transactionRoutes.js`).
4. The router sends the request through the `validateTransaction` middleware. If data is missing, it responds with a `400` error and stops.
5. If valid, the request moves to the `createTransaction` controller.
6. The controller creates the object, pushes it to our temporary in-memory array, and sends a `201 Created` JSON response back to the client.

### Important files
* `backend/src/app.js`: Server setup and configuration.
* `backend/src/routes/transactionRoutes.js`: Maps endpoints to controller functions.
* `backend/src/controllers/transactionController.js`: The CRUD logic.
* `backend/src/middleware/validation.js`: Validates incoming data.

### Example
**Creating a new transaction (Controller)**
```javascript
export const createTransaction = (req, res) => {
    const newTransaction = {
        id: Date.now().toString(),
        ...req.body // The data sent by the user
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction); // 201 means "Created successfully"
};
```

### What I should be able to explain in an interview
1. **What is Node.js?** A runtime environment that allows running JavaScript on a server.
2. **What is Express?** A minimal framework for Node.js used to build APIs quickly.
3. **What is a REST API?** A standard way for frontends to talk to backends using HTTP methods (GET, POST, PUT, DELETE).
4. **What is middleware?** Functions that intercept requests before they reach the main logic (used for validation, authentication).

### Things I should practice myself
* Use an API tool like **Postman** or **Insomnia** (or a VS Code extension like Thunder Client) to send a `GET` request to `http://localhost:3000/api/transactions`.
* Try sending a `POST` request with missing data (like no amount) to see the `400` error message from your validation middleware.

### How to run this stage
```bash
cd backend
npm run dev
```
