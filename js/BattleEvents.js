export class NextTurn{
  constructor(turn){
    this.type = "nextTurn";
    this.turn = turn;
  }

  userString(){
    return "\nTurn " + this.turn + " begins"
  }
}

export class Ability{
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
