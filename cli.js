// #!/usr/bin/env node
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Command } from "commander";
import Database from "./database.js";

const program = new Command();
const db = new Database();

// CLI configuration
program
  .name("library")
  .description("Book Library Management CLI")
  .version("1.0.0");

// List all books
program
  .command("list")
  .alias("ls")
  .description("List all books in the library")
  .option("-s, --sort <field>", "Sort by field (title, author, year)", "title")
  .action(async (options) => {
    try {
      const books = await db.getAllBooks();

      if (books.length === 0) {
        console.log("📚 No books found in the library.");
        return;
      }

      console.log(`\n📚 Found ${books.length} book(s):\n`);
      console.log(
        "ID".padEnd(4) +
          "Title".padEnd(30) +
          "Author".padEnd(25) +
          "Year".padEnd(6) +
          "Genre"
      );
      console.log("-".repeat(80));

      books.forEach((book) => {
        const id = book.id.toString().padEnd(4);
        const title = (book.title || "").substring(0, 28).padEnd(30);
        const author = (book.author || "").substring(0, 23).padEnd(25);
        const year = (book.published_year || "").toString().padEnd(6);
        const genre = book.genre || "";

        console.log(`${id}${title}${author}${year}${genre}`);
      });
      console.log();
    } catch (error) {
      console.error("❌ Error listing books:", error.message);
    }
  });

// Add a new book
program
  .command("add")
  .description("Add a new book to the library")
  .requiredOption("-t, --title <title>", "Book title")
  .requiredOption("-a, --author <author>", "Book author")
  .option("-i, --isbn <isbn>", "Book ISBN")
  .option("-y, --year <year>", "Published year")
  .option("-g, --genre <genre>", "Book genre")
  .action(async (options) => {
    try {
      const bookData = {
        title: options.title,
        author: options.author,
        isbn: options.isbn || null,
        publishedYear: options.year ? parseInt(options.year) : null,
        genre: options.genre || null,
      };

      const bookId = await db.createBook(bookData);
      console.log(`✅ Book added successfully with ID: ${bookId}`);
      console.log(`📖 "${bookData.title}" by ${bookData.author}`);
    } catch (error) {
      console.error("❌ Error adding book:", error.message);
    }
  });

// View a specific book
program
  .command("view <id>")
  .description("View details of a specific book")
  .action(async (id) => {
    try {
      const book = await db.getBookById(id);

      if (!book) {
        console.log(`❌ Book with ID ${id} not found.`);
        return;
      }

      console.log("\n📖 Book Details:");
      console.log("================");
      console.log(`ID: ${book.id}`);
      console.log(`Title: ${book.title}`);
      console.log(`Author: ${book.author}`);
      console.log(`ISBN: ${book.isbn || "N/A"}`);
      console.log(`Published Year: ${book.published_year || "N/A"}`);
      console.log(`Genre: ${book.genre || "N/A"}`);
      console.log(`Added: ${new Date(book.created_at).toLocaleDateString()}`);
      console.log(`Updated: ${new Date(book.updated_at).toLocaleDateString()}`);
      console.log();
    } catch (error) {
      console.error("❌ Error viewing book:", error.message);
    }
  });

// Update a book
program
  .command("update <id>")
  .description("Update a book in the library")
  .option("-t, --title <title>", "Book title")
  .option("-a, --author <author>", "Book author")
  .option("-i, --isbn <isbn>", "Book ISBN")
  .option("-y, --year <year>", "Published year")
  .option("-g, --genre <genre>", "Book genre")
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
        genre: options.genre || null,
      };

      await db.updateBook(id, updateData);
      console.log(`✅ Book with ID ${id} updated successfully.`);

      // Show updated book
      const updatedBook = await db.getBookById(id);
      console.log(`📖 "${updatedBook.title}" by ${updatedBook.author}`);
    } catch (error) {
      console.error("❌ Error updating book:", error.message);
    }
  });

