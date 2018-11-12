import newUID from "./UID.js";
import {basicAttack} from "./Action.js";

import Log from "./Log.js";
let log = Log("unit");

export default class Unit {
  constructor(player, x, y, game) {
    this.game = game;
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = 100;
    this.id = newUID();
    this.ability = basicAttack;
    this.ap = 0;
    this.apRegen = 74;
  }

  canAct(){
    return this.ap > 100 && this.game.activePlayer == this.player;
  }
}

