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
const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    backgroundColor: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
};

export default App;
