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
    return this.actor.name() + " uses " + this.ability.name + " on " + this.target.name();
  }
}


export class NextTurnEvent{
  compute(state){
    return new EventResult([new NextTurnEffect()]);
  }

  userString(){
    return "";
  }
}

export class EventResult{
  constructor(effects){
    this.effects = effects;
  }

  userString(){
    let results = {}
    let a = this.effects.map(x => x.results());
    let b = a.flat(10);


    this.effects.map(x => x.results()).flat(10).map(res => {
      if(!results[res.key]){
        results[res.key] = [];
      }
      results[res.key].push(res);
    });

    let resultString = Object.keys(results).map(k => results[k][0].reduceToUserString(results[k])).map(x => "  " + x).join("\n");
    return resultString;
  }
}
