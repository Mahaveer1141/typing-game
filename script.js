let index = 0,
  startTime = 0;

let score = Number(localStorage.getItem("score")) || 0;
let totalTime = Number(localStorage.getItem("totalTime")) || 0;
let averageTime = Number(localStorage.getItem("averageTime")) || 0;

const mainDiv = document.getElementById("main");
const startButton = document.getElementById("start");
const form = document.getElementById("form");
const quoteInput = document.getElementById("input");
const quoteDisplay = document.getElementById("quote");
const nextButton = document.getElementById("next");
const statusMessage = document.getElementById("status-message");
const scoreDisplay = document.getElementById("score");
const totalTimeDisplay = document.getElementById("totalTime");
const averageTimeDisplay = document.getElementById("averageTime");

scoreDisplay.innerHTML = `Score: ${score}`;
totalTimeDisplay.innerHTML = `Total Time: ${formatTime(totalTime)}`;
averageTimeDisplay.innerHTML = `Average Time: ${formatTime(averageTime)}`;

async function fetchAPI() {
  const data = await (await fetch("https://type.fit/api/quotes")).json();
  const quotes = getRandomQuotes(data, 5);

  startButton.addEventListener("click", () => {
    score = 0;
    totalTime = 0;
    averageTime = 0;
    index = 0;
    startTime = 0;
    scoreDisplay.innerHTML = "";
    totalTimeDisplay.innerHTML = "";
    averageTimeDisplay.innerHTML = "";
    mainDiv.className = "show";
    startButton.className = "hidden";
    quoteDisplay.innerHTML = quotes[index].text;
    handleStart();
  });

  nextButton.addEventListener("click", () => {
    index++;
    if (index === quotes.length) {
      handleStop(quotes.length);
      return;
    }
    quoteDisplay.innerHTML = quotes[index].text;
    handleStart();
  });

  form.addEventListener("submit", (e) => {
    totalTime += Date.now() - startTime;
    nextButton.classList = "show";
    const userTypedQuote = quoteInput.value;
    quoteInput.blur();
    if (userTypedQuote === quotes[index].text) {
      score++;
      statusMessage.innerHTML = "Correct";
    } else {
      statusMessage.innerHTML = "Incorrect";
      quoteInput.className = "error";
    }
    e.preventDefault();
  });
}

fetchAPI();

function getRandomQuotes(quotes, size) {
  const arr = [];
  const used = [];
  while (arr.length != size) {
    const index = Math.floor(Math.random() * quotes.length);
    if (used.includes(index)) continue;
    arr.push(quotes[index]);
    used.push(index);
  }
  return arr;
}

function createPElement(text) {
  const element = document.createElement("p");
  element.innerHTML = text;
  return element;
}

function handleStart() {
  nextButton.className = "hidden";
  quoteInput.value = "";
  quoteInput.className = "";
  quoteInput.focus();
  statusMessage.innerHTML = "";
  startTime = Date.now();
}

function handleStop(size) {
  mainDiv.className = "hidden";
  startButton.className = "show";
  nextButton.className = "hidden";
  scoreDisplay.innerHTML = `Score: ${score}`;
  totalTimeDisplay.innerHTML = `Total Time: ${formatTime(totalTime)}`;
  averageTimeDisplay.innerHTML = `Average Time: ${formatTime(
    totalTime / size
  )}`;
  localStorage.setItem("score", score);
  localStorage.setItem("totalTime", totalTime);
  localStorage.setItem("averageTime", totalTime / size);
}

function formatTime(time) {
  let finalOutput = "";
  let milliseconds = Math.floor(time % 1000);
  let seconds = Math.floor((time / 1000) % 60);
  let minutes = Math.floor((time / 1000 / 60) % 60);
  if (minutes) {
    finalOutput += minutes + "m: ";
  }
  finalOutput += `${seconds}.${milliseconds} s`;
  return finalOutput;
}
