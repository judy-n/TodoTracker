"use strict";


// To get current date in the description 
let today = new Date()
document.querySelector('.dateToday').innerText = today.toLocaleString('default', {month: 'short'}) + " " + today.getDate();

// For the header
const todo = new TodoTracker(true);
todo.addAfter('.title')


// Example of default TodoTracker
const todo_normal = new TodoTracker(false);
todo_normal.addAfter('#ex1')

// Year-long TodoTracker
const todo_year = new TodoTracker(true, false, 12)
todo_year.addAfter('#ex2')


// TodoTracker with dropdown to choose date
const todo_choose = new TodoTracker(false, true, 5, 10)
todo_choose.addAfter('#ex3')