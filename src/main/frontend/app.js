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
//  DUMMY FUNCTIONS (so no errors)
// ══════════════════════════════════════════════
function globalSearch() {}
function openContextModal() {}
function openModal() {}
function closeModal() {}
function borrowBook() {}
function returnBook() {}