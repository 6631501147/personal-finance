# Learning Notes

## Stage 1: Basic UI
* Built the basic structure using HTML, CSS, and JavaScript.
* Created the dashboard layout and static UI elements.

## Stage 2: Interactive Features
* Made the transactions list interactive using JavaScript.
* Implemented the ability to add and delete transactions in the browser (without saving to a real database yet).

## Stage 3: Full-Stack Application & Deployment (Current Stage)
In this stage, the project was completely transformed into a professional, production-ready web application:

1. **Frontend Framework (Vue 3 + Vite):** 
   - Moved away from plain HTML/JS and rebuilt the UI using Vue 3. 
   - Vue makes it much easier to build complex, interactive components (like the Sidebar, Dashboard, and Settings) and manage state (data) across the app.

2. **Backend Server (Node.js + Express.js):**
   - Created a real backend API server. Instead of the frontend doing all the work, it now asks the backend to fetch or save data via HTTP requests (`GET`, `POST`, `PUT`, `DELETE`).

3. **Database (SQLite):**
   - Replaced temporary browser storage with a real SQL database. 
   - We used `sqlite3`, which saves all financial data into a physical file on the server. This means data persists even if you refresh or close the browser!

4. **Analytics & PDF Export:**
   - Integrated `Chart.js` to create beautiful Doughnut and Bar charts for visualizing income vs expenses.
   - Used `jsPDF` to generate a downloadable PDF report summarizing the user's financial data.

5. **Cloud Deployment (Render.com):**
   - Packaged the Vue frontend and Node backend together into a single "Web Service".
   - Deployed the code to Render.com so the website is permanently hosted live on the internet!
