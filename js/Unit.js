import newUID from "./UID.js";

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

    this.health = this.stats().maxHealth;
    this.ap = Math.floor(this.stats().ala * 0.5);

    this.stunTripped = false;
    this.stunnedTime = 0;
    this.stunCounter = 0;
  }

  clone(){
    let obj = Object.create(Unit.prototype);
    Object.assign(obj, this);
    return obj;
  }

  nextTurn(){
    this.ap += this.stats().ala;

    if(this.stunnedTime == 1){
      log.info(this.name() + " recovers from stun");
    }
    this.stunnedTime = Math.max(0, this.stunnedTime-1);

    if(!this.stunTripped){
      this.stunCounter = 0;
    }
    this.stunTripped = false;
  }

  couldAct(state){
    if(state == undefined){
      throw "state required";
    }
    return this.ap > 100 && this.isAlive() && !this.isStunned();
  }

  canAct(state){
    if(state == undefined){
      throw "state required";
    }
    return state.activePlayer == this.player && this.couldAct(state);
  }

  isAlive(){
    return this.health > 0;
  }

  isStunned(){
    return this.stunnedTime > 0;
  }

  damage(amount){
    if(!this.isAlive()){
      return;
    }

    this.health = Math.max(0, this.health - amount);
    if(!this.isAlive()){
      log.info(this.name() + " dies!");
      return;
    }

    if(!this.stunTripped){
      this.stunTripped = true;
      this.stunCounter++;
      if(this.stunCounter == 3){
        log.info(this.name() + " is stunned!");
        this.stunCounter = 0;
        this.stunnedTime = 2;
      }
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
      + "\n";
    if(this.stunnedTime > 0){
      result += ("\nStunned: " + this.stunnedTime + "\n");
    }
    if(this.stunCounter > 0){
      result += ("\nCombo: " + this.stunCounter + "\n");
    }
    let stats = this.stats();
    for(let stat in stats){
      result += "\n" + stat + ": " + stats[stat];
    }
    return result + this.debugInfo();
  }

  name(){
    return this.clazz.name + "[" + this.id + "]";
  }

  stats(){
    let stats = Object.assign({}, this.clazz.stats);
    stats.maxHealth = stats.vit * 10;
    return stats;
  }

  debugInfo(){
    return "\n\nDEBUG--"
      + "\nID: " + this.id
      + "\nx: " + this.x
      + "\ny: " + this.y
      ;
  }
}

