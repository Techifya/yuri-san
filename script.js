const questions = [
    { hiragana: "あ", answer: "a" },
    { hiragana: "い", answer: "i" },
    { hiragana: "う", answer: "u" },
    { hiragana: "え", answer: "e" },
    { hiragana: "お", answer: "o" },
    { hiragana: "か", answer: "ka" },
    { hiragana: "き", answer: "ki" },
    { hiragana: "く", answer: "ku" },
    { hiragana: "け", answer: "ke" },
    { hiragana: "こ", answer: "ko" },
    { hiragana: "さ", answer: "sa" },
    { hiragana: "し", answer: "shi" },
    { hiragana: "す", answer: "su" },
    { hiragana: "せ", answer: "se" },
    { hiragana: "そ", answer: "so" },
    { hiragana: "た", answer: "ta" },
    { hiragana: "ち", answer: "chi" },
    { hiragana: "つ", answer: "tsu" },
    { hiragana: "て", answer: "te" },
    { hiragana: "と", answer: "to" },
    { hiragana: "な", answer: "na" },
    { hiragana: "に", answer: "ni" },
    { hiragana: "ぬ", answer: "nu" },
    { hiragana: "ね", answer: "ne" },
    { hiragana: "の", answer: "no" },
    { hiragana: "は", answer: "ha" },
    { hiragana: "ひ", answer: "hi" },
    { hiragana: "ふ", answer: "fu" },
    { hiragana: "へ", answer: "he" },
    { hiragana: "ほ", answer: "ho" },
    { hiragana: "ま", answer: "ma" },
    { hiragana: "み", answer: "mi" },
    { hiragana: "む", answer: "mu" },
    { hiragana: "め", answer: "me" },
    { hiragana: "も", answer: "mo" },
    { hiragana: "や", answer: "ya" },
    { hiragana: "ゆ", answer: "yu" },
    { hiragana: "よ", answer: "yo" },
    { hiragana: "ら", answer: "ra" },
    { hiragana: "り", answer: "ri" },
    { hiragana: "る", answer: "ru" },
    { hiragana: "れ", answer: "re" },
    { hiragana: "ろ", answer: "ro" },
    { hiragana: "わ", answer: "wa" },
    { hiragana: "を", answer: "wo" },
];

const hiraganaLevels = [
    ['あ', 'い', 'う', 'え', 'お'],  // Level 1 (Vowels)
    ['か', 'き', 'く', 'け', 'こ'],  // Level 2 (K-Sounds)
    ['さ', 'し', 'す', 'せ', 'そ'],  // Level 3 (S-Sounds)
    ['た', 'ち', 'つ', 'て', 'と'],  // Level 4 (T-Sounds)
    ['な', 'に', 'ぬ', 'ね', 'の'],  // Level 5 (N-Sounds)
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],  // Level 6 (H-Sounds (and Fu))
    ['ま', 'み', 'む', 'め', 'も'],  // Level 7 (M-Sounds)
    ['や', 'ゆ', 'よ', 'わ', 'を'],  // Level 8 (Y-Sounds + "wa" and "wo")
    ['ら', 'り', 'る', 'れ', 'ろ'],  // Level 9 (R-Sounds)
];


// Define the Romaji for each Hiragana character (corresponding to the chart)
const hiraganaRomaji = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo', 'ら': 'ra', 'り': 'ri',
    'る': 'ru', 'れ': 're', 'ろ': 'ro', 'わ': 'wa', 'を': 'wo',
};

let isQuizEnded = false;
let currentQuestion = 0;
let currentLevel = 1;  // Default to Level 1
let currentQuestionIndex = 0; 
let correctAnswers = 0;  // Track correct answers
let incorrectAnswers = 0;
let isMuted = true; 
let lastQuestion = "";

let quizState = {
    isQuizEnded: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    totalQuestions: 0,
};


let flipped = true; // Set the flipped variable (can toggle on/off as needed)

// Function to load questions based on the selected level
function loadLevel() {
    // Get the level selector value
    const levelSelector = document.getElementById("level-selector");
    const selectedLevel = parseInt(levelSelector.value);  // Get the selected level

    // Update currentLevel with the selected level
    currentLevel = selectedLevel;

    // If the quiz is ended, we don't want to reset the entire state
    if (!quizState.isQuizEnded) {
        loadQuestion();  // Load the question based on the new level

        const choices = document.querySelectorAll(".choice");
        choices.forEach(choice => choice.style.display = "block"); 
        document.querySelector("button[onclick='endQuiz()']").disabled = false;
         // Ensure options are visible again
    } else {
        // Restart the quiz without resetting correct and incorrect answers
        quizState.isQuizEnded = false;  // Set the quiz state back to active
        quizState.currentQuestionIndex = 0;
        quizState.correctAnswers = 0;
        quizState.incorrectAnswers = 0;
        quizState.totalQuestions = 0;

        // Clear the result and restart the quiz
        document.getElementById("result").innerText = '';
        loadQuestion();  // Load the first question of the new level
    }
}

