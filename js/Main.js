import UI from "./ui/UI.js";
import defaultAi from "./ai/Ai.js";
import Battle from "./Battle.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    let ui = new UI();
    let battle = new Battle(ui);
    let ai1 = defaultAi(0, battle);
    //let ai2 = defaultAi(1, battle);
    battle.setPlayers({0: ai1, 1: ui});

    document.battle = battle;
    document.ui = ui;

    battle.run().then(
      victor => log.info("Battle victor is " + victor),
      err => {
        log.fatal("Unhandled error");
        console.dir(err);
      });
  }
}

(new Zealantica).go();
