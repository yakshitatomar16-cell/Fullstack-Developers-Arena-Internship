package library;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Book implements Serializable {
    private String isbn;
    private String title;
    private String author;
    private String genre;
    private int publishYear;
    private boolean available;
    private String borrowedByMemberId;
    private LocalDate dueDate;
    private List<String> reservationQueue; // Member IDs in reservation order

    public Book(String isbn, String title, String author, String genre, int publishYear) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.publishYear = publishYear;
        this.available = true;
        this.borrowedByMemberId = null;
        this.dueDate = null;
        this.reservationQueue = new ArrayList<>();
    }

    // Getters
    public String getIsbn() { return isbn; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getGenre() { return genre; }
    public int getPublishYear() { return publishYear; }
    public boolean isAvailable() { return available; }
    public String getBorrowedByMemberId() { return borrowedByMemberId; }
    public LocalDate getDueDate() { return dueDate; }
    public List<String> getReservationQueue() { return reservationQueue; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setAuthor(String author) { this.author = author; }
    public void setGenre(String genre) { this.genre = genre; }
    public void setPublishYear(int publishYear) { this.publishYear = publishYear; }
    public void setAvailable(boolean available) { this.available = available; }
    public void setBorrowedByMemberId(String memberId) { this.borrowedByMemberId = memberId; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public void addReservation(String memberId) {
        if (!reservationQueue.contains(memberId)) {
            reservationQueue.add(memberId);
        }
    }

    public String nextReservation() {
        return reservationQueue.isEmpty() ? null : reservationQueue.remove(0);
    }

    public boolean isOverdue() {
        return !available && dueDate != null && LocalDate.now().isAfter(dueDate);
    }

    public long overdueDays() {
        if (!isOverdue()) return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(dueDate, LocalDate.now());
    }

    // Serialize to CSV line
    public String toCsvLine() {
        String dueDateStr = (dueDate != null) ? dueDate.toString() : "null";
        String borrowerId = (borrowedByMemberId != null) ? borrowedByMemberId : "null";
        String queue = String.join(";", reservationQueue);
        return String.join("|", isbn, title, author, genre,
                String.valueOf(publishYear), String.valueOf(available),
                borrowerId, dueDateStr, queue);
    }

    // Deserialize from CSV line
    public static Book fromCsvLine(String line) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 9) throw new IllegalArgumentException("Invalid book record: " + line);
        Book b = new Book(parts[0], parts[1], parts[2], parts[3], Integer.parseInt(parts[4]));
        b.setAvailable(Boolean.parseBoolean(parts[5]));
        b.setBorrowedByMemberId(parts[6].equals("null") ? null : parts[6]);
        b.setDueDate(parts[7].equals("null") ? null : LocalDate.parse(parts[7]));
        if (!parts[8].isEmpty()) {
            for (String mid : parts[8].split(";")) {
                b.addReservation(mid);
            }
        }
        return b;
    }

    @Override
    public String toString() {
        String status = available ? "Available" : ("Borrowed" + (isOverdue() ? " [OVERDUE " + overdueDays() + "d]" : ""));
        return String.format("[%s] \"%s\" by %s (%d) | %s | %s",
                isbn, title, author, publishYear, genre, status);
    }
}