/////////////////////////////////////////////

const DB_SCORE = "todayScore"


let todayScore = 0;

/////////////////////////////////////////////

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

function addNewRow(score) {
    localStorage.setItem(DB_SCORE, parseInt(todayScore) + parseInt(score))
    refreshJsData()
    refreshUI()
}

function refreshJsData() {
    todayScore = localStorage.getItem(DB_SCORE)
}

function refreshUI() {
    let scoreUI = document.getElementById("score");
    let userInput = document.getElementById("userInput");

    userInput.value = "";
    //userInput.style.display = "none";
    scoreUI.innerHTML = todayScore
}

function abcde() {
    refreshJsData()
    refreshUI()
}

window.onload = function () {
    abcde()
}

