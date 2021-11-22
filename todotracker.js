"use strict";

function TodoTracker(time) {

    // Number of months for the graph
    this.length = time;

    // If time parameter wasn't passed in, default is 122 days (4 months)
    if (time == undefined) {
        this.length = 4;
    }

    // let num_months = Math.floor(this.length / 30); 

    // The starting month will be the current month
    const d = new Date();
    let curr_month = d.getMonth();
    let curr_year = d.getFullYear();

    const month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", 
                    "Sep", "Oct", "Nov", "Dec"]
    let month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check if it's a leap year
    if(curr_year % 4 == 0){
        month_days[1] = 29;
    }

    let total_days = 0;
    let counter = 0;
    let j = curr_month;
    let months_to_display = [];
    while (counter < this.length) {
        if (j > 11) {
            j = 0
        }
        months_to_display.push(month_names[j])
        total_days += month_days[j]
        counter ++;
        j++;
    }
    // console.log(months_to_display)

    this.todolist = []
    
    this.element = document.createElement('div')
    this.element.className = "todotracker-container" 
    this.element.innerHTML = 
    `<div class="todolist-container">
    <div class="todolist-add">
        <input type="text" spellcheck="false" id="todoInput" placeholder="Type a task here...">
        <a href="#" id="add-btn">+</a>
    </div>

    <div class="todolist-list">
        <ul class="ListItems">
        </ul>
    </div>
    </div>

    <div class="graph">
    <ul class="months">
    </ul>
    <ul class="days">
      <li>Sun</li>
      <li>Mon</li>
      <li>Tue</li>
      <li>Wed</li>
      <li>Thu</li>
      <li>Fri</li>
      <li>Sat</li>
    </ul>
    <ul class="squares">
    </ul>
    </div>
    `

    // Add months to DOM
    const months = this.element.querySelector('.months');
    for (let k = 0; k < months_to_display.length; k++){
        months.insertAdjacentHTML('beforeend', `<li>${months_to_display[k]}</li>`)
    }
    months.style.gridTemplateColumns = "";



    // Add squares to DOM 
    const squares = this.element.querySelector('.squares');
    for (let i = 1; i <= total_days; i++) {
    const level = Math.floor(Math.random() * 4);  
    squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
    }
    
    // Add button adds an element to the list
    this.element.querySelector('#add-btn').addEventListener('click', ()=>this.addToList(this.element))

    // Enter key adds element to the list (if it's in focus) 
    document.activeElement.addEventListener("keyup", (e)=> {
        if (e.keyCode === 13){
            e.preventDefault();
            this.addToList(this.element)
        }
    })

    document.body.appendChild(this.element)
}

TodoTracker.prototype = {

    addToList: function(element) {
        const todolist = element.querySelector(".ListItems");
        const toAdd = element.querySelector("#todoInput").value
        const child = document.createElement('li')
        const lastChild = todolist.children[0]
        child.innerHTML = 
        `<input type='checkbox'>
        <label>${toAdd}</label>
        <a href='#'><img class='trashcan' src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-delete-miscellaneous-kiranshastry-lineal-kiranshastry.png'></a>
        `
        todolist.insertBefore(child, lastChild);
        element.querySelector("#todoInput").value = ''
        child.querySelector('.trashcan').addEventListener('click', (e)=> this.deleteFromList(e, element))
    },

    deleteFromList: function(e, element) {
        e.preventDefault();
        const todolist = element.querySelector(".ListItems");
        const toRemove = e.target.parentElement.parentElement;
        todolist.removeChild(toRemove)
    }
}