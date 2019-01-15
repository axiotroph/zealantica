import Action from "./Action.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import Formula from "./Formula.js";

class genericSpell extends Action{
  constructor(targetSpec, patternSpec, name, texture, formulas, ap, mp){
    super(targetSpec, patternSpec);
    this.texture = texture;
    this.formulas = formulas;
    this.name = name;
    this.apCost = ap;
    this.mpCost = mp;
  }
}

const spells = {
  'flame_sword': new genericSpell(
      Targets.and(Targets.front, Targets.enemy),
      Patterns.single,
      "Flame Sword",
      "assets/flame_sword.png",
      {'damage': new Formula(150, 0, {'atk': 0.6, 'int': 0.4}, 0, {'wis': 1}, 0)},
      200,
      2),
}

export default spells;
