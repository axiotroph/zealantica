import UI from "./UI.js";
import Battle from "./Battle.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    this.preload();
    this.ui.load(() => this.postload());
  }

  preload() {
    log.info("Loading...");
    this.ui = new UI();
  }

  postload() {
    this.battle = new Battle();

    this.ui.drawNewState(this.battle);

    this.ui.addEventListener('turnReady', this.turnReady.bind(this));
    this.ui.listenForTurn();

    log.info("Running");
  }

  turnReady(details){
    this.battle.applyTurn(details);
    this.ui.listenForTurn();
  }
}

(new Zealantica).go();
