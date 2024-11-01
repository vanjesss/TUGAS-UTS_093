// Initialize the chart
let chart;
function updateChart() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const pendingTasks = document.querySelectorAll("#task-list li:not(.completed)").length;

    if (!chart) {
        const ctx = document.getElementById("taskChart").getContext("2d");
        chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Completed", "Pending"],
                datasets: [{
                    data: [completedTasks, pendingTasks],
                    backgroundColor: ["#28a745", "#ffc107"]
                }]
            }
        });
    } else {
        chart.data.datasets[0].data = [completedTasks, pendingTasks];
        chart.update();
    }
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const imageInput = document.getElementById("image-input");
    const taskList = document.getElementById("task-list");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const listItem = document.createElement("li");
    listItem.textContent = taskText;
    listItem.draggable = true;

    // Add image if available
    if (imageInput.files.length > 0) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(imageInput.files[0]);
        listItem.insertBefore(img, listItem.firstChild);
    }

    // Add drag-and-drop functionality
    listItem.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text/plain", taskText);
        event.dataTransfer.effectAllowed = "move";
        listItem.classList.add("dragging");
    });

    listItem.addEventListener("dragover", function(event) {
        event.preventDefault();
    });

    listItem.addEventListener("drop", function(event) {
        event.preventDefault();
        const dragging = document.querySelector(".dragging");
        taskList.insertBefore(dragging, listItem);
        dragging.classList.remove("dragging");
        updateChart();
    });

    listItem.addEventListener("dragend", function() {
        listItem.classList.remove("dragging");
    });

    // Mark task as complete
    listItem.addEventListener("click", function() {
        listItem.classList.toggle("completed");
        updateChart();
    });

    // Delete button
    const deleteBtn = document.createElement("span");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = function() {
        taskList.removeChild(listItem);
        updateChart();
    };

    listItem.appendChild(deleteBtn);
    taskList.appendChild(listItem);
    taskInput.value = "";
    imageInput.value = "";

    updateChart();
}
