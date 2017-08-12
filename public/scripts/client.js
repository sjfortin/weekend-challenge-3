console.log('client.js sourced');

$(document).ready(function () {
    console.log('jquery sourced');
    getTasks()

    $('#createTask').on('click', saveTasks)

});

function saveTasks() {

    var newTask = {
        task: $('#addTaskInput').val(),
        completed: false
    }
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask,
        success: function (response) {
            getTasks();
        }
    })
}

function getTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function (response) {
            displayTasks(response)
        }
    })
}

function displayTasks(tasks) {
    $('#tasks').empty();
    console.log('Display tasks', tasks);
    tasks.forEach(function (taskItem) {
        $('#tasks').append('<div class="task-item">' + taskItem.task + '</div>');
    });
}