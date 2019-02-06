import BattleState from "../BattleState.js";

export default function stateValue(state, player){
  let [myValue, myDesc, myRaw] = oneSideStateValue(state, player);
  let [theirValue, theirDesc, theirRaw] = oneSideStateValue(state, (player+1)%2);
  let resultDesc = {};

  for(var key in myDesc){
    let balance = myDesc[key]/theirDesc[key];
    if(balance < 0.95 || balance > 1.05){
      resultDesc[key] = "" + balance.toFixed(2) + " (" + myRaw[key] + " vs " + theirRaw[key] + ")";
    }
  }

  return [myValue/theirValue, resultDesc];
}

function oneSideStateValue(state, player){
  let factors = [];
  let weights = [];
  let names = [];

  let myUnits = Object.values(state.units).filter(x => x.player == player && x.isAlive());

  let weight = function(value, weight, name = "unknown"){
    factors.push(value);
    weights.push(weight);
    names.push(name);
  }

  let unitValueSum = 10 + myUnits.map(x => unitValue(x)).reduce((x, y) => x+y, 0);
  weight(unitValueSum, 5, "unit values");

  //let apSum = Math.max(1, myUnits.map(x => x.ap).reduce((x, y) => x+y, 0));
  //weight(apSum, 0.25, "ap total");

  let aliveCount = 0.1 + myUnits.filter(x => x.isAlive()).length;
  weight(aliveCount, 1, "units alive");

  let canActCount = 0.1 + myUnits.filter(x => x.couldAct(state)).length;
  weight(canActCount, 2, "units can act");

  let zeroComboCount = 0.1 + myUnits.filter(x => x.stunCounter == 0).length;
  weight(zeroComboCount, 0.1, "combo 0");

  let oneComboCount = 0.1 + myUnits.filter(x => x.stunCounter <= 1).length;
  weight(oneComboCount, 0.25, "combo 1");
    
  let twoComboCount = 0.1 + myUnits.filter(x => x.stunCounter <= 2).length;
  weight(twoComboCount, 0.5, "combo 2");

  return weightedGeometricMean(factors, weights, names);
}

function unitValue(unit){
  return unit.health;
}

function weightedGeometricMean(vals, weights, names){
  let sum = 0;
  let weightSum = 0;
  let desc = {};
  let raws = {};
  for(let i in vals){
    if(vals[i] <= 0){
      throw "Cannot find geometric average of nonpositive value";
    }

    sum += weights[i] * Math.log(vals[i]);
    weightSum += weights[i];
    desc[names[i]] = vals[i] ** weights[i];
    raws[names[i]] = vals[i];
  }

  return [Math.exp(sum/weightSum), desc, raws];
}
