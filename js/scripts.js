



//region Widget Score
function scoreSet(score){
    let element = document.getElementById('score');
    element.innerHTML = score;
}
function scoreColorSet(color){
    let element = document.getElementById('score');
    element.style.color = color;
}
function rewardSet(reward){
    let element = document.getElementById('reward');
    element.src = 'images/rewards/' + reward + '.png';
}
function progressSet(progress){
    let element = document.getElementById('progress');
    element.value = progress;
}
//endregion




