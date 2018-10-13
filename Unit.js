import newUID from "./UID.js";

export default class Unit {
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = 100;
    this.id = newUID();
  }
}

