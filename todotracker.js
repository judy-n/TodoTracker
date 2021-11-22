"use strict";

function TodoTracker(random, time, start) {

    // Number of months to have in the graph
    this.length = time;

    // Month (1-12) to start the graph from
    this.start = start;

    // If time parameter wasn't passed in, default is 4 months
    if (time == undefined) {
        this.length = 4;
    }

    // If start parameter wasn't passed in, the default starting month is the current month
    const d = new Date();
    let curr_year = d.getFullYear();
    let curr_month = 0;
    
    if (start == undefined) {
        curr_month = d.getMonth();
    } else {
        curr_month = start-1;
    }
    

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
    let month_to_display_ids =[];
    while (counter < this.length) {
        if (j > 11) {
            j = 0
        }
        months_to_display.push(month_names[j])
        month_to_display_ids.push(j)
        total_days += month_days[j]
        counter ++;
        j++;
    }


    // If random parameter is true, the graph will have random square colors (for proof of concept). 
    // Otherwise it will start out empty.

    if (random == undefined) {
        this.randomize = false;
    } else {
        this.randomize = random;
    }
    
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
    let month_style = "";
    const months = this.element.querySelector('.months');
    for (let k = 0; k < months_to_display.length; k++){
        months.insertAdjacentHTML('beforeend', `<li>${months_to_display[k]}</li>`)
        month_style += "calc(var(--week-width) * 4) "
    }
    months.style.gridTemplateColumns = month_style;


    // Add squares to DOM 
    let level = 0;
    const squares = this.element.querySelector('.squares');
    let month_id = 1;

    for (let f = 0; f < month_to_display_ids.length; f++){
        for (let h=0; h < month_days[month_to_display_ids[f]]; h++){
            if (this.randomize) {
                level = Math.floor(Math.random() * 4);  
            } 
            // Each has an id in the form "month/day"
            squares.insertAdjacentHTML('beforeend', `<li data-level="${level}" id="md${month_to_display_ids[f]+1}/${month_id}"></li>`);
            month_id++;
        }
        month_id=1;
    }
    // console.log(document.querySelector(`#md${11}\\/${22}`).value)

    // Keeps track of completed list items
    this.completed = {}
    
    // Add button adds an element to the list
    this.element.querySelector('#add-btn').addEventListener('click', ()=>this.addToList(this.element, this.completed))

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

    addToList: function(element, completed) {
        const todolist = element.querySelector(".ListItems");
        const toAdd = element.querySelector("#todoInput").value
        const child = document.createElement('li')
        const lastChild = todolist.children[0]
        child.innerHTML = 
        `<input type='checkbox' id='check'>
        <label>${toAdd}</label>
        <a href='#'><img class='trashcan' src='https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/000000/external-delete-miscellaneous-kiranshastry-lineal-kiranshastry.png'></a>
        `
        todolist.insertBefore(child, lastChild);
        element.querySelector("#todoInput").value = ''
        // Trashcan button deletes the item from list
        child.querySelector('.trashcan').addEventListener('click', (e)=> this.deleteFromList(e, element))

        // Keep track of completed items 
        child.querySelector('#check').addEventListener('change', (e)=> {
            if (e.target.checked){
                this.addToCompleted(e, element, this.completed)
            } else {
                this.removeFromCompleted(e, this.completed)
            }
        });
        
    },

    deleteFromList: function(e, element) {
        e.preventDefault();
        const todolist = element.querySelector(".ListItems");
        const toRemove = e.target.parentElement.parentElement;
        todolist.removeChild(toRemove)
    },

    addToCompleted: function(e, element, completed) {
        e.preventDefault();
        const today = new Date();
        let dateCompleted = today.getMonth()+1 + "/" + today.getDate()
        const completedItem = e.target.parentElement.children[1].innerText
   
        if (dateCompleted in completed) {
            completed[dateCompleted].push(completedItem)
        } else {
            completed[dateCompleted]= [completedItem]
        }
        console.log(completed)
        let curr_square = document.querySelector(`#md${today.getMonth()+1}\\/${today.getDate()}`);
        let curr_lvl = curr_square.getAttribute("data-level");
        if (curr_lvl < 3) {
            console.log("hi im completed")
            curr_square.setAttribute("data-level", parseInt(curr_lvl)+ 1)
        }
    
        
    },

    removeFromCompleted: function(e, completed) {
        e.preventDefault();
        const today = new Date();
        let dateCompleted = today.getMonth()+1 + "/" + today.getDate()

        const completedItem = e.target.parentElement.children[1].innerText
        completed[dateCompleted].splice(completed[dateCompleted].indexOf(completedItem),1)
        
    
        let curr_square = document.querySelector(`#md${today.getMonth()+1}\\/${today.getDate()}`);
        let curr_lvl = curr_square.getAttribute("data-level");
        if (curr_lvl > 0) {
            curr_square.setAttribute("data-level", parseInt(curr_lvl)-1)
        }
    }
}