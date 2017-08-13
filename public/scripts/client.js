console.log('client.js sourced');
var deleteConfirmationAnswered = true;

$(document).ready(function () {
    console.log('jquery sourced');
    getTasks()

    $('#createTask').on('click', createTask);
    $('#tasks').on('click', '.completeButton', completeTask);
    $('#tasks').on('click', '.deleteButton', confirmDelete);
});

function createTask() {
    var newTask = {
        task: $('#addTaskInput').val(),
        completed: false
    }
    if (newTask.task.length !== 0) {
        $.ajax({
            method: 'POST',
            url: '/tasks',
            data: newTask,
            success: function (response) {
                $('#addTaskInput').val('');
                getTasks();
            }
        })
    }
}

function getTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function (response) {
            displayTasks(response);
        }
    })
}

function completeTask() {
    var taskId = $(this).parent().parent().parent().data().id;

    if ($(this).parent().hasClass('completed')) {
        var newCompleteStatus = false
    } else {
        var newCompleteStatus = true;
    }

    $.ajax({
        method: 'PUT',
        url: '/tasks/' + taskId,
        data: {
            completed: newCompleteStatus
        },
        success: function (response) {
            getTasks();
        }
    })
}

function confirmDelete() {
    if (deleteConfirmationAnswered === true) {
        deleteConfirmationAnswered = false;
        console.log('delete button clicked', deleteConfirmationAnswered);

        var taskId = $(this).parent().parent().parent().data().id;

        $('#deleteConfirm').html('<p>Are you sure you want to delete the task: <em>' + $(this).parent().parent().parent().children('.task').text() + '</em>? <button class="confirmDeleteYes btn btn-primary">Yes</button><button class="confirmDeleteNo btn btn-danger">No</button></p>');

        $('#tasks').on('click', '.confirmDeleteYes', function () {
            $.ajax({
                method: 'DELETE',
                url: '/tasks/' + taskId,
                success: function (response) {
                    getTasks();
                    $('#deleteConfirm').html('');
                    deleteConfirmationAnswered = true;
                }
            })
        });
        $('#tasks').on('click', '.confirmDeleteNo', function () {
            $('#deleteConfirm').html('');
            deleteConfirmationAnswered = true;
        });
    } else {
        alert('Confirm if you want to delete previous item selected first');
    }
}

function displayTasks(tasks) {
    $('#completedTasks, #incompleteTasks').empty();
    var taskData = {};

    tasks.forEach(function (taskItem) {
        if (taskItem.completed === true) {
            taskData.status = 'class="completed';
            taskData.$sectionAddedTo = $('#completedTasks');
            taskData.buttonText = 'Move to Incomplete'
        } else {
            taskData.status = 'class="incomplete';
            taskData.$sectionAddedTo = $('#incompleteTasks');
            taskData.buttonText = 'Complete'
        }

        taskData.$sectionAddedTo.prepend(
            '<div class="task-item" data-id="' + taskItem.id + '">' +
            '<div class="task"><h4>' + taskItem.task + '</h4></div>' +
            '<div>' +
            '<span ' + taskData.status + '"><button class="completeButton btn btn-primary">' + taskData.buttonText + '</button></span>' +
            '<span class="delete"><button class="deleteButton btn btn-danger">Delete</button></span>' +
            '</div>' +
            '</div>'
        );

    });
}