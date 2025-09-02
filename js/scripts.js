//region Widget Score
function scoreSet(score) {
    let element = document.getElementById('score');
    element.innerHTML = score;
}

function scoreColorSet(color) {
    let element = document.getElementById('score');
    element.style.color = color;
}

function rewardSet(reward) {
    let element = document.getElementById('reward');
    element.src = 'images/rewards/' + reward + '.png';
}

function progressSet(progress) {
    let element = document.getElementById('progress');
    element.value = progress;
}

//endregion


let userInput = ""
let selectedCategoryID = 0

function userInputRefresh() {
    userInput = userInput.trim();
    document.getElementById("userInput").innerHTML = userInput;
}

function userInputSet(value) {
    userInput = value;
    userInputRefresh();
}

function userInputAdds(value) {
    if (userInput === 0) userInputSet("")
    userInput = `${userInput}${value}`;
    userInputRefresh();
}

function userInputClear() {
    userInput = userInput.slice(0, -1);
    userInputRefresh();
}

function userInputNegative() {
    if (userInput[0] === "-") {
        userInput = userInput.slice(1);
    } else {
        userInput = `-${userInput}`
    }
    userInputRefresh();
}

function keyboardToggle() {
    let elem = document.getElementById('keyboard');
    if (elem.style.display === 'block') {
        elem.style.display = 'none';
    } else {
        userInputSet("");
        elem.style.display = 'block';
    }
}

function userInputSave() {

}


function categoryClick(elem){
    let id = elem.dataset.id.trim()

    if (id === "0") {
        let p = prompt("Category name");
    }else{
        selectedCategoryID = id;
        keyboardToggle()
    }



}


