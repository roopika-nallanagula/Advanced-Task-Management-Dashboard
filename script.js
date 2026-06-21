let currentEditId = null;
const themeToggle =
document.getElementById(
    "themeToggle"
);
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskDate = document.getElementById("taskDate");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskContainer");
const searchTask = document.getElementById("searchTask");
addTaskBtn.addEventListener("click", addTask);
searchTask.addEventListener("input",searchTasks);
function addTask() {

    const title = taskTitle.value.trim();
    const category = taskCategory.value;
    const dueDate = taskDate.value;

    if (
        title === "" ||
        category === "" ||
        dueDate === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const task = {
        id: Date.now(),
        title,
        category,
        dueDate,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();
    clearForm();
}

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function clearForm() {
    taskTitle.value = "";
    taskCategory.value = "";
    taskDate.value = "";
}

function searchTasks(){

    const searchText =
    searchTask.value
    .toLowerCase();

    const filteredTasks =
    tasks.filter(task =>

        task.title
        .toLowerCase()
        .includes(searchText)

    );

    renderTasks(filteredTasks);
}

function getCategoryIcon(category) {

    switch (category) {

        case "Work":
            return "💼";

        case "Learning":
            return "📚";

        case "Personal":
            return "🏠";

        default:
            return "📌";
    }
}

function renderTasks(
    taskList = tasks
)  {

    if (taskList.length === 0) {

        taskContainer.innerHTML =
            "<p>No Tasks Added Yet</p>";

        updateStats();
        return;
    }

    taskContainer.innerHTML = "";

    taskList.forEach(task => {

        const taskRow =
            document.createElement("div");

        taskRow.id =
        `task-${task.id}`;

        taskRow.classList.add("task-row");

        if (task.completed) {
            taskRow.classList.add("completed-task");
        }

        taskRow.innerHTML = `

        <div class="task-content">

            <h3>${task.title}</h3>

            <div class="task-meta">

                <span class="category-badge">
                    ${getCategoryIcon(task.category)}
                    ${task.category}
                </span>

                <span class="due-date">
                    📅 ${task.dueDate}
                </span>

            </div>

        </div>

        <div class="task-actions">

            <button
            class="complete-btn"
            onclick="toggleTask(${task.id})">
            ✓
            </button>

            <button
            class="edit-btn"
            onclick="editTask(${task.id})">
            ✏
            </button>

            <button
            class="delete-btn"
            onclick="deleteTask(${task.id})">
            🗑
            </button>

        </div>
        `;

        taskContainer.appendChild(taskRow);
    });

    updateStats();
}

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function editTask(id){

    const task =
    tasks.find(
        task => task.id === id
    );

    currentEditId = id;

    document.getElementById(
        "editTitle"
    ).value = task.title;

    document.getElementById(
        "editCategory"
    ).value = task.category;


    document.getElementById(
        "editDate"
    ).value = task.dueDate;

    document.getElementById(
        "editModal"
    ).style.display = "flex";
}

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();
}

function updateNotifications(){

    const today =
    new Date();

    let notifications = [];

    tasks.forEach(task => {

        if(task.completed)
        return;

        const dueDate =
        new Date(task.dueDate);

        const diffDays =
        Math.ceil(
            (
                dueDate - today
            )
            /
            (
                1000*60*60*24
            )
        );

        if(diffDays === 0){

            notifications.push({

         id: task.id,

         title: task.title,

         message: "Due Today"
        });
    }
        else if(
            diffDays === 1
        ){

            notifications.push({

         id: task.id,

         title: task.title,

         message: "Due Tomorrow"
        });
        }

        else if(
            diffDays === 2
        ){

             notifications.push({

         id: task.id,

         title: task.title,

         message: "Due in 2 days"
        });
        }

        else if(
            diffDays === -1
        ){

           notifications.push({

    id: task.id,

    title: task.title,

    message: "Overdue by 1 Day"
});
        }

        else if(
            diffDays === -2
        ){

           notifications.push({

    id: task.id,

    title: task.title,

    message: "Overdue by 2 Day"
});
        }

    });

    document
    .getElementById(
        "notificationCount"
    )
    .textContent =
    notifications.length;

    const notificationList =
    document
    .getElementById(
        "notificationList"
    );

    if(
        notifications.length === 0
    ){

        notificationList.innerHTML =
        "No Notifications";

        return;
    }

    console.log(notifications);

    notificationList.innerHTML =
    notifications
    .map(
    notification =>
    `
    <div
    class="notification-item"
    onclick="scrollToTask(${notification.id})">

        <strong>
            ${notification.title}
         </strong>

        <br>

        ${notification.message}

    </div>
    `
    )
    .join("");
    }

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

    document.getElementById(
        "pendingTasks"
    ).textContent = pending;

    const today =
new Date();

const overdue =
tasks.filter(task => {

    if(task.completed)
    return false;

    const dueDate =
    new Date(task.dueDate);

    const diffDays =
    Math.ceil(
        (
            dueDate - today
        ) /
        (
            1000 * 60 * 60 * 24
        )
    );

    return (
        diffDays === -1 ||
        diffDays === -2
    );

}).length;

    document.getElementById(
    "overdueTasks"
).textContent =
overdue;

const workCount =
tasks.filter(
task => task.category === "Work"
).length;

const learningCount =
tasks.filter(
task => task.category === "Learning"
).length;

const personalCount =
tasks.filter(
task => task.category === "Personal"
).length;

document.getElementById(
    "workCount"
).textContent =
workCount;

document.getElementById(
    "learningCount"
).textContent =
learningCount;

document.getElementById(
    "personalCount"
).textContent =
personalCount;

    const progress =
total === 0
? 0
: Math.round(
(completed / total) * 100
);

document
.getElementById("progressBar")
.style.width =
`${progress}%`;

let message = "";

if(progress >= 80){

    message =
    "Excellent productivity! Keep it up.";
}

else if(progress >= 50){

    message =
    "Good progress. You're on track.";
}

else if(progress > 0){

    message =
    "Keep pushing. More tasks to complete.";
}

else{

    message =
    "Start adding tasks to track productivity.";
}

document.getElementById(
    "productivityMessage"
).textContent =
message;

document
.getElementById("progressText")
.textContent =
`${progress}% Completed (${completed}/${total})`;


if(progress >= 80){

    message =
    "Excellent productivity! Keep it up.";
}

else if(progress >= 50){

    message =
    "Good progress. You're on track.";
}

else if(progress > 0){

    message =
    "Keep pushing. More tasks to complete.";
}

else{

    message =
    "Start adding tasks to track productivity.";
}

const productivityMessage =
document.getElementById(
    "productivityMessage"
);

if(productivityMessage){

    productivityMessage.textContent =
    message;
}

updateNotifications();
}

