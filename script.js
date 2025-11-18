// Data Management
const STORAGE_KEY = 'taskflow_data';
const QUOTES = [
    "Stay focused and make it happen! 🌟",
    "Every task completed is a step forward! 💪",
    "You're doing amazing! Keep going! 🚀",
    "Progress, not perfection! 📈",
    "Small steps lead to big achievements! 👣",
    "Believe in yourself and your goals! 🌈",
    "One task at a time, you've got this! ⏱️",
    "Your future self will thank you! 🙏",
    "Today is the perfect day to accomplish! ✨",
    "Never stop improving! 🎯"
];

let appState = {
    lists: [],
    currentListId: null,
    filter: 'all',
    editingTaskId: null
};

function initApp() {
    loadData();
    if (appState.lists.length === 0) {
        createDefaultList();
    }
    if (!appState.currentListId) {
        appState.currentListId = appState.lists[0].id;
    }
    updateUI();
    rotateQuotes();
    setInterval(rotateQuotes, 10000);
}

function createDefaultList() {
    const defaultList = {
        id: Date.now(),
        name: 'My Tasks',
        tasks: []
    };
    appState.lists.push(defaultList);
    appState.currentListId = defaultList.id;
    saveData();
}

function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        appState = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function rotateQuotes() {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    document.getElementById('quote').textContent = randomQuote;
}

function getCurrentList() {
    return appState.lists.find(l => l.id === appState.currentListId);
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) return;

    const currentList = getCurrentList();
    const newTask = {
        id: Date.now(),
        title: text,
        description: '',
        date: '',
        time: '',
        completed: false,
        createdAt: new Date().toISOString()
    };

    currentList.tasks.push(newTask);
    saveData();
    updateUI();
    input.value = '';
    input.focus();
}

function toggleTask(taskId) {
    const currentList = getCurrentList();
    const task = currentList.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            celebrateCompletion();
        }
        saveData();
        updateUI();
    }
}

function deleteTask(taskId) {
    const currentList = getCurrentList();
    currentList.tasks = currentList.tasks.filter(t => t.id !== taskId);
    saveData();
    updateUI();
}

function editTask(taskId) {
    const currentList = getCurrentList();
    const task = currentList.tasks.find(t => t.id === taskId);
    if (task) {
        appState.editingTaskId = taskId;
        document.getElementById('editTitle').value = task.title;
        document.getElementById('editDescription').value = task.description || '';
        document.getElementById('editDate').value = task.date || '';
        document.getElementById('editTime').value = task.time || '';
        document.getElementById('editModal').classList.add('active');
    }
}

function saveEditedTask(e) {
    e.preventDefault();
    const currentList = getCurrentList();
    const task = currentList.tasks.find(t => t.id === appState.editingTaskId);
    if (task) {
        task.title = document.getElementById('editTitle').value;
        task.description = document.getElementById('editDescription').value;
        task.date = document.getElementById('editDate').value;
        task.time = document.getElementById('editTime').value;
        saveData();
        updateUI();
        closeModal();
    }
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('newListModal').classList.remove('active');
    appState.editingTaskId = null;
}

function createNewList() {
    document.getElementById('newListModal').classList.add('active');
}

function saveNewList(e) {
    e.preventDefault();
    const name = document.getElementById('newListName').value.trim();
    if (!name) return;

    const newList = {
        id: Date.now(),
        name: name,
        tasks: []
    };
    appState.lists.push(newList);
    appState.currentListId = newList.id;
    saveData();
    updateUI();
    closeModal();
    document.getElementById('newListName').value = '';
}

function selectList(listId) {
    appState.currentListId = listId;
    appState.filter = 'all';
    saveData();
    updateUI();
}

function deleteList(listId, e) {
    e.stopPropagation();
    if (appState.lists.length === 1) {
        alert('You must have at least one list!');
        return;
    }
    appState.lists = appState.lists.filter(l => l.id !== listId);
    if (appState.currentListId === listId) {
        appState.currentListId = appState.lists[0].id;
    }
    saveData();
    updateUI();
}

function filterTasks(type) {
    appState.filter = type;
    updateUI();
}

function getFilteredTasks() {
    const currentList = getCurrentList();
    if (!currentList) return [];

    let tasks = currentList.tasks;
    if (appState.filter === 'pending') {
        tasks = tasks.filter(t => !t.completed);
    } else if (appState.filter === 'completed') {
        tasks = tasks.filter(t => t.completed);
    }
    return tasks;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

function isToday(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function celebrateCompletion() {
    const celebration = document.getElementById('celebration');
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = ['#667eea', '#764ba2', '#f093fb', '#4facfe'][Math.floor(Math.random() * 4)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        celebration.appendChild(confetti);
    }
    setTimeout(() => {
        celebration.innerHTML = '';
    }, 3500);
}

function updateUI() {
    updateSidebar();
    updateMainContent();
}

function updateSidebar() {
    const container = document.getElementById('listContainer');
    container.innerHTML = '';

    appState.lists.forEach(list => {
        const completedCount = list.tasks.filter(t => t.completed).length;
        const totalCount = list.tasks.length;
        const listElement = document.createElement('div');
        listElement.className = 'list-item';
        if (list.id === appState.currentListId) {
            listElement.classList.add('active');
        }

        listElement.innerHTML = `
            <span>${list.name}</span>
            <span class="list-badge">${completedCount}/${totalCount}</span>
        `;

        listElement.addEventListener('click', () => selectList(list.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.style.background = 'none';
        deleteBtn.style.border = 'none';
        deleteBtn.style.color = 'inherit';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '20px';
        deleteBtn.style.padding = '0';
        deleteBtn.style.display = 'none';
        listElement.appendChild(deleteBtn);
        deleteBtn.onclick = (e) => deleteList(list.id, e);

        listElement.onmouseenter = () => {
            deleteBtn.style.display = 'block';
        };
        listElement.onmouseleave = () => {
            deleteBtn.style.display = 'none';
        };

        container.appendChild(listElement);
    });
}

function updateMainContent() {
    const currentList = getCurrentList();
    if (!currentList) return;

    document.getElementById('currentListName').textContent = currentList.name;

    const tasks = getFilteredTasks();
    const totalTasks = currentList.tasks.length;
    const completedTasks = currentList.tasks.filter(t => t.completed).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('progressPercent').textContent = totalTasks === 0 ? '0%' : Math.round((completedTasks / totalTasks) * 100) + '%';

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach((btn, idx) => {
        btn.classList.remove('active');
        if ((idx === 0 && appState.filter === 'all') ||
            (idx === 1 && appState.filter === 'pending') ||
            (idx === 2 && appState.filter === 'completed')) {
            btn.classList.add('active');
        }
    });

    const container = document.getElementById('tasksContainer');
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">📝 No tasks yet. Add one to get started!</div>';
        return;
    }

    container.innerHTML = tasks.map(task => {
        const overdue = isOverdue(task.date) && !task.completed;
        const today = isToday(task.date);
        const dateClass = overdue ? 'overdue' : today ? 'today' : '';
        const dateText = formatDate(task.date);

        return `
            <div class="task-card ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${task.id})" />
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        ${task.date ? `<span class="task-date ${dateClass}">📅 ${dateText}</span>` : ''}
                        ${task.time ? `<span class="task-time">🕐 ${task.time}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn" onclick="editTask(${task.id})">✏️</button>
                    <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Event Listeners
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('editModal')) closeModal();
});

document.getElementById('newListModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('newListModal')) closeModal();
});

// Initialize App
initApp();
