require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const socket = require("socket.io");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

const app = express();
const portNum = process.env.PORT || 3000;
let allPlayers = [];
let goal = {};

app.use(helmet({
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: { setTo: "PHP 7.4.3" },
  noCache: true
}));

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).type("text").send("Not Found");
});

const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(runner.run, 1500);
  }
});

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("init", (data) => {
    try {
      data.localPlayer.socketId = socket.id;
      if (!allPlayers.some(player => player.socketId === data.localPlayer.socketId)) {
        allPlayers.push(data.localPlayer);
      }
      io.emit("updateClientPlayers", { allPlayers, goal });
    } catch (error) {
      console.error('Error during init:', error);
    }
  });

  socket.on("updateServerPlayers", (data) => {
    goal = data.goal;
    const playerIndex = allPlayers.findIndex(player => player.id === data.localPlayer.id);
    if (playerIndex >= 0) {
      allPlayers[playerIndex] = { ...allPlayers[playerIndex], ...data.localPlayer };
      io.emit("updateClientPlayers", { allPlayers, goal });
    }
  });

  socket.on("disconnect", () => {
    allPlayers = allPlayers.filter(player => player.socketId !== socket.id);
    io.emit("updateClientPlayers", { allPlayers, goal });
    console.log(`${socket.id} disconnected`);
  });
});

module.exports = app;
