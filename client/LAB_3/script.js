// Select elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const keyInput = document.getElementById("keyInput");
const keyOutput = document.getElementById("keyOutput");


// 1. Input event
taskInput.addEventListener("input", function () {
    message.textContent = "You entered: " + taskInput.value;
});


// 2. Button click event
addBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task !== "") {

        const li = document.createElement("li");
        li.textContent = task;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "removeBtn";

        removeBtn.addEventListener("click", function () {
            li.remove();
        });

        li.appendChild(removeBtn);
        taskList.appendChild(li);

        taskInput.value = "";
        message.textContent = "Task added successfully!";
    }
});


// 3. Keyboard event
keyInput.addEventListener("keydown", function (event) {
    keyOutput.textContent = "You pressed: " + event.key;
});