// Delete a book
program
  .command("delete <id>")
  .alias("rm")
  .description("Delete a book from the library")
  .option("-f, --force", "Force delete without confirmation")
  .action(async (id, options) => {
    try {
      const book = await db.getBookById(id);

      if (!book) {
        console.log(`❌ Book with ID ${id} not found.`);
        return;
      }

      if (!options.force) {
        const readline = await import("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `Are you sure you want to delete "${book.title}" by ${book.author}? (y/N): `,
          async (answer) => {
            if (
              answer.toLowerCase() === "y" ||
              answer.toLowerCase() === "yes"
            ) {
              await db.deleteBook(id);
              console.log(`✅ Book "${book.title}" deleted successfully.`);
            } else {
              console.log("❌ Delete operation cancelled.");
            }
            rl.close();
          }
        );
      } else {
        await db.deleteBook(id);
        console.log(`✅ Book "${book.title}" deleted successfully.`);
      }
    } catch (error) {
      console.error("❌ Error deleting book:", error.message);
    }
  });

// Search books
program
  .command("search <query>")
  .description("Search books by title, author, or genre")
  .action(async (query) => {
    try {
      const books = await db.searchBooks(query);

      if (books.length === 0) {
        console.log(`📚 No books found matching "${query}".`);
        return;
      }

      console.log(`\n🔍 Found ${books.length} book(s) matching "${query}":\n`);
      console.log(
        "ID".padEnd(4) + "Title".padEnd(30) + "Author".padEnd(25) + "Genre"
      );
      console.log("-".repeat(70));

      books.forEach((book) => {
        const id = book.id.toString().padEnd(4);
        const title = (book.title || "").substring(0, 28).padEnd(30);
        const author = (book.author || "").substring(0, 23).padEnd(25);
        const genre = book.genre || "";

        console.log(`${id}${title}${author}${genre}`);
      });
      console.log();
    } catch (error) {
      console.error("❌ Error searching books:", error.message);
    }
  });

// Statistics
program
  .command("stats")
  .description("Show library statistics")
  .action(async () => {
    try {
      const books = await db.getAllBooks();
      const totalBooks = books.length;

      if (totalBooks === 0) {
        console.log("📚 Library is empty.");
        return;
      }

      // Count by genre
      const genreCount = {};
      books.forEach((book) => {
        const genre = book.genre || "Unknown";
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });

      console.log("\n📊 Library Statistics:");
      console.log("======================");
      console.log(`Total Books: ${totalBooks}`);
      console.log(`\nBooks by Genre:`);

      Object.entries(genreCount)
        .sort(([, a], [, b]) => b - a)
        .forEach(([genre, count]) => {
          console.log(`  ${genre}: ${count}`);
        });
      console.log();
    } catch (error) {
      console.error("❌ Error getting statistics:", error.message);
    }
  });

// Server management commands
const serverCommand = program
  .command("server")
  .description("Manage the API server");

// Start server
serverCommand
  .command("start")
  .description("Start the API server")
  .option("-p, --port <port>", "Port to run server on", "3000")
  .option("-d, --daemon", "Run server in background")
  .action((options) => {
    const serverPath = path.join(__dirname, "server.js");

    if (!fs.existsSync(serverPath)) {
      console.log(
        "❌ Server file not found. Make sure server.js exists in the same directory."
      );
      return;
    }

    const env = { ...process.env, PORT: options.port };

    if (options.daemon) {
      // Start server as daemon
      const server = spawn("node", [serverPath], {
        detached: true,
        stdio: "ignore",
        env,
      });

      server.unref();

      // Save PID for later management
      const pidFile = path.join(__dirname, ".server.pid");
      fs.writeFileSync(pidFile, server.pid.toString());

      console.log(`🚀 Server started in background on port ${options.port}`);
      console.log(`📝 Process ID: ${server.pid}`);
      console.log(`💡 Use 'library server stop' to stop the server`);
    } else {
      // Start server in foreground
      console.log(`🚀 Starting server on port ${options.port}...`);
      console.log(`💡 Press Ctrl+C to stop the server`);

      const server = spawn("node", [serverPath], {
        stdio: "inherit",
        env,
      });

      server.on("error", (err) => {
        console.error("❌ Failed to start server:", err.message);
      });

      // Handle graceful shutdown
      process.on("SIGINT", () => {
        console.log("\n🛑 Shutting down server...");
        server.kill("SIGTERM");
        process.exit(0);
      });
    }
  });

