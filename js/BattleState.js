import Log from "./Log.js";
let log = Log("BattleState");

export default class BattleState{

  constructor(priorState, action){
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
          let unit = new Unit(clazz, i, x, y, this);
          this.units[unit.id] = unit;
        });
      });     
    });

    this.activePlayer = Math.floor(Math.random() * 2);
    this.turnCount = 0;
  }

  initFromPriorState(priorState, action){
    this.turnCount = priorState.turnCount + 1;
    this.prior = priorState;
  }
}
