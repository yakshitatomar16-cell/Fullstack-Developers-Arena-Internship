package library;

import library.model.Book;
import library.model.Member;
import library.service.Library;
import library.util.InputValidator;
import library.util.Printer;

import java.util.List;
import java.util.Scanner;

public class LibraryApp {

    private static final String DATA_DIR = "data";
    private final Library library;
    private final Scanner sc;

    public LibraryApp() {
        this.library = new Library(DATA_DIR);
        this.sc = new Scanner(System.in);
        seedDataIfEmpty();
    }

    public static void main(String[] args) {
        new LibraryApp().run();
    }

    private void run() {
        System.out.println("\n  Welcome to the Library Management System!");
        boolean running = true;
        while (running) {
            Printer.printMainMenu();
            System.out.print("  Enter choice: ");
            String input = sc.nextLine().trim();
            int choice;
            try { choice = Integer.parseInt(input); }
            catch (NumberFormatException e) { Printer.error("Invalid input."); continue; }

            switch (choice) {
                case 0  -> { Printer.info("Goodbye! Data saved."); running = false; }
                case 1  -> addBook();
                case 2  -> removeBook();
                case 3  -> listAllBooks();
                case 4  -> searchBooks();
                case 5  -> bookDetails();
                case 6  -> registerMember();
                case 7  -> listAllMembers();
                case 8  -> searchMembers();
                case 9  -> memberDetails();
                case 10 -> borrowBook();
                case 11 -> returnBook();
                case 12 -> reserveBook();
                case 13 -> overdueBooks();
                case 14 -> statistics();
                case 15 -> exportAll();
                default -> Printer.error("Invalid option. Choose 0-15.");
            }
            if (running) pause();
        }
        sc.close();
    }

    // ─── Book Operations ──────────────────────────────────────────────────────

    private void addBook() {
        Printer.header("ADD NEW BOOK");
        String isbn   = InputValidator.readIsbn(sc, "  ISBN (10 or 13 digits): ");
        if (library.findBookByIsbn(isbn) != null) {
            Printer.error("A book with this ISBN already exists."); return;
        }
        String title  = InputValidator.readNonEmpty(sc, "  Title: ");
        String author = InputValidator.readNonEmpty(sc, "  Author: ");
        String genre  = InputValidator.readNonEmpty(sc, "  Genre: ");
        int    year   = InputValidator.readYear(sc, "  Publication Year: ");

        if (library.addBook(isbn, title, author, genre, year))
            Printer.success("Book \"" + title + "\" added successfully.");
        else
            Printer.error("Failed to add book.");
    }

    private void removeBook() {
        Printer.header("REMOVE BOOK");
        String isbn = InputValidator.readIsbn(sc, "  ISBN of book to remove: ");
        Book book = library.findBookByIsbn(isbn);
        if (book == null) { Printer.error("Book not found."); return; }
        if (!book.isAvailable()) { Printer.error("Cannot remove a borrowed book."); return; }
        Printer.printBookDetail(book);
        System.out.print("  Confirm removal? (yes/no): ");
        if (sc.nextLine().trim().equalsIgnoreCase("yes")) {
            library.removeBook(isbn);
            Printer.success("Book removed.");
        } else {
            Printer.info("Removal cancelled.");
        }
    }

    private void listAllBooks() {
        Printer.header("ALL BOOKS");
        Printer.printBooks(library.getAllBooks());
    }

    private void searchBooks() {
        Printer.header("SEARCH BOOKS");
        String query = InputValidator.readNonEmpty(sc, "  Search (title / author / ISBN / genre): ");
        List<Book> results = library.searchBooks(query);
        Printer.printBooks(results);
    }

    private void bookDetails() {
        Printer.header("BOOK DETAILS");
        String isbn = InputValidator.readIsbn(sc, "  ISBN: ");
        Book book = library.findBookByIsbn(isbn);
        if (book == null) Printer.error("Book not found.");
        else Printer.printBookDetail(book);
    }

    // ─── Member Operations ────────────────────────────────────────────────────

    private void registerMember() {
        Printer.header("REGISTER NEW MEMBER");
        String name  = InputValidator.readNonEmpty(sc, "  Full Name: ");
        String email = InputValidator.readEmail(sc, "  Email: ");
        String phone = InputValidator.readPhone(sc, "  Phone: ");

        if (library.registerMember(name, email, phone))
            Printer.success("Member registered successfully.");
        else
            Printer.error("A member with this email already exists.");
    }

    private void listAllMembers() {
        Printer.header("ALL MEMBERS");
        Printer.printMembers(library.getAllMembers());
    }

    private void searchMembers() {
        Printer.header("SEARCH MEMBERS");
        String query = InputValidator.readNonEmpty(sc, "  Search (name / ID / email): ");
        List<Member> results = library.searchMembers(query);
        Printer.printMembers(results);
    }

