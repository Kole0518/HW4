// Add an event listener for the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded()
{
    // variables used
    const startButton = document.getElementById("start-btn");
    const backButton = document.getElementById("back-btn");
    const nextButton = document.getElementById("next-btn");
    const questionContainerElement = document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const answerButtonsElement = document.getElementById("answer-buttons");
    const settings = document.getElementById("settings");
    const correct = document.getElementById("correct");
    const timed = document.getElementById("timed");
    const shuffle = document.getElementById("shuffle");
    const elements = document.getElementsByClassName("info");

    let shuffledQuestions, currentQuestionIndex, correctQuestions;
    let options = [true, false, false];

    // settings event listeners
    shuffle.addEventListener("change", () => {
        options[0] = !options[0];
    });
    timed.addEventListener("change", () => {
        options[1] = !options[1];
    });
    correct.addEventListener("change", () => {
        options[2] = !options[2];
    });

    // direction button event listeners
    startButton.addEventListener("click", startGame);
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    backButton.addEventListener("click", () => {
        currentQuestionIndex--;
        setNextQuestion();
    });

    // begins game when start button is pressed
    function startGame()
    {
        settings.classList.add("hide");
        startButton.classList.add("hide");

        if (currentQuestionIndex === undefined)
        {
            if (options[0])
                shuffledQuestions = questions.sort(() => Math.random() - .5);
            else
                shuffledQuestions = questions;

            if (options[1])
                showTimer();

            if (options[2])
                correctQuestions = [];
        }

        currentQuestionIndex = 0;
        questionContainerElement.classList.remove("hide");
        setNextQuestion();
    }

    // resets card for next question
    function setNextQuestion()
    {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    }

    // creates timer
    function showTimer()
    {
        const timer = document.createElement("div");
        timer.classList.add("timer");
        timer.innerText = "00m 00s";
        questionContainerElement.parentElement.appendChild(timer);

        let count = 0;
        let timerId = setInterval(function() {
            count++;
            let min = Math.floor(count / 60);
            let sec = count % 60;

            timer.innerText = "" + ("0" + min).slice(-2) + "m " + ("0" + sec).slice(-2) + "s";
            timer.classList.toggle("flash", sec === 30 || sec === 32 || (min > 0 && (sec === 0 || sec === 2)));
        }, 1000);
    }

    // shows questions
    function showQuestion(question)
    {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");

            if (answer.correct)
                button.dataset.correct = answer.correct;

            button.addEventListener("click", selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    // resets state of card
    function resetState()
    {
        clearStatusClass(document.body);
        nextButton.classList.add("hide");
        backButton.classList.add("hide");

        while (elements.length > 0)
            answerButtonsElement.parentElement.removeChild(elements[0]);

        while (answerButtonsElement.firstChild) 
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }

    // run when an answer is selected
    function selectAnswer(e)
    {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct;
        let correctButton = selectedButton;

        setStatusClass(document.body, correct);
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct)
                correctButton = button;

            setStatusClass(button, button.dataset.correct);
        });

        const info = document.createElement("div");
        info.classList.add("info");
        info.innerText = "The correct answer was '" + correctButton.innerText + "'!";
        answerButtonsElement.parentElement.insertBefore(info, answerButtonsElement.parentElement.firstChild);

        if (options[2] && correct)
        {
            correctQuestions.push(shuffledQuestions.splice(currentQuestionIndex, 1)[0]);
            currentQuestionIndex--;
        }

        if (shuffledQuestions.length > currentQuestionIndex + 1)
        {
            nextButton.classList.remove("hide");
            if (currentQuestionIndex > 0)
                backButton.classList.remove("hide");
        }
        else
        {
            startButton.innerText = "Restart";
            startButton.classList.remove("hide");
        }
    }

    // sets status of elements based on correctness of answer
    function setStatusClass(element, correct)
    {
        clearStatusClass(element);
        if (correct)
            element.classList.add("correct");
        else
            element.classList.add("wrong");
    
    }

    // clears status effects
    function clearStatusClass(element)
    {
        element.classList.remove("correct");
        element.classList.remove("wrong");
    }

    // questions used
    const questions = [
        {
            question: "How long is New Zealand's Ninety Mile Beach?",
            answers: [
                { text: "58 miles", correct: true },
                { text: "74 miles", correct: false },
                { text: "90 miles", correct: false },
                { text: "108 miles", correct: false },
            ]
        },
        {
            question: "What is a Bombay Duck?",
            answers: [
                { text: "a virus", correct: false },
                { text: "a duck", correct: false },
                { text: "a fish", correct: true },
                { text: "a shrimp", correct: false },
            ]
        },
        {
            question: "You can sneeze in your sleep.",
            answers: [
                { text: "True", correct: false },
                { text: "False", correct: true },
            ]
        },
        {
            question: "Which bird is nicknamed the 'Laughing Jackass'?",
            answers: [
                { text: "The Common Raven", correct: false },
                { text: "The Kookaburra", correct: true },
                { text: "The Blue Macaw", correct: false },
            ]
        },
        {
            question: "Who entered a contest to find his own look-alike and came in 3rd?",
            answers: [
                { text: "Aaron Crandall", correct: false },
                { text: "Daniel Olivares", correct: false },
                { text: "Tom Cruise", correct: false },
                { text: "Charlie Chaplin", correct: true },
            ]
        },
        {
            question: "It's illegal in Texas to put what on your neighbour’s Cow?",
            answers: [
                { text: "Graffiti", correct: true },
                { text: "Glasses", correct: false },
                { text: "Hats", correct: false },
                { text: "'For Sale' Signs", correct: false },
            ]
        },
        {
            question: "What is the most common color of toilet paper in france?",
            answers: [
                { text: "...they wipe?", correct: false },
                { text: "pink", correct: true },
                { text: "teal", correct: false },
            ]
        },
        {
            question: "What is a Mountain Chicken?",
            answers: [
                { text: "a chicken", correct: false },
                { text: "a cougar", correct: false },
                { text: "a frog", correct: true },
                { text: "me every wednesday", correct: false },
            ]
        },
        {
            question: "Do I know what I am doing?",
            answers: [
                { text: "yes", correct: false },
                { text: "no but I know what you're doing :)", correct: true },
            ]
        },
        {
            question: "How many Zags does it take to screw in a lightbulb?",
            answers: [
                { text: "three.", correct: false },
                { text: "depends on where you ask. and how.", correct: true },
                { text: "unknown.", correct: false },
                { text: "fifteen?", correct: false },
            ]
        },
    ]
}