console.log('client.js sourced');

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
    var taskId = $(this).parent().parent().data().id;

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

function deleteTask(taskId) {
    // var taskId = $(this).parent().parent().data().id;

    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + taskId,
        success: function (response) {
            getTasks();
        }
    })
}

function confirmDelete() {
    var taskId = $(this).parent().parent().data().id;

    $('#deleteConfirm').html('<p>Are you sure you want to delete? <button class="confirmDeleteYes">Yes</button><button class="confirmDeleteNo">No</button></p>');

    $('#tasks').on('click', '.confirmDeleteYes', function(){
        $.ajax({
            method: 'DELETE',
            url: '/tasks/' + taskId,
            success: function (response) {
                getTasks();
                $('#deleteConfirm').html('');
            }
        })
    });
    $('#tasks').on('click', '.confirmDeleteNo', function() {
        $('#deleteConfirm').html('');        
    });

}



function displayTasks(tasks) {
    $('#completedTasks, #incompleteTasks').empty();
    var taskData = {}
    tasks.forEach(function (taskItem) {
        if (taskItem.completed === true) {
            taskData.status = 'class="completed';
            taskData.$sectionAddedTo = $('#completedTasks');
            taskData.buttonText = 'Not Done'
        } else {
            taskData.status = 'class="incomplete';
            taskData.$sectionAddedTo = $('#incompleteTasks');
            taskData.buttonText = 'Complete'
        }

        taskData.$sectionAddedTo.prepend(
            '<div class="task-item" data-id="' + taskItem.id + '">' +
            '<span ' + taskData.status + '"><button class="completeButton">' + taskData.buttonText + '</button></span>' +
            '<span class="task">' + taskItem.task + '</span>' +
            '<span class="delete"><button class="deleteButton">Delete</button></span>' +
            '</div>'
        );

    });
}