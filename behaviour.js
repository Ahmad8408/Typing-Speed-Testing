/*--------------------------------this function will hide the text and-------------------------
-----------------------------------remove the blur effect--------------------------------------*/

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



// /*------------------------------------This function will handle the fetching and---------------------
// --------------------------------------displaying of text based on difficulty-----------------------*/
function differentButtons() {

    const easyButton = document.getElementById("easy");
    const mediumButton = document.getElementById("medium");
    const hardButton = document.getElementById("hard");
    const difficultyDropdown = document.getElementById("difficultyDropdown");
    const displayText = document.getElementById("display-text");

    function loadTextByDifficulty(difficulty, clickedButton) {

        // Reset button colors
        easyButton.style.backgroundColor = "black";
        mediumButton.style.backgroundColor = "black";
        hardButton.style.backgroundColor = "black";

        // Highlight selected button
        clickedButton.style.backgroundColor = "green";

        // Keep dropdown synchronized
        if (difficulty === "easy") {
            difficultyDropdown.value = "Easy";
        } else if (difficulty === "medium") {
            difficultyDropdown.value = "Medium";
        } else {
            difficultyDropdown.value = "Hard";
        }

        fetch("data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                const paragraphs = data[difficulty];
                const randomIndex = Math.floor(Math.random() * paragraphs.length);
                const randomText = paragraphs[randomIndex].text;

                // Reset everything
                typed = "";
                startTime = null;
                wpm = 0;

                displayText.textContent = randomText;
            })
            .catch(error => {
                console.error("Error fetching JSON:", error);
                displayText.textContent = "Error loading text";
            });
    }

    // Desktop buttons
    easyButton.addEventListener("click", () => {
        loadTextByDifficulty("easy", easyButton);
    });

    mediumButton.addEventListener("click", () => {
        loadTextByDifficulty("medium", mediumButton);
    });

    hardButton.addEventListener("click", () => {
        loadTextByDifficulty("hard", hardButton);
    });

    // Mobile dropdown
    difficultyDropdown.addEventListener("change", function () {

        if (this.value === "Easy") {
            loadTextByDifficulty("easy", easyButton);

        } else if (this.value === "Medium") {
            loadTextByDifficulty("medium", mediumButton);

        } else if (this.value === "Hard") {
            loadTextByDifficulty("hard", hardButton);
        }
    });

}


/*----------------------------------this function handle the counter 60 min-------------------------
-------- ---------------------------when timed button is clicked--------------------------------------*/
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


/*--------------------------------------this function stop the time and-------------------------
----------------------------------------reset it to 0 when user clicked passage button---------*/
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


/*-------------------------------------Mode buttons when clicked turn blue-------------------------
---------------------------------------and also call other function --------------------------------------*/
let modeSelected = false;

function buttonSetup() {
    const timedButton = document.getElementById("timedButton");
    const passageButton = document.getElementById("PassageButton");
    const modeDropdown = document.getElementById("modeDropdown");

    // Initial appearance
    timedButton.style.backgroundColor = "black";
    passageButton.style.backgroundColor = "black";
    modeDropdown.style.backgroundColor = "black";

    function selectTimedMode() {
        modeSelected = true;

        timedButton.style.backgroundColor = "blue";
        passageButton.style.backgroundColor = "black";
        modeDropdown.style.backgroundColor = "blue";
        modeDropdown.value = "Timed (60s)";

        countTime();
        differentButtons();
    }

    function selectPassageMode() {
        modeSelected = true;

        passageButton.style.backgroundColor = "blue";
        timedButton.style.backgroundColor = "black";
        modeDropdown.style.backgroundColor = "blue";
        modeDropdown.value = "Passage";

        stopAndResetTime();
        differentButtons();
    }

    timedButton.addEventListener("click", selectTimedMode);
    passageButton.addEventListener("click", selectPassageMode);

    modeDropdown.addEventListener("change", function () {
        if (this.value === "Timed (60s)") {
            selectTimedMode();
        } else {
            selectPassageMode();
        }
    });
}



/*------This function assign blue color when right letter is press and red for -------------------------
-------- wrong one and also when backspace is press it go back by one letter --------------------------*/

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

  //-----------------------------------here calculate time-----------------------------------------
  const currentTime = (Date.now() - startTime) / 1000;

  //--------------------------------------here update WPM-------------------------------------------
  wpm = calculateWPM(typed, currentTime);

  //-------------------------------------here show wpm----------------------------------------------
  document.getElementById("WPM").textContent = wpm;

  const accuracy = calculateAccuracy(sentence, typed);
document.getElementById("accuracy").textContent = accuracy + "%";

//---------------------------------here check if typing is complete------------------------------------
  if (typed === sentence) {

    //-----------------------------Move to result page--------------------------------------------------
    window.location.href = "desktop-results-first-test.html";
  }
}



