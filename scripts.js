const counterEl = document.getElementById("counter");
const imageEl = document.getElementById("image");
const progressEl = document.getElementById("progress");

let counterValue = 0;
let progressMax = 100;
let progressValue = 0;

function setCounter(value) {
  counterValue = value;
  counterEl.textContent = value;
}

function getCounter() {
  return counterValue;
}

function setImage(url) {
  imageEl.src = url;
}

function setProgressMax(max) {
  progressMax = max;
}

function setProgressValue(value) {
  progressValue = Math.min(value, progressMax);
  let percent = (progressValue / progressMax) * 100;
  progressEl.style.width = percent + "%";
}

// анимированное изменение значения счётчика
function animateCounter(toValue, duration = 1000) {
  let fromValue = counterValue;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    let progress = Math.min((timestamp - start) / duration, 1);
    let current = Math.floor(fromValue + (toValue - fromValue) * progress);
    setCounter(current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function animateProgress(toValue, duration = 1000) {
  let fromValue = progressValue;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    let progress = Math.min((timestamp - start) / duration, 1);
    let current = fromValue + (toValue - fromValue) * progress;
    setProgressValue(current);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function animateImage(url, duration = 1000) {
  imageEl.style.transition = `opacity ${duration / 2}ms`;
  imageEl.style.opacity = 0;

  setTimeout(() => {
    imageEl.src = url;
    imageEl.onload = () => {
      imageEl.style.opacity = 1;
    };
  }, duration / 2);
}
// Пример использования