function loadQuestion() {
    // Get the Hiragana for the selected level
    const levelHiragana = hiraganaLevels[currentLevel - 1];

    // Randomly select a Hiragana symbol from the current level's row
    let randomHiragana;

    // Ensure the random Hiragana is not the same as the previous one
    do {
        randomHiragana = levelHiragana[Math.floor(Math.random() * levelHiragana.length)];
    } while (randomHiragana === lastQuestion);  // Check if it matches the last question

    lastQuestion = randomHiragana;  // Store the new question as the last one

    // Randomize the Romaji choices for the selected level
    const randomChoices = getRandomRomajiOptions(levelHiragana);

    const choices = document.querySelectorAll(".choice");

    // Show the question in Romaji (always)
    const romaji = hiraganaRomaji[randomHiragana];  // Get the Romaji for the randomly selected Hiragana symbol
    document.getElementById("hiragana-symbol").innerText = romaji;  // Show the Romaji as the question

    // Shuffle the Hiragana options
    const shuffledHiragana = shuffle([...levelHiragana]);  // Create a shuffled version of the Hiragana options

    // Update the choices with the shuffled Hiragana answers
    choices.forEach((choice, index) => {
        choice.innerText = shuffledHiragana[index];  // Display the corresponding shuffled Hiragana for each choice
        choice.setAttribute("data-answer", shuffledHiragana[index]); // Store the shuffled Hiragana in data-answer
        choice.setAttribute("data-character", hiraganaRomaji[shuffledHiragana[index]]); // Store the Romaji character in data-character
    });

    // Add the hover and touch events
    addCharacterReadEvents();
}

// Shuffle function to randomize the array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Shuffle the array
    }
    return array;
}


function checkAnswer(event) {
    const selectedAnswer = event.target.getAttribute("data-answer"); // Get the selected answer (Hiragana)
    const hiraganaSymbol = document.getElementById("hiragana-symbol").innerText;  // Get the current Romaji question displayed
    const result = document.getElementById("result");

    // We need to get the corresponding Hiragana symbol for the current Romaji question
    let correctAnswer = '';

    // Get the correct Hiragana based on the Romaji question
    for (const question of questions) {
        if (hiraganaRomaji[question.hiragana] === hiraganaSymbol) {
            correctAnswer = question.hiragana;  // Get the Hiragana symbol that corresponds to the displayed Romaji
            break;
        }
    }

    if (selectedAnswer === correctAnswer) {
        quizState.correctAnswers++;
        result.innerText = "Correct!";
        result.classList.remove("text-red-500");
        result.classList.add("text-green-500");  // Change text color to green for correct answer
    } else {
        quizState.incorrectAnswers++;
        result.innerText = `Uh Uh, Incorrect! Answer is ${correctAnswer}`;
        result.classList.remove("text-green-500");
        result.classList.add("text-red-500");  // Change text color to red for incorrect answer
    }

    // Hide the result message and load the next question after a short delay
    setTimeout(() => {
        result.innerText = ""; // Clear the result message
        loadQuestion(); // Load the next question
    }, 2000); // Adjust the delay time as needed
}





function getRandomRomajiOptions(levelHiragana) {
    // Create an array of all possible Romaji options based on the current level
    const randomChoices = [];

    // Get the Romaji for all characters in the level
    const romajiList = levelHiragana.map(hiragana => hiraganaRomaji[hiragana]);

    // Pick 3 random Romaji from the level's options
    while (randomChoices.length < 3) {
        const randomRomaji = romajiList[Math.floor(Math.random() * romajiList.length)];
        if (!randomChoices.includes(randomRomaji)) {
            randomChoices.push(randomRomaji);
        }
    }

    // Get the correct Romaji for the randomly selected Hiragana character (randomly pick one from the level)
    const correctHiragana = levelHiragana[Math.floor(Math.random() * levelHiragana.length)];
    const correctAnswer = hiraganaRomaji[correctHiragana];

    // Add the correct answer to the choices array and shuffle the options
    randomChoices.push(correctAnswer);
    return shuffle(randomChoices);  // Shuffle the answers
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Shuffle the array
    }
    return array;
}

