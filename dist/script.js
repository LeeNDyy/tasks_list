// Селекторы DOM
const tasksContainer = document.getElementById("tasks");
const createBtn = document.getElementById("createTask");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");

// Загружаем задачи при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks);

// Функция загрузки задач
async function loadTasks() {
    try {
        const response = await fetch('/api/task');
        if (!response.ok) throw new Error('Ошибка загрузки задач');
        
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (err) {
        console.error("Ошибка:", err);
        tasksContainer.innerHTML = '<div class="error">Не удалось загрузить задачи</div>';
    }
}

// Функция отрисовки задач
function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.dataset.id = task.id;
        taskElement.innerHTML = `
            <div class="task-header">
                <h3>#${task.id}: ${task.title}</h3>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
            <p>${task.description}</p>
            <div class="edit-form" id="edit-form-${task.id}" style="display: none;">
                <input type="text" id="edit-title-${task.id}" value="${task.title}" required>
                <textarea id="edit-desc-${task.id}" required>${task.description}</textarea>
                <button onclick="saveTask(${task.id})">Сохранить</button>
                <button onclick="cancelEdit(${task.id})">Отмена</button>
            </div>
        `;
        tasksContainer.appendChild(taskElement);
    });
}

// Функция создания задачи
async function createTask() {
    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    
    if (!title) {
        alert("Пожалуйста, введите заголовок задачи");
        return;
    }

    try {
        const response = await fetch('/api/task', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, description})
        });
        
        if (!response.ok) throw new Error('Ошибка при создании задачи');
        
        const newTask = await response.json();
        taskTitle.value = "";
        taskDesc.value = "";
        loadTasks(); // Перезагружаем список задач
        
    } catch (err) {
        console.error("Ошибка:", err);
        alert("Не удалось создать задачу");
    }
}

// Глобальные функции для управления задачами
window.editTask = function(id) {
    // Скрываем все формы редактирования
    document.querySelectorAll('.edit-form').forEach(form => {
        form.style.display = 'none';
    });
    // Показываем нужную форму
    document.getElementById(`edit-form-${id}`).style.display = 'block';
};

window.cancelEdit = function(id) {
    document.getElementById(`edit-form-${id}`).style.display = 'none';
};

window.saveTask = async function(id) {
    const title = document.getElementById(`edit-title-${id}`).value.trim();
    const description = document.getElementById(`edit-desc-${id}`).value.trim();
    
    if (!title) {
        alert("Заголовок не может быть пустым");
        return;
    }

    try {
        const response = await fetch(`/api/task/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, description})
        });
        
        if (!response.ok) throw new Error('Ошибка при обновлении задачи');
        
        loadTasks(); // Перезагружаем список задач
        
    } catch (err) {
        console.error("Ошибка:", err);
        alert("Не удалось обновить задачу");
    }
};

window.deleteTask = async function(id) {
    if (!confirm("Вы уверены, что хотите удалить эту задачу?")) return;
    
    try {
        const response = await fetch(`/api/task/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Ошибка при удалении задачи');
        
        loadTasks(); // Перезагружаем список задач
        
    } catch (err) {
        console.error("Ошибка:", err);
        alert("Не удалось удалить задачу");
    }
};

// Обработчики событий
createBtn.addEventListener("click", createTask);
taskTitle.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') createTask();
});