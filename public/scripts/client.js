console.log('client.js sourced');

$(document).ready(function () {
    console.log('jquery sourced');

    $('#createTask').on('click', displayTasks)

});

function displayTasks() {
    $('#tasks').append('<div class="task-item">' + $('#addTaskInput').val() + '</div>');
}