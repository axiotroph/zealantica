import UI from "./ui/UI.js";
import defaultAi from "./ai/Ai.js";
import Battle from "./Battle.js";
import BattleRunner from "./BattleRunner.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    let battle = new Battle();
    let ui = new UI();
    let ai1 = defaultAi(0, battle);
    let ai2 = defaultAi(1, battle);
    let runner = new BattleRunner(battle, {0: ai1, 1: ui}, ui);

    document.battle = battle;
    document.ui = ui;

    runner.run().then(
      victor => log.info("Battle victor is " + victor),
      err => {
        log.fatal("Unhandled error");
        console.dir(err);
      });
  }
}

(new Zealantica).go();
