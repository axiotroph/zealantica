export class AbilityEvent{
  constructor(ability, actor, target){
    this.ability = ability;
    this.actor = actor;
    this.target = target;
  }

  compute(state){
    return new EventResult(this.ability.perform(this.actor, this.target, state));
  }
}

export class NextTurnEvent{
  compute(state){
    return new EventResult([new NextTurnEffect()]);
  }
}

export class EventResult{
  constructor(effects){
    this.effects = effects;
  }
}
