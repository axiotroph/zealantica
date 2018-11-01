import newUID from "./UID.js";

import Log from "./Log.js";
let log = Log("action");

export const actions = {};

export default class Action {
  constructor(targetRule) {
    this.targetRule = targetRule;
    this.id = newUID();
    this.apCost = 100;
    actions[this.id] = this;
  }

  canTarget(actor, target){
    return this.targetRule(actor, target);
  }

  perform(actor, target){
    actor.ap -= this.apCost;
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

export const basicAttack = new Action(targetsEnemies);
