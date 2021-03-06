import BattleState from "./BattleState.js";

import Log from "./Log.js";
let log = Log("battle");

export default class Battle{

  constructor(){
    this.state = new BattleState();
  }

  applyAction(action){
    this.state = new BattleState(this.state, {'action': action});
    this.state.events.forEach(x => log.user(x.userString()));
  }

  status(){
    return this.state.status();
  }
}
