package library;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Member implements Serializable {
    private String memberId;
    private String name;
    private String email;
    private String phone;
    private LocalDate memberSince;
    private List<String> borrowedIsbns;
    private List<String> reservedIsbns;
    private double totalFinesPaid;
    private boolean active;

    public static final int MAX_BORROW_LIMIT = 5;

    public Member(String memberId, String name, String email, String phone) {
        this.memberId = memberId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.memberSince = LocalDate.now();
        this.borrowedIsbns = new ArrayList<>();
        this.reservedIsbns = new ArrayList<>();
        this.totalFinesPaid = 0.0;
        this.active = true;
    }

    // Getters
    public String getMemberId() { return memberId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public LocalDate getMemberSince() { return memberSince; }
    public List<String> getBorrowedIsbns() { return borrowedIsbns; }
    public List<String> getReservedIsbns() { return reservedIsbns; }
    public double getTotalFinesPaid() { return totalFinesPaid; }
    public boolean isActive() { return active; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setMemberSince(LocalDate date) { this.memberSince = date; }
    public void setTotalFinesPaid(double totalFinesPaid) { this.totalFinesPaid = totalFinesPaid; }
    public void setActive(boolean active) { this.active = active; }

    public boolean canBorrow() {
        return active && borrowedIsbns.size() < MAX_BORROW_LIMIT;
    }

    public void borrowBook(String isbn) {
        if (!borrowedIsbns.contains(isbn)) borrowedIsbns.add(isbn);
        reservedIsbns.remove(isbn);
    }

    public void returnBook(String isbn) {
        borrowedIsbns.remove(isbn);
    }

    public void reserveBook(String isbn) {
        if (!reservedIsbns.contains(isbn)) reservedIsbns.add(isbn);
    }

    public void payFine(double amount) {
        this.totalFinesPaid += amount;
    }

    // Serialize to CSV line
    public String toCsvLine() {
        String borrowed = String.join(";", borrowedIsbns);
        String reserved = String.join(";", reservedIsbns);
        return String.join("|", memberId, name, email, phone,
                memberSince.toString(), borrowed, reserved,
                String.valueOf(totalFinesPaid), String.valueOf(active));
    }

    // Deserialize from CSV line
    public static Member fromCsvLine(String line) {
        String[] parts = line.split("\\|", -1);
        if (parts.length < 9) throw new IllegalArgumentException("Invalid member record: " + line);
        Member m = new Member(parts[0], parts[1], parts[2], parts[3]);
        m.setMemberSince(LocalDate.parse(parts[4]));
        if (!parts[5].isEmpty()) {
            for (String isbn : parts[5].split(";")) m.borrowBook(isbn);
        }
        if (!parts[6].isEmpty()) {
            for (String isbn : parts[6].split(";")) m.reserveBook(isbn);
        }
        m.setTotalFinesPaid(Double.parseDouble(parts[7]));
        m.setActive(Boolean.parseBoolean(parts[8]));
        return m;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s | %s | %s | Books: %d/%d | Since: %s | %s",
                memberId, name, email, phone,
                borrowedIsbns.size(), MAX_BORROW_LIMIT,
                memberSince, active ? "Active" : "Inactive");
    }
}