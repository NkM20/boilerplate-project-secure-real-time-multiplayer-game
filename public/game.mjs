import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

const playerId = Math.random().toString(36).substr(2, 9);
let players = {};
let collectibles = [];

const player = new Player({x: 50, y: 50, score: 0, id: playerId});

socket.emit('newPlayer', {x: player.x, y: player.y, score: player.score, id: player.id});

socket.on('updatePlayers', (serverPlayers) => {
  players = serverPlayers;
});

socket.on('updateCollectibles', (serverCollectibles) => {
  collectibles = serverCollectibles.map(c => new Collectible(c));
});

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let id in players) {
    const p = players[id];
    const otherPlayer = new Player(p);
    otherPlayer.draw(context);
  }

  collectibles.forEach(collectible => collectible.draw(context));

  player.draw(context);
  requestAnimationFrame(draw);
}

document.addEventListener('keydown', (e) => {
  const directions = {ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right'};
  if (directions[e.key]) {
    player.movePlayer(directions[e.key]);
    socket.emit('movePlayer', {x: player.x, y: player.y, id: player.id});
  }
});

socket.on('collect', (collectibleId) => {
  collectibles = collectibles.filter(c => c.id !== collectibleId);
});

socket.on('playerCollected', (data) => {
  players[data.id].score = data.score;
});

draw();