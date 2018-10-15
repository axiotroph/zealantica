import newUID from "./UID.js";

import Log from "./Log.js";
let log = Log("unit");

export default class Unit {
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = 100;
    this.id = newUID();
  }

  performAbility(other){
    log.info("Unit " + this.id + " attacks unit " + other.id + " for 10 damage!");
    other.health = Math.max(0, other.health - 10);
  }
}

