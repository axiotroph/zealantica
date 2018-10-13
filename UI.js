const stageDimensions = {width: 800, height: 800};
const unitDimensions = {width: 64, height: 64};
const borderThickness = 4;
const p2Offset = 300;
const hoverBorderColor = 0xAAAAAA;
const selectBorderColor = 0x666666;

export default class UI {

  constructor() {
    this.app = new PIXI.Application(stageDimensions);
    document.body.appendChild(this.app.view);
  }

  load(callback) {
    PIXI.loader.add("assets/unit.png").load(callback);
  }

  drawNewState(state) {
    this.unitTiles = {};

    state.units.forEach((x) => {
      this.unitTiles[x.id] = new UnitTile(this, x);
    });
  }
}

class UnitTile {

  constructor(ui, unitState) {
    this.unitState = unitState;

    let texture = PIXI.utils.TextureCache["assets/unit.png"];
    this.sprite = new PIXI.Sprite(texture);

    this.sprite.x = unitState.x * (unitDimensions.width + 5);
    this.sprite.y = unitState.y * (unitDimensions.height + 5) + p2Offset*unitState.player;

    this.hoverBorder = this.drawBorder(hoverBorderColor);
    this.selectBorder = this.drawBorder(selectBorderColor);

    this.sprite.interactive = true;
    this.sprite.on('click', (e) => this.onClick(e));
    this.sprite.on('mouseover', (e) => this.hoverBorder.visible = true);
    this.sprite.on('mouseout', (e) => this.hoverBorder.visible = false);


    ui.app.stage.addChild(this.sprite);
  }

  drawBorder(color){
    let border = new PIXI.Graphics();

    border.lineStyle(borderThickness, color);
    let offset = borderThickness/2;
    border.drawRect(offset, offset, unitDimensions.width - offset - 1, unitDimensions.height - offset - 1);

    border.visible = false;
    this.sprite.addChild(border);

    return border;
  }

  onClick(event) {
    this.selectBorder.visible = true;
  }
}
