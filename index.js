const taskInput = document.querySelector(".task-input input[type='text']"),
      priorityInput = document.querySelector(".task-input select"),
      dueDateInput = document.querySelector(".task-input input[type='date']"),
      filters = document.querySelectorAll(".filters span"),
      clearAll = document.querySelector(".clear-btn"),
      taskBox = document.querySelector(".task-box"),
      addBtn = document.querySelector(".add-btn"); 

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list")) || [];


filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});


function showTodo(filter) {
    let liTag = "";
    if (todos.length) {
        todos.forEach((todo, id) => {
            let completed = todo.status === "completed" ? "checked" : "";
            if (filter === todo.status || filter === "all") {
                liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="details">
                        <span class="prifrity">${todo.priority || "-"}</span>
                        <span class="due-date">${todo.dueDate || "Son Tarih Belirlenmemiş"}</span>
                    </div>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id})'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>Burada herhangi bir göreviniz yok</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}

showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.querySelector("p");
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function editTask(taskId) {
    editId = taskId;
    isEditTask = true;
    let todo = todos[taskId];
    taskInput.value = todo.name;
    priorityInput.value = todo.priority || "Normal";
    dueDateInput.value = todo.dueDate || "";
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});


addBtn.addEventListener("click", () => {
    let userTask = taskInput.value.trim();
    if (userTask) {
        let priority = priorityInput.value;
        let dueDate = dueDateInput.value;
        if (!isEditTask) {
            todos.push({
                name: userTask,
                priority: priority,
                dueDate: dueDate,
                status: "pending"
            });
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].priority = priority;
            todos[editId].dueDate = dueDate;
        }
        taskInput.value = ""; 
        priorityInput.selectedIndex = 0; 
        dueDateInput.value = ""; 
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id); 
    }
});


taskInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        addBtn.click(); 
    }
});
