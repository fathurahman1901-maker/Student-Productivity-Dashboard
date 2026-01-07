// script.js
// Motivational Quotes Array
const quotes = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
    "You miss 100% of the shots you don't take. – Wayne Gretzky",
    "The best way to predict the future is to create it. – Peter Drucker"
];

// DOM Elements
const taskForm = document.getElementById('add-task-form');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');
const emptyState = document.getElementById('empty-state');
const quoteElement = document.getElementById('motivational-quote');

// Stats Elements
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');

// Load Tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Set Random Quote
    quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Render Tasks
    renderTasks();
    updateStats();
});

// Add Task Event
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;
    
    if (title && priority && deadline) {
        const task = {
            id: Date.now(),
            title,
            priority,
            deadline,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        updateStats();
        taskForm.reset();
    }
});

// Filter and Sort Events
filterSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

// Render Tasks
function renderTasks() {
    const filter = filterSelect.value;
    const sortBy = sortSelect.value;
    
    let filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
    });
    
    // Sort Tasks
    filteredTasks.sort((a, b) => {
        if (sortBy === 'deadline') {
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (sortBy === 'priority') {
            const priorityOrder = { low: 1, medium: 2, high: 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });
    
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-details">
                    <span class="task-title">${task.title}</span>
                    <div class="task-meta">
                        Deadline: ${new Date(task.deadline).toLocaleDateString()}
                        <span class="task-priority priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="complete-btn" data-id="${task.id}">✔</button>
                    <button class="edit-btn" data-id="${task.id}">✏</button>
                    <button class="delete-btn" data-id="${task.id}">🗑</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
    
    // Add Event Listeners to Buttons
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', toggleComplete);
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editTask);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

// Toggle Complete
function toggleComplete(e) {
    const id = parseInt(e.target.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Edit Task
function editTask(e) {
    const id = parseInt(e.target.dataset.id);
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newTitle = prompt('Edit Task Title:', task.title);
        const newPriority = prompt('Edit Priority (low/medium/high):', task.priority);
        const newDeadline = prompt('Edit Deadline (YYYY-MM-DD):', task.deadline);
        
        if (newTitle && newPriority && newDeadline) {
            task.title = newTitle.trim();
            task.priority = newPriority.toLowerCase();
            task.deadline = newDeadline;
            saveTasks();
            renderTasks();
        }
    }
}

// Delete Task
function deleteTask(e) {
    const id = parseInt(e.target.dataset.id);
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Update Stats
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
}

// Save Tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
