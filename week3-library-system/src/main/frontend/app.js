// ══════════════════════════════════════════════
//  CONSTANTS & STATE
// ══════════════════════════════════════════════
const FINE_PER_DAY = 2;
const BORROW_DAYS  = 14;
const MAX_BORROW   = 5;

let recordCounter = 1;
let memberCounter = 1;

let books   = [];
let members = [];
let loans   = [];

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════
function today() {
  return new Date().toISOString().split('T')[0];
}

// ══════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════
const VIEW_TITLES = {
  dashboard : 'Dashboard',
  books     : 'Book Catalog',
  members   : 'Member Registry',
  loans     : 'Borrow / Return',
  overdue   : 'Overdue Books',
  stats     : 'Statistics',
};

function nav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  const view = el.dataset.view;

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');

  document.getElementById('topbar-title').textContent = VIEW_TITLES[view];
}

// ══════════════════════════════════════════════
//  SIDEBAR TOGGLE (IMPORTANT)
// ══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }
});

// ══════════════════════════════════════════════
//  ADDING FUNCTIONS 
// ══════════════════════════════════════════════

function renderBooks() {
  const tbody = document.getElementById("books-tbody");
  tbody.innerHTML = "";

  books.forEach((book, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${book.isbn}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td><span class="badge badge-available">Available</span></td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteBook(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function addBook() {
  const book = {
    isbn: document.getElementById("isbn").value,
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    genre: document.getElementById("genre").value,
    year: document.getElementById("year").value,
  };

  books.push(book);

  document.getElementById("modal-bg").classList.remove("open");

  renderBooks();
  showToast("Book added successfully");
}

function deleteBook(index) {
  books.splice(index, 1);
  renderBooks();
  showToast("Book deleted");
}

function openModal(type) {
  const modalBg = document.getElementById("modal-bg");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  modalBg.classList.add("open");

  if (type === "book") {
    modalTitle.innerText = "Add New Book";

    modalBody.innerHTML = `
      <div class="form-group">
        <label class="form-label">ISBN</label>
        <input id="isbn" class="form-input">
      </div>

      <div class="form-group">
        <label class="form-label">Title</label>
        <input id="title" class="form-input">
      </div>

      <div class="form-group">
        <label class="form-label">Author</label>
        <input id="author" class="form-input">
      </div>

      <div class="form-group">
        <label class="form-label">Genre</label>
        <input id="genre" class="form-input">
      </div>

      <div class="form-group">
        <label class="form-label">Year</label>
        <input id="year" class="form-input">
      </div>

      <button class="btn btn-primary" onclick="addBook()">Add Book</button>
    `;
  }
}
function closeModal(e) {
  if (e.target.id === "modal-bg") {
    document.getElementById("modal-bg").classList.remove("open");
  }
}
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.className = "show success";

  setTimeout(() => {
    toast.className = "";
  }, 2000);
}
