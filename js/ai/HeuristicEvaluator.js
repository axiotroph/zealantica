import BattleState from "../BattleState.js";

export default function stateValue(state, player){
  return oneSideStateValue(state, player) / oneSideStateValue(state, (player+1)%2);
}

function oneSideStateValue(state, player){
  let factors = [];
  let weights = [];

  let myUnits = Object.values(state.units).filter(x => x.player == player && x.isAlive());

  let weight = function(value, weight){
    factors.push(value);
    weights.push(weight);
  }

  let unitValueSum = 10 + myUnits.map(x => unitValue(x)).reduce((x, y) => x+y, 0);
  weight(unitValueSum, 5);

  let apSum = Math.max(1, myUnits.map(x => x.ap).reduce((x, y) => x+y, 0));
  weight(apSum, 0.25);

  let aliveCount = 0.1 + myUnits.filter(x => x.isAlive()).length;
  weight(aliveCount, 1);

  let canActCount = 0.1 + myUnits.filter(x => x.couldAct(state)).length;
  weight(canActCount, 2);

  let zeroComboCount = 0.1 + myUnits.filter(x => x.stunCounter == 0).length;
  weight(zeroComboCount, 0.1);

  let oneComboCount = 0.1 + myUnits.filter(x => x.stunCounter <= 1).length;
  weight(oneComboCount, 0.25);
    
  let twoComboCount = 0.1 + myUnits.filter(x => x.stunCounter <= 2).length;
  weight(twoComboCount, 0.5);

  return weightedGeometricMean(factors, weights);
}

function unitValue(unit){
  return unit.health;
}

function weightedGeometricMean(vals, weights){
  let sum = 0;
  let weightSum = 0;
  for(let i in vals){
    if(vals[i] <= 0){
      throw "Cannot find geometric average of nonpositive value";
    }

    sum += weights[i] * Math.log(vals[i]);
    weightSum += weights[i];
  }

  return Math.exp(sum/weightSum);
}
