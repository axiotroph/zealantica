import frame from "./Frame.js";
import Player from "../Player.js";
import Log, {logText} from "../Log.js";
let log = Log("UI");

const hoverBorderColor = 0x6699ee;
const selectBorderColor = 0x99ccff;
const unitAvailableBorderColor = 0x3366bb;
const healthColor = 0x00FF00;

const darkGrey = 0x222222;
const medGrey = 0x333333;
const lightGrey = 0x444444;

let pixiLoad = new Promise(resolve => {
  PIXI.loader
    .add("assets/sword.png")
    .add("assets/spear.png")
    .add("assets/axe.png")
    .add("assets/bow.png")
    .add("assets/gun.png")
    .add("assets/cannon.png")
    .add("assets/staff.png")
    .add("assets/attack.png")
    .add("assets/cancel.png")
    .add("assets/flame_sword.png")
    .add("assets/awakening.png")
    .add("assets/deep_insight.png")
    .add("assets/freezing_axe.png")
    .add("assets/heal.png")
    .add("assets/holy_guard.png")
    .add("assets/lightning_spear.png")
    .add("assets/silence.png")
    .add("assets/wild_shot.png")
    .add("assets/swap.png")
    .add("assets/guard.png")
    .load(resolve);
});

export default class UIPlayer extends Player{

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

  load(battle){
    return pixiLoad.then(() => {
      this.app = new PIXI.Application(frame.stage);
      document.getElementById("render").appendChild(this.app.view);

      this.leftPanel = this.drawPanel(this.app.stage, frame.leftPanel, darkGrey);
      this.rightPanel = this.drawPanel(this.app.stage, frame.rightPanel, darkGrey);
      this.field = this.drawPanel(this.app.stage, frame.field, medGrey);
      this.formations = {};
      this.formations[0] = this.drawPanel(this.field, frame.formation0, darkGrey);
      this.formations[1] = this.drawPanel(this.field, frame.formation1, darkGrey);

      this.actionBar = this.drawPanel(this.field, frame.actionBar, darkGrey);
      this.actionTiles = [];

      let style = new PIXI.TextStyle({
        fill: "white",
        wordWrap: true,
        wordWrapWidth: frame.leftPanel.width,
        fontSize: 14
      });

      this.leftText = new PIXI.Text("", style);
      this.leftPanel.addChild(this.leftText);
      this.rightText = new PIXI.Text("", style);
      this.rightPanel.addChild(this.rightText);
      this.battle = battle;
      this.unitTiles = {};

      Object.values(battle.state.units).forEach((x) => {
        this.unitTiles[x.id] = new UnitTile(this, x.id, battle);
      });

      this.update();
    });
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
      this.rightText.text = this.hoverTarget.unitState().status();
    }

