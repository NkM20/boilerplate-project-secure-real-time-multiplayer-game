class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.width = 30;
    this.height = 30;
    this.speed = 5;
  }

  movePlayer(dir) {
    if (dir === 'left') this.x -= this.speed;
    if (dir === 'right') this.x += this.speed;
    if (dir === 'up') this.y -= this.speed;
    if (dir === 'down') this.y += this.speed;
  }

  draw(context) {
    context.fillStyle = 'blue';
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  collision(item) {
    return (
      this.x < item.x + 20 &&
      this.x + this.width > item.x &&
      this.y < item.y + 20 &&
      this.y + this.height > item.y
    );
  }

  calculateRank(players) {
    players.sort((a, b) => b.score - a.score);
    return players.indexOf(this) + 1;
  }
}

export default Player;