    private void memberDetails() {
        Printer.header("MEMBER DETAILS");
        String id = InputValidator.readNonEmpty(sc, "  Member ID: ");
        Member member = library.findMemberById(id);
        if (member == null) Printer.error("Member not found.");
        else Printer.printMemberDetail(member, library.getAllBooks());
    }

    // ─── Borrow / Return ──────────────────────────────────────────────────────

    private void borrowBook() {
        Printer.header("BORROW BOOK");
        String memberId = InputValidator.readNonEmpty(sc, "  Member ID: ");
        String isbn     = InputValidator.readIsbn(sc, "  ISBN: ");

        Library.BorrowResult result = library.borrowBook(memberId, isbn);
        if (result.success) {
            Printer.success(result.message);
            Printer.info("Borrow Record ID: " + result.record.getRecordId());
        } else {
            Printer.error(result.message);
        }
    }

    private void returnBook() {
        Printer.header("RETURN BOOK");
        String memberId = InputValidator.readNonEmpty(sc, "  Member ID: ");
        String isbn     = InputValidator.readIsbn(sc, "  ISBN: ");

        Library.ReturnResult result = library.returnBook(memberId, isbn);
        if (result.success) {
            Printer.success(result.message);
            if (result.nextReservationMemberId != null)
                Printer.info("📬 Notify member " + result.nextReservationMemberId + " — their reserved book is now available!");
        } else {
            Printer.error(result.message);
        }
    }

    private void reserveBook() {
        Printer.header("RESERVE BOOK");
        String memberId = InputValidator.readNonEmpty(sc, "  Member ID: ");
        String isbn     = InputValidator.readIsbn(sc, "  ISBN: ");

        Book book = library.findBookByIsbn(isbn);
        if (book == null) { Printer.error("Book not found."); return; }
        if (book.isAvailable()) { Printer.info("Book is available — you can borrow it directly!"); return; }

        boolean ok = library.reserveBook(memberId, isbn);
        if (ok) {
            int pos = book.getReservationQueue().size();
            Printer.success("Reservation added. Queue position: #" + pos);
        } else {
            Printer.error("Could not add reservation (already reserved or invalid IDs).");
        }
    }

    private void overdueBooks() {
        Printer.header("OVERDUE BOOKS");
        List<Book> overdue = library.getOverdueBooks();
        if (overdue.isEmpty()) {
            Printer.success("No overdue books! 🎉");
        } else {
            Printer.warn(overdue.size() + " overdue book(s) found:");
            for (Book b : overdue) {
                System.out.printf("  [%s] \"%s\" | Borrowed by: %s | Overdue: %d day(s) | Fine: $%.2f%n",
                        b.getIsbn(), b.getTitle(), b.getBorrowedByMemberId(),
                        b.overdueDays(), b.overdueDays() * 2.0);
            }
        }
    }

    // ─── Reports ──────────────────────────────────────────────────────────────

    private void statistics() {
        Printer.header("LIBRARY STATISTICS");
        Printer.printStats(library.getStats());
    }

    private void exportAll() {
        Printer.header("EXPORT DATA TO CSV");
        library.exportAll();
        Printer.success("All data exported to the data/ directory.");
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private void pause() {
        System.out.print("\n  Press Enter to continue...");
        sc.nextLine();
    }

    /**
     * Seeds sample data when the library is empty (first run).
     */
    private void seedDataIfEmpty() {
        if (!library.getAllBooks().isEmpty()) return;

        System.out.println("  ℹ Seeding sample data for first run...");
        library.addBook("9780061965708", "To Kill a Mockingbird", "Harper Lee", "Fiction", 1960);
        library.addBook("9780743273565", "The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 1925);
        library.addBook("9780141439518", "Pride and Prejudice", "Jane Austen", "Romance", 1813);
        library.addBook("9780547928227", "The Hobbit", "J.R.R. Tolkien", "Fantasy", 1937);
        library.addBook("9780593135204", "Project Hail Mary", "Andy Weir", "Sci-Fi", 2021);
        library.addBook("9781250301697", "The Midnight Library", "Matt Haig", "Fiction", 2020);
        library.addBook("9780385737951", "The Maze Runner", "James Dashner", "Young Adult", 2009);
        library.addBook("9780062409850", "Sapiens", "Yuval Noah Harari", "Non-Fiction", 2011);

        library.registerMember("Alice Johnson", "alice@example.com", "+1-555-0101");
        library.registerMember("Bob Martinez", "bob@example.com", "+1-555-0102");
        library.registerMember("Carol White", "carol@example.com", "+1-555-0103");
        System.out.println("  ✔ Sample data loaded!\n");
    }
}