import sqlite3pkg from "sqlite3";
const sqlite3 = sqlite3pkg.verbose();
import path from "path";

class Database {
  constructor(dbPath = "./library.db") {
    this.dbPath = dbPath;
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  init() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE,
        published_year INTEGER,
        genre TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Error creating books table:", err);
      } else {
        console.log("📊 Database initialized successfully");
      }
    });
  }

  // Get all books
  getAllBooks() {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM books ORDER BY created_at DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // Get book by ID
  getBookById(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Create new book
  createBook(book) {
    return new Promise((resolve, reject) => {
      const { title, author, isbn, publishedYear, genre } = book;
      const query = `
        INSERT INTO books (title, author, isbn, published_year, genre)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db.run(
        query,
        [title, author, isbn, publishedYear, genre],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // Update book
  updateBook(id, book) {
    return new Promise((resolve, reject) => {
      const { title, author, isbn, publishedYear, genre } = book;
      const query = `
        UPDATE books 
        SET title = COALESCE(?, title),
            author = COALESCE(?, author),
            isbn = COALESCE(?, isbn),
            published_year = COALESCE(?, published_year),
            genre = COALESCE(?, genre),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      this.db.run(
        query,
        [title, author, isbn, publishedYear, genre, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  // Delete book
  deleteBook(id) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM books WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  // Search books
  searchBooks(query) {
    return new Promise((resolve, reject) => {
      const searchQuery = `
        SELECT * FROM books 
        WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?
        ORDER BY created_at DESC
      `;
      const searchTerm = `%${query}%`;

      this.db.all(
        searchQuery,
        [searchTerm, searchTerm, searchTerm],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  // Close database connection
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default Database;
