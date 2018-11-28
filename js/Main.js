import UI from "./UI.js";
import Battle from "./Battle.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    this.battle = new Battle();
    this.ui = new UI();

    this.players = {
      0: this.ui,
      1: this.ui
    }

    this.ui.load(this.battle).then(this.doBattle.bind(this)).catch(err => {log.fatal("uncaught error"); console.dir(err);});
  }

  doBattle(){
    return this.players[this.battle.activePlayer].getTurn().then(turn => {
      this.battle.applyAction(turn);
      this.ui.update();
    }).then(this.doBattle.bind(this));
  }
}

(new Zealantica).go();
