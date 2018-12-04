import UI from "./ui/UI.js";
import Ai from "./ai/Ai.js";
import Battle from "./Battle.js";
import BattleRunner from "./BattleRunner.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    let battle = new Battle();
    let ui = new UI();
    let ai1 = new Ai(0, battle, null, null);
    let ai2 = new Ai(1, battle, null, null);
    let runner = new BattleRunner(battle, {0: ai1, 1: ai2}, ui);

    runner.run().then(
      victor => log.info("Battle victor is " + victor),
      err => {
        log.fatal("Unhandled error");
        console.dir(err);
      });
  }
}

(new Zealantica).go();
