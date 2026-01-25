let balance = 1000;

function deposit() {
    const amount = Number(document.getElementById("amount").value);
    const message = document.getElementById("message");

    if (amount <= 0) {
        message.textContent = "Enter a valid deposit amount";
        message.style.color = "red";
        return;
    }

    balance += amount;
    updateUI("Deposit successful", "green");
}

function withdraw() {
    const amount = Number(document.getElementById("amount").value);
    const message = document.getElementById("message");

    if (amount <= 0) {
        message.textContent = "Enter a valid withdrawal amount";
        message.style.color = "red";
        return;
    }

    if (amount > balance) {
        message.textContent = "Insufficient balance";
        message.style.color = "red";
        return;
    }

    balance -= amount;
    updateUI("Withdrawal successful", "green");
}

function updateUI(text, color) {
    document.getElementById("balance").textContent = balance;
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.color = color;
    document.getElementById("amount").value = "";
}
