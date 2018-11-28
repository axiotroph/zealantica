import Unit from "./Unit.js";
import classes from "./Class.js";

import Log from "./Log.js";
let log = Log("battle");

let a = 0;
let b = 0;

export default class Battle{

  constructor(){
    log.info("Building initial state...");

    this.units = {};

    [0, 1].forEach((i) => {
      [0, 1, 2].forEach((x) => {
        [0, 1, 2].forEach((y) => {
          let j = Math.floor(Math.random() * Object.keys(classes).length);
          let clazz = classes[Object.keys(classes)[j]];
          let unit = new Unit(clazz, i, x, y, this);
          this.units[unit.id] = unit;
        });
      });     
    });

    this.activePlayer = Math.floor(Math.random() * 2);
    this.turnCount = 0;

    this.prepareForNextAction();
  }

  unitByPosition(x, y){
    for(var key in this.units){
      if(this.units[key].x == x && this.units[key].y == y){
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

  status(){
    return "Turn " + this.turnCount
      + "\nActive Player: " + this.activePlayer
      + "\nActivations: " + this.activationsRemaining;
  }
}