document
.getElementById("cancelEdit")
.addEventListener(
"click",
function(){

    document
    .getElementById(
        "editModal"
    )
    .style.display = "none";
});

document
.getElementById("saveEdit")
.addEventListener(
"click",
function(){

    const task =
    tasks.find(
        task =>
        task.id === currentEditId
    );

    task.title =
    document
    .getElementById(
        "editTitle"
    ).value;

    task.category =
    document
    .getElementById(
        "editCategory"
    ).value;

    task.dueDate =
    document
    .getElementById(
        "editDate"
    ).value;

    saveTasks();

    renderTasks();

    document
    .getElementById(
        "editModal"
    )
    .style.display = "none";
});

function filterTasks(type, button){

    document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {

        btn.classList.remove(
            "active"
        );
    });

    button.classList.add(
        "active"
    );

    let filteredTasks = [];

    if(type === "all"){

        filteredTasks = tasks;
    }

    else if(type === "pending"){

        filteredTasks =
        tasks.filter(
            task => !task.completed
        );
    }

    else if(type === "completed"){

        filteredTasks =
        tasks.filter(
            task => task.completed
        );
    }

    renderTasks(filteredTasks);
}

function scrollToTask(id){

    const task =
    document.getElementById(
        `task-${id}`
    );

    task.scrollIntoView({

        behavior:"smooth",

        block:"center"
    });

    task.classList.add(
        "highlight-task"
    );

    setTimeout(() => {

        task.classList.remove(
            "highlight-task"
        );

    }, 2000);
}

document
.getElementById(
    "notificationBell"
)
.addEventListener(
"click",
function(){

    const panel =
    document
    .getElementById(
        "notificationPanel"
    );

    const badge =
    document
    .getElementById(
        "notificationCount"
    );

    if(
        panel.style.display
        === "block"
    ){

        panel.style.display =
        "none";
    }
    else{

        panel.style.display =
        "block";

        badge.style.display =
        "none";
    }
});

themeToggle.addEventListener(
"click",
toggleTheme
);

function toggleTheme(){

    document.documentElement
    .classList.toggle(
        "dark-mode"
    );

    const isDark =
    document.documentElement
    .classList.contains(
        "dark-mode"
    );

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

    themeToggle.textContent =
    isDark
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
}

const savedTheme =
localStorage.getItem(
    "theme"
);

if(savedTheme === "dark"){

    document.documentElement
    .classList.add(
        "dark-mode"
    );

    themeToggle.textContent =
    "☀ Light Mode";
}

document
.querySelectorAll(".filter-btn")
.forEach(btn => {

    btn.classList.remove(
        "active"
    );
});

function showSection(section){

    document
    .querySelectorAll(".page-section")
    .forEach(sec => {

        sec.classList.remove("active");
    });

    document
    .getElementById(
        `${section}Section`
    )
    .classList.add("active");

    const pageTitle =
    document.getElementById(
        "pageTitle"
    );

    if(section === "dashboard"){

        pageTitle.textContent =
        "Dashboard";
    }

    else if(section === "tasks"){

        pageTitle.textContent =
        "Tasks";
    }

    else if(section === "analytics"){

        pageTitle.textContent =
        "Analytics";
    }

    else if(section === "settings"){

        pageTitle.textContent =
        "Settings";
    }
}


document
.getElementById(
    "clearTasksBtn"
)
.addEventListener(
"click",
clearAllTasks
);

function clearAllTasks(){

    const confirmDelete =
    confirm(
    "Delete all tasks?"
    );

    if(!confirmDelete)
    return;

    tasks = [];

    saveTasks();

    renderTasks();
}

renderTasks();