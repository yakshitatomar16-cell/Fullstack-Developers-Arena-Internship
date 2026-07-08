package library;

import library.model.Book;
import library.model.BorrowRecord;
import library.model.Member;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

public class Library {
    private List<Book> books;
    private List<Member> members;
    private List<BorrowRecord> borrowRecords;
    private final DataManager dataManager;
    private int recordCounter;

    public Library(String dataDir) {
        this.dataManager = new DataManager(dataDir);
        this.books = new ArrayList<>();
        this.members = new ArrayList<>();
        this.borrowRecords = new ArrayList<>();
        this.recordCounter = 1;
        loadData();
    }

    // ─── Persistence ──────────────────────────────────────────────────────────

    public void loadData() {
        books = dataManager.loadBooks();
        members = dataManager.loadMembers();
        borrowRecords = dataManager.loadBorrowRecords();
        recordCounter = borrowRecords.size() + 1;
        System.out.printf("✔ Loaded: %d books, %d members, %d borrow records%n",
                books.size(), members.size(), borrowRecords.size());
    }

    public void saveAll() {
        dataManager.saveBooks(books);
        dataManager.saveMembers(members);
        dataManager.saveBorrowRecords(borrowRecords);
    }

    // ─── Book Operations ──────────────────────────────────────────────────────

    public boolean addBook(String isbn, String title, String author, String genre, int year) {
        if (findBookByIsbn(isbn) != null) return false;
        books.add(new Book(isbn, title, author, genre, year));
        saveAll();
        return true;
    }

    public boolean removeBook(String isbn) {
        Book book = findBookByIsbn(isbn);
        if (book == null || !book.isAvailable()) return false;
        books.remove(book);
        saveAll();
        return true;
    }

    public Book findBookByIsbn(String isbn) {
        return books.stream()
                .filter(b -> b.getIsbn().equalsIgnoreCase(isbn))
                .findFirst().orElse(null);
    }

