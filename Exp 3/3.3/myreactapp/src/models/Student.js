import Person from "./Person";

class Student extends Person {
  constructor(name, age, course) {
    super(name, age);
    this.course = course;
  }

  // Method Overriding
  getRole() {
    return "Student";
  }

  getDetails() {
    return `Name: ${this.name}, Age: ${this.age}, Course: ${this.course}`;
  }
}

export default Student;
