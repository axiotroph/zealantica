import BattleState from "./BattleState.js";

import Log from "./Log.js";
let log = Log("battle");

export default class Battle{

  constructor(){
    this.state = new BattleState();
    this.prepareForNextAction();
  }

  applyAction(action){
    this.state = new BattleState(this.state, action);
  }

  status(){
    return this.state.status();
  }
}
