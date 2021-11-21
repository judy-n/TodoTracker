"use strict";

function TodoTracker() {
    
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
      <li>Sep</li>
      <li>Oct</li>
      <li>Nov</li>
      <li>Dec</li> 
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

    // Add squares to DOM 
    const squares = this.element.querySelector('.squares');
    for (var i = 1; i < 122; i++) {
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