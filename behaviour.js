/*------this function will hide the text and-------------------------
-------- remove the blur effect--------------------------------------*/

buttonSetup();


let startButton = document.getElementById("startButton");
let textToType = document.getElementById("textToType");

startButton.addEventListener("click", function() {
  if (!modeSelected){
  alert ("Please Select Mode First And Difficulty");
  return;
} 
  textToType.style.display = "none";
  document.getElementById("display-text").style.filter = "none";
});



/*------------This function will handle the fetching and-------------
displaying of text based on difficulty-----------------------*/

function differentButtons() {
// 1. Declare your HTML element references ONCE at the top
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const displayText = document.getElementById('display-text');


// 2. Create ONE reusable function to handle the fetching and displaying
function loadTextByDifficulty(difficulty, clickedButton) {
  // Reset all button backgrounds to default first (optional, but good practice)
  easyButton.style.backgroundColor = "";
  mediumButton.style.backgroundColor = "";
  hardButton.style.backgroundColor = "";

  // Highlight the clicked button green
  clickedButton.style.backgroundColor = "green";

  // Fetch the data
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Use brackets [difficulty] to dynamically grab "easy", "medium", or "hard"
      const paragraphs = data[difficulty];
      
      // Grab a random paragraph
      const randomIndex = Math.floor(Math.random() * paragraphs.length);
      const randomText = paragraphs[randomIndex].text;

      // RESET EVERYTHING
      typed = "";
      startTime = null;
      wpm = 0
      
      // Display the text
      displayText.textContent = randomText;
    })

    .catch(error => {
      console.error('Error fetching the JSON data:', error);
      displayText.textContent = "Error loading text";
    });
  
}

// 3. Add simple event listeners that pass the difficulty to the function
easyButton.addEventListener('click', () => loadTextByDifficulty('easy', easyButton));
mediumButton.addEventListener('click', () => loadTextByDifficulty('medium', mediumButton));
hardButton.addEventListener('click', () => loadTextByDifficulty('hard', hardButton));

}






// 1. Move these variables OUTSIDE so they can be accessed globally
let countdown = null; 
let timeLeft = 60;
const timerElement = document.getElementById("Timer");

function countTime() {
  // If a timer is already running, don't start another one!
  if (countdown !== null) return; 

  timeLeft = 60; // Reset time to 60 whenever it starts
  timerElement.textContent = timeLeft;

  countdown = setInterval(function() {
    timerElement.textContent = timeLeft;
    console.log(timeLeft);
    timeLeft--;
    
    if (timeLeft < 0) {
      clearInterval(countdown);
      countdown = null; // Clear the reference
      timerElement.textContent = "Time's up!";
      console.log("Finished!");
    }
  }, 1000);
}



// Function to stop and reset the timer completely
function stopAndResetTime() {
  if (countdown !== null) {
    clearInterval(countdown); // This actually stops the ticking
    countdown = null;         // Resets our tracker
  }
  timeLeft = 60;              // Reset the backend variable
  timerElement.textContent = "60"; // Reset the UI display
  console.log("Timer stopped and reset.");
}

// --- BUTTONS SETUP ---
let modeSelected = false;

function buttonSetup() {
const timedButton = document.getElementById("timedButton");
const passageButton = document.getElementById("PassageButton");

passageButton.style.backgroundColor = "black";
timedButton.style.backgroundColor = "black";

// When Timed is clicked
timedButton.addEventListener("click", function () {
   modeSelected = true; // ✅ user selected a mode

  timedButton.style.backgroundColor = "blue";
  passageButton.style.backgroundColor = "black";
  
  
  // Just run it! The function itself now guards against duplicate timers.
  countTime(); 
  differentButtons();
  
});

// When Passage is clicked
passageButton.addEventListener("click", function () {
   modeSelected = true; // ✅ user selected a mode

  passageButton.style.backgroundColor = "blue";
  timedButton.style.backgroundColor = "black";
  
  // Call our new reset function
  stopAndResetTime();
  differentButtons();
 
});
}




//new function

 let typed = "";
 let startTime = null;
 let wpm = 0;

 

document.addEventListener("keydown", (e) => {
  if (!startTime) {
    startTime = Date.now(); // start timer on first keypress
  }

  if (e.key === "Backspace") {
    typed = typed.slice(0, -1);
  }
  else if (e.key.length === 1) {
    typed += e.key;
  }

  render();
});

function calculateWPM(text) {
  const words = text.length / 5;
  
  return Math.round(words) || 0;
}

function calculateAccuracy(sentence, typed) {
  let correct = 0;

  for (let i = 0; i < sentence.length; i++) {
    if (sentence[i] === typed[i]) {
      correct++;
    }
  }

  return Math.round((correct / sentence.length) * 100) || 0;
}


function render() {
  const container = document.getElementById("display-text");

// let currentSentence = "";

  const sentence = container.textContent;

  container.innerHTML = "";

  for (let i = 0; i < sentence.length; i++) {
    const span = document.createElement("span");

    const typedChar = typed[i];
    const actualChar = sentence[i];

    if (typedChar == null) {
      span.className = "pending";
    } else if (typedChar === actualChar) {
      span.className = "correct";
    } else {
      span.className = "incorrect";
    }

    span.textContent = actualChar;
    container.appendChild(span);
  }

  // ⏱ calculate time
  const currentTime = (Date.now() - startTime) / 1000;

  // ⚡ update WPM
  wpm = calculateWPM(typed, currentTime);

  // show it
  document.getElementById("WPM").textContent = wpm;

  const accuracy = calculateAccuracy(sentence, typed);
document.getElementById("accuracy").textContent = accuracy + "%";

// Check if typing is complete
  if (typed === sentence) {

    // Move to result page
    window.location.href = "result-first-test.html";
  }
}



