import {NextTurnEffect} from "./Effect.js";

export class AbilityEvent{
  constructor(ability, actor, target){
    if(!ability || !actor || !target){
      throw "shouldn't be null";
    }

    this.ability = ability;
    this.actor = actor;
    this.target = target;
  }

  compute(state){
    return new EventResult(this.ability.perform(this.actor, this.target, state));
  }

  userString(){
    return "...";
  }
}


export class NextTurnEvent{
  compute(state){
    return new EventResult([new NextTurnEffect()]);
  }

  userString(){
    return "...";
  }
}

export class EventResult{
  constructor(effects){
    this.effects = effects;
  }

  userString(){
    return "...";
  }
}
