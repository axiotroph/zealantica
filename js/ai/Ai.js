import Player from "../Player.js";
import {AbilityEvent} from "../Event.js";
import heuristic from "./HeuristicEvaluator.js"
import greedy from "./GreedyStrategy.js"

import Log from "../Log.js";
let log = Log("ai");

export default function ai(player, battle){
  return new Ai(player, battle, heuristic, greedy);
}

class Ai extends Player{
  constructor(player, battle, evaluationStrategy, selectionStrategy){
    super();
    this.player = player;
    this.battle = battle;
    this.evaluationStrategy = evaluationStrategy;
    this.selectionStrategy = selectionStrategy;
  }

  load(){
    return Promise.resolve();
  }

  getTurn(){
    log.info("heuristic score: " + this.evaluationStrategy(this.battle.state, this.player).toFixed(2));

    let delay = new Promise(resolve => setTimeout(resolve, 200));
    let moves = this.enumerateMoves(this.battle);
    let choice = this.selectionStrategy(this.battle, moves, this.evaluationStrategy, this.player);

    return delay.then(() => Promise.resolve(choice));
  }

  enumerateMoves(battle){
    let result = [];
    for(var actorKey in battle.state.units){
      let actor = battle.state.units[actorKey];
      if(!actor.canAct(battle.state)){
        continue;
      }

      for(var actionKey in actor.abilities){
        let action = actor.abilities[actionKey];
        if(!action.canActivate(actor)){
          continue;
        }
        for(var targetKey in battle.state.units){
          let target = battle.state.units[targetKey];
          if(action.canTarget(actor, target, battle.state)){
            result.push(new AbilityEvent(action, actor, target));
          }
        }
      }
    }
    return result;
  }
}
