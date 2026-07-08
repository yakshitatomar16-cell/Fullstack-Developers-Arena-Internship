# 📖 Bibliotheca — Library Management System

A full-featured console-based Library Management System built in Java, plus a polished browser-based dashboard in HTML/CSS/JS.

---

## Project Structure

```
library-system/
├── src/
│   └── library/
│       ├── model/
│       │   ├── Book.java          — Book entity (ISBN, title, author, genre, year, availability)
│       │   ├── Member.java        — Member entity (ID, name, email, phone, borrowed list)
│       │   └── BorrowRecord.java  — Loan record (dates, fines, status)
│       ├── service/
│       │   ├── Library.java       — Core business logic (borrow, return, reserve, stats)
│       │   └── DataManager.java   — File I/O, CSV export, persistence
│       ├── ui/
│       │   └── LibraryApp.java    — Console menu system (entry point)
│       └── util/
│           ├── InputValidator.java — Input validation (ISBN, email, phone, year)
│           └── Printer.java        — Formatted console output
├── web/
│   └── index.html                 — Browser dashboard (self-contained HTML/CSS/JS)
├── data/                          — Auto-created; stores books.txt, members.txt, records.txt
├── out/                           — Compiled .class files (auto-generated)
├── run.sh                         — Linux/macOS build & run
├── run.bat                        — Windows build & run
└── README.md
```

---

## Requirements

- **Java 11+** (JDK, not just JRE)
- No external libraries needed — pure Java SE

---

## Running the Java Console App

### Linux / macOS
```bash
chmod +x run.sh
./run.sh
```

### Windows
```
run.bat
```

### Manual compile & run
```bash
# From the library-system/ directory:
mkdir -p out data
find src -name "*.java" | xargs javac -d out -sourcepath src
java -cp out library.ui.LibraryApp
```

---

## Running the Web Dashboard

Simply open `web/index.html` in any modern browser. No server required.

---

## Features

### 📚 Books
| Feature | Description |
|---------|-------------|
| Add book | ISBN, title, author, genre, year with full validation |
| Remove book | Only removes books not currently borrowed |
| Search | By title, author, ISBN, or genre |
| View details | Full info including borrow status and reservations |

### 👥 Members
| Feature | Description |
|---------|-------------|
| Register | Name, email (unique), phone with validation |
| Search | By name, ID, or email |
| Profile | Full details with currently borrowed books |
| Borrow limit | 5 books maximum per member |

### 📤 Borrow / Return
| Feature | Description |
|---------|-------------|
| Borrow | Validates availability, member limits, generates record |
| Return | Calculates overdue fines ($2/day), triggers reservations |
| Due date | 14-day loan period |
| Fine rate | $2.00 per overdue day |

### 📋 Reservations
- Queue-based reservation for borrowed books
- Auto-notification when book becomes available

### 📊 Statistics
- Total/available/borrowed/overdue book counts
- Active member count and loan counts
- Total fines collected
- Genre distribution breakdown

### 💾 Data Persistence
- Auto-saves to `data/books.txt`, `data/members.txt`, `data/borrow_records.txt`
- Loads data automatically on startup
- CSV export with timestamps: `data/books_YYYYMMDD_HHmmss.csv`

---

## Console Menu

```
 1. Add Book            2. Remove Book
 3. List All Books      4. Search Books
 5. Book Details

 6. Register Member     7. List All Members
 8. Search Members      9. Member Details

10. Borrow Book        11. Return Book
12. Reserve Book       13. Overdue Books

14. Library Statistics  15. Export All to CSV
 0. Exit
```

---

## OOP Design

- **Encapsulation** — All fields private with getters/setters
- **Single Responsibility** — Model / Service / UI / Util layers separated
- **Result Objects** — `BorrowResult` and `ReturnResult` wrap outcomes cleanly
- **Immutable collections** — `getAllBooks()` returns `unmodifiableList`
- **Exception Handling** — File I/O wrapped with graceful error messages
- **Input Validation** — Dedicated `InputValidator` with regex checks

---

## Fine Policy
- Loan period: **14 days**
- Fine rate: **$2.00 per day** overdue
- Fines are calculated on return and added to member's total