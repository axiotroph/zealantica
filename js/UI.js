import frame from "./Frame.js";
import Log from "./Log.js";
let log = Log("UI");

const hoverBorderColor = 0xAAAAAA;
const selectBorderColor = 0x666666;
const healthColor = 0x00FF00;

const darkGrey = 0x222222;
const medGrey = 0x333333;
const lightGrey = 0x444444;

export default class UI extends EventTarget{

  constructor(battle){
    super();

    this.app = new PIXI.Application(frame.stage);
    document.getElementById("render").appendChild(this.app.view);

    this.leftPanel = this.drawPanel(this.app.stage, frame.leftPanel, darkGrey);
    this.rightPanel = this.drawPanel(this.app.stage, frame.rightPanel, darkGrey);
    this.field = this.drawPanel(this.app.stage, frame.field, medGrey);
    this.formations = {};
    this.formations[0] = this.drawPanel(this.field, frame.formation0, darkGrey);
    this.formations[1] = this.drawPanel(this.field, frame.formation1, darkGrey);

  }

  drawPanel(parent, panelDimensions, color){
    let result = new PIXI.Graphics();
    result.beginFill(color);
    result.drawRect(0, 0, panelDimensions.width, panelDimensions.height);
    result.endFill();
    result.x = panelDimensions.x;
    result.y = panelDimensions.y;
    parent.addChild(result);
    return result;
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
    if(this.state === "actorSelect" && tile.unitState.player == this.battle.activePlayer && tile.unitState.canAct()){
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
    if(this.state == "actorSelect"){
      return tile.unitState.canAct();
    }else if(this.selectedTile && this.selectedAction){
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

    this.targetDimensions = frame.units[unitState.player][unitState.x][unitState.y];
    this.baseSpriteDimensions = {height: this.sprite.height, width: this.sprite.width};
    this.scalex = this.sprite.width;
    this.scaley = this.sprite.height;
    this.scaleyRatio = (this.scaley / this.targetDimensions.height);
    this.scalexRatio = (this.scalex / this.targetDimensions.width);

    ui.formations[unitState.player].addChild(this.sprite);

    this.healthBar = new PIXI.Graphics();
    this.healthBar.beginFill(healthColor);
    this.healthBar.drawRect(0, 0, this.scalex, this.scaleyRatio * frame.healthHeight);
    this.healthBar.endFill();
		this.healthBar.x = 0;
		this.healthBar.y = this.scaleyRatio * (this.targetDimensions.height - frame.healthHeight);
    this.sprite.addChild(this.healthBar);

    this.hoverBorder = this.drawBorder(hoverBorderColor);
    this.selectBorder = this.drawBorder(selectBorderColor);

    this.sprite.x = this.targetDimensions.x;
    this.sprite.y = this.targetDimensions.y;
    this.sprite.height = this.targetDimensions.height;
    this.sprite.width = this.targetDimensions.width;
    this.update();

    this.sprite.interactive = true;
    this.sprite.on('click', (e) => this.ui.unitSelect(this));
    this.sprite.on('mouseover', (e) => this.hoverBorder.visible = this.ui.isTileHoverable(this));
    this.sprite.on('mouseout', (e) => this.hoverBorder.visible = false);
  }

  drawBorder(color){
    let border = new PIXI.Graphics();

    border.lineStyle(frame.borderThickness, color);
    let offset = frame.borderThickness/2;
    border.drawRect(offset, offset, frame.unitSideLength - offset - 1, frame.unitSideLength - offset - 1);

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
    this.healthBar.width = this.baseSpriteDimensions.width * (this.unitState.health / 100);
  }
}
