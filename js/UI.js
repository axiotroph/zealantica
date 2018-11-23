import frame from "./Frame.js";
import Log, {logText} from "./Log.js";
let log = Log("UI");

const hoverBorderColor = 0x6699ee;
const selectBorderColor = 0x99ccff;
const unitAvailableBorderColor = 0x3366bb;
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

    let style = new PIXI.TextStyle({
      fill: "white",
      wordWrap: true,
      wordWrapWidth: frame.leftPanel.width
    });

    this.leftText = new PIXI.Text("", style);
    this.leftPanel.addChild(this.leftText);
    this.rightText = new PIXI.Text("", style);
    this.rightPanel.addChild(this.rightText);
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
    PIXI.loader
      .add("assets/sword.png")
      .add("assets/spear.png")
      .add("assets/axe.png")
      .add("assets/bow.png")
      .add("assets/gun.png")
      .add("assets/cannon.png")
      .add("assets/staff.png")
      .load(callback);
  }

  drawNewState(battle){
    this.battle = battle;
    this.unitTiles = {};

    Object.values(battle.units).forEach((x) => {
      this.unitTiles[x.id] = new UnitTile(this, x);
    });

    this.update();
  }

  update(){
    this.leftText.text = this.battle.status() + "\n\n" + logText();
    Object.values(this.unitTiles).forEach((x) => x.update());
    this.updateHover();
  }

  updateHover(){
    self = this;

    if(!this.hoverTarget){
      this.rightText.text = "";
    }else{
      this.rightText.text = this.hoverTarget.unitState.status();
    }

    if(this.state == "actorSelect"){
      var pred = function(tile){return tile.unitState.canAct() && tile == self.hoverTarget};
    }else if(this.state == "targetSelect" && this.hoverTarget){
      var pred = function(tile){
        return self.selectedAction.canTarget(self.selectedTile.unitState, self.hoverTarget.unitState, self.battle)
          && self.selectedAction.willAffect(self.hoverTarget.unitState, tile.unitState);
      }
    }else{
      var pred = function(){return false;};
    }

    for(var key in this.unitTiles){
      let tile = this.unitTiles[key];
      tile.showIndicatorBorder(pred(tile));
    }

  }

  unitHover(tile){
    if(this.hoverTarget != tile){
      this.hoverTarget = tile;
      this.updateHover();
    }
  }

  unitUnHover(tile){
    if(this.hoverTarget == tile){
      this.hoverTarget = null;
      this.updateHover();
    }
  }

  unitSelect(tile){
    if(this.state === "actorSelect" && tile.unitState.player == this.battle.activePlayer && tile.unitState.canAct()){
      this.select(tile);
      this.state = "targetSelect";
      log.trace("actor is " + tile.unitState.id);
    }else if(this.state === "targetSelect"){
      if(this.selectedAction.canTarget(this.selectedTile.unitState, tile.unitState, this.battle)){
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
      }else{
        log.trace("ignoring click because !canTarget()");
      }
    }
  }

  select(tile){
    this.selectedTile = tile;
    this.selectedAction = tile.unitState.abilities[0];
    tile.showSelectBorder(true);
  }

  clearSelect(){
    if(this.selectedTile){
      this.selectedTile.showSelectBorder(false);
    }
    this.selectedTile = null;
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

    let texture = PIXI.utils.TextureCache[unitState.clazz.texture];
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

    this.availableBorder = this.drawBorder(unitAvailableBorderColor);
    this.hoverBorder = this.drawBorder(hoverBorderColor);
    this.selectBorder = this.drawBorder(selectBorderColor);

    this.sprite.x = this.targetDimensions.x;
    this.sprite.y = this.targetDimensions.y;
    this.sprite.height = this.targetDimensions.height;
    this.sprite.width = this.targetDimensions.width;
    this.update();

    this.sprite.interactive = true;

    this.sprite.on('click', (e) => this.ui.unitSelect(this));

    this.sprite.on('mouseover', (e) => {
        this.ui.unitHover(this);
    });

    this.sprite.on('mouseout', (e) => {
        this.ui.unitUnHover(this);
    });
  }

  drawBorder(color){
    let border = new PIXI.Graphics();

    border.lineStyle(frame.borderThickness * this.scaleyRatio, color);
    let offset = frame.borderThickness/2 * this.scaleyRatio;
    border.drawRect(offset, offset, this.scalex - offset - 1, this.scaley - offset - 1);

    border.visible = false;
    this.sprite.addChild(border);

    return border;
  }

  showSelectBorder(bool){
    this.selectBorder.visible = bool;
  }

  showIndicatorBorder(bool){
    this.hoverBorder.visible = bool;
  }

  update(){
    this.availableBorder.visible = this.unitState.canAct();
    this.healthBar.width = this.baseSpriteDimensions.width * (this.unitState.health / 100);
  }
}
