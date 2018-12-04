import Player from "../Player.js";

import Log from "../Log.js";
let log = Log("ai");

export default class Ai{
  constructor(player, battle, evaluationStrategy, selectionStrategy){
    this.player = player;
    this.battle = battle;
    this.evaluationStrategy = evaluationStrategy;
    this.selectionStrategy = selectionStrategy;
  }

  load(){
    return Promise.resolve();
  }

  getTurn(){
    let delay = new Promise(resolve => setTimeout(resolve, 5));
    let moves = this.enumerateMoves(this.battle);
    log.error(moves.length);
    return delay.then(() => Promise.resolve(moves[0]));
  }

  enumerateMoves(battle){
    let result = [];
    for(var actorKey in battle.units){
      let actor = battle.units[actorKey];
      if(!actor.canAct()){
        continue;
      }

      for(var actionKey in actor.abilities){
        let action = actor.abilities[actionKey];
        for(var targetKey in battle.units){
          let target = battle.units[targetKey];
          if(action.canTarget(actor, target, battle)){
            result.push({
              actor: actor,
              target: target,
              action: action
            });
          }
        }
      }
    }
    return result;
  }
}
