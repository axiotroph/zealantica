import Action from "./Action.js";
import numbers from "./Balance.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import Log from "./Log.js";
import Formula from "./Formula.js";

let log = Log("BasicAttack");

class BasicAttack extends Action{
  constructor(targetSpec, patternSpec, weaponName){
    super(targetSpec, patternSpec);
    this.weaponName = weaponName;
    this.name = "basic attack (" + weaponName + ")";
    this.texture = "assets/attack.png";
    this.formulas['damage'] = new Formula(numbers.baseAttackDamage, 0, {'atk': 1}, 0, {'def': 1}, 0);
    this.tags.physical = true;
  }
}

const basicAttacksByWeapon = {
  "sword": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.single,
    "sword"),
  "spear": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.spear,
    "spear"),
  "axe": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.axe,
    "axe"),
  "bow": new BasicAttack(
    Targets.enemy,
    Patterns.single,
    "bow"),
  "gun": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.gun,
    "rifle"),
  "cannon": new BasicAttack(
    Targets.enemy,
    Patterns.cannon,
    "cannon"),
  "staff": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.single,
    "staff"),
}

export default basicAttacksByWeapon;

