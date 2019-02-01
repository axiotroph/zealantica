import Action from "./Action.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import {Formula, ConstantFormula} from "./Formula.js";
import StatusTemplate from "./StatusTemplate.js";

class GenericSpell extends Action{
  constructor(targetSpec, patternSpec, name, texture, formulas, applies, ap, mp, tags = {}){
    super(Targets.and(targetSpec, Targets.notTag('magic immune')), patternSpec);
    this.texture = texture;
    this.formulas = formulas;
    this.statuses = applies;
    this.name = name;
    this.apCost = ap;
    this.mcpCost = mp;
    this.tags = tags;
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
      [],
      200,
      2),

  'heal': new GenericSpell(
      Targets.ally,
      Patterns.row,
      "Heal",
      "assets/heal.png",
      {'healing': new Formula(100, 0, {'int': 1}, 0, {'wis': 1}, true)},
      [],
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
      [],
      200,
      2),

  'awakening': new GenericSpell(
      Targets.ally,
      Patterns.cross,
      "Awakening",
      "assets/awakening.png",
      {
        'awaken': new Formula(2.25, 50, {'int': 0.5}, 100, {'wis': 0.1, 'ala': 0.1}, true),
        'ap mod': new Formula(5, 0, {'int': 1}, 0, {'wis': 1}, true),
      },
      [],
      75,
      1),

  'deep_insight': new GenericSpell(
      Targets.enemy,
      Patterns.all,
      "Deep Insight",
      "assets/deep_insight.png",
      {},
      [new StatusTemplate(
        new Formula(1.6, 75, {'int': 0.25}, 75, {'wis': 0.25}),
        {'def': new Formula(-20, 0, {'int': 1}, 0, {'wis': 1})},
        {'magic': true},
        {},
        "Deep Insight"
        )
      ],
      200,
      2),

  'freezing_axe': new GenericSpell(
      Targets.and(Targets.enemy, Targets.front),
      Patterns.row,
      "Freezing Axe",
      "assets/freezing_axe.png",
      {},
      [new StatusTemplate(
        new ConstantFormula(2),
        {'wis': new Formula(-20, 0, {'int': 1}, 0, {'wis': 1})},
        {'magic': true},
        {'stun': true},
        "Freezing Axe"
        )
      ],
      200,
      3),

  'silence': new GenericSpell(
      Targets.and(Targets.enemy, Targets.firstTwo),
      Patterns.row,
      "Silence",
      "assets/silence.png",
      {
        'damage': new Formula(30, 0, {'int': 1}, 0, {'wis': 1})
      },
      [new StatusTemplate(
        new ConstantFormula(2),
        {},
        {'magic': true},
        {'silence': true},
        "Silence"
        )
      ],
      200,
      3),

  'holy_guard': new GenericSpell(
      Targets.ally,
      Patterns.row,
      "Holy Guard",
      "assets/holy_guard.png",
      {},
      [new StatusTemplate(
        new ConstantFormula(2),
        {'def': new Formula(30, 0, {'int': 1}, 0, {'wis': 1}, true)},
        {'magic': true},
        {'magic immune': true},
        "Holy Guard",
        )
      ],
      150,
      2,
      {'dispel': true}),
}

export default spells;
