// --- Timer Logic ---
let defaultMinutes = 25;
let timeLeft = defaultMinutes * 60;
let timerInterval = null;
let sessions = Number(localStorage.getItem('ff_sessions') || 0);

function updateTimerUI() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${m}:${s}`;
  document.getElementById('sessionCount').textContent = sessions;
}

function setMode(mins) {
  clearInterval(timerInterval);
  timerInterval = null;
  defaultMinutes = mins;
  timeLeft = mins * 60;
  document.getElementById('startBtn').textContent = 'Start';
  updateTimerUI();
}

function toggleTimer() {
  const btn = document.getElementById('startBtn');
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    btn.textContent = 'Start';
  } else {
    btn.textContent = 'Pause';
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerUI();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.textContent = 'Start';
        if (defaultMinutes === 25) {
          sessions++;
          localStorage.setItem('ff_sessions', sessions);
        }
        alert('Session complete! Great job.');
        updateTimerUI();
      }
    }, 1000);
  }
}

function resetTimer() {
  setMode(defaultMinutes);
}

// --- Task Logic ---
let tasks = JSON.parse(localStorage.getItem('ff_tasks') || '[]');

function saveAndRender() {
  localStorage.setItem('ff_tasks', JSON.stringify(tasks));
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let done = 0;
  tasks.forEach((task, i) => {
    if (task.done) done++;
    const li = document.createElement('li');
    li.className = `${task.priority} ${task.done ? 'done' : ''}`;
    li.innerHTML = `
      <div class="task-left" onclick="toggleTask(${i})">
        <input type="checkbox" ${task.done ? 'checked' : ''} />
        <span class="text">${task.text}</span>
        <span class="badge">${task.priority}</span>
      </div>
      <button class="btn-danger" onclick="deleteTask(${i})">✕</button>
    `;
    list.appendChild(li);
  });

  document.getElementById('completedCount').textContent = done;
  document.getElementById('pendingCount').textContent = tasks.length - done;
}

function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('priorityInput').value;
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ text, priority, done: false });
  input.value = '';
  saveAndRender();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveAndRender();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveAndRender();
}

document.getElementById('taskInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

updateTimerUI();
saveAndRender();