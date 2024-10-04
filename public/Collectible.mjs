class Collectible {
  constructor({ x, y, value, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
  }

  draw(context) {
    context.fillStyle = 'yellow';
    context.fillRect(this.x, this.y, 20, 20);
  }

  collect(player) {
    if (this.isCollidingWith(player)) {
      player.score += this.value;
      return true;
    }
    return false;
  }

  isCollidingWith(player) {
    return (
      player.x < this.x + 20 &&
      player.x + player.width > this.x &&
      player.y < this.y + 20 &&
      player.y + player.height > this.y
    );
  }
}

// Export the class as default
export default Collectible;
