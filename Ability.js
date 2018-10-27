import newUID from "./UID.js";

import Log from "./Log.js";
let log = Log("ability");

export const abilities = {};

export default class Ability {
  constructor(targetRule) {
    this.targetRule = targetRule;
    this.id = newUID();
    abilities[this.id] = this;
  }

  canTarget(actor, target){
    return this.targetRule(actor, target);
  }

  perform(actor, target){
    log.info("Unit " + actor.id + " attacks unit " + target.id + " for 10 damage!");
    target.health = Math.max(0, target.health - 10);
  }
}

export function targetsEnemies(actor, target){
  return actor.player != target.player;
}

export function targetsAllies(actor, target){
  return actor.player == target.player;
}

export const basicAttack = new Ability(targetsEnemies);
