// Импортируем Centrifuge (если используете модули)
// import { Centrifuge } from 'centrifuge';

// Конфигурация Centrifugo
const centrifugo = new Centrifuge('ws://localhost:8000/connection/websocket', {
  // token: "USER_TOKEN" // Раскомментировать если требуется аутентификация
});

// DOM элементы
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');

// Подключение к Centrifugo
centrifugo.connect();

// Подписка на канал задач
const sub = centrifugo.newSubscription('tasks');

// Обработчики событий Centrifugo
sub.on('publication', (ctx) => {
  const event = ctx.data;
  console.log('Получено событие:', event);
  
  switch(event.type) {
    case 'created':
      addTaskToDOM(event.task);
      break;
    case 'updated':
      updateTaskInDOM(event.task);
      break;
    case 'deleted':
      removeTaskFromDOM(event.taskId);
      break;
  }
});

sub.subscribe(); // Явно подписываемся на канал

// Загрузка задач при старте
document.addEventListener('DOMContentLoaded', loadTasks);

// ============== Основные функции ============== //

// Загрузка всех задач
async function loadTasks() {
  try {
    const response = await fetch('/api/task');
    if (!response.ok) throw new Error('Ошибка загрузки задач');
    
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (err) {
    console.error('Ошибка:', err);
    taskList.innerHTML = '<li class="error">Не удалось загрузить задачи</li>';
  }
}

// Создание задачи
async function createTask(e) {
  e.preventDefault();
  
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) {
    showAlert('Введите заголовок задачи', 'error');
    return;
  }

  try {
    const response = await fetch('/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) throw new Error('Ошибка создания задачи');
    
    taskForm.reset();
    showAlert('Задача создана!', 'success');
  } catch (err) {
    console.error('Ошибка:', err);
    showAlert('Не удалось создать задачу', 'error');
  }
}

// Обновление задачи
async function updateTask(taskId) {
  const title = prompt('Новый заголовок:');
  if (!title) return;

  const description = prompt('Новое описание:', 
    document.querySelector(`.task-item[data-id="${taskId}"] p`).textContent);

  try {
    const response = await fetch(`/api/task/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (!response.ok) throw new Error('Ошибка обновления задачи');
    showAlert('Задача обновлена!', 'success');
  } catch (err) {
    console.error('Ошибка:', err);
    showAlert('Не удалось обновить задачу', 'error');
  }
}

// Удаление задачи
async function deleteTask(taskId) {
  if (!confirm('Удалить задачу?')) return;
  
  try {
    const response = await fetch(`/api/task/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Ошибка удаления задачи');
    showAlert('Задача удалена!', 'success');
  } catch (err) {
    console.error('Ошибка:', err);
    showAlert('Не удалось удалить задачу', 'error');
  }
}

// ============== Вспомогательные функции ============== //

// Отрисовка всех задач
function renderTasks(tasks) {
  taskList.innerHTML = '';
  
  if (tasks.length === 0) {
    taskList.innerHTML = '<li>Нет задач. Создайте первую!</li>';
    return;
  }
  
  tasks.forEach(task => {
    addTaskToDOM(task);
  });
}

// Добавление задачи в DOM
function addTaskToDOM(task) {
  const taskEl = document.createElement('li');
  taskEl.className = 'task-item';
  taskEl.dataset.id = task.id;
  taskEl.innerHTML = `
    <div class="task-content">
      <h3>${task.title}</h3>
      <p>${task.description}</p>
    </div>
    <div class="task-actions">
      <button class="btn-edit" onclick="updateTask(${task.id})">✏️</button>
      <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️</button>
    </div>
  `;
  taskList.appendChild(taskEl);
}

// Обновление задачи в DOM
function updateTaskInDOM(task) {
  const taskEl = document.querySelector(`.task-item[data-id="${task.id}"]`);
  if (taskEl) {
    taskEl.querySelector('h3').textContent = task.title;
    taskEl.querySelector('p').textContent = task.description;
  }
}

// Удаление задачи из DOM
function removeTaskFromDOM(taskId) {
  const taskEl = document.querySelector(`.task-item[data-id="${taskId}"]`);
  if (taskEl) taskEl.remove();
}

// Показать уведомление
function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  document.body.appendChild(alert);
  
  setTimeout(() => alert.remove(), 3000);
}

// ============== Обработчики событий ============== //
taskForm.addEventListener('submit', createTask);

// Делаем функции глобальными для обработчиков в HTML
window.updateTask = updateTask;
window.deleteTask = deleteTask;