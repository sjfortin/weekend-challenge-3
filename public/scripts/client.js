console.log('client.js sourced');

$(document).ready(function () {
    console.log('jquery sourced');

    // Display todos on DOM load
    getTodos()

    // Event Listeners
    $('#createTodo').on('submit', createTodo);
    $('#todos').on('click', '.completeButton', completeTodo);
    $('#todos').on('click', '.deleteButton', confirmDelete);
    $('#todos').on('click', '.confirmDeleteYes', deleteTodo);
    $('#todos').on('click', '.confirmDeleteNo', resetDeleteTodo);
});

// Save todo input to database
function createTodo() {
    event.preventDefault();
    var newTodo = {
        todo: $('#addTodoInput').val(),
        completed: false
    }
    if (newTodo.todo.length !== 0) {
        $.ajax({
            method: 'POST',
            url: '/todos',
            data: newTodo
        }).done(function (response) {
            getTodos();
        }).fail(function (response) {
            console.log('Error:', response);
        })
    }
}

// Toggle todo from complete to incomplete and update in database
function completeTodo() {
    var todoId = $(this).parent().parent().parent().data().id;

    if ($(this).parent().hasClass('completed')) {
        var newCompleteStatus = false
    } else {
        var newCompleteStatus = true;
    }

    $.ajax({
        method: 'PUT',
        url: '/todos/' + todoId,
        data: {
            completed: newCompleteStatus
        },
        success: function (response) {
            getTodos();
        }
    })
}

// Display are you sure?
function confirmDelete() {
    var todoId = $(this).parent().parent().parent().data().id;

    var confirmDeleteDiv = $(this).parent().siblings('.confirm');

    confirmDeleteDiv.html(
        '<span>Are you sure? <button class="confirmDeleteYes btn btn-sm btn-primary">Yes</button><button class="confirmDeleteNo btn btn-sm btn-default">No</button></span>');

    confirmDeleteDiv.data('deleteid', todoId);
    confirmDeleteDiv.addClass('confirm-styled');
}

// Delete todo from view and database if user confirms deletion
function deleteTodo() {
    var todoId = $(this).parent().parent().data().deleteid;

    $.ajax({
        method: 'DELETE',
        url: '/todos/' + todoId,
        success: function (response) {
            getTodos();
        }
    })
}

// Remove delete text and buttons if user doesn't want to delete
function resetDeleteTodo() {
    $(this).closest('.confirm').removeClass('confirm-styled');
    $(this).parent().parent().html('');
}

// GET todos from database
function getTodos() {
    $.ajax({
        method: 'GET',
        url: '/todos',
        success: function (response) {
            displayTodos(response);
        }
    })
}

// Display all todos on the view
function displayTodos(todos) {
    $('#completedTodos, #incompleteTodos').empty();
    $('#addTodoInput').val('');
    var todoData = {};

    // Determine if todo should be added to the complete or incomplete section. Store data in todoData object.
    todos.forEach(function (todoItem) {
        if (todoItem.completed === true) {
            todoData.status = 'class="completed';
            todoData.$sectionAddedTo = $('#completedTodos');
            todoData.buttonText = 'Move to Incomplete'
        } else {
            todoData.status = 'class="incomplete';
            todoData.$sectionAddedTo = $('#incompleteTodos');
            todoData.buttonText = 'Complete'
        }

        var $todoItem = $('<div class="todo-item"></div>');
        $todoItem.data('id', todoItem.id);

        todoData.$sectionAddedTo.prepend($todoItem);

        $todoItem.append(
            '<div class="todo"><h4>' + todoItem.todo + '</h4></div>' +
            '<div>' +
            '<span ' + todoData.status + '"><button class="completeButton btn btn-primary">' + todoData.buttonText + '</button></span>' +
            '<span class="delete"><button class="deleteButton btn btn-danger">Delete</button></span><p class="confirm"></p>' +
            '</div>'
        );
    });

    if ($('#completedTodos').children().length === 0) {
        $('#completedTodos').html('<h4>Complete something. Do it!</h4>');
    }

    if ($('#incompleteTodos').children().length === 0) {
        $('#incompleteTodos').html('<h4>Add a new todo!</h4>');
    }
}
