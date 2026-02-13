import Student from "./models/Student";
import Teacher from "./models/Teacher";
import "./App.css";

function App() {
  const people = [
    new Student("Aarav", 20, "Computer Science"),
    new Teacher("Dr. Mehta", 45, "Data Structures"),
    new Student("Neha", 22, "Information Technology"),
    new Teacher("Ms. Sharma", 38, "Operating Systems"),
  ];

  return (
    <div className="app">
      <h1 className="title">Person Inheritance Demo</h1>

      <div className="card-grid">
        {people.map((person, index) => (
          <div className="person-card" key={index}>
            <span
              className={`role-badge ${
                person.getRole() === "Student" ? "student" : "teacher"
              }`}
            >
              {person.getRole()}
            </span>

            <p className="details">{person.getDetails()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
