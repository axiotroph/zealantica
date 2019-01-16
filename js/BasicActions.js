import Action from "./Action.js";
import numbers from "./Balance.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import {ConstantFormula} from "./Formula.js";
import StatusTemplate from "./StatusTemplate.js";

class Guard extends Action{
  constructor(){
    super(Targets.self, Patterns.single);
    this.texture = "assets/guard.png";
    this.apCost = numbers.guardCost;
    this.statuses = [
      new StatusTemplate(
          new ConstantFormula(1),
          {'def': new ConstantFormula(numbers.guardMagnitude)},
          {'guard': true, 'physical': true},
          "Guarding")];
    this.tags = {'physical': true};
    this.consumesActivation = false;
    this.name = "Guard";
  }
}

class Swap extends Action{
  constructor(){
    super(Targets.and(Targets.ally, Targets.notSelf), Patterns.single);
    this.texture = "assets/swap.png";
    this.apCost = numbers.swapCost;
    this.tags = {'physical': true};
    this.consumesActivation = false;
    this.name = "Swap";
  }

  unitPerform(actor, thisTarget, state, magnitude){
    thisTarget.ap -= numbers.swapCost;
    let xt = thisTarget.x;
    let yt = thisTarget.y;
    thisTarget.x = actor.x;
    thisTarget.y = actor.y;
    actor.x = xt;
    actor.y = yt;
  }
}

let guard = new Guard();
let swap = new Swap();

export {guard, swap};
