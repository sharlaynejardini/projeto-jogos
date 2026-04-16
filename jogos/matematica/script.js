const questionElement = document.getElementById("question");
const answerOptionsElement = document.getElementById("answer-options");
const scoreElement = document.getElementById("score");
const roundElement = document.getElementById("round");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("start-btn");
const operationButtons = document.querySelectorAll(".operation-option");
const successImage = document.getElementById("success-image");
const errorImage = document.getElementById("error-image");

let currentAnswer = null;
let score = 0;
let round = 0;
let answeredCurrentQuestion = false;
let nextQuestionTimeoutId = null;
let gameStarted = false;

function clearFeedbackImages() {
  if (nextQuestionTimeoutId) {
    clearTimeout(nextQuestionTimeoutId);
    nextQuestionTimeoutId = null;
  }

  successImage.classList.remove("active");
  errorImage.classList.remove("active");
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleList(list) {
  const shuffled = [...list];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = randomNumber(0, index);
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getSelectedOperations() {
  return Array.from(operationButtons)
    .filter((button) => button.classList.contains("active"))
    .map((button) => button.dataset.operation);
}

function createWrongAnswer(correctAnswer) {
  let candidate = correctAnswer + randomNumber(-10, 10);

  while (candidate === correctAnswer || candidate < 0) {
    candidate = correctAnswer + randomNumber(-10, 10);
  }

  return candidate;
}

function renderAnswerOptions(correctAnswer) {
  const options = [correctAnswer];

  while (options.length < 4) {
    const wrongAnswer = createWrongAnswer(correctAnswer);

    if (!options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  const shuffledOptions = shuffleList(options);

  answerOptionsElement.innerHTML = shuffledOptions
    .map((option) => `<button type="button" class="answer-option" data-answer="${option}">${option}</button>`)
    .join("");
}

function setWaitingState(text, message = "") {
  questionElement.innerHTML = `<span class="question-symbol">${text}</span>`;
  answerOptionsElement.innerHTML = "";
  messageElement.textContent = message;
}

function generateQuestion() {
  const selectedOperations = getSelectedOperations();

  if (selectedOperations.length === 0) {
    currentAnswer = null;
    gameStarted = false;
    clearFeedbackImages();
    setWaitingState(
      "Escolha pelo menos uma operação.",
      "Selecione uma ou mais operações e clique em Começar."
    );
    startButton.textContent = "Começar";
    return;
  }

  const operation = selectedOperations[randomNumber(0, selectedOperations.length - 1)];

  let num1 = randomNumber(1, 10);
  let num2 = randomNumber(1, 10);
  let symbol = "";

  answeredCurrentQuestion = false;

  if (operation === "addition") {
    currentAnswer = num1 + num2;
    symbol = "+";
  }

  if (operation === "subtraction") {
    if (num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    currentAnswer = num1 - num2;
    symbol = "-";
  }

  if (operation === "multiplication") {
    currentAnswer = num1 * num2;
    symbol = "x";
  }

  if (operation === "division") {
    currentAnswer = num1;
    num2 = randomNumber(1, 10);
    num1 = currentAnswer * num2;
    symbol = "/";
  }

  questionElement.innerHTML = `
    <span class="question-number">${num1}</span>
    <span class="question-symbol">${symbol}</span>
    <span class="question-number">${num2}</span>
    <span class="question-symbol">= ?</span>
  `;

  renderAnswerOptions(currentAnswer);
  clearFeedbackImages();
  messageElement.textContent = "";
  gameStarted = true;
  round += 1;
  roundElement.textContent = round;
  startButton.textContent = "Próxima pergunta";
}

function lockAnswerOptions() {
  const answerButtons = answerOptionsElement.querySelectorAll(".answer-option");

  answerButtons.forEach((button) => {
    button.disabled = true;
  });
}

function highlightAnswers(selectedButton) {
  const answerButtons = answerOptionsElement.querySelectorAll(".answer-option");

  answerButtons.forEach((button) => {
    const optionValue = Number(button.dataset.answer);

    if (optionValue === currentAnswer) {
      button.classList.add("correct");
    }

    if (button === selectedButton && optionValue !== currentAnswer) {
      button.classList.add("wrong");
    }
  });
}

function checkAnswer(selectedAnswer, selectedButton) {
  if (!gameStarted || currentAnswer === null) {
    messageElement.textContent = "Escolha as operações e clique em Começar.";
    return;
  }

  if (answeredCurrentQuestion) {
    messageElement.textContent = "Clique em Próxima pergunta para continuar.";
    return;
  }

  const userAnswer = Number(selectedAnswer);

  lockAnswerOptions();
  highlightAnswers(selectedButton);

  if (userAnswer === currentAnswer) {
    score += 1;
    successImage.classList.add("active");
    errorImage.classList.remove("active");
    messageElement.textContent = "Resposta correta! Você ganhou 1 ponto.";
    scoreElement.textContent = score;
    answeredCurrentQuestion = true;
    nextQuestionTimeoutId = setTimeout(() => {
      nextQuestionTimeoutId = null;
      generateQuestion();
    }, 2200);
    return;
  }

  errorImage.classList.add("active");
  successImage.classList.remove("active");
  messageElement.textContent = `Resposta incorreta. A resposta certa era ${currentAnswer}.`;
  answeredCurrentQuestion = true;
  scoreElement.textContent = score;
}

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");

    if (!gameStarted) {
      const selectedOperations = getSelectedOperations();

      if (selectedOperations.length === 0) {
        setWaitingState(
          "Escolha pelo menos uma operação.",
          "Selecione uma ou mais operações e clique em Começar."
        );
      } else {
        setWaitingState("Tudo pronto! Clique em Começar para iniciar.");
      }

      return;
    }

    generateQuestion();
  });
});

answerOptionsElement.addEventListener("click", (event) => {
  const button = event.target.closest(".answer-option");

  if (button) {
    checkAnswer(button.dataset.answer, button);
  }
});

startButton.addEventListener("click", generateQuestion);

setWaitingState("Escolha as operações e clique em Começar.");
