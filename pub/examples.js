"use strict";


// To get current date in the description 
let today = new Date()
document.querySelector('.dateToday').innerText = today.toLocaleString('default', {month: 'short'}) + " " + today.getDate();

// For the header
const todo = new TodoTracker({random: true});
todo.addAfter('.title')

// Example of default TodoTracker
const todo_normal = new TodoTracker();
todo_normal.addAfter('#ex1')

// Year-long TodoTracker
const todo_year = new TodoTracker({random: true, time: 12})
todo_year.addAfter('#ex2')


// TodoTracker with dropdown to choose date
const todo_choose = new TodoTracker({customDate: true, start: 10})
todo_choose.addAfter('#ex3')

const todo_color = new TodoTracker({random: true});
todo_color.appendTo('.themes-cont')
// todo_color.changeColor('orange')

function changeColor(color) {
    todo_color.changeColor(color)
}