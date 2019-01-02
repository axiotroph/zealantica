import Action from "./Action.js";
import numbers from "./Balance.js";
import Patterns from "./PatternSpec.js";
import Targets from "./TargetSpec.js";
import Log from "./Log.js";
let log = Log("BasicAttack");

class BasicAttack extends Action{
  constructor(targetSpec, patternSpec){
    super(targetSpec, patternSpec);
  }

  unitPerform(actor, thisTarget, state, magnitude){
    let damage = Math.floor(numbers.baseAttackDamage * actor.stats().atk / thisTarget.stats().def * magnitude);
    thisTarget.damage(damage);
    log.info(actor.name() + " strikes " + thisTarget.name() + " for " + damage + " damage");
  }
}

const basicAttacksByWeapon = {
  "sword": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.single),
  "spear": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.spear),
  "axe": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.axe),
  "bow": new BasicAttack(
    Targets.enemy,
    Patterns.single),
  "gun": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.gun),
  "cannon": new BasicAttack(
    Targets.enemy,
    Patterns.cannon),
  "staff": new BasicAttack(
    Targets.and(Targets.front, Targets.enemy),
    Patterns.single),
}

export default basicAttacksByWeapon;
