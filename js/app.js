document.addEventListener('DOMContentLoaded', () => {
    // === 1. DOM Elements ===
    // (DOM manipulation means using JavaScript to find and change HTML elements on the page)
    const dateElement = document.getElementById('currentDate');
    
    // Sidebar toggle elements
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    // Form elements
    const form = document.getElementById('transactionForm');
    const editIdInput = document.getElementById('editId');
    const descInput = document.getElementById('descInput');
    const amountInput = document.getElementById('amountInput');
    const dateInput = document.getElementById('dateInput');
    const typeInput = document.getElementById('typeInput');
    const categoryInput = document.getElementById('categoryInput');
    const notesInput = document.getElementById('notesInput');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');

    // Dashboard Cards and Table
    const transactionBody = document.getElementById('transactionBody');
    const totalBalanceEl = document.getElementById('totalBalance');
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const savingsRateEl = document.getElementById('savingsRate');
    const categoryBreakdownEl = document.getElementById('categoryBreakdown');

    // Filter, Search, Sort Controls
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterCategory = document.getElementById('filterCategory');
    const sortBy = document.getElementById('sortBy');

    // === 2. Initial Setup ===
    // Display current date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);

    // Default the date input to today
    dateInput.value = new Date().toISOString().split('T')[0];

    // Mobile Sidebar Toggle (Events)
    openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    // === 3. State & Local Storage ===
    // We store transactions in an Array of Objects.
    // We use localStorage to save data in the browser so it doesn't disappear when you refresh.
    let transactions = JSON.parse(localStorage.getItem('finance_transactions')) || [];

    // Helper Function: Save to localStorage
    function saveToLocalStorage() {
        // localStorage only stores strings, so we use JSON.stringify to convert our Array to a string
        localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    }

    // Helper Function: Format numbers to currency strings (e.g. 35000 -> "฿35,000.00")
    function formatCurrency(amount) {
        return '฿' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // === 4. Dashboard Calculations ===
    function updateDashboard() {
        let income = 0;
        let expenses = 0;

        // Loop through all transactions (Array iteration)
        transactions.forEach(t => {
            if (t.type === 'Income') {
                income += parseFloat(t.amount);
            } else if (t.type === 'Expense') {
                expenses += parseFloat(t.amount);
            }
        });

        // Calculations
        const balance = income - expenses;
        let savingsRate = 0;
        if (income > 0) {
            savingsRate = ((income - expenses) / income) * 100;
        }

        // DOM Manipulation: Update text on screen
        totalIncomeEl.textContent = formatCurrency(income);
        totalExpensesEl.textContent = formatCurrency(expenses);
        totalBalanceEl.textContent = formatCurrency(balance);
        savingsRateEl.textContent = savingsRate.toFixed(1) + '%';
        
        // Dynamic style based on positive/negative balance
        totalBalanceEl.style.color = balance >= 0 ? 'var(--text-main)' : 'var(--danger-color)';
    }

    // === 5. Category Breakdown ===
    function updateCategories() {
        const categoryTotals = {};
        
        // A JavaScript Object to hold style configuration for categories
        const categoryIcons = {
            'Salary': { icon: 'payments', bg: '#e8f5e9', color: '#4caf50' },
            'Food': { icon: 'restaurant', bg: '#ffebee', color: '#f44336' },
            'Transportation': { icon: 'directions_car', bg: '#e3f2fd', color: '#2196f3' },
            'Shopping': { icon: 'shopping_bag', bg: '#f3e5f5', color: '#9c27b0' },
            'Bills': { icon: 'receipt', bg: '#fff8e1', color: '#ffb300' },
            'Entertainment': { icon: 'movie', bg: '#e0f2f1', color: '#009688' },
            'Other': { icon: 'category', bg: '#eceff1', color: '#607d8b' }
        };

        // Sum expenses by category
        transactions.forEach(t => {
            if (t.type === 'Expense') {
                if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
                categoryTotals[t.category] += parseFloat(t.amount);
            }
        });

        // Clear existing HTML in the category section
        categoryBreakdownEl.innerHTML = '';
        
        const catKeys = Object.keys(categoryTotals);
        if (catKeys.length === 0) {
            categoryBreakdownEl.innerHTML = '<p style="color: var(--text-muted); font-size: 14px;">No expenses to show.</p>';
            return;
        }

        // Loop through the calculated totals and build HTML strings
        for (const [cat, amount] of Object.entries(categoryTotals)) {
            const styles = categoryIcons[cat] || categoryIcons['Other'];
            
            // Template Literals (`) let us inject variables directly into HTML strings
            const itemHTML = `
                <div class="category-item">
                    <div class="cat-info">
                        <div class="cat-icon" style="background-color: ${styles.bg}; color: ${styles.color};">
                            <span class="material-symbols-rounded">${styles.icon}</span>
                        </div>
                        <span>${cat}</span>
                    </div>
                    <span class="cat-amount">${formatCurrency(amount)}</span>
                </div>
            `;
            // Add the HTML string to the container
            categoryBreakdownEl.innerHTML += itemHTML;
        }
    }

    // === 6. Filtering, Sorting, and Rendering the Table ===
    function renderTable() {
        // Get values from our control inputs
        const searchVal = searchInput.value.toLowerCase();
        const typeVal = filterType.value;
        const catVal = filterCategory.value;
        const sortVal = sortBy.value;

        // Filtering: Keep only transactions that match the search, type, and category
        let filteredData = transactions.filter(t => {
            const matchSearch = t.description.toLowerCase().includes(searchVal) || t.category.toLowerCase().includes(searchVal);
            const matchType = (typeVal === 'All') || (t.type === typeVal);
            const matchCat = (catVal === 'All') || (t.category === catVal);
            
            return matchSearch && matchType && matchCat;
        });

        // Sorting: Change the order of the array
        filteredData.sort((a, b) => {
            if (sortVal === 'dateDesc') return new Date(b.date) - new Date(a.date); // Newest first
            if (sortVal === 'dateAsc') return new Date(a.date) - new Date(b.date);  // Oldest first
            if (sortVal === 'amountDesc') return parseFloat(b.amount) - parseFloat(a.amount); // Highest first
            if (sortVal === 'amountAsc') return parseFloat(a.amount) - parseFloat(b.amount);  // Lowest first
            return 0;
        });

        // Update the DOM Table
        transactionBody.innerHTML = ''; // Clear table
        
        if (filteredData.length === 0) {
            transactionBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">No transactions found.</td></tr>';
            return;
        }

        // Loop through the filtered array and build HTML for each row
        filteredData.forEach(t => {
            const tr = document.createElement('tr');
            
            // Format date nicely
            const dateObj = new Date(t.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const badgeClass = t.type === 'Income' ? 'income' : 'expense';
            const amountClass = t.type === 'Income' ? 'positive' : 'negative';
            const prefix = t.type === 'Income' ? '+' : '-';
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${t.description}</td>
                <td>${t.category}</td>
                <td><span class="badge ${badgeClass}">${t.type}</span></td>
                <td class="amount ${amountClass}">${prefix}${formatCurrency(t.amount)}</td>
                <td>
                    <button class="btn-icon" onclick="editTransaction('${t.id}')" title="Edit">
                        <span class="material-symbols-rounded">edit</span>
                    </button>
                    <button class="btn-icon delete" onclick="deleteTransaction('${t.id}')" title="Delete">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </td>
            `;
            // Append the newly created row to the table body
            transactionBody.appendChild(tr);
        });
    }

    // A Master function to refresh all parts of the UI at once
    function refreshUI() {
        saveToLocalStorage(); // Always save when UI updates
        updateDashboard();
        updateCategories();
        renderTable();
    }

    // === 7. CRUD Operations (Create, Update) ===
    form.addEventListener('submit', (e) => {
        // e.preventDefault() stops the browser from refreshing the page when we click submit
        e.preventDefault(); 

        const amount = parseFloat(amountInput.value);
        // Validation
        if (amount <= 0) {
            alert('Amount must be greater than 0.');
            return;
        }

        // Create an Object with the form data
        const transactionData = {
            description: descInput.value,
            amount: amount,
            date: dateInput.value,
            type: typeInput.value,
            category: categoryInput.value,
            notes: notesInput.value
        };

        const editingId = editIdInput.value;
        
        if (editingId) {
            // UPDATE: Find the index of the transaction we are editing
            const index = transactions.findIndex(t => t.id === editingId);
            if (index !== -1) {
                // Keep the old ID, update the rest
                transactions[index] = { ...transactionData, id: editingId };
            }
            
            // Reset UI back to "Add Mode"
            formTitle.textContent = 'Add New Transaction';
            saveBtn.textContent = 'Save Transaction';
            cancelBtn.style.display = 'none';
        } else {
            // CREATE: Generate a unique ID (we use current timestamp) and add to array
            transactionData.id = Date.now().toString(); 
            transactions.push(transactionData);
        }

        // Reset form inputs back to blank
        form.reset();
        dateInput.value = new Date().toISOString().split('T')[0]; // reset date to today
        editIdInput.value = '';
        
        // Refresh everything to show new data
        refreshUI();
    });

    // Handle Cancel Edit Button
    cancelBtn.addEventListener('click', () => {
        form.reset();
        dateInput.value = new Date().toISOString().split('T')[0];
        editIdInput.value = '';
        formTitle.textContent = 'Add New Transaction';
        saveBtn.textContent = 'Save Transaction';
        cancelBtn.style.display = 'none';
    });

    // === 8. CRUD Operations (Read, Delete) ===
    
    // We attach these to the global `window` object so our inline HTML onclick handlers can find them.
    window.editTransaction = function(id) {
        // Find the specific transaction object in our array
        const t = transactions.find(tx => tx.id === id);
        if (!t) return;
        
        // Populate the HTML form inputs with the data from that object
        editIdInput.value = t.id;
        descInput.value = t.description;
        amountInput.value = t.amount;
        dateInput.value = t.date;
        typeInput.value = t.type;
        categoryInput.value = t.category;
        notesInput.value = t.notes || '';
        
        // Change button text to indicate Edit mode
        formTitle.textContent = 'Edit Transaction';
        saveBtn.textContent = 'Update Transaction';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll smoothly to form for better mobile experience
        form.scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteTransaction = function(id) {
        // Show browser confirmation box
        if (confirm('Are you sure you want to delete this transaction?')) {
            // Filter OUT the deleted transaction (keep everything where id doesn't match)
            transactions = transactions.filter(t => t.id !== id);
            
            refreshUI();
            
            // If the user deleted the transaction while they were editing it, cancel the edit
            if (editIdInput.value === id) {
                cancelBtn.click();
            }
        }
    };

    // === 9. Event Listeners for Controls ===
    // Every time an input changes, re-run the renderTable function
    searchInput.addEventListener('input', renderTable);
    filterType.addEventListener('change', renderTable);
    filterCategory.addEventListener('change', renderTable);
    sortBy.addEventListener('change', renderTable);

    // Run once on load to show any existing data from localStorage
    refreshUI();
});
