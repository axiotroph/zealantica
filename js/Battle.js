import Unit from "./Unit.js";
import classes from "./Class.js";

import Log from "./Log.js";
let log = Log("battle");

let a = 0;
let b = 0;

export default class Battle{

  constructor(){

    this.prepareForNextAction();
  }

  unitByPosition(x, y, owner){
    for(var key in this.units){
      if(this.units[key].x == x && this.units[key].y == y && this.units[key].player == owner){
        return this.units[key];
      }
    }
    throw "no unit at this position: " + x + ", " + y;
  }

  applyAction(turn){
    turn.action.perform(turn.actor, turn.target, this);
    this.prepareForNextAction();
  }

  prepareForNextAction(){
    if(this.activeUnits().every((u) => !u.canAct()) || this.activationsRemaining <= 0){
      this.nextTurn();
    }
  }

  nextTurn(){
    this.turnCount++;
    this.activePlayer = (this.activePlayer + 1) % 2;

    this.activeUnits().forEach((u) => u.nextTurn());
    this.activationsRemaining = 5;

    log.info("Starting turn " + this.turnCount);
    this.prepareForNextAction();
  }

  activeUnits(){
    return Object.values(this.units).filter((u) => u.player == this.activePlayer);
  }

  playerDead(player){
    return Object.values(this.units).every((u) => u.player != player || !u.isAlive());
  }

  finished(){
    return this.playerDead(0) || this.playerDead(1);
  }

  victor(){
    if(this.playerDead(0) && this.playerDead(1)){
      return "tie";
    }
    if(this.playerDead(1)){
      return 0;
    }
    if(this.playerDead(0)){
      return 1;
    }
  }

  status(){
    return "Turn " + this.turnCount
      + "\nActive Player: " + this.activePlayer
      + "\nActivations: " + this.activationsRemaining;
  }
}
