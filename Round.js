const random = (min = 0, max = 50) => {
  let num = Math.random() * (max - min) + min;

  return Math.round(num);
};

class Round {
  constructor(players) {
    this.players = players;
    this.nbPlayers = players.length;
    this.isRoundFinished = false;
  }

  get currentPlayer() {
    return this.players[this.playerIndex];
  }
  get currentDealer() {
    return this.players[this.dealerIndex];
  }

  setDealer(index) {
    this.players.forEach((p) => (p.isDealer = false));
    this.currentDealer.isDealer = true;
  }

  newGame() {
    this.resetGame();
    this.chooseDealer();
    this.setDealerAndPlayer();
  }

  chooseDealer() {
    this.dealerIndex = random(0, this.nbPlayers - 1);
  }

  setDealerAndPlayer() {
    this.setDealer(this.dealerIndex);

    if (this.dealerIndex === this.nbPlayers - 1) {
      this.playerIndex = 0;
    } else {
      this.playerIndex = this.dealerIndex + 1;
    }
    this.currentPlayer.isPlaying = true;
  }

  resetGame() {
    this.players.forEach((p) => {
      p.isPlaying = false;
      p.isDealer = false;
    });
    this.isRoundFinished = false;
  }

  nextPlayerIndex() {
    if (this.playerIndex === this.nbPlayers - 1) {
      this.playerIndex = -1;
    }
    this.playerIndex++;

    return this.playerIndex;
  }

  // returns true if the round is finished
  nextPlayer() {
    this.nextPlayerIndex();

    if (this.playerIndex === this.dealerIndex) {
      this.isRoundFinished = true;

      return true;
    }

    this.players.forEach((p) => (p.isPlaying = false));
    this.currentPlayer.isPlaying = true;

    return false;
  }
}

module.exports = Round;
