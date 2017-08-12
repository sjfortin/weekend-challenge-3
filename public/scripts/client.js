console.log('client.js sourced');

$(document).ready(function () {
    console.log('jquery sourced');
    getTasks()

    $('#createTask').on('click', saveTask);
    $('#tasks').on('click', '.completeButton', completeTask);
    // $('#tasks').on('click', '.deleteTask', deleteTask);

});

function saveTask() {

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
        $('#tasks').append(
            '<div class="task-item" data-id="' + taskItem.id + '">' +
            '<span class="status"><button class="completeButton">Complete</button></span>' +
            '<span class="task">' + taskItem.task + '</span>' +
            '<span class="delete"><button class="deleteButton">Delete</button></span>' +
            '</div>'
        );

    });
}

function completeTask() {
    var taskId = $(this).parent().parent().data().id;
    var status = $(this).parent();
    
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + taskId,
        data: {
            completed: true
        },
        success: function (response) {
            status.addClass('completed');
        }
    })

}