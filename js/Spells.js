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
    this.tags.magic = true;
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
        'ap mod': new Formula(-50, 50, {'int': 0.5}, 0, {'wis': 1}),
      },
      200,
      2),

  'awakening': new GenericSpell(
      Targets.ally,
      Patterns.cross,
      "Awakening",
      "assets/awakening.png",
      {
        'awaken': new Formula(2, 50, {'int': 0.5}, 100, {'wis': 0.1, 'ala': 0.1}, true),
        'ap mod': new Formula(5, 0, {'int': 1}, 0, {'wis': 1}, true),
      },
      75,
      1),
}

export default spells;
