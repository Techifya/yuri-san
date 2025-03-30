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

// Function to load questions based on the selected level
function loadLevel() {
    const levelSelector = document.getElementById("level-selector");
    currentLevel = parseInt(levelSelector.value);  // Get the selected level (1-9)

    loadQuestion();  // Load the new question based on the selected level
}

function loadQuestion() {
    // Get the Hiragana for the selected level
    const levelHiragana = hiraganaLevels[currentLevel - 1];

    // Randomly select a Hiragana symbol from the current level's row
    const randomHiragana = levelHiragana[Math.floor(Math.random() * levelHiragana.length)];

    // Randomize the Romaji choices for the selected level
    const randomChoices = getRandomRomajiOptions(levelHiragana);

    const choices = document.querySelectorAll(".choice");

    // Update the Hiragana symbol to the randomly selected one
    document.getElementById("hiragana-symbol").innerText = randomHiragana;  // Update the symbol displayed

    // Update the choices with randomized Romaji answers and the correct Hiragana character
    choices.forEach((choice, index) => {
        const hiraganaCharacter = levelHiragana[index];  // Get the Hiragana character
        const romaji = hiraganaRomaji[hiraganaCharacter];  // Get the Romaji for the Hiragana

        choice.innerText = romaji;  // Display the randomized Romaji
        choice.setAttribute("data-answer", romaji); // Store Romaji in data-answer
        choice.setAttribute("data-character", hiraganaCharacter); // Store Hiragana character in data-character

        // Add hover event listener to read out the character in Japanese
        addCharacterReadEvents();
    });
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

function checkAnswer(event) {
    const selectedRomaji = event.target.getAttribute("data-answer"); // Get the Romaji from the clicked choice
    const levelHiragana = hiraganaLevels[currentLevel - 1];  // Get Hiragana for the selected level
    const hiraganaSymbol = document.getElementById("hiragana-symbol").innerText;  // Get the current Hiragana symbol displayed

    // Find the correct Romaji for the displayed Hiragana symbol
    const correctAnswer = hiraganaRomaji[hiraganaSymbol];

    const result = document.getElementById("result");

    if (selectedRomaji === correctAnswer) {
        correctAnswers++;
        result.innerText = "Correct!";
    } else {
        incorrectAnswers++;
        result.innerText = `Uh Uh, Incorrect! Answer is ${correctAnswer}`;
    }

    // Hide the result message and load the next question after a short delay
    setTimeout(() => {
        result.innerText = ""; // Clear the result message
        // Move to the next random symbol within the selected level
        loadQuestion();
    }, 2000); // Adjust the delay time as needed
}

function openPopup() {
    document.getElementById("popup").style.display = 'flex';
}

function closePopup() {
    document.getElementById("popup").style.display = 'none';
}

function endQuiz() {
    isQuizEnded = true;  // Set the quiz as ended

    const result = document.getElementById("result");

    const totalQuestions = correctAnswers + incorrectAnswers; // Total number of attempts
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Display the score with correct and incorrect answers
    result.innerText = `Quiz Ended! You got ${correctAnswers} correct and ${incorrectAnswers} incorrect.`;

    // Replace Hiragana symbol with the score
    document.getElementById("hiragana-symbol").innerText = `${percentage.toFixed(2)}% Accuracy`;

    // Hide the choices to prevent further interaction
    const choices = document.querySelectorAll(".choice");
    choices.forEach(choice => choice.style.display = "none");

    // Disable the End Quiz button
    document.querySelector("button[onclick='endQuiz()']").disabled = true;

    // Show the Start Quiz button again (if needed)
    document.getElementById("start-quiz-btn").style.display = 'block'; // Optionally add a restart button
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
loadQuestion();
