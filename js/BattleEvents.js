import Log from "./Log.js";
let log = Log("battle event");

export class NextTurnEvent{
  constructor(turn){
    this.type = "nextTurn";
    this.turn = turn;
    this.effects = [new NextTurnEffect()];
  }

  userString(){
    return "\nTurn " + this.turn + " begins"
  }
}

export class AbilityEvent{
  constructor(ability, actor, target, effects){
    this.type = "ability";
    this.ability = ability;
    this.actor = actor;
    this.target = target;
    this.effects = effects;
  }

  userString(){
    return this.actor.name() + " uses " + this.ability.name + " targeting " + this.target.name() + " doing stuff";
  }
}

class Effect{
  userString(){
    return JSON.stringify(this);
  }

  apply(state){
    throw "abstract method";
  }
}

class NextTurnEffect extends Effect{
  apply(state){
    state.newTurn();
  }
}

export class StatusAppliedEffect extends Effect{
  constructor(target, status){
    this.target = target;
    this.status = status;
  }

  apply(state){
    state.units[this.target.id].statuses.push(this.status);
  }
}

export class NumericalModEffect extends Effect{
  constructor(target, amount){
    super();
    this.target = target;
    this.amount = amount;
  }
}

export class SimpleEffectAppliedEffect extends Effect{
  constructor(target){
    super();
    this.target = target;
  }
}

export class StatusDispelledEffect extends Effect{
  constructor(target, status){
    super();
    this.target = target;
    this.status = status;
  }

  apply(state){
    log.error("todo");
  }
}

export class SwapEffect extends Effect{
  constructor(target, target2){
    super();
    this.target = target;
    this.target2 = target2;
  }

  apply(state){
    let t1 = state.units[target.id];
    let t2 = state.units[target2.id];

    let xt = t1.x;
    let yt = t1.y;

    t1.x = t2.x;
    t1.y = t2.y;

    t2.x = xt;
    t2.y = yt;
  }
}

export class DamageEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].damage(this.amount);
  }
}

export class HealEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].heal(this.amount);
  }
}

export class APModEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].ap += this.amount;
  }
}

export class MCPModEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].mcp += this.amount;
  }
}

export class AwakenEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].awaken(this.amount);
  }
}

export class StunTriggeredEffect extends SimpleEffectAppliedEffect{
  apply(state){
    state.units[this.target.id].triggerStun();
  }
}

export class ConsumeActivationEffect extends Effect{
  apply(state){
    state.activationsRemaining--;
  }
}
