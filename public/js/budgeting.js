function toggleMenu() {
    const navItems = document.querySelector('.nav-items');
    navItems.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const mainContent = document.querySelector('.main-content');

    // Toggle sidebar visibility
    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('active');
    });
});


document.addEventListener('DOMContentLoaded', function () {
    updateTotals(); // Initialize totals from local storage

    // Event listener for adding income
    document.getElementById('income-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addTransaction('income');
    });

    // Event listener for adding expense
    document.getElementById('expense-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addTransaction('expense');
    });
});

// Function to add a transaction
function addTransaction(type) {
    const amount = document.getElementById(`${type}-amount`).value;
    const date = document.getElementById(`${type}-date`).value;

    if (amount === '' || date === '') {
        alert('Please fill out all fields');
        return;
    }

    // Create transaction object
    const transaction = {
        type: type,
        amount: parseFloat(amount),
        date: new Date(date).toLocaleDateString()
    };

    // Save transaction to localStorage
    saveTransaction(transaction);
    updateTotals(); // Update totals section

    // Reset the form
    document.getElementById(`${type}-form`).reset();
}

// Save transaction to local storage
function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to update the totals
function updateTotals() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate total income and expenses
    transactions.forEach((transaction) => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            totalExpenses += transaction.amount;
        }
    });

    // Update DOM elements with the totals
    document.querySelector('.income-total p').textContent = `$${totalIncome.toFixed(2)}`;
    document.querySelector('.expense-total p').textContent = `$${totalExpenses.toFixed(2)}`;
    document.querySelector('.balance-total p').textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
}

// Function to display transactions (optional)
function displayTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const listContainer = document.querySelector('.transaction-list');
    listContainer.innerHTML = ''; // Clear list before appending

    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.textContent = `${transaction.type}: $${transaction.amount} on ${transaction.date}`;
        listContainer.appendChild(li);
    });
}

// Initialize arrays to hold the details
// Initialize arrays to hold the details
const incomeDetails = JSON.parse(localStorage.getItem('incomeDetails')) || [];
const expenseDetails = JSON.parse(localStorage.getItem('expenseDetails')) || [];
const savingsDetails = JSON.parse(localStorage.getItem('savingsDetails')) || [];
const goalsDetails = JSON.parse(localStorage.getItem('goalsDetails')) || [];

// Function to update the overlay
function updateOverlay(title, details) {
    document.getElementById('overlay-title').textContent = title;
    const overlayDetails = document.getElementById('overlay-details');
    overlayDetails.innerHTML = ''; // Clear previous details

    details.forEach(detail => {
        const li = document.createElement('li');
        li.textContent = detail;
        overlayDetails.appendChild(li);
    });

    document.getElementById('overlay').style.display = 'flex'; // Show overlay
}

// Function to close overlay
document.getElementById('close-overlay').addEventListener('click', function() {
    document.getElementById('overlay').style.display = 'none'; // Hide overlay
});

// Handle form submissions
document.getElementById('income-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('income-amount').value;
    const date = document.getElementById('income-date').value;
    const detail = `Amount: ${amount}, Date: ${date}`;
    incomeDetails.push(detail);
    localStorage.setItem('incomeDetails', JSON.stringify(incomeDetails)); // Save to local storage
    this.reset(); // Reset the form
});

document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('expense-amount').value;
    const date = document.getElementById('expense-date').value;
    const detail = `Amount: ${amount}, Date: ${date}`;
    expenseDetails.push(detail);
    localStorage.setItem('expenseDetails', JSON.stringify(expenseDetails)); // Save to local storage
    this.reset(); // Reset the form
});

document.getElementById('savings-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('savings-amount').value;
    const date = document.getElementById('savings-date').value;
    const detail = `Amount: ${amount}, Date: ${date}`;
    savingsDetails.push(detail);
    localStorage.setItem('savingsDetails', JSON.stringify(savingsDetails)); // Save to local storage
    this.reset(); // Reset the form
});

document.getElementById('goals-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = document.getElementById('goals-amount').value;
    const date = document.getElementById('goals-date').value;
    const detail = `Amount: ${amount}, Date: ${date}`;
    goalsDetails.push(detail);
    localStorage.setItem('goalsDetails', JSON.stringify(goalsDetails)); // Save to local storage
    this.reset(); // Reset the form
});

// Click event for sidebar items
document.querySelectorAll('.tabs a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');

        switch (target) {
            case 'income':
                updateOverlay('Income Details', incomeDetails);
                break;
            case 'expenses':
                updateOverlay('Expense Details', expenseDetails);
                break;
            case 'savings':
                updateOverlay('Savings Details', savingsDetails);
                break;
            case 'goals':
                updateOverlay('Goals Details', goalsDetails);
                break;
        }
    });
});



// Function to show the history overlay
document.addEventListener('DOMContentLoaded', function () {
    // Event listener for opening the overlay
    document.querySelector('a[data-target="history"]').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        showHistoryOverlay();
    });

    // Event listener for closing the overlay
    document.querySelector('.close-overlay').addEventListener('click', closeHistoryOverlay);
});

// Function to show the history overlay
function showHistoryOverlay() {
    const overlay = document.getElementById('history-overlay');
    overlay.style.display = 'flex'; // Show overlay
    populateHistoryTable(); // Populate the table with data
}

// Function to close the overlay
function closeHistoryOverlay() {
    const overlay = document.getElementById('history-overlay');
    overlay.style.display = 'none'; // Hide overlay
}

// Function to populate the history table
function populateHistoryTable() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const historyBody = document.getElementById('history-body');
    historyBody.innerHTML = ''; // Clear existing rows

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        const date = new Date(transaction.date);

        // Create cells for each column
        row.innerHTML = `
            <td>${date.toLocaleDateString()}</td>
            <td>${date.toLocaleString('default', { month: 'long' })}</td>
            <td>${transaction.type === 'income' ? transaction.amount.toFixed(2) : '-'}</td>
            <td>${transaction.type === 'expense' ? transaction.amount.toFixed(2) : '-'}</td>
            <td>${transaction.type === 'savings' ? transaction.amount.toFixed(2) : '-'}</td>
            <td>${transaction.type === 'goals' ? transaction.amount.toFixed(2) : '-'}</td>
            <td>${calculateRemainingBalance().toFixed(2)}</td>
        `;
        historyBody.appendChild(row);
    });
}

// Function to calculate remaining balance
function calculateRemainingBalance() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalSavings = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            totalExpenses += transaction.amount;
        } else if (transaction.type === 'savings') {
            totalSavings += transaction.amount;
        }
    });

    return totalIncome - totalExpenses - totalSavings;
}
