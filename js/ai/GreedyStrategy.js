import BattleState from "../BattleState.js";


export default function select(state, options, heuristic, player){
  let best = Number.NEGATIVE_INFINITY;
  let bestAction = null;

  options.forEach(opt => {
    let result = new BattleState(state, {'action': opt});
    while(result.turnCount < state.turnCount + 2){
      result = new BattleState(result, {'special': 'nextTurn'});
    }

    let score = heuristic(result, player);
    if(score > best){
      best = score;
      bestAction = opt;
    }
  });

  return bestAction;
}
