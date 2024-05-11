const mainMenu = document.querySelector(".main-menu");
const clickableArea = document.querySelector(".clickable-area");
const message = document.querySelector(".clickable-area .message");
const endScreen = document.querySelector(".end-screen");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const score3 = document.getElementById("score3");
const average = document.getElementById("average");
const audio2 = new Audio('audio2.mp3');
const audio3 = new Audio('audio3.mp3');

const reactionTimeText = document.querySelector(
  ".end-screen .reaction-time-text"
);
const playAgainBtn = document.querySelector(".end-screen .play-again-btn");

let timer;
let greenDisplayed;
let timeNow;
let waitingForStart;
let waitingForGreen;
let scores;

const init = () => {
  greenDisplayed = false;
  waitingForStart = false;
  waitingForGreen = false;
  scores = [];
};

init();

const setGreenColor = () => {
  clickableArea.style.backgroundColor = "#32cd32";
  message.innerHTML = "Click Now!";
  message.style.color = "#111";
  greenDisplayed = true;
  timeNow = Date.now();
};

const startGame = () => {
  // audio.play();
  if(scores.length == 1) audio2.play();
  if(scores.length == 2) audio3.play();
  clickableArea.style.backgroundColor = "#c1121f";
  message.innerHTML = "Wait for the Green Color.";
  message.style.color = "#fff";

  let randomNumber = Math.floor(Math.random() * 4000 + 3000);
  timer = setTimeout(setGreenColor, randomNumber); // random number change karna hai

  waitingForStart = false;
  waitingForGreen = true;
};

mainMenu.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  startGame();
});

const endGame = () => {
  audio2.pause();
  audio3.pause();
  endScreen.classList.add("active");
  clearTimeout(timer);

  let total = 0;

  scores.forEach((s) => {
    total += s;
  });

  let averageScore = Math.round(total / scores.length);
  //   const sendFinalScore = (averageScore) => {
  //     sendScoreToServer(averageScore);
  // };
  // reactionTimeText.innerHTML = `${averageScore} ms`;
  score1.innerHTML = `Score 1: ${scores[0]} ms`;
  score2.innerHTML = `Score 2: ${scores[1]} ms`;
  score3.innerHTML = `Score 3: ${scores[2]} ms`;
  average.innerHTML = `Average: ${((scores[0]+scores[1]+scores[2])/3).toFixed(0)} ms`;
  fetch('http://127.0.0.1:5503/index.html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ averageScore })
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
};

const displayReactionTime = (rt) => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = `<div class='reaction-time-text'>${rt} ms</div>Click to continue.`;
  greenDisplayed = false;
  waitingForStart = true;
  scores.push(rt);
  audio2.pause();
  audio3.pause();

  if (scores.length >= 3) {
    endGame();
  }
};

const displayTooSoon = () => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = "Too Soon. Click to continue";
  message.style.color = "#111";
  waitingForStart = true;
  audio2.pause();
  audio3.pause();
  clearTimeout(timer);
};

clickableArea.addEventListener("click", () => {
  if (greenDisplayed) {
    let clickTime = Date.now();
    let reactionTime = clickTime - timeNow;
    displayReactionTime(reactionTime);
    return;
  }

  if (waitingForStart) {
    startGame();
    return;
  }

  if (waitingForGreen) {
    displayTooSoon();
  }
});
