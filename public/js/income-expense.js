function toggleMenu() {
    const navItems = document.querySelector('.nav-items');
    navItems.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", function() {
    const logForm = document.getElementById("logForm");
    const historyModal = document.getElementById("historyModal");
    const closeHistory = document.getElementById("closeHistory");
    const historyBody = document.getElementById("historyBody");
    const historyBodyModal = document.getElementById("historyBodyModal");
    const viewHistoryButton = document.getElementById("viewHistory");
    const sortBySelect = document.getElementById("sortBy");

    let entries = [];

    // Load entries from local storage when the page loads
    loadEntries();

    logForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission

        const description = document.getElementById("description").value;
        const type = document.getElementById("type").value;
        const amount = parseFloat(document.getElementById("amount").value).toFixed(2); // Ensure amount is a valid number
        const date = new Date().toLocaleDateString(); // Get current date
        const category = document.getElementById("category").value;
        const notes = document.getElementById("notes").value;
        const recurring = document.getElementById("recurring").checked;

        // Check if all fields are filled
        if (description === "" || category === "" || type === "" || isNaN(amount)) {
            alert("Please fill all fields before submitting.");
            return;
        }

        const entry = { date,  type, category, description, amount, notes, recurring };

        // Save the entry to local storage
        saveEntry(entry);

        // Add the entry to the table immediately
        renderEntries();
        
        // Clear the form fields
        logForm.reset();
    });

    // Show history modal when "View Your History" is clicked
    viewHistoryButton.addEventListener("click", function() {
        historyModal.classList.add("show");
        historyModal.classList.remove("hidden");
    });

    // Hide history modal when the left arrow is clicked
    closeHistory.addEventListener("click", function() {
        historyModal.classList.remove("show");
        historyModal.classList.add("hidden");
    });

    // Save an entry to local storage
    function saveEntry(entry) {
        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));
    }

    // Load entries from local storage and display them
    function loadEntries() {
        entries = JSON.parse(localStorage.getItem("entries")) || [];
        renderEntries(); // Render the entries on page load
    }

    // Render entries based on the sort option
    function renderEntries() {
        historyBody.innerHTML = "";  // Clear current table content
        historyBodyModal.innerHTML = "";  // Clear modal table content

        const sortedEntries = sortEntries(entries); // Sort entries before rendering

        sortedEntries.forEach(function(entry) {
            addEntryToTable(entry); // Add each entry to the table and modal
        });
    }

    // Add an entry to both the history table and the modal table
    function addEntryToTable(entry) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${entry.date}</td>
             <td>${entry.type}</td>
                <td>${entry.category}</td>
            <td>${entry.description}</td>
           
            <td>${entry.amount}</td>
             <td>${entry.notes}</td>
            <td>${entry.recurring ? 'Yes' : 'No'}</td>
        `;
        historyBody.appendChild(newRow); // Append row to main history table

        const newRowModal = document.createElement("tr");
        newRowModal.innerHTML = `
            <td>${entry.date}</td>
              <td>${entry.type}</td>
            <td>${entry.category}</td>
            <td>${entry.description}</td>
          
            <td>${entry.amount}</td>
            <td>${entry.notes}</td>
            <td>${entry.recurring ? 'Yes' : 'No'}</td>
        `;
        historyBodyModal.appendChild(newRowModal); // Append row to modal history table
    }

    // Sort entries based on the selected sort option
    function sortEntries(entries) {
        const sortBy = sortBySelect.value;

        return entries.slice().sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    // Parse date and sort by newest first
                    return new Date(b.date.split("/").reverse().join("-")) - new Date(a.date.split("/").reverse().join("-"));
                
                case "oldest":
                    // Parse date and sort by oldest first
                    return new Date(a.date.split("/").reverse().join("-")) - new Date(b.date.split("/").reverse().join("-"));

                case "amountAsc":
                    // Sort by amount ascending (smallest first)
                    return parseFloat(a.amount) - parseFloat(b.amount);

                case "amountDesc":
                    // Sort by amount descending (largest first)
                    return parseFloat(b.amount) - parseFloat(a.amount);

                case "income":
                    // Prioritize income over expense
                    return a.type === 'income' && b.type !== 'income' ? -1 : (b.type === 'income' && a.type !== 'income' ? 1 : 0);

                case "expense":
                    // Prioritize expense over income
                    return a.type === 'expense' && b.type !== 'expense' ? -1 : (b.type === 'expense' && a.type !== 'expense' ? 1 : 0);

                default:
                    return 0;
            }
        });
    }

    // Re-render entries when the sort option changes
    sortBySelect.addEventListener("change", renderEntries);
});

// Add this code inside the DOMContentLoaded event listener

const searchInput = document.getElementById("searchInput");

// Filter and highlight entries based on search input
searchInput.addEventListener("input", function() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = historyBodyModal.querySelectorAll("tr");

    rows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        if (textContent.includes(searchTerm)) {
            row.style.display = ""; // Show the row if it matches
            highlightMatch(row, searchTerm);
        } else {
            row.style.display = "none"; // Hide the row if it doesn't match
        }
    });
});

// Function to highlight matching text in the row
function highlightMatch(row, searchTerm) {
    const cells = row.querySelectorAll("td");
    cells.forEach(cell => {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        cell.innerHTML = cell.textContent.replace(regex, '<span class="highlight">$1</span>');
    });
}

// Load transactions from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTransactions);

// Event listener for adding new transactions
document.getElementById('submitDueTransaction').addEventListener('click', function () {
   const result = document.getElementById('result').value;
    const amountDue = document.getElementById('amountDue').value;
    const dueDate = new Date(document.getElementById('dueDate').value);
    const currentDate = new Date();

    // Create a new transaction object
    const transaction = {
        result,
        amountDue,
        dueDate: dueDate.toISOString(),
        completed: false
    };

    // Save the transaction to localStorage
    saveTransaction(transaction);

    // Add transaction to the UI
    addTransactionToList(transaction);

    // Clear the input fields
    document.getElementById('result').value = '';
    document.getElementById('amountDue').value = '';
    document.getElementById('dueDate').value = '';
});

// Function to load transactions from localStorage
function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    storedTransactions.forEach(addTransactionToList);
}

// Function to save transactions to localStorage
function saveTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to update transactions in localStorage after deletion or completion
function updateTransactions(updatedTransactions) {
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
}

// Function to add a transaction to the list
function addTransactionToList(transaction) {
    const transactionList = document.getElementById('dueTransactionList');
    const transactionItem = document.createElement('li');

    const transactionDate = new Date(transaction.dueDate);
    const currentDate = new Date();

    transactionItem.innerHTML = `
        Result: ${transaction.result},
        Amount: ${transaction.amountDue}, Due Date: ${transactionDate.toDateString()} 
        <button class="delete-btn">Delete</button>
        <button class="complete-btn">Mark as Completed</button>
    `;

    // Warning if due date is past
    if (currentDate > transactionDate && !transaction.completed) {
        const warning = document.createElement('span');
        warning.style.color = 'red';
        warning.innerText = ' - Due date ended, did you get the money? If yes then mark as completed.';
        transactionItem.appendChild(warning);
    }

    // Apply completed styles if the transaction is marked as completed
    if (transaction.completed) {
        transactionItem.classList.add('completed-transaction');
        transactionItem.querySelector('.complete-btn').remove();
    }

    // Add event listeners
    transactionItem.querySelector('.delete-btn').addEventListener('click', function () {
        deleteTransaction(transaction, transactionItem);
    });

    transactionItem.querySelector('.complete-btn')?.addEventListener('click', function () {
        completeTransaction(transaction, transactionItem);
    });

    transactionList.appendChild(transactionItem);
}

// Function to delete a transaction
function deleteTransaction(transaction, transactionItem) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const updatedTransactions = transactions.filter(t => t.result !== transaction.result || t.dueDate !== transaction.dueDate || t.amountDue !== transaction.amountDue);
    updateTransactions(updatedTransactions);
    transactionItem.remove();
}

// Function to mark a transaction as completed
function completeTransaction(transaction, transactionItem) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const updatedTransactions = transactions.map(t =>
        t.result === transaction.result &&
        t.dueDate === transaction.dueDate && t.amountDue === transaction.amountDue
            ? { ...t, completed: true }
            : t
    );
    updateTransactions(updatedTransactions);

    transactionItem.classList.add('completed-transaction');
    const warning = transactionItem.querySelector('span');
    if (warning) warning.remove();
    transactionItem.querySelector('.complete-btn').remove();
}
