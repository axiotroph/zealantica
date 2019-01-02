import Action from "./Action.js";
import numbers from "./Balance.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import Log from "./Log.js";
let log = Log("BasicAttack");

class BasicAttack extends Action{
  constructor(targetSpec, patternSpec, weaponName){
    super(targetSpec, patternSpec);
    this.weaponName = weaponName;
  }

  unitPerform(actor, thisTarget, state, magnitude){
    let damage = Math.floor(numbers.baseAttackDamage * actor.stats().atk / thisTarget.stats().def * magnitude);
    thisTarget.damage(damage);
  }

  name(){
    return "basic attack (" + this.weaponName + ")";
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