    for(var key in this.unitTiles){
      let tile = this.unitTiles[key];
      tile.showIndicatorBorder(this.highlightOnHover(this.hoverTarget, tile));
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

  actionHover(tile){
    this.rightText.text = tile.action.status();
  }

  actionUnHover(tile){
    console.log("unhovering");
    this.rightText.text = "";
  }

  onTileClick(){}
  highlightOnHover(){return false;}

  getTurn(){
    log.trace("waiting for turn imput");
    return this.getActor().then(this.getTarget.bind(this)).then(turnData => new AbilityEvent(turnData.ability, turnData.actor, turnData.target));
  }

  getActor(){
    let pending = true;
    return new Promise((resolve, reject) => {
      this.highlightOnHover = (hoverTile, highlightTile) => {
        return pending && hoverTile == highlightTile && hoverTile.unitState().canAct(this.battle.state);
      };

      this.onTileClick = tile => {
        if(pending && tile.unitState().player == this.battle.state.activePlayer && tile.unitState().canAct(this.battle.state)){
          pending = false;
          tile.showSelectBorder(true);
          resolve({'actor': tile.unitState(), 'actorTile': tile});
        }
      };
    });
  }

  getAction(turnData){
    turnData.action = turnData.actor.abilities[0];
    return Promise.resolve(turnData);
  }

  getTarget(turnData){
    let pending = true;
    return new Promise((resolve, reject) => {
      let self = this;
      this.highlightOnHover = (hoverTile, highlightTile) => {
        return pending 
          && hoverTile != null 
          && turnData.action.canTarget(turnData.actor, hoverTile.unitState(), this.battle.state) 
          && turnData.action.willAffect(hoverTile.unitState(), highlightTile.unitState());
      };

      let index = 0;
      let selectedActionTile = null;

      turnData.actor.abilities.forEach(action => {
        let tile = new ActionTile(this, action, index, turnData.actor, this.battle);
        this.actionTiles.push(tile);
        tile.onClick = function(){
          if(tile.action.canActivate(turnData.actor)){
            selectedActionTile.showSelectBorder(false);

            selectedActionTile = tile;
            tile.showSelectBorder(true);
            turnData.action = tile.action;
          }
        };
        index++;
      });

      let cleanupActionTiles = function(){
        self.actionTiles.forEach(tile => {
          self.actionBar.removeChild(tile.sprite);
        });
        self.actionTiles = [];
      };

      let cancelAction = {
        texture: 'assets/cancel.png',
        status: function(){return "cancel"},
        canActivate: function(){return true},
      }

      let cancelTile = new ActionTile(this, cancelAction, index, turnData.actor, this.battle);
      cancelTile.onClick = function(){
        turnData.actorTile.showSelectBorder(false);
        cleanupActionTiles();
        self.getTurn().then(resolve, reject);
      }
      this.actionTiles.push(cancelTile);

      turnData.action = turnData.actor.abilities[0];
      selectedActionTile = this.actionTiles[0];
      selectedActionTile.showSelectBorder(true);

      this.onTileClick = tile => {
        if(pending && turnData.action.canTarget(turnData.actor, tile.unitState(), this.battle.state)){
          pending = false;
          turnData.target = tile.unitState();
          turnData.actorTile.showSelectBorder(false);
          cleanupActionTiles();
          resolve(turnData);
        }
      };
    });
  }
}

class BorderedTile {
  drawBorders(){
    this.availableBorder = this.drawBorder(unitAvailableBorderColor);
    this.hoverBorder = this.drawBorder(hoverBorderColor);
    this.selectBorder = this.drawBorder(selectBorderColor);
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

  showAvailableBorder(bool){
    this.availableBorder.visible = bool;
  }
}

class ActionTile extends BorderedTile{
  constructor(ui, action, index, actor, battle){
    super();
    this.ui = ui;
    this.action = action;
    this.index = index;
    this.battle = battle;

    let texture = PIXI.utils.TextureCache[action.texture];

    this.sprite = new PIXI.Sprite(texture);
    ui.actionBar.addChild(this.sprite);

    // needed for the borders
    this.targetDimensions = frame.actions[index]
    this.baseSpriteDimensions = {height: this.sprite.height, width: this.sprite.width};
    this.scalex = this.sprite.width;
    this.scaley = this.sprite.height;
    this.scaleyRatio = (this.scaley / this.targetDimensions.height);
    this.scalexRatio = (this.scalex / this.targetDimensions.width);

    this.sprite.x = frame.actions[index].x;
    this.sprite.y = frame.actions[index].y;
    this.sprite.width = frame.actions[index].width;
    this.sprite.height = frame.actions[index].height;

    this.drawBorders();

    this.sprite.interactive = true;

    this.sprite.on('mouseover', (e) => {
      this.showIndicatorBorder(this.action.canActivate(actor));
      this.ui.actionHover(this);
    });

    this.sprite.on('mouseout', (e) => {
      this.showIndicatorBorder(false);
      this.ui.actionHover(this);
    });

    this.sprite.on('click', (e) => {
      this.onClick();
    });
  }
}

class UnitTile extends BorderedTile {

  constructor(ui, unitID, battle){
    super();
    this.battle = battle;
    this.ui = ui;
    this.unitID = unitID;

    let texture = PIXI.utils.TextureCache[this.unitState().clazz.texture];
    this.sprite = new PIXI.Sprite(texture);

    this.targetDimensions = frame.units[this.unitState().player][this.unitState().x][this.unitState().y];
    this.baseSpriteDimensions = {height: this.sprite.height, width: this.sprite.width};
    this.scalex = this.sprite.width;
    this.scaley = this.sprite.height;
    this.scaleyRatio = (this.scaley / this.targetDimensions.height);
    this.scalexRatio = (this.scalex / this.targetDimensions.width);

    this.setPosition();

    ui.formations[this.unitState().player].addChild(this.sprite);

    this.healthBar = new PIXI.Graphics();
    this.healthBar.beginFill(healthColor);
    this.healthBar.drawRect(0, 0, this.scalex, this.scaleyRatio * frame.healthHeight);
    this.healthBar.endFill();
		this.healthBar.x = 0;
		this.healthBar.y = this.scaleyRatio * (this.targetDimensions.height - frame.healthHeight);
    this.sprite.addChild(this.healthBar);

    this.sprite.height = this.targetDimensions.height;
    this.sprite.width = this.targetDimensions.width;

    this.drawBorders();

    this.update();

    this.sprite.interactive = true;

    this.sprite.on('click', (e) => this.ui.onTileClick(this));

    this.sprite.on('mouseover', (e) => {
        this.ui.unitHover(this);
    });

    this.sprite.on('mouseout', (e) => {
        this.ui.unitUnHover(this);
    });

  }

  setPosition(){
    this.targetDimensions = frame.units[this.unitState().player][this.unitState().x][this.unitState().y];

    this.sprite.x = this.targetDimensions.x;
    this.sprite.y = this.targetDimensions.y;
  }

  unitState(){
    return this.battle.state.units[this.unitID];
  }

  update(){
    this.setPosition();
    this.showAvailableBorder(this.unitState().canAct(this.battle.state));
    this.healthBar.width = this.baseSpriteDimensions.width * (this.unitState().health / this.unitState().stats().maxHealth);
  }
}
