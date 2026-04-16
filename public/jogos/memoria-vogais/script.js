const basePairs = [
  { vowel: "A", word: "Abelha", icon: "🐝", phrase: "A de Abelha" },
  { vowel: "E", word: "Elefante", icon: "🐘", phrase: "E de Elefante" },
  { vowel: "I", word: "Igreja", icon: "⛪", phrase: "I de Igreja" },
  { vowel: "O", word: "Ovo", icon: "🥚", phrase: "O de Ovo" },
  { vowel: "U", word: "Urso", icon: "🐻", phrase: "U de Urso" },
  { vowel: "A", word: "Árvore", icon: "🌳", phrase: "A de Árvore" },
  { vowel: "E", word: "Escada", icon: "🪜", phrase: "E de Escada" },
  { vowel: "O", word: "Olho", icon: "👁️", phrase: "O de Olho" },
];

const difficultyConfig = {
  easy: 3,
  medium: 5,
  hard: 8,
};

const boardElement = document.getElementById("game-board");
const attemptsElement = document.getElementById("attempts");
const scoreElement = document.getElementById("score");
const starsElement = document.getElementById("stars");
const feedbackElement = document.getElementById("feedback-text");
const celebrationElement = document.getElementById("celebration");
const restartButton = document.getElementById("restart-btn");
const soundButton = document.getElementById("sound-btn");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

let selectedDifficulty = "easy";
let deck = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let lockBoard = false;

function shuffle(list) {
  const items = [...list];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }

  return items;
}

function getStars() {
  const pairCount = difficultyConfig[selectedDifficulty];

  if (attempts <= pairCount + 1) {
    return "★★★";
  }

  if (attempts <= pairCount + 4) {
    return "★★☆";
  }

  return "★☆☆";
}

function getScore() {
  const pairCount = difficultyConfig[selectedDifficulty];
  const maxScore = pairCount * 100;
  return Math.max(10, maxScore - attempts * 10);
}

function updateScoreboard() {
  attemptsElement.textContent = attempts;
  scoreElement.textContent = getScore();
  starsElement.textContent = getStars();
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function showCelebration() {
  celebrationElement.classList.remove("active");
  void celebrationElement.offsetWidth;
  celebrationElement.classList.add("active");
}

function createDeck() {
  const pairCount = difficultyConfig[selectedDifficulty];
  const selectedPairs = basePairs.slice(0, pairCount);

  const cards = selectedPairs.flatMap((pair, index) => [
    {
      id: `vowel-${index}`,
      pairId: index,
      type: "vowel",
      value: pair.vowel,
      phrase: pair.phrase,
      matched: false,
    },
    {
      id: `word-${index}`,
      pairId: index,
      type: "word",
      value: pair.word,
      icon: pair.icon,
      phrase: pair.phrase,
      matched: false,
    },
  ]);

  deck = shuffle(cards);
}

function getCardMarkup(card) {
  if (card.type === "vowel") {
    return `
      <div class="card-face card-back vowel-card">
        <span>${card.value}</span>
      </div>
    `;
  }

  return `
    <div class="card-face card-back word-card">
      <span class="card-icon">${card.icon}</span>
      <span class="card-word">${card.value}</span>
    </div>
  `;
}

function renderBoard() {
  boardElement.innerHTML = deck
    .map(
      (card) => `
        <button
          class="memory-card ${card.matched ? "is-flipped matched" : ""}"
          data-id="${card.id}"
          ${card.matched ? "disabled" : ""}
        >
          <div class="card-inner">
            <div class="card-face card-front">
              <span>?</span>
              <small>Vire</small>
            </div>
            ${getCardMarkup(card)}
          </div>
        </button>
      `
    )
    .join("");
}

function resetTurn() {
  flippedCards = [];
  lockBoard = false;
}

function finishGame() {
  feedbackElement.textContent = `Parabéns! Você encontrou todos os pares com ${attempts} tentativa(s).`;
  showCelebration();
  speak("Muito bem! Você encontrou todos os pares.");
}

function handleMatch(firstCard, secondCard) {
  deck = deck.map((card) =>
    card.pairId === firstCard.pairId ? { ...card, matched: true } : card
  );

  matchedPairs += 1;
  feedbackElement.textContent = "Muito bem! Você encontrou um par correto.";
  showCelebration();
  speak(firstCard.phrase);
  renderBoard();
  updateScoreboard();
  resetTurn();

  if (matchedPairs === difficultyConfig[selectedDifficulty]) {
    finishGame();
  }
}

function handleMismatch() {
  feedbackElement.textContent = "Essas cartas não formam um par. Tente novamente.";
  speak("Tente novamente.");

  const [firstCard, secondCard] = flippedCards;
  const firstElement = document.querySelector(`[data-id="${firstCard.id}"]`);
  const secondElement = document.querySelector(`[data-id="${secondCard.id}"]`);

  firstElement.classList.add("shake");
  secondElement.classList.add("shake");

  setTimeout(() => {
    firstElement.classList.remove("is-flipped", "shake");
    secondElement.classList.remove("is-flipped", "shake");
    resetTurn();
  }, 1100);
}

function onCardClick(cardId) {
  if (lockBoard) {
    return;
  }

  const clickedCard = deck.find((card) => card.id === cardId);
  const cardElement = document.querySelector(`[data-id="${cardId}"]`);

  if (!clickedCard || clickedCard.matched || flippedCards.some((card) => card.id === cardId)) {
    return;
  }

  cardElement.classList.add("is-flipped");
  flippedCards.push(clickedCard);
  speak(clickedCard.phrase);

  if (flippedCards.length < 2) {
    return;
  }

  lockBoard = true;
  attempts += 1;
  updateScoreboard();

  const [firstCard, secondCard] = flippedCards;

  if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
    setTimeout(() => handleMatch(firstCard, secondCard), 400);
    return;
  }

  handleMismatch();
}

function startGame() {
  matchedPairs = 0;
  attempts = 0;
  flippedCards = [];
  lockBoard = false;
  feedbackElement.textContent = "Clique em duas cartas para formar os pares.";
  celebrationElement.classList.remove("active");
  createDeck();
  renderBoard();
  updateScoreboard();
}

boardElement.addEventListener("click", (event) => {
  const cardButton = event.target.closest(".memory-card");

  if (cardButton) {
    onCardClick(cardButton.dataset.id);
  }
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedDifficulty = button.dataset.difficulty;
    startGame();
  });
});

restartButton.addEventListener("click", startGame);

soundButton.addEventListener("click", () => {
  speak("A, E, I, O, U");
  feedbackElement.textContent = "Vamos ouvir as vogais: A, E, I, O, U.";
});

startGame();
