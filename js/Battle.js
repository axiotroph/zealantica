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
  }

  applyTurn(event){
    log.trace("applying turn " + JSON.stringify(event.turn));
    event.turn.action.perform(event.turn.actor, event.turn.target);
  }
}
