const fs = require("fs");
const readline = require("readline");

const FILE = "employees.json";

function loadEmployees() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveEmployees(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

let employees = loadEmployees();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\n=== Employee Management System ===");
  console.log("1. Add Employee");
  console.log("2. View Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");

  rl.question("Choose an option: ", handleChoice);
}

function handleChoice(choice) {
  switch (choice) {
    case "1":
      addEmployee();
      break;
    case "2":
      viewEmployees();
      break;
    case "3":
      updateEmployee();
      break;
    case "4":
      deleteEmployee();
      break;
    case "5":
      rl.close();
      break;
    default:
      console.log("Invalid choice!");
      showMenu();
  }
}

function addEmployee() {
  rl.question("Enter ID: ", (id) => {
    if (employees.find((e) => e.id === id)) {
      console.log("Employee ID already exists!");
      return showMenu();
    }

    rl.question("Enter Name: ", (name) => {
      rl.question("Enter Department: ", (dept) => {
        rl.question("Enter Salary: ", (salary) => {
          if (isNaN(salary)) {
            console.log("Salary must be a number!");
            return showMenu();
          }

          employees.push({
            id,
            name,
            department: dept,
            salary: Number(salary),
          });

          saveEmployees(employees);
          console.log("Employee added successfully!");
          showMenu();
        });
      });
    });
  });
}

function viewEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.table(employees);
  }
  showMenu();
}

function updateEmployee() {
  rl.question("Enter Employee ID to update: ", (id) => {
    const emp = employees.find((e) => e.id === id);

    if (!emp) {
      console.log("Employee not found!");
      return showMenu();
    }

    rl.question("Enter new Name: ", (name) => {
      rl.question("Enter new Department: ", (dept) => {
        rl.question("Enter new Salary: ", (salary) => {
          if (isNaN(salary)) {
            console.log("Invalid salary!");
            return showMenu();
          }

          emp.name = name;
          emp.department = dept;
          emp.salary = Number(salary);

          saveEmployees(employees);
          console.log("Employee updated successfully!");
          showMenu();
        });
      });
    });
  });
}

function deleteEmployee() {
  rl.question("Enter Employee ID to delete: ", (id) => {
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      console.log("Employee not found!");
    } else {
      employees.splice(index, 1);
      saveEmployees(employees);
      console.log("Employee deleted successfully!");
    }
    showMenu();
  });
}

showMenu();