// Stop server
serverCommand
  .command("stop")
  .description("Stop the API server")
  .action(() => {
    const pidFile = path.join(__dirname, ".server.pid");

    if (!fs.existsSync(pidFile)) {
      console.log("❌ No running server found.");
      return;
    }

    try {
      const pid = parseInt(fs.readFileSync(pidFile, "utf8"));

      // Try to kill the process
      process.kill(pid, "SIGTERM");

      // Remove PID file
      fs.unlinkSync(pidFile);

      console.log(`✅ Server stopped (PID: ${pid})`);
    } catch (error) {
      if (error.code === "ESRCH") {
        // Process doesn't exist, clean up PID file
        fs.unlinkSync(pidFile);
        console.log("❌ Server process not found. Cleaned up stale PID file.");
      } else {
        console.error("❌ Error stopping server:", error.message);
      }
    }
  });

// Server status
serverCommand
  .command("status")
  .description("Check API server status")
  .action(async () => {
    const pidFile = path.join(__dirname, ".server.pid");

    // Check if PID file exists
    if (fs.existsSync(pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(pidFile, "utf8"));

        // Check if process is running
        process.kill(pid, 0); // Signal 0 checks if process exists

        console.log(`🟢 Server is running (PID: ${pid})`);

        // Try to connect to health endpoint
        const options = {
          hostname: "localhost",
          port: process.env.PORT || 3000,
          path: "/api/health",
          method: "GET",
          timeout: 5000,
        };

        const req = http.request(options, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const response = JSON.parse(data);
              if (response.success) {
                console.log(`✅ API is responding on port ${options.port}`);
                console.log(`🌐 Health check: ${response.message}`);
              }
            } catch (e) {
              console.log("⚠️  Server running but API not responding properly");
            }
          });
        });

        req.on("error", () => {
          console.log("⚠️  Server process running but API not accessible");
        });

        req.on("timeout", () => {
          console.log("⚠️  Server process running but API not responding");
          req.destroy();
        });

        req.setTimeout(5000);
        req.end();
      } catch (error) {
        if (error.code === "ESRCH") {
          // Process doesn't exist, clean up PID file
          fs.unlinkSync(pidFile);
          console.log("🔴 Server is not running (cleaned up stale PID file)");
        } else {
          console.error("❌ Error checking server status:", error.message);
        }
      }
    } else {
      console.log("🔴 Server is not running in the background");
    }
  });

// Restart server
serverCommand
  .command("restart")
  .description("Restart the API server")
  .option("-p, --port <port>", "Port to run server on", "3000")
  .action(async (options) => {
    console.log("🔄 Restarting server...");

    // Stop server first

    // ...existing code...

    const pidFile = path.join(__dirname, ".server.pid");

    if (fs.existsSync(pidFile)) {
      try {
        const pid = parseInt(fs.readFileSync(pidFile, "utf8"));
        process.kill(pid, "SIGTERM");
        fs.unlinkSync(pidFile);
        console.log("🛑 Stopped existing server");

        // Wait a moment for cleanup
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === "ESRCH") {
          fs.unlinkSync(pidFile);
        }
      }
    }

    // Start server

    const serverPath = path.join(__dirname, "server.js");

    const env = { ...process.env, PORT: options.port };
    const server = spawn("node", [serverPath], {
      detached: true,
      stdio: "ignore",
      env,
    });

    server.unref();
    fs.writeFileSync(pidFile, server.pid.toString());

    console.log(
      `🚀 Server restarted on port ${options.port} (PID: ${server.pid})`
    );
  });

// Logs command
serverCommand
  .command("logs")
  .description("View server logs (for foreground server only)")
  .action(() => {
    console.log("💡 To view logs, start the server in foreground mode:");
    console.log("   library server start");
    console.log("");
    console.log("   For background server, logs are not captured.");
    console.log(
      "   Consider using a process manager like PM2 for production logging."
    );
  });

// Parse command line arguments
program.parse();
