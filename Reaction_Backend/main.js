const mainMenu = document.querySelector(".main-menu");
const clickableArea = document.querySelector(".clickable-area");
const message = document.querySelector(".clickable-area .message");
const endScreen = document.querySelector(".end-screen");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const score3 = document.getElementById("score3");
const average = document.getElementById("average");
const loginform  = document.getElementById("loginform");
const number = document.getElementById("otp");
const sec = document.querySelector(".sec");

const audio2 = new Audio('audio2.mp3');
const audio3 = new Audio('audio3.mp3');
let otp

loginform.addEventListener("submit", async function(event){
  event.preventDefault();
  const temp = number.value;
  otp = temp.toString();
  console.log(otp);

  try {
      const response = await fetch('http://localhost:3000/api/scores', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              ReactionTimeScore1: 0,
              ReactionTimeScore2: 0,
              ReactionTimeScore3: 0,
              otpcode: otp
          })
      });

      if (response.status === 404) {
          alert("Wrong code Entered, Please try again.");
          location.reload();
          return;
      }

      sec.style.display = "none";
      clickableArea.style.display = "grid";
      mainMenu.classList.add("active");
      alert("You are logged in successfully.");
  } catch (err) {
      console.error('Error logging in:', err.message);
      alert("An error occurred. Please try again.");
  }
});


async function getPhoneNumberFromUser() {
  return otp;
}


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
const endGame = async () => {
  audio2.pause();
  audio3.pause();
  endScreen.classList.add("active");
  clearTimeout(timer);

  let total = 0;

  scores.forEach((s) => {
    total += s;
  });

  let averageScore = Math.round(total / scores.length);
  score1.innerHTML = `Score 1: ${scores[0]} ms`;
  score2.innerHTML = `Score 2: ${scores[1]} ms`;
  score3.innerHTML = `Score 3: ${scores[2]} ms`;
  average.innerHTML = `Average: ${((scores[0]+scores[1]+scores[2])/3).toFixed(0)} ms`;

  try {
    const otp = await getPhoneNumberFromUser();
    const response = await fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ReactionTimeScore1: scores[0],
            ReactionTimeScore2: scores[1],
            ReactionTimeScore3: scores[2],
            otpcode: otp
        })
    });
        console.log('Score saved successfully');
} catch (err) {
    console.error('Error saving score:', err.message);
}
};

const displayReactionTime = (rt) => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = `<div class='reaction-time-text'>${rt} ms</div>Click to continue.`;
  greenDisplayed = false;
  waitingForStart = true;
  scores.push(rt);
  audio2.pause();
  audio3.pause();

  if (scores.length >=3) {
    endGame()
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