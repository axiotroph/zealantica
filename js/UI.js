const stageDimensions = {width: 800, height: 800};
const unitDimensions = {width: 64, height: 64};
const borderThickness = 4;
const p2Offset = 300;
const hoverBorderColor = 0xAAAAAA;
const selectBorderColor = 0x666666;
const healthHeight = 8;
const healthColor = 0x00FF00;

import Log from "./Log.js";
let log = Log("UI");

export default class UI extends EventTarget{

  constructor(battle){
    super();

    this.app = new PIXI.Application(stageDimensions);
    document.getElementById("render").appendChild(this.app.view);
  }

  load(callback){
    PIXI.loader.add("assets/unit.png").load(callback);
  }

  drawNewState(battle){
    this.battle = battle;
    this.unitTiles = {};

    Object.values(battle.units).forEach((x) => {
      this.unitTiles[x.id] = new UnitTile(this, x);
    });
  }

  update(){
    Object.values(this.unitTiles).forEach((x) => x.update());
  }

  unitSelect(tile){
    if(this.state === "actorSelect" && tile.unitState.player == this.battle.activePlayer){
      this.select(tile);
      this.state = "targetSelect";
      log.trace("actor is " + tile.unitState.id);
    }else if(this.state === "targetSelect"){
      if(this.selectedAction.canTarget(this.selectedTile.unitState, tile.unitState)){
        this.selectedTargetTile = tile;
        log.trace("target is " + tile.unitState.id);

        this.state = "idle";
        let data = {
          "actor": this.selectedTile.unitState,
          "action": this.selectedAction,
          "target": this.selectedTargetTile.unitState
        };

        this.clearSelect();
        this.dispatchEvent(new CustomEvent("actionReady", {'detail': data}));
      }
    }
  }

  select(tile){
    this.selectedTile = tile;
    this.selectedAction = tile.unitState.ability;
    tile.select();
  }

  clearSelect(){
    if(this.selectedTile){
      this.selectedTile.deselect();
    }
    this.selectedTile = null;
  }

  isTileHoverable(tile){
    if(this.selectedTile && this.selectedAction){
      return this.selectedAction.canTarget(this.selectedTile.unitState, tile.unitState);
    }else{
      return true;
    }
  }

  listenForTurn(){
    this.clearSelect();
    this.state = "actorSelect";
    log.trace("waiting for turn input");
  }
}

class UnitTile {

  constructor(ui, unitState){
    this.ui = ui;
    this.unitState = unitState;

    let texture = PIXI.utils.TextureCache["assets/unit.png"];
    this.sprite = new PIXI.Sprite(texture);

    this.sprite.x = unitState.x * (unitDimensions.width + 5);
    this.sprite.y = unitState.y * (unitDimensions.height + 5) + p2Offset*unitState.player;

    this.healthBar = new PIXI.Graphics();
    this.healthBar.beginFill(healthColor);
    this.healthBar.drawRect(0, unitDimensions.height - healthHeight, unitDimensions.width, healthHeight);
    this.healthBar.endFill();
    this.sprite.addChild(this.healthBar);

    this.update();
    this.hoverBorder = this.drawBorder(hoverBorderColor);
    this.selectBorder = this.drawBorder(selectBorderColor);

    this.sprite.interactive = true;
    this.sprite.on('click', (e) => this.ui.unitSelect(this));
    this.sprite.on('mouseover', (e) => this.hoverBorder.visible = this.ui.isTileHoverable(this));
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

  select(){
    this.selectBorder.visible = true;
  }

  deselect(){
    this.selectBorder.visible = false;
  }

  update(){
    this.healthBar.width = unitDimensions.width * (this.unitState.health / 100);
  }
}
