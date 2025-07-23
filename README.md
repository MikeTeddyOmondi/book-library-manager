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
```

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
