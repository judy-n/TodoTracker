"use strict";

function TodoTracker(random, customDate, time, start) {

    // Number of months to have in the graph
    this.length = time;

    // Month (1-12) to start the graph from
    this.start = start;

    // If time parameter wasn't passed in, default is 4 months
    if (time == undefined || time > 12) {
        this.length = 4;
    }

    // If start parameter wasn't passed in, the default starting month is the current month
    this.day = new Date();
    let curr_year = this.day.getFullYear();
    let curr_month = 0;
    
    if (start == undefined) {
        curr_month = this.day.getMonth();
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
            // Each square has an id in the form "month/day"
            squares.insertAdjacentHTML('beforeend', `<li class="tooltip" data-level="${level}" id="md${month_to_display_ids[f]+1}/${month_id}">
            <span class="tooltiptext"><p id="month-popup">${month_names[month_to_display_ids[f]]} ${month_id}</p></span></li>`);
            month_id++;
        }
        month_id=1;
    }

    // If passed as true, the customDate option creates a dropdown to change the date and simulate a 
    // longterm use of TodoTracker
    if (customDate == undefined) {
        this.custom = false;
    } else {
        this.custom = customDate;
    }

    if (this.custom) {
        let dropd = document.createElement('div')
        dropd.className = "dropdown";
        dropd.innerHTML = 
        `<p>Use the dropdown to try different dates</p>
        <select name="month" id="month-select">
            <option value="">Month</option>
        </select>
        <select name="day" id="day-select">
            <option value="">Day</option>
        </select>`
        this.element.querySelector(".todolist-container").appendChild(dropd)

        const og_value = this.element.querySelector('#month-select');
        // Set values to current date
        const month_select = this.element.querySelector('#month-select')
        const day_select = this.element.querySelector('#day-select')

        month_select.children[0].innerText = month_names[curr_month];
        day_select.children[0].innerText = this.day.getDate();

        // Add possible months to dropdown
        for (let i = 0; i < months_to_display.length; i++){
            if (months_to_display[i] !== month_names[curr_month]) {
            let child = document.createElement('option');
            child.innerText = months_to_display[i]
            month_select.appendChild(child)
            }
        }

        // Add possible days to dropdown - Changes depending on month

        // Setup for current month
        for (let i = 1; i <= month_days[curr_month]; i++){
            let child = document.createElement('option');
            child.innerText = i
            day_select.appendChild(child)
        }


        month_select.addEventListener('change', ()=> {
            let selectedMonth = month_select.selectedOptions[0].innerText
            let num_days_in_month = month_days[month_names.indexOf(selectedMonth)]

            day_select.innerHTML= og_value;
            for (let i = 0; i <= num_days_in_month; i++){
                let child = document.createElement('option');
                child.innerText = i
                day_select.appendChild(child)
            }
            day_select.children[0].innerText = this.day.getDate();

        })

        // Check if month/day were changed, and change today's date accordingly
        month_select.addEventListener('change', ()=> {
            let selectedMonth = month_select.selectedOptions[0].innerText
            this.day.setMonth(month_names.indexOf(selectedMonth))
        })

        day_select.addEventListener('change', ()=>{
            let selectedDay = day_select.selectedOptions[0].innerText
            this.day.setDate(parseInt(selectedDay))
        })

    }


    // Keeps track of completed list items for each date
    this.completed = {}
    
    // Add button adds an element to the list
    this.element.querySelector('#add-btn').addEventListener('click', (e)=> { e.preventDefault()
        this.addToList(this.element, this.completed, this.day)})

    // Enter key adds element to the list (if it's in focus) 
    document.activeElement.addEventListener("keyup", (e)=> {
        if (this.element.contains(document.activeElement)) {
            if (e.keyCode === 13){
                e.preventDefault();
                this.addToList(this.element, this.completed, this.day)
            }
        }
    })

}

TodoTracker.prototype = {

    appendTo: function(query) {
        const parent = document.querySelector(query)
        if (parent) {
            parent.appendChild(this.element)
        }
    },

    addBefore: function(query) {
        const sibling = document.querySelector(query)
        if (sibling) {
            sibling.before(this.element)
        }
    },


    addAfter: function(query) {
        const sibling = document.querySelector(query)
        if (sibling) {
            sibling.after(this.element)
        }
    },

    addToList: function(element, completed, today) {
        const todolist = element.querySelector(".ListItems");
        const toAdd = element.querySelector("#todoInput").value
        if (!(toAdd.length === 0) && toAdd.trim()) {
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

        // Keep track of completed items; if user checks the task, it's marked as completed
        child.querySelector('#check').addEventListener('change', (e)=> {
            if (e.target.checked){
                this.addToCompleted(e, element, completed, today)
            } else {
                this.removeFromCompleted(e, element, completed, today)
            }
        });
    }
        
    },

    deleteFromList: function(e, element) {
        e.preventDefault();
        const todolist = element.querySelector(".ListItems");
        const toRemove = e.target.parentElement.parentElement;
        todolist.removeChild(toRemove)
    },

    addToCompleted: function(e, element, completed, today) {
        e.preventDefault();
        let dateCompleted = today.getMonth()+1 + "/" + today.getDate()
        const completedItem = e.target.parentElement.children[1].innerText  
        if (dateCompleted in completed) {
            completed[dateCompleted].push(completedItem)
        } else {
            completed[dateCompleted]= [completedItem]
        }
        let curr_square = element.querySelector(`#md${today.getMonth()+1}\\/${today.getDate()}`);
        let curr_lvl = curr_square.getAttribute("data-level");
        if (curr_lvl < 3) {
            curr_square.setAttribute("data-level", parseInt(curr_lvl)+ 1)
        }

        // Add info to hover popup
        if (completed[dateCompleted].length == 1) {
            let num_tasks = document.createElement('p')
        num_tasks.innerText = `1 task`
        curr_square.children[0].appendChild(num_tasks)
        } else {
            curr_square.children[0].children[1].innerText = `${completed[dateCompleted].length} tasks`
        }
        

    
    },

    removeFromCompleted: function(e, element, completed, today) {
        e.preventDefault();
        const completedItem = e.target.parentElement.children[1].innerText
        let dateCompleted = 0;
        for (let i=0; i< Object.keys(completed).length; i++)
        {
            for (let k=0; k< completed[Object.keys(completed)[i]].length; k++){
                if (completed[Object.keys(completed)[i]][k] == completedItem){
                    completed[Object.keys(completed)[i]].splice(k, 1)
                    dateCompleted = Object.keys(completed)[i]
                    break;
                }
            }
        
        }
            
        let curr_square = element.querySelector(`#md${today.getMonth()+1}\\/${today.getDate()}`);
        let curr_lvl = curr_square.getAttribute("data-level");
        if (curr_lvl > 0) {
            curr_square.setAttribute("data-level", parseInt(curr_lvl)-1)
        }
        
        // Update popup info
        let num_tasks = curr_square.children[0].children[1]
        if (completed[dateCompleted].length == 0) {
            curr_square.children[0].removeChild(num_tasks)
        } else {
            if (completed[dateCompleted].length == 1 ) {
                num_tasks.innerText = `1 task`
            } else {
                num_tasks.innerText = `${completed[dateCompleted].length} tasks`
            }
           
        }

    },

    // TODO: 
    // - Show date and completed tasks on square click
    // - Add more lvls and colors so its a wider range
    // - Add option to change color (in the code / in the UI maybe?)
}