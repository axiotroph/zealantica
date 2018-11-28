import UI from "./ui/UI.js";
import Battle from "./Battle.js";
import BattleRunner from "./BattleRunner.js";

import Log from "./Log.js";
let log = Log("main");

class Zealantica {
  go() {
    let battle = new Battle();
    let ui = new UI();
    let runner = new BattleRunner(battle, {0: ui, 1: ui}, ui);

    runner.run().then(
      victor => log.info("Battle victor is " + victor),
      err => {
        log.fatal("Unhandled error");
        console.dir(err);
      });
  }
}

(new Zealantica).go();
