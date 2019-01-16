import newUID from "./UID.js";

export const actions = {};

export default class Action {
  constructor(targetSpec, patternSpec) {
    this.targetSpec = targetSpec;
    this.patternSpec = patternSpec;
    this.id = newUID();
    this.apCost = 100;
    this.mcpCost = 0;
    actions[this.id] = this;
    this.formulas = {};
    this.statuses = [];
    this.tags = {};
    this.name = "[default ability name]";
  }

  canTarget(actor, target, state){
    return this.targetSpec(actor, target, state);
  }

  willAffect(target, secondTarget){
    return this.patternSpec(target, secondTarget) > 0 && target.player == secondTarget.player;
  }

  canActivate(actor){
    if(this.tags.magic){
      if(actor.statusTags().silence){
        return false;
      }
    }

    if(actor.mcp < this.mcpCost){
      return false;
    }

    return true;
  }

  validate(actor, target, state){
    if(!this.canActivate(actor, state)){
      throw "Tried to illegal action - actor cannot use this ability";
    }

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
    actor.mcp -= this.mcpCost;

    for(let key in state.units){
      let unit = state.units[key];
      let magnitude = this.patternSpec(target, unit);
      if(this.willAffect(target, unit)){
        this.unitCommonPerform(actor, unit, state, magnitude);
        this.unitPerform(actor, unit, state, magnitude);
      }
    };
  }

  unitCommonPerform(actor, thisTarget, state, magnitude){
    if(this.tags.magic && thisTarget.statusTags()['magic immune']){
      return;
    }

    for(var key in this.formulas){
      switch(key){
        case "damage":
          thisTarget.damage(this.formulas.damage.compute(magnitude, actor, thisTarget));
          break;
        case "healing":
          thisTarget.heal(this.formulas.healing.compute(magnitude, actor, thisTarget));
          break;
        case "ap mod":
          thisTarget.ap += this.formulas['ap mod'].compute(magnitude, actor, thisTarget);
          break;
        case "awaken":
          thisTarget.awaken(this.formulas.awaken.compute(magnitude, actor, thisTarget));
      }
    }

    if(this.tags.dispel){
      thisTarget.statuses = thisTarget.statuses.filter(x => !x.tags.magic);
    }

    this.statuses.forEach(x => {
      let computed = x.compute(magnitude, actor, thisTarget);
      thisTarget.statuses.push(computed);
    });

    if(this.tags.physical){
      thisTarget.triggerStun();
    }
  }

  unitPerform(actor, thisTarget, state, magnitude){
  }

  status(){
    let result = [];
    result.push(this.name);
    if(this.apCost > 0){
      result.push("AP cost: " + this.apCost);
      result.push("MCP cost: " + this.mcpCost);
    }

    for(let key in this.formulas){
      result.push(key + ": " + this.formulas[key].describe());
    }

    this.statuses.forEach(x =>
        result.push("Applies " + x.describe()));

    let tags = [];
    for(let key in this.tags){
      if(this.tags[key]){
        tags.push(key);
      }
    }
    if(tags.length > 0){
      result.push(tags.join('/'));
    }

    return result.join("\n");
  }
}
