# Book Library Management System

---

## Documentation

A comprehensive book library management system with both REST API and CLI interface built with Express.js, Commander.js, and SQLite. This system provides complete CRUD operations through both web API endpoints and command-line interface, including server management capabilities.

## Table of Contents

- [Features](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#features)
- [Installation](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#installation)
- [Quick Start](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#quick-start)
- [API Documentation](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#api-documentation)
- [CLI Documentation](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#cli-documentation)
- [Database Schema](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#database-schema)
- [File Structure](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#file-structure)
- [Usage Examples](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#usage-examples)
- [Development](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#development)
- [Troubleshooting](https://claude.ai/chat/975eb28c-871a-4624-854d-5657f5a1a930#troubleshooting)

## Features

### REST API

- **GET** `/api/books` - Get all books with pagination support
- **GET** `/api/books/:id` - Get book by ID
- **POST** `/api/books` - Create new book with validation
- **PUT** `/api/books/:id` - Update existing book
- **DELETE** `/api/books/:id` - Delete book
- **GET** `/api/books/search/:query` - Search books by title, author, or genre
- **GET** `/api/health` - Health check endpoint

### CLI Interface

- **Server Management**: Start, stop, restart, and monitor API server
- **Book Operations**: Complete CRUD operations via command line
- **Search & Analytics**: Search books and view library statistics
- **Interactive Features**: Confirmation prompts and formatted output

### Technical Features

- SQLite database with automatic initialization
- CORS enabled for cross-origin requests
- Security headers with Helmet.js
- Request logging with Morgan
- Error handling and validation
- Process management for server operations
- Background daemon mode for server

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Create project directory and navigate to it:**

```bash
mkdir book-library-system
cd book-library-system
```

2. **Create package.json:**

```json
{
  "name": "book-library-manager",
  "version": "1.0.0",
  "description": "Book library management system with Express API and CLI",
  "main": "server.js",
  "bin": {
    "library": "./cli.js"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "cli": "node cli.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "commander": "^11.0.0",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["express", "commander", "cli", "library", "books"],
  "author": "Your Name",
  "license": "MIT"
}
```

3. **Install dependencies:**

```bash
npm install
```

4. **Create the application files** (server.js, database.js, cli.js - see File Structure section)
  
5. **Optional: Install globally for system-wide CLI access:**
  

```bash
npm install -g .
```

## Quick Start

### 1. Start the API Server

```bash
# Using CLI (recommended)
node cli.js server start

# Or using npm script
npm start
```

### 2. Add some books

```bash
# Using CLI
node cli.js add -t "1984" -a "George Orwell" -g "Dystopian Fiction" -y 1949
node cli.js add -t "To Kill a Mockingbird" -a "Harper Lee" -g "Fiction" -y 1960

# Using API
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Pride and Prejudice","author":"Jane Austen","genre":"Romance","publishedYear":1813}'
```

### 3. List books

```bash
# Using CLI
node cli.js list

# Using API
curl http://localhost:3000/api/books
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### GET /books

Get all books in the library.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "1984",
      "author": "George Orwell",
      "isbn": "978-0-452-28423-4",
      "published_year": 1949,
      "genre": "Dystopian Fiction",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

#### GET /books/:id

Get a specific book by ID.

**Parameters:**

- `id` (path) - Book ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "1984",
    "author": "George Orwell",
    "isbn": "978-0-452-28423-4",
    "published_year": 1949,
    "genre": "Dystopian Fiction",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST /books

Create a new book.

**Request Body:**

```json
{
  "title": "Book Title",      // Required
  "author": "Author Name",    // Required
  "isbn": "978-1-234-56789-0", // Optional
  "publishedYear": 2024,      // Optional
  "genre": "Fiction"          // Optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "978-1-234-56789-0",
    "published_year": 2024,
    "genre": "Fiction",
    "created_at": "2024-01-15T10:35:00.000Z",
    "updated_at": "2024-01-15T10:35:00.000Z"
  },
  "message": "Book created successfully"
}
```

#### PUT /books/:id

Update an existing book.

**Parameters:**

- `id` (path) - Book ID

**Request Body:** (All fields optional)

```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "isbn": "978-1-234-56789-1",
  "publishedYear": 2025,
  "genre": "Updated Genre"
}
```

#### DELETE /books/:id

Delete a book.

**Parameters:**

- `id` (path) - Book ID

**Response:**

```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

#### GET /books/search/:query

Search books by title, author, or genre.

**Parameters:**

- `query` (path) - Search term

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "1984",
      "author": "George Orwell",
      "genre": "Dystopian Fiction"
    }
  ],
  "count": 1
}
```

#### GET /health

Health check endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Library API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## CLI Documentation

### Server Management Commands

#### library server start

Start the API server.

**Options:**

- `-p, --port <port>` - Port to run server on (default: 3000)
- `-d, --daemon` - Run server in background

**Examples:**

```bash
# Start server in foreground (shows logs)
library server start

# Start server in background
library server start --daemon

# Start server on custom port
library server start -p 8080

# Start server in background on custom port
library server start --daemon -p 8080
```

#### library server stop

Stop the background API server.

**Examples:**

```bash
library server stop
```

#### library server status

Check API server status and connectivity.

**Examples:**

```bash
library server status
```

**Output:**

```
🟢 Server is running (PID: 12345)
✅ API is responding on port 3000
🌐 Health check: Library API is running
```

#### library server restart

Restart the API server.

**Options:**

- `-p, --port <port>` - Port to run server on (default: 3000)

**Examples:**

```bash
library server restart
library server restart -p 8080
```

#### library server logs

Show information about viewing server logs.

### Book Management Commands

#### library list

List all books in the library.

**Aliases:** `ls`

**Options:**

- `-s, --sort <field>` - Sort by field (title, author, year) [default: title]

**Examples:**

```bash
library list
library ls
library list --sort author
```

**Output:**

```
📚 Found 2 book(s):

ID  Title                         Author                   Year  Genre
--------------------------------------------------------------------------------
1   1984                          George Orwell            1949  Dystopian Fiction
2   To Kill a Mockingbird         Harper Lee               1960  Fiction
```

#### library add

Add a new book to the library.

**Required Options:**

- `-t, --title <title>` - Book title
- `-a, --author <author>` - Book author

**Optional Options:**

- `-i, --isbn <isbn>` - Book ISBN
- `-y, --year <year>` - Published year
- `-g, --genre <genre>` - Book genre

**Examples:**

```bash
library add -t "1984" -a "George Orwell"
library add -t "Pride and Prejudice" -a "Jane Austen" -g "Romance" -y 1813 -i "978-0-14-143951-8"
```

#### library view <id>

View detailed information about a specific book.

**Parameters:**

- `id` - Book ID

**Examples:**

```bash
library view 1
```

**Output:**

```
📖 Book Details:
================
ID: 1
Title: 1984
Author: George Orwell
ISBN: 978-0-452-28423-4
Published Year: 1949
Genre: Dystopian Fiction
Added: 1/15/2024
Updated: 1/15/2024
```

#### library update <id>

Update a book in the library.

**Parameters:**

- `id` - Book ID

**Options:** (All optional)

- `-t, --title <title>` - Book title
- `-a, --author <author>` - Book author
- `-i, --isbn <isbn>` - Book ISBN
- `-y, --year <year>` - Published year
- `-g, --genre <genre>` - Book genre

**Examples:**

```bash
library update 1 -g "Classic Literature"
library update 2 -t "New Title" -a "New Author"
```

#### library delete <id>

Delete a book from the library.

**Aliases:** `rm`

**Parameters:**

- `id` - Book ID

**Options:**

- `-f, --force` - Force delete without confirmation

**Examples:**

```bash
library delete 1
library rm 2 --force
```

**Interactive Example:**

```bash
$ library delete 1
Are you sure you want to delete "1984" by George Orwell? (y/N): y
✅ Book "1984" deleted successfully.
```

#### library search <query>

Search books by title, author, or genre.

**Parameters:**

- `query` - Search term

**Examples:**

```bash
library search "George Orwell"
library search "Fiction"
library search "1984"
```

#### library stats

Show library statistics.

**Examples:**

```bash
library stats
```

**Output:**

```
📊 Library Statistics:
======================
Total Books: 5

Books by Genre:
  Fiction: 2
  Dystopian Fiction: 1
  Romance: 1
  Unknown: 1
```

### Global CLI Options

All CLI commands support these global options:

- `--help` - Show help for command
- `--version` - Show CLI version

**Examples:**

```bash
library --help
library server --help
library add --help
```

## Database Schema

The system uses SQLite with the following schema:

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  published_year INTEGER,
  genre TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Field Descriptions

- `id` - Auto-incrementing primary key
- `title` - Book title (required)
- `author` - Book author (required)
- `isbn` - International Standard Book Number (unique, optional)
- `published_year` - Year the book was published (optional)
- `genre` - Book genre/category (optional)
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated

## File Structure

```
book-library-system/
├── package.json          # Project configuration and dependencies
├── server.js            # Express API server
├── database.js          # Database operations and management
├── cli.js              # Commander CLI interface
├── library.db          # SQLite database (created automatically)
├── .server.pid         # Server process ID (created when running in background)
└── README.md           # This documentation
```

### File Descriptions

#### server.js

The main Express.js application server containing:

- REST API endpoints
- Middleware configuration (CORS, Helmet, Morgan)
- Error handling
- Route definitions
- Server startup logic

#### database.js

Database abstraction layer containing:

- SQLite database connection management
- CRUD operation methods
- Database initialization
- Search functionality
- Promise-based async operations

#### cli.js

Commander.js CLI application containing:

- Command definitions and options
- Server management commands
- Book management commands
- Interactive prompts and confirmations
- Output formatting

## Usage Examples

### Complete Workflow Example

```bash
# 1. Start the server
library server start --daemon

# 2. Check server status
library server status

# 3. Add some books
library add -t "The Great Gatsby" -a "F. Scott Fitzgerald" -g "Classic" -y 1925
library add -t "Dune" -a "Frank Herbert" -g "Science Fiction" -y 1965
library add -t "The Catcher in the Rye" -a "J.D. Salinger" -g "Fiction" -y 1951

# 4. List all books
library list

# 5. Search for books
library search "Fiction"

# 6. View specific book
library view 1

# 7. Update a book
library update 1 -g "American Literature"

# 8. Show statistics
library stats

# 9. Stop the server
library server stop
```

### API Integration Examples

#### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Get all books
curl http://localhost:3000/api/books

# Add a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "genre": "Fantasy",
    "publishedYear": 1937,
    "isbn": "978-0-547-92822-7"
  }'

# Update a book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"genre": "Epic Fantasy"}'

# Search books
curl http://localhost:3000/api/books/search/tolkien

# Delete a book
curl -X DELETE http://localhost:3000/api/books/1
```

#### Using JavaScript fetch

```javascript
// Get all books
const books = await fetch('http://localhost:3000/api/books')
  .then(res => res.json());

// Add a book
const newBook = await fetch('http://localhost:3000/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian Fiction',
    publishedYear: 1932
  })
}).then(res => res.json());
```

#### Using Python requests

```python
import requests

# Get all books
response = requests.get('http://localhost:3000/api/books')
books = response.json()

# Add a book
new_book = {
    'title': 'Fahrenheit 451',
    'author': 'Ray Bradbury',
    'genre': 'Dystopian Fiction',
    'publishedYear': 1953
}
response = requests.post('http://localhost:3000/api/books', json=new_book)
result = response.json()
```

## Development

### Development Setup

```bash
# Install dependencies
npm install

# Start server in development mode (with auto-restart)
npm run dev

# Or start with CLI
library server start
```

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Adding New Features

#### Adding a new API endpoint

1. Add route definition in `server.js`
2. Add corresponding database method in `database.js`
3. Update CLI command in `cli.js` if needed
4. Update documentation

#### Adding a new CLI command

1. Add command definition in `cli.js`
2. Add any required database methods in `database.js`
3. Update documentation

### Database Management

#### Backup Database

```bash
# Copy the SQLite file
cp library.db library_backup.db
```

#### Reset Database

```bash
# Delete the database file (it will be recreated)
rm library.db
```

#### View Database Contents

```bash
# Using SQLite CLI
sqlite3 library.db
.tables
.schema books
SELECT * FROM books;
.quit
```

## Troubleshooting

### Common Issues

#### Server won't start

```bash
# Check if port is already in use
netstat -tulpn | grep :3000

# Start server on different port
library server start -p 8080
```

#### Database locked error

```bash
# Stop the server first
library server stop

# Then restart
library server start
```

#### CLI command not found

```bash
# Make sure you're in the project directory
pwd

# Use node directly if CLI isn't installed globally
node cli.js --help

# Or install globally
npm install -g .
```

#### Permission denied on Linux/Mac

```bash
# Make CLI executable
chmod +x cli.js

# Or use node directly
node cli.js server start
```

### Error Messages

#### "Book not found"

- Verify the book ID exists with `library list`
- Use `library view <id>` to check specific book

#### "Server process not found"

- The server may have crashed or been terminated
- Use `library server status` to check
- Clean start with `library server start`

#### "API request failed"

- Check if server is running with `library server status`
- Verify the correct port is being used
- Check firewall settings

### Logging and Debugging

#### Server Logs

```bash
# Start server in foreground to see logs
library server start

# Check server status
library server status
```

#### Database Debugging

```bash
# View database file
sqlite3 library.db "SELECT * FROM books;"

# Check database schema
sqlite3 library.db ".schema"
```

### Performance Considerations

- SQLite is suitable for small to medium libraries (up to ~100,000 books)
- For larger datasets, consider PostgreSQL or MySQL
- Add database indexes for better search performance
- Use connection pooling for high-traffic scenarios

### Security Considerations

- The system is designed for local/internal use
- Add authentication for production deployments
- Validate and sanitize all inputs
- Use HTTPS in production
- Regular security updates for dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Support

For issues, questions, or contributions:

1. Check the troubleshooting section
2. Review the documentation
3. Create an issue in the repository
4. Contact the development team

**Happy reading and organizing! 📚**

---

## Source

```js
// package.json
{
  "name": "book-library-manager",
  "version": "1.0.0",
  "description": "Book library management system with Express API and CLI",
  "main": "server.js",
  "bin": {
    "library": "./cli.js"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "cli": "node cli.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "commander": "^11.0.0",
    "sqlite3": "^5.1.6",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["express", "commander", "cli", "library", "books"],
  "author": "Your Name",
  "license": "MIT"
}

// server.js - Express API Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await db.getAllBooks();
    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await db.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new book
app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Title and author are required'
      });
    }

    const bookId = await db.createBook({ title, author, isbn, publishedYear, genre });
    const newBook = await db.getBookById(bookId);

    res.status(201).json({
      success: true,
      data: newBook,
      message: 'Book created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update book
app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre } = req.body;
    const bookId = req.params.id;

    const existingBook = await db.getBookById(bookId);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    await db.updateBook(bookId, { title, author, isbn, publishedYear, genre });
    const updatedBook = await db.getBookById(bookId);

    res.json({
      success: true,
      data: updatedBook,
      message: 'Book updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const existingBook = await db.getBookById(bookId);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    await db.deleteBook(bookId);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search books
app.get('/api/books/search/:query', async (req, res) => {
  try {
    const books = await db.searchBooks(req.params.query);
    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Library API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`📚 Library API server running on port ${PORT}`);
  console.log(`🌐 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;

// database.js - Database management
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor(dbPath = './library.db') {
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
        console.error('Error creating books table:', err);
      } else {
        console.log('📊 Database initialized successfully');
      }
    });
  }

  // Get all books
  getAllBooks() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM books ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get book by ID
  getBookById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
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

      this.db.run(query, [title, author, isbn, publishedYear, genre], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
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

      this.db.run(query, [title, author, isbn, publishedYear, genre, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  // Delete book
  deleteBook(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
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

      this.db.all(searchQuery, [searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
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

module.exports = Database;

// cli.js - Commander CLI Interface
#!/usr/bin/env node

const { Command } = require('commander');
const Database = require('./database');

const program = new Command();
const db = new Database();

// CLI configuration
program
  .name('library')
  .description('Book Library Management CLI')
  .version('1.0.0');

// List all books
program
  .command('list')
  .alias('ls')
  .description('List all books in the library')
  .option('-s, --sort <field>', 'Sort by field (title, author, year)', 'title')
  .action(async (options) => {
    try {
      const books = await db.getAllBooks();

      if (books.length === 0) {
        console.log('📚 No books found in the library.');
        return;
      }

      console.log(`\n📚 Found ${books.length} book(s):\n`);
      console.log('ID'.padEnd(4) + 'Title'.padEnd(30) + 'Author'.padEnd(25) + 'Year'.padEnd(6) + 'Genre');
      console.log('-'.repeat(80));

      books.forEach(book => {
        const id = book.id.toString().padEnd(4);
        const title = (book.title || '').substring(0, 28).padEnd(30);
        const author = (book.author || '').substring(0, 23).padEnd(25);
        const year = (book.published_year || '').toString().padEnd(6);
        const genre = book.genre || '';

        console.log(`${id}${title}${author}${year}${genre}`);
      });
      console.log();
    } catch (error) {
      console.error('❌ Error listing books:', error.message);
    }
  });

// Add a new book
program
  .command('add')
  .description('Add a new book to the library')
  .requiredOption('-t, --title <title>', 'Book title')
  .requiredOption('-a, --author <author>', 'Book author')
  .option('-i, --isbn <isbn>', 'Book ISBN')
  .option('-y, --year <year>', 'Published year')
  .option('-g, --genre <genre>', 'Book genre')
  .action(async (options) => {
    try {
      const bookData = {
        title: options.title,
        author: options.author,
        isbn: options.isbn || null,
        publishedYear: options.year ? parseInt(options.year) : null,
        genre: options.genre || null
      };

      const bookId = await db.createBook(bookData);
      console.log(`✅ Book added successfully with ID: ${bookId}`);
      console.log(`📖 "${bookData.title}" by ${bookData.author}`);
    } catch (error) {
      console.error('❌ Error adding book:', error.message);
    }
  });

// View a specific book
program
  .command('view <id>')
  .description('View details of a specific book')
  .action(async (id) => {
    try {
      const book = await db.getBookById(id);

      if (!book) {
        console.log(`❌ Book with ID ${id} not found.`);
        return;
      }

      console.log('\n📖 Book Details:');
      console.log('================');
      console.log(`ID: ${book.id}`);
      console.log(`Title: ${book.title}`);
      console.log(`Author: ${book.author}`);
      console.log(`ISBN: ${book.isbn || 'N/A'}`);
      console.log(`Published Year: ${book.published_year || 'N/A'}`);
      console.log(`Genre: ${book.genre || 'N/A'}`);
      console.log(`Added: ${new Date(book.created_at).toLocaleDateString()}`);
      console.log(`Updated: ${new Date(book.updated_at).toLocaleDateString()}`);
      console.log();
    } catch (error) {
      console.error('❌ Error viewing book:', error.message);
    }
  });

// Update a book
program
  .command('update <id>')
  .description('Update a book in the library')
  .option('-t, --title <title>', 'Book title')
  .option('-a, --author <author>', 'Book author')
  .option('-i, --isbn <isbn>', 'Book ISBN')
  .option('-y, --year <year>', 'Published year')
  .option('-g, --genre <genre>', 'Book genre')
  .action(async (id, options) => {
    try {
      const existingBook = await db.getBookById(id);

      if (!existingBook) {
        console.log(`❌ Book with ID ${id} not found.`);
        return;
      }

      const updateData = {
        title: options.title || null,
        author: options.author || null,
        isbn: options.isbn || null,
        publishedYear: options.year ? parseInt(options.year) : null,
        genre: options.genre || null
      };

      await db.updateBook(id, updateData);
      console.log(`✅ Book with ID ${id} updated successfully.`);

      // Show updated book
      const updatedBook = await db.getBookById(id);
      console.log(`📖 "${updatedBook.title}" by ${updatedBook.author}`);
    } catch (error) {
      console.error('❌ Error updating book:', error.message);
    }
  });

// Delete a book
program
  .command('delete <id>')
  .alias('rm')
  .description('Delete a book from the library')
  .option('-f, --force', 'Force delete without confirmation')
  .action(async (id, options) => {
    try {
      const book = await db.getBookById(id);

      if (!book) {
        console.log(`❌ Book with ID ${id} not found.`);
        return;
      }

      if (!options.force) {
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question(`Are you sure you want to delete "${book.title}" by ${book.author}? (y/N): `, async (answer) => {
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            await db.deleteBook(id);
            console.log(`✅ Book "${book.title}" deleted successfully.`);
          } else {
            console.log('❌ Delete operation cancelled.');
          }
          rl.close();
        });
      } else {
        await db.deleteBook(id);
        console.log(`✅ Book "${book.title}" deleted successfully.`);
      }
    } catch (error) {
      console.error('❌ Error deleting book:', error.message);
    }
  });

// Search books
program
  .command('search <query>')
  .description('Search books by title, author, or genre')
  .action(async (query) => {
    try {
      const books = await db.searchBooks(query);

      if (books.length === 0) {
        console.log(`📚 No books found matching "${query}".`);
        return;
      }

      console.log(`\n🔍 Found ${books.length} book(s) matching "${query}":\n`);
      console.log('ID'.padEnd(4) + 'Title'.padEnd(30) + 'Author'.padEnd(25) + 'Genre');
      console.log('-'.repeat(70));

      books.forEach(book => {
        const id = book.id.toString().padEnd(4);
        const title = (book.title || '').substring(0, 28).padEnd(30);
        const author = (book.author || '').substring(0, 23).padEnd(25);
        const genre = book.genre || '';

        console.log(`${id}${title}${author}${genre}`);
      });
      console.log();
    } catch (error) {
      console.error('❌ Error searching books:', error.message);
    }
  });

// Statistics
program
  .command('stats')
  .description('Show library statistics')
  .action(async () => {
    try {
      const books = await db.getAllBooks();
      const totalBooks = books.length;

      if (totalBooks === 0) {
        console.log('📚 Library is empty.');
        return;
      }

      // Count by genre
      const genreCount = {};
      books.forEach(book => {
        const genre = book.genre || 'Unknown';
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });

      console.log('\n📊 Library Statistics:');
      console.log('======================');
      console.log(`Total Books: ${totalBooks}`);
      console.log(`\nBooks by Genre:`);

      Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .forEach(([genre, count]) => {
          console.log(`  ${genre}: ${count}`);
        });
      console.log();
    } catch (error) {
      console.error('❌ Error getting statistics:', error.message);
    }
  });

// Server management commands
const serverCommand = program
  .command('server')
  .description('Manage the API server');

// Start server
serverCommand
  .command('start')
  .description('Start the API server')
  .option('-p, --port <port>', 'Port to run server on', '3000')
  .option('-d, --daemon', 'Run server in background')
  .action((options) => {
    const { spawn } = require('child_process');
    const path = require('path');
    const fs = require('fs');

    const serverPath = path.join(__dirname, 'server.js');

    if (!fs.existsSync(serverPath)) {
      console.log('❌ Server file not found. Make sure server.js exists in the same directory.');
      return;
    }

    const env = { ...process.env, PORT: options.port };

    if (options.daemon) {
      // Start server as daemon
      const server = spawn('node', [serverPath], {
        detached: true,
        stdio: 'ignore',
        env
      });

      server.unref();

      // Save PID for later management
      const pidFile = path.join(__dirname, '.server.pid');
      fs.writeFileSync(pidFile, server.pid.toString());

      console.log(`🚀 Server started in background on port ${options.port}`);
      console.log(`📝 Process ID: ${server.pid}`);
      console.log(`💡 Use 'library server stop' to stop the server`);
    } else {
      // Start server in foreground
      console.log(`🚀 Starting server on port ${options.port}...`);
      console.log(`💡 Press Ctrl+C to stop the server`);

      const server = spawn('node', [serverPath], {
        stdio: 'inherit',
        env
      });

      server.on('error', (err) => {
        console.error('❌ Failed to start server:', err.message);
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        server.kill('SIGTERM');
        process.exit(0);
      });
    }
  });

// Stop server
serverCommand
  .command('stop')
  .description('Stop the API server')
  .action(() => {
    const path = require('path');
    const fs = require('fs');

    const pidFile = path.join(__dirname, '.server.pid');

    if (!fs.existsSync(pidFile)) {
      console.log('❌ No running server found.');
      return;
    }

    try {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf8'));

      // Try to kill the process
      process.kill(pid, 'SIGTERM');

      // Remove PID file
      fs.unlinkSync(pidFile);

      console.log(`✅ Server stopped (PID: ${pid})`);
    } catch (error) {
      if (error.code === 'ESRCH') {
        // Process doesn't exist, clean up PID file
        fs.unlinkSync(pidFile);
        console.log('❌ Server process not found. Cleaned up stale PID file.');
      } else {
        console.error('❌ Error stopping server:', error.message);
      }
    }
  });

// Server status
serverCommand
  .command('status')
  .description('Check API server status')
  .action(async () => {
    const path = require('path');
    const fs = require('fs');
    const http = require('http');

    const pidFile = path.join(__dirname, '.server.pid');

    // Check if PID file exists
    if (fs.existsSync(pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(pidFile, 'utf8'));

        // Check if process is running
        process.kill(pid, 0); // Signal 0 checks if process exists

        console.log(`🟢 Server is running (PID: ${pid})`);

        // Try to connect to health endpoint
        const options = {
          hostname: 'localhost',
          port: process.env.PORT || 3000,
          path: '/api/health',
          method: 'GET',
          timeout: 5000
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (response.success) {
                console.log(`✅ API is responding on port ${options.port}`);
                console.log(`🌐 Health check: ${response.message}`);
              }
            } catch (e) {
              console.log('⚠️  Server running but API not responding properly');
            }
          });
        });

        req.on('error', () => {
          console.log('⚠️  Server process running but API not accessible');
        });

        req.on('timeout', () => {
          console.log('⚠️  Server process running but API not responding');
          req.destroy();
        });

        req.setTimeout(5000);
        req.end();

      } catch (error) {
        if (error.code === 'ESRCH') {
          // Process doesn't exist, clean up PID file
          fs.unlinkSync(pidFile);
          console.log('🔴 Server is not running (cleaned up stale PID file)');
        } else {
          console.error('❌ Error checking server status:', error.message);
        }
      }
    } else {
      console.log('🔴 Server is not running');
    }
  });

// Restart server
serverCommand
  .command('restart')
  .description('Restart the API server')
  .option('-p, --port <port>', 'Port to run server on', '3000')
  .action(async (options) => {
    console.log('🔄 Restarting server...');

    // Stop server first
    const path = require('path');
    const fs = require('fs');

    const pidFile = path.join(__dirname, '.server.pid');

    if (fs.existsSync(pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(pidFile, 'utf8'));
        process.kill(pid, 'SIGTERM');
        fs.unlinkSync(pidFile);
        console.log('🛑 Stopped existing server');

        // Wait a moment for cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 'ESRCH') {
          fs.unlinkSync(pidFile);
        }
      }
    }

    // Start server
    const { spawn } = require('child_process');
    const serverPath = path.join(__dirname, 'server.js');

    const env = { ...process.env, PORT: options.port };
    const server = spawn('node', [serverPath], {
      detached: true,
      stdio: 'ignore',
      env
    });

    server.unref();
    fs.writeFileSync(pidFile, server.pid.toString());

    console.log(`🚀 Server restarted on port ${options.port} (PID: ${server.pid})`);
  });

