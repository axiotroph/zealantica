import UI from "./UI.js";

const stage_dimensions = {width: 800, height: 800};
const unit_dimensions = {width: 64, height: 64};
const p2_offset = 300;

class Unit {
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
    this.health = 100;
  }
}

PIXI.loader
  .add("assets/unit.png")
  .load(main);
  
function main() {
  let app = new PIXI.Application(stage_dimensions);
  document.body.appendChild(app.view);


  let units = [];
  [0, 1].forEach((i) => {
    [0, 1, 2].forEach((x) => {
      [0, 1, 2].forEach((y) => {
        units.push(new Unit(i, x, y));
      });
    });     
  });

  let texture = PIXI.utils.TextureCache["assets/unit.png"];
  let sprite = new PIXI.Sprite(texture);
  
  units.forEach((x) => {
    let sprite = new PIXI.Sprite(texture);
    sprite.x = x.x * (unit_dimensions.width + 5);
    sprite.y = x.y * (unit_dimensions.height + 5) + p2_offset*x.player;
    app.stage.addChild(sprite);
  });
  
  console.log("Terminating");
}
