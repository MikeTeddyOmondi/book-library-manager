import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Database from "./database.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await db.getAllBooks();
    res.json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await db.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }
    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create new book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: "Title and author are required",
      });
    }

    const bookId = await db.createBook({
      title,
      author,
      isbn,
      publishedYear,
      genre,
    });
    const newBook = await db.getBookById(bookId);

    res.status(201).json({
      success: true,
      data: newBook,
      message: "Book created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre } = req.body;
    const bookId = req.params.id;

    const existingBook = await db.getBookById(bookId);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    await db.updateBook(bookId, { title, author, isbn, publishedYear, genre });
    const updatedBook = await db.getBookById(bookId);

    res.json({
      success: true,
      data: updatedBook,
      message: "Book updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const existingBook = await db.getBookById(bookId);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    await db.deleteBook(bookId);

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Search books
app.get("/api/books/search/:query", async (req, res) => {
  try {
    const books = await db.searchBooks(req.params.query);
    res.json({
      success: true,
      data: books,
      count: books.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Library API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`📚 Library API server running on port ${PORT}`);
  console.log(`🌐 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
