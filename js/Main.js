import UI from "./UI.js";
import Battle from "./Battle.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    this.battle = new Battle();
    this.ui = new UI(this.battle);

    this.ui.load().then(this.doBattle.bind(this)).catch(err => {log.fatal("uncaught error"); console.dir(err);});
  }

  doBattle(){
    return this.ui.getTurn().then(turn => {
      this.battle.applyAction(turn);
      this.ui.update();
    }).then(this.doBattle.bind(this));
  }
}

(new Zealantica).go();
