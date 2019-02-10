class EffectResult{
  constructor(key){
    this.key = key;
  }

  reduceToUserString(effectResults){
    return "";
  }
}

class TargetNumericalEffectResult extends EffectResult{
  constructor(type, target, amount){
    super(type);
    this.target = target;
    this.amount = amount;
  }

  reduceToUserString(effectResults){
    switch(effectResults.length){
      case 0:
        throw "what";
      case 1:
        let res = effectResults[0];
        return res.amount + " " + this.key + " to " + res.target.name();
      case 2:
        let res0 = effectResults[0];
        let res1 = effectResults[1];
        return res0.amount + ", " + res1.amount + " " + this.key + " to " + res0.target.name() + ", " + res1.target.name();
      default:
        return effectResults.map(x => x.amount).reduce((x, y) => x + y) + " total " + this.key + " to " + effectResults.length + " targets";
    }
  }
}

export class HealingResult extends TargetNumericalEffectResult{
  constructor(target, amount){
    super("healing", target, amount);
  }
}

export class DamageResult extends TargetNumericalEffectResult{
  constructor(target, amount){
    super("damage", target, amount);
  }
}

export class APResult extends TargetNumericalEffectResult{
  constructor(target, amount){
    super("AP", target, amount);
  }
}

export class MCPResult extends TargetNumericalEffectResult{
  constructor(target, amount){
    super("MCP", target, amount);
  }
}

export class NextTurnResult extends EffectResult{
  constructor(turn){
    super("new turn");
    this.turn = turn;
  }

  reduceToUserString(effectResults){
    return "Turn " + this.turn + " begins";
  }
}
