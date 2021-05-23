const express = require("express");

const cors = require("cors");

const port = process.env.PORT || 8081;
const index = require("./routes/index");
const cards = require("./cards");
const Round = require("./Round");

const app = express();

app.use(cors());
app.use(express.static("public"));
// app.use(index);

const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, { cors: { origins: "*" } });

let interval;

const random = (min = 0, max = 50) => {
  let num = Math.random() * (max - min) + min;

  return Math.round(num);
};

const createPlayer = (name) => {
  return {
    name,
    isPlaying: false,
    cards: []
  };
};

let players = [
  // createPlayer("Noam"),
  // createPlayer("Khalled"),
  // createPlayer("Daoud"),
  // createPlayer("Amine"),
  // createPlayer("Pge")
];
let deck = [...cards];
let round;
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.emit("hello", "Munchkin");

  // socket.emit("deck", deck);
  socket.emit("players", players);

  // socket.on("chooseDealer", () => {
  //   if (players.length === 0) {
  //     return;
  //   }

  //   const rnd = random(0, players.length - 1);
  //   const player = players[rnd];
  //   if (rnd === players.length - 1) {
  //     players[0].isPlaying = true;
  //   } else {
  //     players[rnd + 1].isPlaying = true;
  //   }
  //   players.forEach((p) => (p.isDealer = false));
  //   player.isDealer = true;
  //   io.emit("players", players);
  // });

  socket.on("message", (name, args) => {
    console.log("New message", name, args);

    io.emit("message", name, args);
  });

  socket.on("newGame", () => {
    console.log("New game");

    // round = new Round(players);
    // round.newGame();

    // deck = [...cards];

    io.emit("newGame", players); //, players, deck);
  });

  socket.on("resetPlayers", () => {
    console.log("Reset players");

    players = [];

    io.emit("players", players); //, players, deck);
  });

  socket.on("newPlayer", (name) => {
    const existing = players.find((p) => p.name === name);
    if (existing) {
      socket.emit("playerAlreadyExist", name);
      return;
    }

    const player = {name, id: socket.id}
    console.log("New player", name);
    // const player = createPlayer(name);
    players.push(player);
    io.emit("players", players);
  });

  // socket.on("servi", (name, type) => {
  //   round.nextPlayer();
  //   io.emit("players", players);
  // });

  // socket.on("newCard", (name, type) => {
  //   const length = deck.length;
  //   if (length === 0) {
  //     io.emit("emtyDeck");
  //   }

  //   const playerId = players.findIndex((p) => p.name === name);
  //   console.log("New CARD", name, type, playerId);
  //   const rnd = random(1, length);
  //   const card = deck[rnd];
  //   card.type = type;
  //   if (playerId !== -1) {
  //     players[playerId].cards.push(card);
  //   }

  //   deck = deck.filter((c) => c.index !== card.index);

  //   // console.log('CARDS rnd', type, rnd, 'card', card, 'remains', deck.length, player)
  //   io.emit("card", card);
  //   io.emit("deck", deck);
  //   io.emit("players", players);
  // });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    const index = players.findIndex((p) => p.id === socket.id);
    if (index !== -1) {
      players.splice(index, 1)

      io.emit("players", players);
    }
  });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
