import newUID from "./UID.js";
import {basicAttack} from "./Ability.js";

import Log from "./Log.js";
let log = Log("unit");

export default class Unit {
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = 100;
    this.id = newUID();
    this.ability = basicAttack;
    this.ap = 0;
    this.apRegen = 74;
  }
}

