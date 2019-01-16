import numbers from "./Balance.js";

export default class Formula{
  constructor(magnitude, flatOffense, offenseScales, flatDefense, defenseScales, friendly = 0){
    this.magnitude = magnitude;
    this.flatOffense = flatOffense;
    this.flatDefense = flatDefense;
    this.offenseScales = offenseScales;
    this.defenseScales = defenseScales;
    this.friendly = friendly;
  }

  compute(magnitude, actor, target){
    let damage = magnitude * this.magnitude;
    let offense = this.flatOffense;
    let defense = this.flatDefense;

    for(var key in this.offenseScales){
      offense += this.offenseScales[key] * actor.stats()[key];
    }

    for(var key in this.defenseScales){
      defense += this.defenseScales[key] * target.stats()[key];
    }

    if(this.friendly){
      defense = (numbers.statBase**2)/defense;
    }

    return Math.floor(damage * offense / defense);
  }

  describeOff(){
    let result = "";
    if(this.flatOffense > 0){
      result += this.flatOffense + "+";
    }
    let terms = [];
    for(var key in this.offenseScales){
      if(this.offenseScales[key] == 1){
        terms.push(key);
      }else{
        terms.push(this.offenseScales[key] + key);
      }
    }
    return result + terms.join("/");
  }

  describeDef(){
    let result = "";
    if(this.flatDefense > 0){
      result += this.flatDefense + "+";
    }
    let terms = [];
    for(var key in this.defenseScales){
      if(this.defenseScales[key] == 1){
        terms.push(key);
      }else{
        terms.push(this.defenseScales[key] + key);
      }
    }
    return result + terms.join("/");
  }

  describe(){
    console.dir(this);
    let result = "" + this.magnitude + " [" + this.describeOff() + " vs " + this.describeDef() + "]";
    if(this.friendly){
      result += " (friendly)";
    }
    return result;
  }
}
