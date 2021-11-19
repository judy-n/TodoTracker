"use strict";

function TodoTracker() {
    
    this.todolist = []
    
    this.element = document.createElement('div')
    this.element.className = "todotracker-container" 
    this.element.innerHTML = 
    `<div class="todolist-container">
    <div class="todolist-add">
        <input type="text" id="todoInput" placeholder="Type a task here...">
        <a href="#" id="add-btn">+</a>
    </div>

    <div class="todolist-list">
        <ul class="ListItems">
        </ul>
    </div>
    </div>
    `
    this.element.querySelector('#add-btn').addEventListener('click', ()=>this.addToList(this.element))
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