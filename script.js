/////////////////////////////////////////////


//region Constants
const DB_SCORE = "score"
const DB_CATEGORIES = "categories"
const DB_HISTORY = "today_history"
//endregion

//region JS variables
let jsScore = 0;
let jsSelectedCategory = 0;
//endregion

//region Category
function createCategory() {
    let name = prompt("Name of category")
    if (name === "") {
        alert("Null error")
        createCategory()
        return
    }
    let cats = JSON.parse(localStorage.getItem(DB_CATEGORIES))
    cats.push(name)
    alert(cats)
    localStorage.setItem(DB_CATEGORIES, JSON.stringify(cats))
    refreshUI()

}

function clickCategory(chips) {
    // in value of <button> I put id of category
    let id = parseInt(chips.value)

    // category 0 use for creating a new one
    if(id === 0){
        createCategory()
    }

    // other id means select category
    else {
        selectCategory(chips)
    }
}

function selectCategory(element) {
    jsSelectedCategory = element.value
    keyboardShow()
}

//endregion

//region Keyboard


function keyboardInput(button) {
    let buttonValue = button.innerHTML.trim();
    let userInput = document.getElementById("userInput");

    if (button.id === "keyBackspace") {
        userInput.value = userInput.value.slice(0, -1);
    } else if (button.id === "keyDone") {
        if (!isNaN(userInput.value)) {
            addNewRow(Number(userInput.value))
        } else {
            alert("err: isNaN")
        }
    } else if (button.id === "keyMinus") {
        if (userInput.value[0] === "-") {
            userInput.value = userInput.value.slice(1);
        } else {
            userInput.value = "-" + userInput.value;
        }
    } else {
        userInput.value += buttonValue;
    }
}

function keyboardHide() {
    let keyboard = document.getElementById("keyboard");
    keyboard.style.display = "none";
}

function keyboardShow() {
    let keyboard = document.getElementById("keyboard");
    keyboard.style.display = "grid";
}

//endregion


function addNewRow(score) {
    let lastScore = parseInt(localStorage.getItem(DB_SCORE, 10));
    let addScore = parseInt(score)
    let newScore = lastScore + addScore;
    localStorage.setItem(DB_SCORE, newScore)

    let lastHistory = JSON.parse(localStorage.getItem(DB_HISTORY))
    let row = JSON.stringify([parseInt(jsSelectedCategory), addScore])
    lastHistory.push(row)
    localStorage.setItem(DB_HISTORY, JSON.stringify(lastHistory))
    refreshUI()
}

function debugHistory(){
    alert(
        localStorage.getItem(DB_HISTORY)
    )
}


function renderCategoriesChips(index, name) {
    return `<button onclick="clickCategory(this)" value=${index} id=category>${name}</button>`
}


function refreshUI() {
    jsScore = localStorage.getItem(DB_SCORE)
    let categories = JSON.parse(localStorage.getItem(DB_CATEGORIES))

    let scoreUI = document.getElementById("score");
    let userInput = document.getElementById("userInput");

    userInput.value = "";
    //userInput.style.display = "none";
    scoreUI.innerHTML = jsScore

    let divCats = document.getElementById("categories");
    divCats.innerHTML = "";

    if (categories !== String) {
        categories.forEach((name, index) => {
            if (name !== "") divCats.innerHTML += renderCategoriesChips(index, name)
        })
    }
    else {
        divCats.innerHTML = renderCategoriesChips(categories[0][0], categories[0][1]);
    }




    keyboardHide()


    let htmlHistory = document.getElementById("history");
    htmlHistory.innerHTML = ""
    let history = JSON.parse(localStorage.getItem(DB_HISTORY))
    history.forEach(item => {
        let row = JSON.parse(item)
        htmlHistory.innerHTML += `<div>${categories[row[0]]} - ${row[1]}</div>`
    })


}


function resetScore() {
    localStorage.clear()
    refreshUI()
}


window.onload = function () {
    let score = localStorage.getItem(DB_SCORE)
    let categories = localStorage.getItem(DB_CATEGORIES)
    let history = localStorage.getItem(DB_HISTORY)

    if (score === null) localStorage.setItem(DB_SCORE, 0)
    if (categories === null) localStorage.setItem(DB_CATEGORIES, JSON.stringify(['+']))
    if (history === null) localStorage.setItem(DB_HISTORY, JSON.stringify([]))


    refreshUI()
}

