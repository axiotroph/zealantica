import newUID from "./UID.js";

import Log from "./Log.js";
let log = Log("unit");

export default class Unit {
  constructor(clazz, player, x, y, game) {
    this.clazz = clazz;
    this.game = game;
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = this.stats().maxHealth;
    this.id = newUID();
    this.abilities = [this.clazz.basicAttack];
    this.ap = 0;
    this.apRegen = 74;

    this.stunTripped = false;
    this.stunnedTime = 0;
    this.stunCounter = 0;
  }

  nextTurn(){
    this.ap += this.apRegen;

    if(this.stunnedTime == 1){
      log.info(this.name() + " recovers from stun");
    }
    this.stunnedTime = Math.max(0, this.stunnedTime-1);

    if(!this.stunTripped){
      this.stunCounter = 0;
    }
    this.stunTripped = false;
  }

  canAct(){
    return this.ap > 100 && this.game.activePlayer == this.player && this.isAlive() && !this.isStunned();
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

  status(){
    let result = 
      this.name() 
      + "\nHealth: " + this.health
      + "\nAP: " + this.ap;
    if(this.stunnedTime > 0){
      result += ("\nStunned: " + this.stunnedTime);
    }
    if(this.stunCounter > 0){
      result += ("\nCombo: " + this.stunCounter);
    }
    return result + this.debugInfo();
  }

  name(){
    return this.clazz.name + "[" + this.id + "]";
  }

  stats(){
    return {
      health: this.health,
      maxHealth: this.clazz.maxHealth,
      attack: this.clazz.attack,
      defense: this.clazz.defense,
    }
  }

  debugInfo(){
    return "\nDEBUG--"
      + "\nID: " + this.id
      + "\nx: " + this.x
      + "\ny: " + this.y
      ;
  }
}

