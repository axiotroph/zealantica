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

  applyAction(event){
    log.trace("applying action " + JSON.stringify(event.detail));
    event.detail.action.perform(event.detail.actor, event.detail.target);
  }
}
