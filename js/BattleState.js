import Unit from "./Unit.js";
import classes from "./Class.js";
import newUID from "./UID.js";

import Log from "./Log.js";
let log = Log("BattleState");

let built = false;

export default class BattleState{

  constructor(priorState, action){
    this.id = newUID();
    if(!priorState || !action){
      this.initInitialState();
    }else{
      this.initFromPrior(priorState, action);
    }
  }

  initInitialState(){
    log.info("Building initial state...");

    this.units = {};

    [0, 1].forEach((i) => {
      [0, 1, 2].forEach((x) => {
        [0, 1, 2].forEach((y) => {
          let j = Math.floor(Math.random() * Object.keys(classes).length);
          let clazz = classes[Object.keys(classes)[j]];
          let unit = new Unit(clazz, i, x, y);
          this.units[unit.id] = unit;
        });
      });     
    });

    this.activePlayer = Math.floor(Math.random() * 2);
    this.turnCount = 0;
    this.endTurnChecks();
  }

  initFromPrior(prior, turn){
    this.prior = prior;
    this.turnCount = prior.turnCount;
    this.activationsRemaining = prior.activationsRemaining;
    this.activePlayer = prior.activePlayer;

    this.units = {};
    for(var key in prior.units){
      this.units[key] = prior.units[key].clone();
    }

    turn.action.perform(this.units[turn.actor.id], this.units[turn.target.id], this);

    this.endTurnChecks();
  }

  endTurnChecks(){
    if(this.activeUnits().every((u) => !u.canAct(this)) || this.activationsRemaining <= 0){
      this.turnCount++;
      this.activePlayer = (this.activePlayer + 1) % 2;

      this.activeUnits().forEach((u) => u.nextTurn());
      this.activationsRemaining = 5;

      log.info("Starting turn " + this.turnCount);
      this.endTurnChecks();
    }
  }

  unitByPosition(x, y, owner){
    for(var key in this.units){
      if(this.units[key].x == x && this.units[key].y == y && this.units[key].player == owner){
        return this.units[key];
      }
    }
    throw "no unit at this position: " + x + ", " + y;
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
