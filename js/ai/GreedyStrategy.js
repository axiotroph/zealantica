import BattleState from "../BattleState.js";

export default function select(battle, options, heuristic, player){
  let best = Number.NEGATIVE_INFINITY;
  let bestAction = null;

  options.forEach(opt => {
    let result = battle.speculate(opt);
    let score = heuristic(result, player);

    if(score > best){
      best = score;
      bestAction = opt;
    }
  });

  return bestAction;
}