// Logs command
serverCommand
  .command('logs')
  .description('View server logs (for foreground server only)')
  .action(() => {
    console.log('💡 To view logs, start the server in foreground mode:');
    console.log('   library server start');
    console.log('');
    console.log('   For background server, logs are not captured.');
    console.log('   Consider using a process manager like PM2 for production logging.');
  });

// Parse command line arguments
program.parse();

// README.md - Documentation
/*
# Book Library Management System

A complete book library management system with both REST API and CLI interface built with Express.js, Commander.js, and SQLite.

## Features

### REST API
- **GET** `/api/books` - Get all books
- **GET** `/api/books/:id` - Get book by ID  
- **POST** `/api/books` - Create new book
- **PUT** `/api/books/:id` - Update book
- **DELETE** `/api/books/:id` - Delete book
- **GET** `/api/books/search/:query` - Search books
- **GET** `/api/health` - Health check

### CLI Interface
- `library list` - List all books
- `library add` - Add new book
- `library view <id>` - View book details
- `library update <id>` - Update book
- `library delete <id>` - Delete book
- `library search <query>` - Search books
- `library stats` - Show statistics

## Installation

1. Install dependencies:
```bash
npm install
````

2. Start the API server:
  
  ```bash
  npm start
  # or for development
  npm run dev
  ```
  
3. Use the CLI:
  
  ```bash
  # Add to PATH or use directly
  node cli.js --help
  ```
  

# Or if installed globally

npm install -g .
library --help

````
## Usage Examples

### API Examples
```bash
# Get all books
curl http://localhost:3000/api/books

# Add a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell","genre":"Dystopian Fiction","publishedYear":1949}'

# Update a book
curl -X PUT http://localhost:3000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"genre":"Classic Literature"}'
````

### CLI Examples

```bash
# Add a book
library add -t "To Kill a Mockingbird" -a "Harper Lee" -g "Fiction" -y 1960

# List all books
library list

# Search books
library search "George Orwell"

# View book details
library view 1

# Update a book
library update 1 -g "Classic Literature"

# Delete a book
library delete 1

# Show statistics
library stats
```

## Database Schema

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE,
  published_year INTEGER,
  genre TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development

- The API runs on port 3000 by default
- SQLite database file: `library.db`
- Logs are written to console with Morgan middleware
- CORS enabled for cross-origin requests
- Helmet.js for security headers

## License

MIT
*/

```