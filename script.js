const cards = document.querySelectorAll('.memory-card');
const winMessage = document.getElementById('win-message');
const restartButton = document.getElementById('restart-button');
const gameOver = document.querySelector('.game-over');

const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const victorySound = document.getElementById('victory-sound');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = 0;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  flipSound.play();

  if (!hasFlippedCard) {
    // Primeiro clique
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  // Segundo clique
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    disableCards();
    matchSound.play();
    matchedCards += 2;
    if (matchedCards === cards.length) {
      setTimeout(showWinMessage, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function showWinMessage() {
  victorySound.play();
  gameOver.style.display = 'flex';
  gameOver.classList.add('animated');
}

function restartGame() {
  matchedCards = 0;
  gameOver.style.display = 'none';
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });
  shuffle();
}

function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

restartButton.addEventListener('click', restartGame);

(function init() {
  shuffle();
  cards.forEach(card => card.addEventListener('click', flipCard));
})();
