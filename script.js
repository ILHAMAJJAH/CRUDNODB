document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("todoform");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const deleteButton = document.getElementById("deleteButton"); // Mendapatkan referensi tombol delete

    // Variabel global untuk status pengeditan
    let isEditing = false;
    let editTaskIndex = -1;

    // Load tasks from localStorage on page load
    loadTasks();

    // Add or edit task
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const task = taskInput.value.trim();
        if (task !== "") {
            if (isEditing && editTaskIndex !== -1) {
                // Jika sedang dalam mode pengeditan, ubah task yang ada pada indeks yang sesuai
                editTask(task, editTaskIndex);
                isEditing = false;
                editTaskIndex = -1;
            } else {
                // Jika tidak dalam mode pengeditan, tambahkan task baru
                addTask(task);
            }
            form.reset();
        }
    });

    // Delete task
    taskList.addEventListener("click", function(e) {
        if (e.target.classList.contains("delete")) {
            const taskItem = e.target.parentElement;
            deleteTask(taskItem);
        } else if (e.target.classList.contains("edit")) {
            const taskItem = e.target.parentElement;
            editTaskIndex = Array.from(taskList.children).indexOf(taskItem); // Simpan indeks task yang diedit
            taskInput.value = taskItem.textContent.trim().replace("Delete", "").replace("Edit", ""); // Isi input dengan teks task yang ada
            isEditing = true;
        }
    });

    // Delete all tasks when delete button is clicked
    deleteButton.addEventListener("click", function() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        // Clear tasks from localStorage
        localStorage.removeItem("tasks");
    });

    function loadTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToList(task));
    }

    function addTask(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        addTaskToList(task); // tambahkan ini untuk menampilkan task yang baru ditambahkan
    }

    function deleteTask(taskItem) {
        const task = taskItem.textContent.trim().replace("Edit", "").replace("Delete", ""); // Menghapus "Edit" dan "Delete" dari teks task
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(item => item !== task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskItem.remove();
    }

    function editTask(task, index) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks[index] = task; // Ganti task pada indeks yang sesuai dengan task yang baru
        localStorage.setItem("tasks", JSON.stringify(tasks));
        reloadTasks();
    }

    function reloadTasks() {
        taskList.innerHTML = "";
        loadTasks();
    }

    function addTaskToList(task) {
        const li = document.createElement("li");
        li.textContent = task;
        
        const deleteButton = document.createElement("span");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.style.marginLeft = "5px"; // Memberikan jarak antara teks dan tombol delete

        const editButton = document.createElement("span");
        editButton.textContent = "Edit";
        editButton.classList.add("edit");
        editButton.style.marginRight = "5px";

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    }
});