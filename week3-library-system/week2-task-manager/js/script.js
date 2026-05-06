/* ========================================================
   TaskFlow — Task Manager
   Features:
     - Add / Edit / Delete tasks
     - Complete toggle
     - Priority levels (Low / Medium / High)
     - Due dates with overdue detection
     - Tags
     - Filter: All / Active / Completed / High / Overdue
     - Search
     - Sort (date, priority, due, alpha)
     - localStorage persistence
     - Drag-and-drop reorder
     - Dark / Light theme toggle
     - Export / Import JSON backup
     - Progress bar
     - Stats
     - Keyboard shortcut: Ctrl/Cmd + K = new task, Escape = close modal
   ======================================================== */

(() => {
  'use strict';

  /* ---- STATE ---- */
  let tasks = [];
  let currentFilter = 'all';
  let currentSort   = 'date-desc';
  let searchQuery   = '';
  let dragSrcIndex  = null;

  /* ---- DOM REFS ---- */
  const taskList        = document.getElementById('task-list');
  const emptyState      = document.getElementById('empty-state');
  const modalOverlay    = document.getElementById('modal-overlay');
  const taskModal       = document.getElementById('task-modal');
  const modalTitle      = document.getElementById('modal-title');
  const modalClose      = document.getElementById('modal-close');
  const modalCancel     = document.getElementById('modal-cancel');
  const modalSave       = document.getElementById('modal-save');
  const editingId       = document.getElementById('editing-task-id');
  const titleInput      = document.getElementById('task-title-input');
  const descInput       = document.getElementById('task-desc-input');
  const priorityInput   = document.getElementById('task-priority');
  const dueInput        = document.getElementById('task-due');
  const tagsInput       = document.getElementById('task-tags-input');
  const titleError      = document.getElementById('title-error');
  const addTaskBtn      = document.getElementById('add-task-btn');
  const searchInput     = document.getElementById('search-input');
  const sortSelect      = document.getElementById('sort-select');
  const themeToggle     = document.getElementById('theme-toggle');
  const themeIcon       = document.getElementById('theme-icon');
  const filterTitle     = document.getElementById('filter-title');
  const progressFill    = document.getElementById('progress-fill');
  const progressLabel   = document.getElementById('progress-label');
  const statTotal       = document.getElementById('stat-total');
  const statActive      = document.getElementById('stat-active');
  const statDone        = document.getElementById('stat-done');
  const clearBtn        = document.getElementById('clear-completed-btn');
  const exportBtn       = document.getElementById('export-btn');
  const importFile      = document.getElementById('import-file');
  const toast           = document.getElementById('toast');
  const filterBtns      = document.querySelectorAll('.filter-btn');

  /* ---- UTILS ---- */
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const today = () => new Date().toISOString().slice(0, 10);

  function isOverdue(dueDate) {
    if (!dueDate) return false;
    return dueDate < today();
  }

  function isDueToday(dueDate) {
    if (!dueDate) return false;
    return dueDate === today();
  }

  function formatDate(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[+m - 1]} ${+d}, ${y}`;
  }

  /* ---- LOCALSTORAGE ---- */
  function loadTasks() {
    try {
      const saved = localStorage.getItem('taskflow_tasks');
      tasks = saved ? JSON.parse(saved) : [];
    } catch {
      tasks = [];
    }
  }

  function saveTasks() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }

  /* ---- THEME ---- */
  function loadTheme() {
    const saved = localStorage.getItem('taskflow_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('taskflow_theme', next);
    updateThemeIcon(next);
  });

  /* ---- TOAST ---- */
  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* ---- MODAL ---- */
  function openModal(task = null) {
    resetForm();
    if (task) {
      modalTitle.textContent = 'Edit Task';
      modalSave.textContent  = 'Update Task';
      editingId.value        = task.id;
      titleInput.value       = task.title;
      descInput.value        = task.description || '';
      priorityInput.value    = task.priority;
      dueInput.value         = task.dueDate || '';
      tagsInput.value        = (task.tags || []).join(', ');
    } else {
      modalTitle.textContent = 'New Task';
      modalSave.textContent  = 'Save Task';
      editingId.value        = '';
    }
    modalOverlay.classList.add('open');
    setTimeout(() => titleInput.focus(), 100);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    resetForm();
  }

  function resetForm() {
    titleInput.value       = '';
    descInput.value        = '';
    priorityInput.value    = 'medium';
    dueInput.value         = '';
    tagsInput.value        = '';
    titleError.textContent = '';
    titleInput.classList.remove('invalid');
    editingId.value        = '';
  }

  function validateForm() {
    let valid = true;
    if (!titleInput.value.trim()) {
      titleError.textContent = 'Task title is required.';
      titleInput.classList.add('invalid');
      valid = false;
    } else {
      titleError.textContent = '';
      titleInput.classList.remove('invalid');
    }
    return valid;
  }

  addTaskBtn.addEventListener('click', () => openModal());
  modalClose.addEventListener('click', closeModal);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  modalSave.addEventListener('click', () => {
    if (!validateForm()) return;

    const id          = editingId.value || uid();
    const title       = titleInput.value.trim();
    const description = descInput.value.trim();
    const priority    = priorityInput.value;
    const dueDate     = dueInput.value || null;
    const tags        = tagsInput.value
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const isEdit = Boolean(editingId.value);

    if (isEdit) {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks[idx] = { ...tasks[idx], title, description, priority, dueDate, tags };
        showToast('✏️ Task updated!');
      }
    } else {
      const newTask = {
        id,
        title,
        description,
        priority,
        dueDate,
        tags,
        completed: false,
        createdAt: Date.now()
      };
      tasks.unshift(newTask);
      showToast('✅ Task added!');
    }

    saveTasks();
    renderAll();
    closeModal();
  });

  /* ---- TASK ACTIONS ---- */
  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    renderAll();
    showToast(task.completed ? '🎉 Task completed!' : '↩️ Task marked active.');
  }

  function deleteTask(id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    // Animate then remove
    const li = taskList.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.classList.add('removing');
      li.addEventListener('animationend', () => {
        tasks.splice(idx, 1);
        saveTasks();
        renderAll();
      }, { once: true });
    } else {
      tasks.splice(idx, 1);
      saveTasks();
      renderAll();
    }
    showToast('🗑️ Task deleted.');
  }

  clearBtn.addEventListener('click', () => {
    const count = tasks.filter(t => t.completed).length;
    if (!count) { showToast('No completed tasks to clear.'); return; }
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderAll();
    showToast(`🧹 Cleared ${count} completed task${count > 1 ? 's' : ''}.`);
  });

  /* ---- FILTERS ---- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      const titles = { all: 'All Tasks', active: 'Active Tasks', completed: 'Completed Tasks', high: 'High Priority', overdue: 'Overdue Tasks' };
      filterTitle.textContent = titles[currentFilter] || 'Tasks';
      renderAll();
    });
  });

  /* ---- SEARCH ---- */
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase();
    renderAll();
  });

  /* ---- SORT ---- */
  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    renderAll();
  });

  /* ---- FILTER + SORT LOGIC ---- */
  function getFilteredSorted() {
    let list = [...tasks];

    // Filter
    switch (currentFilter) {
      case 'active':    list = list.filter(t => !t.completed); break;
      case 'completed': list = list.filter(t => t.completed); break;
      case 'high':      list = list.filter(t => t.priority === 'high'); break;
      case 'overdue':   list = list.filter(t => !t.completed && isOverdue(t.dueDate)); break;
    }

    // Search
    if (searchQuery) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(searchQuery) ||
        (t.description || '').toLowerCase().includes(searchQuery) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    // Sort
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    switch (currentSort) {
      case 'date-asc':  list.sort((a,b) => a.createdAt - b.createdAt); break;
      case 'date-desc': list.sort((a,b) => b.createdAt - a.createdAt); break;
      case 'priority':  list.sort((a,b) => priorityOrder[a.priority] - priorityOrder[b.priority]); break;
      case 'due':       list.sort((a,b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }); break;
      case 'alpha':     list.sort((a,b) => a.title.localeCompare(b.title)); break;
    }

    return list;
  }

  /* ---- RENDER ---- */
  function renderAll() {
    const list = getFilteredSorted();
    renderTaskList(list);
    updateStats();
    updateProgress();
  }

  function renderTaskList(list) {
    taskList.innerHTML = '';
    if (!list.length) {
      emptyState.classList.add('visible');
      return;
    }
    emptyState.classList.remove('visible');

    list.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.setAttribute('data-id', task.id);
      li.setAttribute('draggable', 'true');

      // Due date label
      let dueMeta = '';
      if (task.dueDate) {
        const cls = isOverdue(task.dueDate) && !task.completed ? 'overdue'
                  : isDueToday(task.dueDate) ? 'due-today' : '';
        const icon = isOverdue(task.dueDate) && !task.completed
          ? '<i class="fa-solid fa-triangle-exclamation"></i>'
          : '<i class="fa-regular fa-calendar"></i>';
        dueMeta = `<span class="due-date ${cls}">${icon} ${formatDate(task.dueDate)}</span>`;
      }

      // Tags
      const tagsMeta = (task.tags || []).map(t => `<span class="tag">${escHtml(t)}</span>`).join('');

      li.innerHTML = `
        <div class="task-checkbox" role="button" tabindex="0" aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
          <i class="fa-solid fa-check"></i>
        </div>
        <div class="task-body">
          <div class="task-title">${escHtml(task.title)}</div>
          ${task.description ? `<div class="task-desc">${escHtml(task.description)}</div>` : ''}
          <div class="task-meta">
            <span class="priority-badge ${task.priority}">${task.priority}</span>
            ${dueMeta}
            ${tagsMeta}
          </div>
        </div>
        <div class="task-actions">
          <button class="action-btn edit" title="Edit task"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn delete" title="Delete task"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;

      // Events
      li.querySelector('.task-checkbox').addEventListener('click', () => toggleComplete(task.id));
      li.querySelector('.task-checkbox').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') toggleComplete(task.id);
      });
      li.querySelector('.action-btn.edit').addEventListener('click', () => openModal(task));
      li.querySelector('.action-btn.delete').addEventListener('click', () => deleteTask(task.id));

      // Drag events
      li.addEventListener('dragstart', () => {
        dragSrcIndex = tasks.findIndex(t => t.id === task.id);
        li.classList.add('dragging');
      });
      li.addEventListener('dragend', () => li.classList.remove('dragging'));
      li.addEventListener('dragover', (e) => { e.preventDefault(); li.classList.add('drag-over'); });
      li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
      li.addEventListener('drop', (e) => {
        e.preventDefault();
        li.classList.remove('drag-over');
        const destIndex = tasks.findIndex(t => t.id === task.id);
        if (dragSrcIndex === null || dragSrcIndex === destIndex) return;
        const [moved] = tasks.splice(dragSrcIndex, 1);
        tasks.splice(destIndex, 0, moved);
        dragSrcIndex = null;
        saveTasks();
        renderAll();
      });

      taskList.appendChild(li);
    });
  }

  function updateStats() {
    const total  = tasks.length;
    const done   = tasks.filter(t => t.completed).length;
    const active = total - done;
    statTotal.textContent  = total;
    statActive.textContent = active;
    statDone.textContent   = done;
  }

  function updateProgress() {
    const total    = tasks.length;
    const done     = tasks.filter(t => t.completed).length;
    const pct      = total ? Math.round((done / total) * 100) : 0;
    progressFill.style.width  = pct + '%';
    progressLabel.textContent = `${pct}% complete`;
  }

  /* ---- EXPORT / IMPORT ---- */
  exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `taskflow-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📤 Tasks exported!');
  });

  importFile.addEventListener('change', () => {
    const file = importFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');
        // Merge (skip duplicates by id)
        const existing = new Set(tasks.map(t => t.id));
        let count = 0;
        imported.forEach(t => {
          if (!existing.has(t.id)) { tasks.push(t); count++; }
        });
        saveTasks();
        renderAll();
        showToast(`📥 Imported ${count} new task${count !== 1 ? 's' : ''}!`);
      } catch {
        showToast('❌ Invalid backup file.');
      }
      importFile.value = '';
    };
    reader.readAsText(file);
  });

  /* ---- KEYBOARD SHORTCUTS ---- */
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K = new task
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openModal();
    }
    // Escape = close modal
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
    // Enter in modal title = save
    if (e.key === 'Enter' && modalOverlay.classList.contains('open') && document.activeElement === titleInput) {
      modalSave.click();
    }
  });

  /* ---- HTML ESCAPE ---- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  /* ---- INIT ---- */
  function init() {
    loadTheme();
    loadTasks();
    renderAll();
  }

  init();

})();