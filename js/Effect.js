import {HealingResult, DamageResult, APResult, MCPResult, NextTurnResult} from "./EffectResult.js";
import Log from "./Log.js";
let log = Log("battle event");

class Effect{
  userString(){
    return this.constructor.name;
  }

  apply(state){
    throw "abstract method";
  }

  results(){
    return [];
  }
}

export class NextTurnEffect extends Effect{
  apply(state){
    this.result = new NextTurnResult(state.newTurn());
  }

  results(){
    return [this.result];
  }
}

export class StatusAppliedEffect extends Effect{
  constructor(target, status){
    super();
    this.target = target;
    this.status = status;
  }

  apply(state){
    state.units[this.target.id].statuses.push(this.status);
  }

  results(){
    //TODO
    return [];
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
    state.units[this.target.id].statuses = state.units[this.target.id].statuses.filter(x => x.id != this.status.id);
  }

  results(){
    //TODO
    return [];
  }
}

export class SwapEffect extends Effect{
  constructor(target, target2){
    super();
    this.target = target;
    this.target2 = target2;
  }

  apply(state){
    let t1 = state.units[this.target.id];
    let t2 = state.units[this.target2.id];

    let xt = t1.x;
    let yt = t1.y;

    t1.x = t2.x;
    t1.y = t2.y;

    t2.x = xt;
    t2.y = yt;
  }

  results(){
    //TODO
    return [];
  }
}

export class DamageEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].damage(this.amount);
  }

  results(){
    return [new DamageResult(this.target, this.amount)];
  }
}

export class HealEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].heal(this.amount);
  }

  results(){
    return [new HealingResult(this.target, this.amount)];
  }
}

export class APModEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].ap += this.amount;
  }

  results(){
    return [new APResult(this.target, this.amount)];
  }
}

export class MCPModEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].mcp += this.amount;
  }

  results(){
    return [new MCPResult(this.target, this.amount)];
  }
}

export class AwakenEffect extends NumericalModEffect{
  apply(state){
    state.units[this.target.id].awaken(this.amount);
  }

  results(){
    //TODO
    return [];
  }
}

export class StunTriggeredEffect extends SimpleEffectAppliedEffect{
  apply(state){
    state.units[this.target.id].triggerStun();
  }

  results(){
    //TODO
    return [];
  }
}

export class ConsumeActivationEffect extends Effect{
  apply(state){
    state.activationsRemaining--;
  }

  results(){
    //TODO
    return [];
  }
}
