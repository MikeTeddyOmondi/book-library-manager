import path from "path";
import SQLite3 from "sqlite3";

const sqlite3 = SQLite3.verbose();

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

    const createFilesTableQuery = `
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        object_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id)
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error("Error creating books table:", err);
      } else {
        console.log("📊 Database initialized successfully");
      }
    });

    this.db.run(createFilesTableQuery, (err) => {
      if (err) {
        console.error("Error creating files table:", err);
      } else {
        console.log("📊 Files table initialized successfully");
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

  // Create file record
  createFile(fileData) {
    const { bookId, filename, objectName } = fileData;
    const query = `
      INSERT INTO files (book_id, filename, object_name)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      this.db.run(query, [bookId, filename, objectName], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  // Get files by book ID
  getFilesByBookId(bookId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM files WHERE book_id = ?",
        [bookId],
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