function getHiraganaCharacter(romaji) {
    const hiraganaMap = {
        'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
        'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
        'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
        'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
        'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
        'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
        'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
        'ya': 'や', 'yu': 'ゆ', 'yo': 'よ', 'ra': 'ら', 'ri': 'り',
        'ru': 'る', 're': 'れ', 'ro': 'ろ', 'wa': 'わ', 'wo': 'を'
    };

    return hiraganaMap[romaji] || '';  // Return the Hiragana character if found
}

function readOutCharacter(event) {
    if (isMuted) return;
    const utterance = new SpeechSynthesisUtterance(event.target.getAttribute("data-character"));
    utterance.lang = 'ja-JP';  // Set the language to Japanese
    window.speechSynthesis.speak(utterance); // Speak the Hiragana character
}

function endQuiz() {
    quizState.isQuizEnded = true;  // Set the quiz as ended
    const result = document.getElementById("result");

    quizState.totalQuestions = quizState.correctAnswers + quizState.incorrectAnswers; // Total number of attempts
    const percentage = quizState.totalQuestions > 0 ? (quizState.correctAnswers / quizState.totalQuestions) * 100 : 0;

    // Display the score with correct and incorrect answers
    result.innerText = `Quiz Ended! You got ${quizState.correctAnswers} correct and ${quizState.incorrectAnswers} incorrect.`;

    // Replace Hiragana symbol with the score
    document.getElementById("hiragana-symbol").innerText = `${percentage.toFixed(2)}% Accuracy`;

    // Hide the choices to prevent further interaction
    const choices = document.querySelectorAll(".choice");
    choices.forEach(choice => choice.style.display = "none");

    // Disable the End Quiz button
    document.querySelector("button[onclick='endQuiz()']").disabled = true;

    // Clear any result and reset the game state if the user selects a new level
    quizState.correctAnswers = 0;
    quizState.incorrectAnswers = 0;
    quizState.totalQuestions = 0;

    // Ensure choices and result are visible after ending the quiz
    choices.forEach(choice => choice.style.display = "block");  // Ensure options are visible again
    result.innerText = '';  // Clear result message

    // Reload the first question of the selected level after the quiz is ended
    loadQuestion();  // Load a question again after the quiz ends
}





function openPopup() {
    document.getElementById("popup").style.display = 'flex';
}

function closePopup() {
    document.getElementById("popup").style.display = 'none';
}

function endQuiz() {
    quizState.isQuizEnded = true;  // Set the quiz as ended
    const result = document.getElementById("result");

    quizState.totalQuestions = quizState.correctAnswers + quizState.incorrectAnswers; // Total number of attempts
    const percentage = quizState.totalQuestions > 0 ? (quizState.correctAnswers / quizState.totalQuestions) * 100 : 0;

    // Display the score with correct and incorrect answers
    result.innerText = `Quiz Ended! You got ${quizState.correctAnswers} correct and ${quizState.incorrectAnswers} incorrect.`;

    // Replace Hiragana symbol with the score
    document.getElementById("hiragana-symbol").innerText = `${percentage.toFixed(2)}% Accuracy`;

    // Hide the choices to prevent further interaction
    const choices = document.querySelectorAll(".choice");
    choices.forEach(choice => choice.style.display = "none");

    // Disable the End Quiz button
    document.querySelector("button[onclick='endQuiz()']").disabled = true;

    // Optionally, show a restart button to start the quiz again
    document.getElementById("start-quiz-btn").style.display = 'block'; // Show the restart button
}

function addCharacterReadEvents() {

    const choices = document.querySelectorAll(".choice");
    // Add 'mouseover' for desktop (mouse hover)
    choices.forEach(choice => {
        choice.addEventListener('mouseover', readOutCharacter);
    });
    
    // Add 'touchstart' and 'touchend' for mobile (touch and hold)
    choices.forEach(choice => {
        let touchStartTime = 0;
        const touchHoldDuration = 500;  // Duration in ms to trigger the "hold" action

        choice.addEventListener('touchstart', (event) => {
            touchStartTime = Date.now();  // Record the start time of the touch
        });

        choice.addEventListener('touchend', (event) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            // If touch was held long enough (500ms or more)
            if (touchDuration >= touchHoldDuration) {
                readOutCharacter(event);  // Read out the Hiragana character
            }
        });
    });
}
function disableReadOut() {
    isMuted = !isMuted;  // Toggle the mute state

    if (isMuted) {
        // Stop all speech synthesis
        window.speechSynthesis.cancel();
        document.getElementById("mute-button").innerText = "Unmute";  // Change button text to "Unmute"
    } else {
        document.getElementById("mute-button").innerText = "Mute";  // Change button text to "Mute"
    }
}

document.getElementById("level-selector").addEventListener("change", loadLevel);

loadQuestion();