    public List<Book> searchBooks(String query) {
        String q = query.toLowerCase();
        return books.stream()
                .filter(b -> b.getTitle().toLowerCase().contains(q)
                        || b.getAuthor().toLowerCase().contains(q)
                        || b.getIsbn().toLowerCase().contains(q)
                        || b.getGenre().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public List<Book> getAllBooks() { return Collections.unmodifiableList(books); }

    public List<Book> getAvailableBooks() {
        return books.stream().filter(Book::isAvailable).collect(Collectors.toList());
    }

    public List<Book> getOverdueBooks() {
        return books.stream().filter(Book::isOverdue).collect(Collectors.toList());
    }

    // ─── Member Operations ────────────────────────────────────────────────────

    public boolean registerMember(String name, String email, String phone) {
        if (members.stream().anyMatch(m -> m.getEmail().equalsIgnoreCase(email))) return false;
        String id = generateMemberId();
        members.add(new Member(id, name, email, phone));
        saveAll();
        return true;
    }

    public Member findMemberById(String id) {
        return members.stream()
                .filter(m -> m.getMemberId().equalsIgnoreCase(id))
                .findFirst().orElse(null);
    }

    public List<Member> searchMembers(String query) {
        String q = query.toLowerCase();
        return members.stream()
                .filter(m -> m.getName().toLowerCase().contains(q)
                        || m.getMemberId().toLowerCase().contains(q)
                        || m.getEmail().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public List<Member> getAllMembers() { return Collections.unmodifiableList(members); }

    private String generateMemberId() {
        int next = members.size() + 1;
        return String.format("MEM%04d", next);
    }

    // ─── Borrow / Return ──────────────────────────────────────────────────────

    public BorrowResult borrowBook(String memberId, String isbn) {
        Member member = findMemberById(memberId);
        if (member == null) return BorrowResult.fail("Member not found.");
        if (!member.isActive()) return BorrowResult.fail("Member account is inactive.");
        if (!member.canBorrow()) return BorrowResult.fail("Member has reached borrow limit (" + Member.MAX_BORROW_LIMIT + " books).");

        Book book = findBookByIsbn(isbn);
        if (book == null) return BorrowResult.fail("Book not found.");
        if (!book.isAvailable()) return BorrowResult.fail("Book is currently not available.");

        String recId = String.format("REC%06d", recordCounter++);
        BorrowRecord record = new BorrowRecord(recId, memberId, isbn);

        book.setAvailable(false);
        book.setBorrowedByMemberId(memberId);
        book.setDueDate(record.getDueDate());
        member.borrowBook(isbn);
        borrowRecords.add(record);

        saveAll();
        return BorrowResult.ok(record);
    }

    public ReturnResult returnBook(String memberId, String isbn) {
        Member member = findMemberById(memberId);
        if (member == null) return ReturnResult.fail("Member not found.");

        Book book = findBookByIsbn(isbn);
        if (book == null) return ReturnResult.fail("Book not found.");

        BorrowRecord record = borrowRecords.stream()
                .filter(r -> r.getMemberId().equals(memberId)
                        && r.getIsbn().equals(isbn)
                        && r.isActive())
                .findFirst().orElse(null);

        if (record == null) return ReturnResult.fail("No active borrow record found.");

        record.setReturnDate(LocalDate.now());
        double fine = record.calculateFine();
        record.setFineAmount(fine);

        book.setAvailable(true);
        book.setBorrowedByMemberId(null);
        book.setDueDate(null);
        member.returnBook(isbn);

        // Check reservation queue
        String nextMemberId = book.nextReservation();

        if (fine > 0) member.payFine(fine);

        saveAll();
        return ReturnResult.ok(fine, nextMemberId);
    }

    // ─── Reservations ─────────────────────────────────────────────────────────

    public boolean reserveBook(String memberId, String isbn) {
        Member member = findMemberById(memberId);
        Book book = findBookByIsbn(isbn);
        if (member == null || book == null || book.isAvailable()) return false;
        book.addReservation(memberId);
        member.reserveBook(isbn);
        saveAll();
        return true;
    }

    // ─── Statistics ───────────────────────────────────────────────────────────

    public LibraryStats getStats() {
        long totalBooks = books.size();
        long availableBooks = books.stream().filter(Book::isAvailable).count();
        long borrowedBooks = totalBooks - availableBooks;
        long overdueBooks = books.stream().filter(Book::isOverdue).count();
        long totalMembers = members.size();
        long activeMembers = members.stream().filter(Member::isActive).count();
        long activeLoans = borrowRecords.stream().filter(BorrowRecord::isActive).count();
        double totalFines = borrowRecords.stream()
                .mapToDouble(BorrowRecord::getFineAmount).sum();

        Map<String, Long> genreCount = books.stream()
                .collect(Collectors.groupingBy(Book::getGenre, Collectors.counting()));

        return new LibraryStats(totalBooks, availableBooks, borrowedBooks, overdueBooks,
                totalMembers, activeMembers, activeLoans, totalFines, genreCount);
    }

    // ─── Export ───────────────────────────────────────────────────────────────

    public void exportAll() {
        try {
            dataManager.exportBooksToCSV(books, dataManager.getTimestampedFilename("books", "csv"));
            dataManager.exportMembersToCSV(members, dataManager.getTimestampedFilename("members", "csv"));
            dataManager.exportBorrowRecordsToCSV(borrowRecords, dataManager.getTimestampedFilename("borrow_records", "csv"));
        } catch (IOException e) {
            System.err.println("⚠ Export error: " + e.getMessage());
        }
    }

    // ─── Inner result types ───────────────────────────────────────────────────

    public static class BorrowResult {
        public final boolean success;
        public final String message;
        public final BorrowRecord record;

        private BorrowResult(boolean success, String message, BorrowRecord record) {
            this.success = success; this.message = message; this.record = record;
        }
        public static BorrowResult ok(BorrowRecord r) {
            return new BorrowResult(true, "Book borrowed successfully. Due: " + r.getDueDate(), r);
        }
        public static BorrowResult fail(String msg) {
            return new BorrowResult(false, msg, null);
        }
    }

    public static class ReturnResult {
        public final boolean success;
        public final String message;
        public final double fine;
        public final String nextReservationMemberId;

        private ReturnResult(boolean success, String message, double fine, String next) {
            this.success = success; this.message = message; this.fine = fine;
            this.nextReservationMemberId = next;
        }
        public static ReturnResult ok(double fine, String next) {
            String msg = fine > 0
                    ? String.format("Book returned. Overdue fine: $%.2f", fine)
                    : "Book returned successfully. No fines.";
            return new ReturnResult(true, msg, fine, next);
        }
        public static ReturnResult fail(String msg) {
            return new ReturnResult(false, msg, 0, null);
        }
    }

    public static class LibraryStats {
        public final long totalBooks, availableBooks, borrowedBooks, overdueBooks;
        public final long totalMembers, activeMembers, activeLoans;
        public final double totalFines;
        public final Map<String, Long> genreDistribution;

        public LibraryStats(long totalBooks, long availableBooks, long borrowedBooks,
                            long overdueBooks, long totalMembers, long activeMembers,
                            long activeLoans, double totalFines, Map<String, Long> genreDistribution) {
            this.totalBooks = totalBooks; this.availableBooks = availableBooks;
            this.borrowedBooks = borrowedBooks; this.overdueBooks = overdueBooks;
            this.totalMembers = totalMembers; this.activeMembers = activeMembers;
            this.activeLoans = activeLoans; this.totalFines = totalFines;
            this.genreDistribution = genreDistribution;
        }
    }
}