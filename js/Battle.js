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
          let unit = new Unit(i, x, y);
          this.units[unit.id] = unit;
        });
      });     
    });

    this.activePlayer = Math.floor(Math.random() * 2);
    this.turnCount = 0;
    this.nextTurn();
  }

  applyAction(event){
    log.trace("applying action " + JSON.stringify(event.detail));
    event.detail.action.perform(event.detail.actor, event.detail.target);

    this.activationsRemaining--;
    if(this.activationsRemaining <= 0){
      this.nextTurn();
    }
  }

  nextTurn(){
    this.turnCount++;
    this.activePlayer = (this.activePlayer + 1) % 2;
    this.activationsRemaining = 5;
    log.info("Starting turn " + this.turnCount);
  }
}
