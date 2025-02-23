let transactions = [];

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const type = document.getElementById('type').value;
    const exchangeRate = parseFloat(document.getElementById('exchangeRate').value);

    if (!description || isNaN(amount) || isNaN(exchangeRate)) {
        alert('Please fill all fields correctly.');
        return;
    }

    const transaction = {
        description,
        amount: type === 'expense' ? -amount : amount, // Negative for expenses
        currency,
        type,
        exchangeRate
    };

    transactions.push(transaction);
    updateTable();
    updateBalance();
    clearForm();
}

function updateTable() {
    const tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = transaction.description;

        const typeCell = document.createElement('td');
        typeCell.textContent = transaction.type === 'income' ? 'Income' : 'Expense';

        const amountIRRCell = document.createElement('td');
        const amountUSD = transaction.currency === 'USD' ? transaction.amount : transaction.amount / transaction.exchangeRate;
        const amountIRR = transaction.currency === 'IRR' ? transaction.amount : transaction.amount * transaction.exchangeRate;
        amountIRRCell.textContent = formatNumber(amountIRR.toFixed(3)); // Format IRR amount

        const amountUSDCell = document.createElement('td');
        amountUSDCell.textContent = formatNumber(amountUSD.toFixed(3)); // Format USD amount

        const actionsCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        editButton.onclick = () => editTransaction(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deleteTransaction(index);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(descriptionCell);
        row.appendChild(typeCell);
        row.appendChild(amountIRRCell);
        row.appendChild(amountUSDCell);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

function updateBalance() {
    let totalIRR = 0;
    let totalUSD = 0;

    transactions.forEach(transaction => {
        if (transaction.currency === 'IRR') {
            totalIRR += transaction.amount;
        } else {
            totalUSD += transaction.amount;
        }
    });

    // Convert USD to IRR for total balance
    const exchangeRate = parseFloat(document.getElementById('exchangeRate').value);
    totalIRR += totalUSD * exchangeRate;

    // Update balance display
    document.getElementById('balanceIRR').textContent = formatNumber(totalIRR.toFixed(3)) + ' IRR';
    document.getElementById('balanceUSD').textContent = formatNumber(totalUSD.toFixed(3)) + ' USD';
}

function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('currency').value = 'IRR';
    document.getElementById('type').value = 'income';
    document.getElementById('exchangeRate').value = '90000';
}

function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = Math.abs(transaction.amount); // Show absolute value
    document.getElementById('currency').value = transaction.currency;
    document.getElementById('type').value = transaction.type;
    document.getElementById('exchangeRate').value = transaction.exchangeRate;

    transactions.splice(index, 1);
    updateTable();
    updateBalance();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateTable();
    updateBalance();
}

// Function to format numbers with commas
function formatNumber(number) {
    return parseFloat(number).toLocaleString('en');
}