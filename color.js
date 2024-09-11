let timer = document.getElementsByClassName("timer")[0];
let quizContainer = document.getElementById("container");
let nextButton = document.getElementById("next-button");
let numOfQuestions = document.getElementsByClassName("number-of-questions")[0];
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 10;
let countdown;

// For hex codes
let letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

// Questions and Options Array
let quizArray = [];

// Function to generate a random hex color
const generateRandomColor = () => {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Populate quiz with questions and options
function populateQuiz() {
    quizArray = [];
    for (let i = 0; i < 5; i++) {  // Generate 5 questions
        let correctColor = generateRandomColor();
        let options = [correctColor];

        // Generate 3 more random colors for options
        while (options.length < 4) {
            let newColor = generateRandomColor();
            if (!options.includes(newColor)) {
                options.push(newColor);
            }
        }

        // Shuffle the options array
        options.sort(() => Math.random() - 0.5);

        // Push the question and options to quizArray
        quizArray.push({
            correct: correctColor,
            options: options
        });
    }
}

// Display the quiz
const quizDisplay = (questionCount) => {
    let currentQuestion = quizArray[questionCount];

    // Clear previous content
    quizContainer.innerHTML = '';

    // Display the color code (hex value)
    let questionDiv = document.createElement("p");
    questionDiv.classList.add("question-color");
    questionDiv.textContent = currentQuestion.correct;
    quizContainer.appendChild(questionDiv);

    // Display options
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    currentQuestion.options.forEach((option) => {
        let optionButton = document.createElement("button");
        optionButton.classList.add("option-div");
        optionButton.style.backgroundColor = option;
        optionButton.setAttribute("data-option", option);
        buttonContainer.appendChild(optionButton);
    });

    quizContainer.appendChild(buttonContainer);
};

// Check the user's answer
function checker(userOption) {
    let userSolution = userOption.getAttribute("data-option");
    let question = quizArray[questionCount];
    let options = document.querySelectorAll(".option-div");

    // If user's answer is correct
    if (userSolution === question.correct) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        options.forEach((element) => {
            if (element.getAttribute("data-option") === question.correct) {
                element.classList.add("correct");
            }
        });
    }

    // Disable all options
    options.forEach((element) => {
        element.disabled = true;
    });

    nextButton.classList.remove("hide");
}

// Timer
const timerDisplay = () => {
    countdown = setInterval(() => {
        timer.innerHTML = `<span>Time Left: </span> ${count}s`;
        count--;
        if (count === 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};

// Handle moving to the next question
const displayNext = () => {
  questionCount++;
  if (questionCount < quizArray.length) {
      quizDisplay(questionCount);
      count = 10; // Reset timer for the next question
      clearInterval(countdown); // Clear the previous countdown
      timerDisplay(); // Start the timer again
  } else {
      // End of the quiz
      displayContainer.classList.add("hide");
      scoreContainer.classList.remove("hide");
      userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
  }
  nextButton.classList.add("hide"); // Hide the "Next" button again after moving to the next question
};

// Initialize the game
function initial() {
  nextButton.classList.add("hide"); // Hide the "Next" button at the start
  quizContainer.innerHTML = ''; // Clear the quiz container
  questionCount = 0; // Reset question count
  scoreCount = 0; // Reset score
  clearInterval(countdown); // Clear any existing countdown
  count = 10; // Reset timer
  timerDisplay(); // Start the timer
  quizDisplay(questionCount); // Display the first question
}

// Event Listener for the "Next" Button
nextButton.addEventListener("click", () => {
  displayNext(); // Call displayNext when the "Next" button is clicked
});

// Restart game
restart.addEventListener("click", () => {
    quizArray = [];
    populateQuiz();
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});

// When user clicks on start button
startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    displayContainer.classList.remove("hide");
    quizArray = [];
    populateQuiz();
    initial();
});

// Event delegation for dynamic buttons
document.addEventListener("click", (e) => {
    if (e.target.matches(".option-div")) {
        checker(e.target);
    }
});

// Populate the quiz when the script loads
populateQuiz();
