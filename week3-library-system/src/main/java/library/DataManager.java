package library;

import library.model.Book;
import library.model.BorrowRecord;
import library.model.Member;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class DataManager {
    private final String dataDir;
    private static final String BOOKS_FILE = "books.txt";
    private static final String MEMBERS_FILE = "members.txt";
    private static final String RECORDS_FILE = "borrow_records.txt";

    public DataManager(String dataDir) {
        this.dataDir = dataDir;
        ensureDirectoryExists();
    }

    private void ensureDirectoryExists() {
        try {
            Files.createDirectories(Paths.get(dataDir));
        } catch (IOException e) {
            System.err.println("⚠ Could not create data directory: " + e.getMessage());
        }
    }

    // ─── Books ────────────────────────────────────────────────────────────────

    public void saveBooks(List<Book> books) {
        writeLines(BOOKS_FILE, books.stream()
                .map(Book::toCsvLine)
                .collect(java.util.stream.Collectors.toList()));
    }

    public List<Book> loadBooks() {
        List<Book> books = new ArrayList<>();
        for (String line : readLines(BOOKS_FILE)) {
            try {
                books.add(Book.fromCsvLine(line));
            } catch (Exception e) {
                System.err.println("⚠ Skipping invalid book record: " + e.getMessage());
            }
        }
        return books;
    }

    // ─── Members ──────────────────────────────────────────────────────────────

    public void saveMembers(List<Member> members) {
        writeLines(MEMBERS_FILE, members.stream()
                .map(Member::toCsvLine)
                .collect(java.util.stream.Collectors.toList()));
    }

    public List<Member> loadMembers() {
        List<Member> members = new ArrayList<>();
        for (String line : readLines(MEMBERS_FILE)) {
            try {
                members.add(Member.fromCsvLine(line));
            } catch (Exception e) {
                System.err.println("⚠ Skipping invalid member record: " + e.getMessage());
            }
        }
        return members;
    }

    // ─── Borrow Records ───────────────────────────────────────────────────────

    public void saveBorrowRecords(List<BorrowRecord> records) {
        writeLines(RECORDS_FILE, records.stream()
                .map(BorrowRecord::toCsvLine)
                .collect(java.util.stream.Collectors.toList()));
    }

    public List<BorrowRecord> loadBorrowRecords() {
        List<BorrowRecord> records = new ArrayList<>();
        for (String line : readLines(RECORDS_FILE)) {
            try {
                records.add(BorrowRecord.fromCsvLine(line));
            } catch (Exception e) {
                System.err.println("⚠ Skipping invalid borrow record: " + e.getMessage());
            }
        }
        return records;
    }

    // ─── CSV Export ───────────────────────────────────────────────────────────

    public void exportBooksToCSV(List<Book> books, String filename) throws IOException {
        String path = dataDir + File.separator + filename;
        try (PrintWriter pw = new PrintWriter(new FileWriter(path))) {
            pw.println("ISBN,Title,Author,Genre,Year,Available,BorrowedBy,DueDate,ReservationQueue");
            for (Book b : books) {
                pw.printf("\"%s\",\"%s\",\"%s\",\"%s\",%d,%b,\"%s\",\"%s\",\"%s\"%n",
                        b.getIsbn(), b.getTitle(), b.getAuthor(), b.getGenre(),
                        b.getPublishYear(), b.isAvailable(),
                        b.getBorrowedByMemberId() != null ? b.getBorrowedByMemberId() : "",
                        b.getDueDate() != null ? b.getDueDate().toString() : "",
                        String.join(";", b.getReservationQueue()));
            }
        }
        System.out.println("✔ Books exported to: " + path);
    }

    public void exportMembersToCSV(List<Member> members, String filename) throws IOException {
        String path = dataDir + File.separator + filename;
        try (PrintWriter pw = new PrintWriter(new FileWriter(path))) {
            pw.println("MemberID,Name,Email,Phone,MemberSince,BorrowedBooks,ReservedBooks,TotalFinesPaid,Active");
            for (Member m : members) {
                pw.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%b%n",
                        m.getMemberId(), m.getName(), m.getEmail(), m.getPhone(),
                        m.getMemberSince(),
                        String.join(";", m.getBorrowedIsbns()),
                        String.join(";", m.getReservedIsbns()),
                        m.getTotalFinesPaid(), m.isActive());
            }
        }
        System.out.println("✔ Members exported to: " + path);
    }

    public void exportBorrowRecordsToCSV(List<BorrowRecord> records, String filename) throws IOException {
        String path = dataDir + File.separator + filename;
        try (PrintWriter pw = new PrintWriter(new FileWriter(path))) {
            pw.println("RecordID,MemberID,ISBN,BorrowDate,DueDate,ReturnDate,FineAmount");
            for (BorrowRecord r : records) {
                pw.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f%n",
                        r.getRecordId(), r.getMemberId(), r.getIsbn(),
                        r.getBorrowDate(), r.getDueDate(),
                        r.getReturnDate() != null ? r.getReturnDate().toString() : "",
                        r.getFineAmount());
            }
        }
        System.out.println("✔ Borrow records exported to: " + path);
    }

    // ─── Internal helpers ─────────────────────────────────────────────────────

    private void writeLines(String filename, List<String> lines) {
        String path = dataDir + File.separator + filename;
        try (PrintWriter pw = new PrintWriter(new FileWriter(path))) {
            for (String line : lines) pw.println(line);
        } catch (IOException e) {
            System.err.println("⚠ Error saving " + filename + ": " + e.getMessage());
        }
    }

    private List<String> readLines(String filename) {
        List<String> lines = new ArrayList<>();
        String path = dataDir + File.separator + filename;
        File f = new File(path);
        if (!f.exists()) return lines;
        try (BufferedReader br = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty()) lines.add(line);
            }
        } catch (IOException e) {
            System.err.println("⚠ Error reading " + filename + ": " + e.getMessage());
        }
        return lines;
    }

    public String getTimestampedFilename(String prefix, String ext) {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return prefix + "_" + ts + "." + ext;
    }
}