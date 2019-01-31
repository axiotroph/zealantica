import BattleState from "./BattleState.js";

import Log from "./Log.js";
let log = Log("battle");

export default class Battle{

  constructor(players, ui){
    this.state = new BattleState();
    this.players = players;
    this.ui = ui;
  }

  run(){
    let load = (this.ui == undefined) ? Promise.resolve() : this.ui.load(this.battle);

    return load.then(this.runStep.bind(this));
  }

  runStep(){
    if(this.state.finished()){
      return this.state.victor();
    }else if(this.state.triggerQueue.length > 0){
      this.state = new BattleState(this.state);
      this.updateUI();
      return this.runStep();
    }else{
      let event = this.players[this.state.activePlayer].getTurn();
      return event.then(t => {
        if(t == undefined){
          throw "got undefined turn?";
        }
        this.state = new BattleState(this.state, t);
        this.updateUI();
      }).then(this.runStep.bind(this));
    }
  }

  updateUI(){
    if(this.ui != undefined){
      this.ui.update();
    }
  }

  status(){
    return this.state.status();
  }
}
