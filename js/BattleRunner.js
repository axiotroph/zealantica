import UI from "./ui/UI.js";
import Battle from "./Battle.js";

export default class BattleRunner{
  constructor(battle, players, ui){
    this.battle = battle;
    this.players = players;
    this.ui = ui;
  }

  run(){
    let load = (this.ui == undefined) ? Promise.resolve() : this.ui.load(this.battle);

    return load.then(this.runStep.bind(this));
  }

  runStep(){
    if(this.battle.state.finished()){
      return this.battle.state.victor();

    }else if(this.battle.state.triggerQueue.length > 0){
      this.battle.doTrigger();
      if(this.ui != undefined){
        this.ui.update();
      }

    }else{
      let turn = this.players[this.battle.state.activePlayer].getTurn();
      return turn.then(t => {
        if(t == undefined){
          throw "got undefined turn?";
        }

        this.battle.applyAction(t);
        if(this.ui != undefined){
          this.ui.update();
        }
      }).then(this.runStep.bind(this));
    }
  }
}
