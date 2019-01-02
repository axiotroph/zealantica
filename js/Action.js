import newUID from "./UID.js";

export const actions = {};

export default class Action {
  constructor(targetSpec, patternSpec) {
    this.targetSpec = targetSpec;
    this.patternSpec = patternSpec;
    this.id = newUID();
    this.apCost = 100;
    actions[this.id] = this;
  }

  canTarget(actor, target, state){
    return this.targetSpec(actor, target, state);
  }

  willAffect(target, secondTarget){
    return this.patternSpec(target, secondTarget) > 0 && target.player == secondTarget.player;
  }

  validate(actor, target, state){
    if(!actor.canAct(state)){
      throw "Tried to apply illegal action - actor cannot act";
    }
    if(actor.player != state.activePlayer){
      throw "Tried to apply illegal action - actor is not active player's";
    }
    if(!this.canTarget(actor, target, state)){
      throw "Tried to apply illegal action - illegal target";
    }
  }

  perform(actor, target, state){
    this.validate(actor, target, state);

    state.activationsRemaining--;
    actor.ap -= this.apCost;

    for(let key in state.units){
      let unit = state.units[key];
      let magnitude = this.patternSpec(target, unit);
      if(this.willAffect(target, unit)){
        this.unitPerform(actor, unit, state, magnitude);
      }
    };
  }

  unitPerform(actor, thisTarget, state, magnitude){
    throw "abstract method";
  }

  name(){
    throw "abstract method";
  }
}
