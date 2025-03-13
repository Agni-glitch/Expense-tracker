// Selecting the DOM elements
const expenseType = document.getElementById("expense-type");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const addExpenseButton = document.querySelector(".add-expense-btn");
const totalExpenseElement = document.querySelector(".total-expense-amount");
const debitContainer = document.querySelector(".expense-debit-item-container");
const creditContainer = document.querySelector(
  ".expense-credit-item-container"
);
const expenseChartElement = document.getElementById("expenseChart");

let totalDebit = 0;
let totalCredit = 0;

// Function to update the total expense amount and the pie chart
function updateExpenseData() {
  const total = totalDebit - totalCredit;
  totalExpenseElement.textContent = `₹${total.toFixed(2)}`;

  // Update the pie chart data
  expenseChart.data.datasets[0].data = [totalDebit, totalCredit];
  expenseChart.update();
}

// Function to add an expense
function addExpense(event) {
  event.preventDefault();

  const expenseDescription = desc.value.trim();
  const expenseAmount = parseFloat(amount.value.trim());

  if (!expenseDescription || isNaN(expenseAmount) || expenseAmount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }

  // Create a new expense item element
  const expenseItem = document.createElement("div");
  expenseItem.classList.add("expense-item");

  const expenseHTML = `
        <div class="expense-item-description">${expenseDescription}</div>
        <div class="expense-item-amount">₹${expenseAmount.toFixed(2)}</div>
    `;
  expenseItem.innerHTML = expenseHTML;

  // Add to either debit or credit container
  if (expenseType.value === "debit") {
    debitContainer.appendChild(expenseItem);
    totalDebit += expenseAmount;
  } else {
    creditContainer.appendChild(expenseItem);
    totalCredit += expenseAmount;
  }

  // Update the total expense data and the chart
  updateExpenseData();

  // Clear the input fields
  desc.value = "";
  amount.value = "";
  expenseType.value = "debit";
}

// Event listener for the "Add Expense" button
addExpenseButton.addEventListener("click", addExpense);

// Initialize the chart
let expenseChart = new Chart(expenseChartElement, {
  type: "pie",
  data: {
    labels: ["Debit", "Credit"],
    datasets: [
      {
        label: "Expenses",
        data: [totalDebit, totalCredit],
        backgroundColor: ["#ff4c4c", "#4caf50"],
        borderColor: ["#ff4c4c", "#4caf50"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": ₹" + tooltipItem.raw.toFixed(2);
          },
        },
      },
    },
  },
});

// Function to remove an expense
function removeExpense(event) {
  const expenseItem = event.target.closest(".expense-item");
  const expenseAmount = parseFloat(
    expenseItem
      .querySelector(".expense-item-amount")
      .textContent.replace("₹", "")
      .trim()
  );

  if (expenseItem.parentElement === debitContainer) {
    totalDebit -= expenseAmount;
  } else {
    totalCredit -= expenseAmount;
  }

  expenseItem.remove(); // Remove the expense item from the list
  updateExpenseData(); // Update the totals and the chart
}

// Modify addExpense function to include delete button
function addExpense(event) {
  event.preventDefault();

  const expenseDescription = desc.value.trim();
  const expenseAmount = parseFloat(amount.value.trim());

  if (!expenseDescription || isNaN(expenseAmount) || expenseAmount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }

  // Create a new expense item element
  const expenseItem = document.createElement("div");
  expenseItem.classList.add("expense-item");

  const expenseHTML = `
        <div class="expense-item-description">${expenseDescription}</div>
        <div class="expense-item-amount">₹${expenseAmount.toFixed(2)}</div>
        <button class="delete-expense-btn">Delete</button>
    `;
  expenseItem.innerHTML = expenseHTML;

  // Add event listener for deleting the expense
  const deleteButton = expenseItem.querySelector(".delete-expense-btn");
  deleteButton.addEventListener("click", removeExpense);

  // Add to either debit or credit container
  if (expenseType.value === "debit") {
    debitContainer.appendChild(expenseItem);
    totalDebit += expenseAmount;
  } else {
    creditContainer.appendChild(expenseItem);
    totalCredit += expenseAmount;
  }

  // Update the total expense data and the chart
  updateExpenseData();

  // Clear the input fields
  desc.value = "";
  amount.value = "";
  expenseType.value = "debit";
}

// Selecting the search input
const searchInput = document.getElementById("search-input");

// Function to search and filter expenses by description
function searchExpenses() {
  const searchTerm = searchInput.value.toLowerCase();

  // Get all expense items
  const allExpenseItems = [
    ...debitContainer.querySelectorAll(".expense-item"),
    ...creditContainer.querySelectorAll(".expense-item"),
  ];

  allExpenseItems.forEach((item) => {
    const description = item
      .querySelector(".expense-item-description")
      .textContent.toLowerCase();
    if (description.includes(searchTerm)) {
      item.style.display = "block"; // Show the item
    } else {
      item.style.display = "none"; // Hide the item
    }
  });
}

// Event listener for search input
searchInput.addEventListener("input", searchExpenses);

// Function to export expenses as CSV
function exportToCSV() {
  const expenses = [];

  // Get all expense items (both debit and credit)
  const allExpenseItems = [
    ...debitContainer.querySelectorAll(".expense-item"),
    ...creditContainer.querySelectorAll(".expense-item"),
  ];

  // Iterate through each expense item and extract data
  allExpenseItems.forEach((item) => {
    const description = item.querySelector(
      ".expense-item-description"
    ).textContent;
    const amount = item
      .querySelector(".expense-item-amount")
      .textContent.replace("₹", "")
      .trim();
    const type = item.parentElement === debitContainer ? "Debit" : "Credit";
    expenses.push([description, type, amount]);
  });

  // Convert expenses to CSV format
  let csvContent = "Description,Type,Amount\n";
  expenses.forEach((expense) => {
    csvContent += expense.join(",") + "\n";
  });

  // Create a Blob and download the file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
}

// Event listener for the export button
const exportButton = document.getElementById("export-btn");
exportButton.addEventListener("click", exportToCSV);

const darkModeToggle = document.getElementById("dark-mode-toggle");
const moonIcon = document.querySelector(".fa-moon"); // Moon icon for dark mode
const sunIcon = document.createElement("i");
sunIcon.classList.add("fas", "fa-sun"); // Sun icon for light mode

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Toggle the icon when dark mode is activated
  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.innerHTML = "";
    darkModeToggle.appendChild(sunIcon); // Show sun icon for light mode
  } else {
    darkModeToggle.innerHTML = "";
    darkModeToggle.appendChild(moonIcon); // Show moon icon for dark mode
  }
});
