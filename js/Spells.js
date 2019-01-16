import Action from "./Action.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import Formula from "./Formula.js";

class GenericSpell extends Action{
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
  'flame_sword': new GenericSpell(
      Targets.and(Targets.front, Targets.enemy),
      Patterns.single,
      "Flame Sword",
      "assets/flame_sword.png",
      {'damage': new Formula(150, 0, {'atk': 0.6, 'int': 0.4}, 0, {'wis': 1})},
      200,
      2),

  'heal': new GenericSpell(
      Targets.ally,
      Patterns.row,
      "Heal",
      "assets/heal.png",
      {'healing': new Formula(100, 0, {'int': 1}, 0, {'wis': 1}, true)},
      200,
      2),

  'lightning_spear': new GenericSpell(
      Targets.and(Targets.enemy, Targets.front),
      Patterns.gun,
      "Lightning Spear",
      "assets/lightning_spear.png",
      {
        'damage': new Formula(50, 0, {'atk': 0.5, 'int': 0.5}, 0, {'def': 1}),
        'ap damage': new Formula(50, 0.5, {'int': 0.5}, 0, {'wis': 1}),
      },
      200,
      2),
}

export default spells;
