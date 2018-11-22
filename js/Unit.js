import newUID from "./UID.js";

import Log from "./Log.js";
let log = Log("unit");

export default class Unit {
  constructor(clazz, player, x, y, game) {
    this.clazz = clazz;
    this.game = game;
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = this.stats().maxHealth;
    this.id = newUID();
    this.abilities = [this.clazz.basicAttack];
    this.ap = 0;
    this.apRegen = 74;
  }

  canAct(){
    return this.ap > 100 && this.game.activePlayer == this.player && this.isAlive();
  }

  isAlive(){
    return this.health > 0;
  }

  status(){
    return this.name() + "\n" + "Health: " + this.health
      + "\nAP: " + this.ap;
  }

  name(){
    return this.clazz.name + "[" + this.id + "]";
  }

  stats(){
    return {
      health: this.health,
      maxHealth: this.clazz.maxHealth,
      attack: this.clazz.attack,
      defense: this.clazz.defense,
    }
  }
}

