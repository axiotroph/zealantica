import newUID from "./UID.js";
import numbers from "./Balance.js";

import Log from "./Log.js";
let log = Log("unit");

export default class Unit {
  constructor(clazz, player, x, y) {
    this.clazz = clazz;
    this.player = player;
    this.x = x;
    this.y = y;
    this.id = newUID();
    this.abilities = this.clazz.abilities;
    this.statuses = [];

    this.health = this.stats().maxHealth;
    this.ap = Math.floor(this.stats().ala * 0.5);
    this.mcp = 0;

    this.stunTripped = false;
    this.stunnedTime = 0;
    this.stunCounter = 0;
  }

  clone(){
    let obj = Object.create(Unit.prototype);
    Object.assign(obj, this);

    obj.statuses = [];
    this.statuses.forEach(x => obj.statuses.push(x.clone()));

    return obj;
  }

  nextTurn(){
    this.ap += this.stats().ala;
    this.mcp = Math.min(numbers.maxMCP, this.mcp+1);

    this.stunnedTime = Math.max(0, this.stunnedTime-1);

    if(!this.stunTripped){
      this.stunCounter = 0;
    }
    this.stunTripped = false;

    this.statuses.forEach(x => x.tick(this));
    this.statuses = this.statuses.filter(x => x.duration > 0);
  }

  couldAct(state){
    if(state == undefined){
      throw "state required";
    }
    return this.isAlive() && !this.isStunned() && !this.isGuarding();
  }

  canAct(state){
    if(state == undefined){
      throw "state required";
    }
    return state.activePlayer == this.player && this.couldAct(state) && this.ap > 100;
  }

  isAlive(){
    return this.health > 0;
  }

  isStunned(){
    return this.stunnedTime > 0 || this.statusTags().stun;
  }

  isGuarding(){
    return this.statusTags().guard;
  }

  awaken(amount){
    if(!this.isAlive()){
      return;
    }

    this.stunCounter = Math.max(0, this.stunCounter - amount);
    this.stunnedTime = Math.max(0, this.stunnedTime - amount);
  }

  damage(amount){
    if(!this.isAlive()){
      return;
    }

    this.health = Math.max(0, this.health - amount);
    if(!this.isAlive()){
      return;
    }
  }

  triggerStun(){
    if(!this.stunTripped){
      this.stunTripped = true;
      this.stunCounter++;
      if(this.stunCounter == 3){
        this.stunCounter = 0;
        this.stunnedTime = 2;
        return "stunned";
      }else{
        return "combo " + this.stunCounter;
      }
    }else{
      return false;
    }
  }

  heal(amount){
    if(!this.isAlive()){
      return;
    }

    this.health = Math.min(this.health + amount, this.stats().maxHealth);
  }

  status(){
    let result = 
      this.name() 
      + "\nHealth: " + this.health
      + "\nAP: " + this.ap
      + "\nMCP: " + this.mcp
      + "\n";
    if(this.stunnedTime > 0){
      result += ("\nStunned: " + this.stunnedTime + "\n");
    }
    if(this.stunCounter > 0){
      result += ("\nCombo: " + this.stunCounter + "\n");
    }

    let stats = this.stats();
    let baseStats = this.baseStats();
    for(let stat in stats){
      let statLine = stat + ": " + stats[stat];
      if(stats[stat] != baseStats[stat]){
        statLine += " (base " + baseStats[stat] + ")";
      }
      result += "\n" + statLine;
    }

    result += "\n";

    this.statuses.forEach(x => result += ("\nAffected by " + x.describe()));

    return result + this.debugInfo();
  }

  name(){
    return this.clazz.name + "[" + this.id + "]";
  }

  baseStats(){
    let stats = Object.assign({}, this.clazz.stats);
    stats.maxHealth = stats.vit * 10;
    return stats;
  }

  stats(){
    let stats = this.baseStats();
    this.statuses.forEach(x => {
      for(var key in x.stats){
        stats[key] += x.stats[key];
      }
    });
    return stats;
  }

  statusTags(){
    let result = {};
    this.statuses.forEach(x => {
      for(var key in x.applies){
        if(x.applies[key]){
          result[key] = true;
        }
      }
    });
    return result;
  }

  debugInfo(){
    return "\n\nDEBUG--"
      + "\nID: " + this.id
      + "\nx: " + this.x
      + "\ny: " + this.y
      + "\nstatus: " + JSON.stringify(this.statusTags())
      ;
  }
}

