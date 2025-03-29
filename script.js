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

let isQuizEnded = false;
let score = 0;
let currentQuestion = 0;

function loadQuestion() {
    const question = questions[currentQuestion];
    const choices = document.querySelectorAll(".choice");

    // Show the current Hiragana symbol
    document.getElementById("hiragana-symbol").innerText = question.hiragana;

    // Randomize Romaji choices only (not the Hiragana)
    let randomAnswers = getRandomRomajiOptions(question.answer);

    // Update the choices with randomized Romaji answers and the correct Hiragana character
    choices.forEach((choice, index) => {
        choice.innerText = randomAnswers[index];  // Display the randomized Romaji
        choice.setAttribute("data-answer", randomAnswers[index]); // Store Romaji in data-answer
        
        // Map the Romaji to its corresponding Hiragana character for the hover event
        const hiraganaCharacter = getHiraganaCharacter(randomAnswers[index]);
        choice.setAttribute("data-character", hiraganaCharacter); // Store Hiragana character in data-character

        // Add hover event listener to read out the character in Japanese
        addCharacterReadEvents();
    });
}

function getRandomRomajiOptions(correctAnswer) {
    // Create an array of all possible Romaji options
    const romajiList = ["a", "i", "u", "e", "o", "ka", "ki", "ku", "ke", "ko", "sa", "shi", "su", "se", "so", 
                        "ta", "chi", "tsu", "te", "to", "na", "ni", "nu", "ne", "no", "ha", "hi", "fu", "he", "ho", 
                        "ma", "mi", "mu", "me", "mo", "ya", "yu", "yo", "ra", "ri", "ru", "re", "ro", "wa", "wo"];
    
    // Filter out the correct answer from the options to avoid repeating it
    const filteredList = romajiList.filter(romaji => romaji !== correctAnswer);
    
    // Pick 3 random Romaji from the remaining options
    let randomChoices = [];
    for (let i = 0; i < 3; i++) {
        let randomChoice;
        do {
            randomChoice = filteredList[Math.floor(Math.random() * filteredList.length)];
        } while (randomChoices.includes(randomChoice)); // Ensure no duplicates
        randomChoices.push(randomChoice);
    }

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
    const utterance = new SpeechSynthesisUtterance(event.target.getAttribute("data-character"));
    utterance.lang = 'ja-JP';  // Set the language to Japanese
    window.speechSynthesis.speak(utterance); // Speak the Hiragana character
}

function checkAnswer(event) {
    const selectedRomaji = event.target.getAttribute("data-answer"); // Get the Romaji from the clicked choice
    const correctAnswer = questions[currentQuestion].answer;
    const result = document.getElementById("result");

    if (selectedRomaji === correctAnswer) {
        score++;
        result.innerText = "Correct!";
    } else {
        result.innerText = `Uh Uh, Incorrect! Answer is ${correctAnswer}`;
    }

    // Hide the result message and load next question after a short delay
    setTimeout(() => {
        result.innerText = ""; // Clear the result message
        currentQuestion = (currentQuestion + 1) % questions.length;
        loadQuestion();
    }, 1000); // Adjust the delay time as needed
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
    result.innerText = `Quiz Ended! You scored ${score} out of ${questions.length}`;

    // Replace Hiragana symbol with the score
    document.getElementById("hiragana-symbol").innerText = `${score} / ${questions.length}`;

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
            event.preventDefault(); // Prevent the default touch behavior (e.g., copy/paste menu)
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


loadQuestion();
