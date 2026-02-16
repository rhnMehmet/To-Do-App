document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const taskCount = document.getElementById('task-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const dateDisplay = document.getElementById('date-display');

    // Set Date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Initialize
    renderTodos();

    // Event Listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Functions
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateCount();
        checkEmpty();
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') return;

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodoItem(newTodo);
        
        todoInput.value = '';
        todoInput.focus();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => item.remove(), 200);
        }
    }

    function toggleTodo(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos();
        
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.classList.toggle('completed');
        }
    }

    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos(); // Full re-render needed here to sync DOM
    }

    function updateCount() {
        const activeCount = todos.filter(t => !t.completed).length;
        taskCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }

    function checkEmpty() {
        if (todos.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }
    }

    function renderTodoItem(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        const checkbox = document.createElement('div');
        checkbox.className = 'checkbox';
        checkbox.addEventListener('click', () => toggleTodo(todo.id));

        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        // Allow clicking text to toggle too for better UX
        span.addEventListener('click', () => toggleTodo(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        
        // Remove empty state if it's there
        if (emptyState.classList.contains('visible')) {
            emptyState.classList.remove('visible');
        }
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => renderTodoItem(todo));
        updateCount();
        checkEmpty();
    }
});
