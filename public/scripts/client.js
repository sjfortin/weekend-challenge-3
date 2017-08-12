console.log('client.js sourced');

$(document).ready(function () {
    console.log('jquery sourced');
    getTasks()

    $('#createTask').on('click', getTasks)

});

function getTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: function (response) {
            console.log(response);
            displayTasks(response)
        }
    })
}

function displayTasks(tasks) {
    console.log('Display tasks', tasks);
    tasks.forEach(function(taskItem){
        $('#tasks').append('<div class="task-item">' + taskItem.task + '</div>');
    });
}