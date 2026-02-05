import { useState } from "react";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import "./components/Library.css";

function App() {
  const [books, setBooks] = useState([
    { id: 1, title: "Clean Code", author: "Robert C. Martin" },
    { id: 2, title: "Atomic Habits", author: "James Clear" },
    { id: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt" },
  ]);

  const [search, setSearch] = useState("");

  const addBook = (book) => {
    setBooks([...books, book]);
  };

  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="library-app">
      <h1 className="title">Library Management System</h1>

      <input
        type="text"
        placeholder="Search book..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <BookForm addBook={addBook} />
      <BookList books={filteredBooks} removeBook={removeBook} />
    </div>
  );
}

export default App;
