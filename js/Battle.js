import Unit from "./Unit.js";

import Log from "./Log.js";
let log = Log("battle");

export default class Battle{

  constructor(){
    log.info("Building initial state...");

    this.units = {};

    [0, 1].forEach((i) => {
      [0, 1, 2].forEach((x) => {
        [0, 1, 2].forEach((y) => {
          let unit = new Unit(i, x, y, this);
          this.units[unit.id] = unit;
        });
      });     
    });

    this.activePlayer = Math.floor(Math.random() * 2);
    this.turnCount = 0;

    this.prepareForNextAction();
  }

  applyAction(event){
    event.detail.action.perform(event.detail.actor, event.detail.target, this);

    this.activationsRemaining--;
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

    this.activeUnits().forEach((u) => u.ap += u.apRegen);
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
