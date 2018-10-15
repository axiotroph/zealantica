import UI from "./UI.js";
import Unit from "./Unit.js";
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
    log.info("Building initial state...");

    let units = [];
    [0, 1].forEach((i) => {
      [0, 1, 2].forEach((x) => {
        [0, 1, 2].forEach((y) => {
          units.push(new Unit(i, x, y));
        });
      });     
    });

    this.ui.drawNewState({'units': units});

    log.info("Running");
    this.mainLoop();
  }

  mainLoop() {
    this.ui.listenForTurn();
  }
}

(new Zealantica).go();
