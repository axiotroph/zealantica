export class NextTurnEvent{
  constructor(turn){
    this.type = "nextTurn";
    this.turn = turn;
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

export class StatusAppliedEffect{
  constructor(target, status){
    this.target = target;
    this.status = status;
  }
}

export class NumericalModEffect{
  constructor(target, amount){
    this.target = target;
    this.amount = amount;
  }
}

export class SimpleEffectAppliedEffect{
  constructor(target){
    this.target = target;
  }
}

export class StatusDispelledEffect{
  constructor(target, status){
    this.target = target;
    this.status = status;
  }
}

export class DamageEffect extends NumericalModEffect{
}

export class HealEffect extends NumericalModEffect{
}

export class APModEffect extends NumericalModEffect{
}

export class MCPModEffect extends NumericalModEffect{
}

export class AwakenEffect extends NumericalModEffect{
}

export class StunTriggeredEffect extends SimpleEffectAppliedEffect{
}

export class ConsumeActivationEffect{
}
