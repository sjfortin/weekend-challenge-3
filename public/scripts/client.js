console.log('client.js sourced');
var deleteConfirmationAnswered = true;

$(document).ready(function () {
    console.log('jquery sourced');
    
    // Display 
    getTodos()

    $('#createTodo').on('click', createTodo);
    $('#todos').on('click', '.completeButton', completeTodo);
    $('#todos').on('click', '.deleteButton', confirmDelete);
});

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

function getTodos() {
    $.ajax({
        method: 'GET',
        url: '/todos',
        success: function (response) {
            displayTodos(response);
        }
    })
}

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

function confirmDelete() {
    if (deleteConfirmationAnswered === true) {
        deleteConfirmationAnswered = false;
        console.log('delete button clicked', deleteConfirmationAnswered);

        var todoId = $(this).parent().parent().parent().data().id;

        $('#deleteConfirm').html('<p>Are you sure you want to delete the todo: <em>' + $(this).parent().parent().parent().children('.todo').text() + '</em>? <button class="confirmDeleteYes btn btn-primary">Yes</button><button class="confirmDeleteNo btn btn-danger">No</button></p>');

        $('#todos').on('click', '.confirmDeleteYes', function () {
            $.ajax({
                method: 'DELETE',
                url: '/todos/' + todoId,
                success: function (response) {
                    getTodos();
                    $('#deleteConfirm').html('');
                    deleteConfirmationAnswered = true;
                }
            })
        });
        $('#todos').on('click', '.confirmDeleteNo', function () {
            $('#deleteConfirm').html('');
            deleteConfirmationAnswered = true;
        });
    } else {
        alert('Confirm if you want to delete previous item selected first');
    }
}

function displayTodos(todos) {
    $('#completedTodos, #incompleteTodos').empty();
    var todoData = {};

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
            '<span class="delete"><button class="deleteButton btn btn-danger">Delete</button></span>' +
            '</div>' +
            '</div>'
        );

    });
}