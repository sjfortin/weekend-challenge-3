console.log('client.js sourced');
var deleteConfirmationAnswered = true;

$(document).ready(function () {
    console.log('jquery sourced');

    // Display todos on DOM load
    getTodos()

    // Event Listeners
    $('#createTodo').on('click', createTodo);
    $('#todos').on('click', '.completeButton', completeTodo);
    $('#todos').on('click', '.deleteButton', confirmDelete);
    $('#todos').on('click', '.confirmDeleteYes', deleteTodo);
    $('#todos').on('click', '.confirmDeleteNo', resetDeleteTodo);
});

// Save todo input to database
function createTodo() {
    var newTodo = {
        todo: $('#addTodoInput').val(),
        completed: false
    }
    if (newTodo.todo.length !== 0) {
        $.ajax({
            method: 'POST',
            url: '/todos',
            data: newTodo,
            success: function (response) {
                $('#addTodoInput').val('');
                getTodos();
            }
        })
    }
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

// Display are you sure you want to delete text and buttons
function confirmDelete() {
        var todoId = $(this).parent().parent().parent().data().id;
        var $buttonDiv = $(this).parent().parent();
        console.log($(this).parent().siblings().html());
        
        $(this).parent().siblings('.confirm').html('<p data-deleteid="' + todoId + '">Are you sure you want to delete the todo: <em>' + $(this).parent().parent().parent().children('.todo').text() + '</em>? <button class="confirmDeleteYes btn btn-sm btn-primary">Yes</button><button class="confirmDeleteNo btn btn-sm btn-danger">No</button></p>');
}

// Delete todo from view and database
function deleteTodo() {
    var todoId = $(this).parent().data().deleteid;
    
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
    $(this).parent().html('');
}

// Display all todos on the view
function displayTodos(todos) {
    $('#completedTodos, #incompleteTodos').empty();
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

        todoData.$sectionAddedTo.prepend(
            '<div class="todo-item" data-id="' + todoItem.id + '">' +
            '<div class="todo"><h4>' + todoItem.todo + '</h4></div>' +
            '<div>' +
            '<span ' + todoData.status + '"><button class="completeButton btn btn-primary">' + todoData.buttonText + '</button></span>' +
            '<span class="delete"><button class="deleteButton btn btn-danger">Delete</button></span><span class="confirm"></span>' +
            '</div>' +
            '</div>'
        );

    });
}