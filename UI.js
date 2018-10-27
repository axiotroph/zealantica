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

  constructor(){
    super();

    this.app = new PIXI.Application(stageDimensions);
    document.getElementById("render").appendChild(this.app.view);

    this.resetState();
  }

  load(callback){
    PIXI.loader.add("assets/unit.png").load(callback);
  }

  drawNewState(state){
    this.unitTiles = {};

    Object.values(state.units).forEach((x) => {
      this.unitTiles[x.id] = new UnitTile(this, x);
    });
  }

  resetState(){
    this.state = "idle";
    this.stateData = {};
  }

  update(){
    Object.values(this.unitTiles).forEach((x) => x.update());
  }

  unitSelect(unit){
    let turn = this.stateData.turn;
    if(this.state === "actorSelect"){
      log.trace("actor is " + unit.id);
      turn.actor = unit;
      turn.action = unit.ability;
      this.state = "targetSelect";
    }else if(this.state === "targetSelect"){
      if(turn.action.canTarget(turn.actor, unit)){
        log.trace("target is " + unit.id);
        turn.target = unit;

        let event = this.stateData;
        this.resetState();
        this.dispatchEvent(event);
      }
    }else{
      log.warn("tried to select a unit in unknown state");
    }
  }

  enableHover(unit){
    if(this.state == "targetSelect"){
      return this.stateData.turn.action.canTarget(this.stateData.turn.actor, unit);
    }else{
      return true;
    }
  }

  listenForTurn(){
    this.state = "actorSelect";
    this.stateData = new CustomEvent("turnReady");
    this.stateData.turn = {};

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
    this.sprite.on('click', (e) => this.ui.unitSelect(this.unitState));
    this.sprite.on('mouseover', (e) => this.hoverBorder.visible = this.ui.enableHover(this.unitState));
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

  update(){
    this.healthBar.width = unitDimensions.width * (this.unitState.health / 100);
  }
}
