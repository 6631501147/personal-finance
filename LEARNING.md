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
