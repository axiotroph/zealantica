import UI from "./UI.js";
import Unit from "./Unit.js";

class Zealantica {
  go() {
    this.preload();
    this.ui.load(() => this.postload());
  }

  preload() {
    console.log("Loading");
    this.ui = new UI();
  }

  postload() {
    console.log("Building state");

    let units = [];
    [0, 1].forEach((i) => {
      [0, 1, 2].forEach((x) => {
        [0, 1, 2].forEach((y) => {
          units.push(new Unit(i, x, y));
        });
      });     
    });

    this.ui.drawNewState({'units': units});

    console.log("Running");
    this.mainLoop();
  }

  mainLoop() {
  }
}

(new Zealantica).go();
