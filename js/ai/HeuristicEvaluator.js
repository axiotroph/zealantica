export default function stateValue(state, player){
  let sum = 0;
  for(var key in state.units){
    let unit = state.units[key];
    if(unit.player == player){
      sum += unitValue(unit);
    }else{
      sum -= unitValue(unit);
    }
  }

  return sum;
}

function unitValue(unit){
  if(!unit.isAlive()){
    return 0;
  }

  return unit.health / 100.0;
}
