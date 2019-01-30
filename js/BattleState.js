import Unit from "./Unit.js";
import classes from "./Class.js";
import newUID from "./UID.js";
import {NextTurnEvent} from "./BattleEvents.js";

import Log from "./Log.js";
let log = Log("BattleState");

let built = false;

export default class BattleState{

  constructor(priorState, next){
    this.id = newUID();
    this.events = [];
    if(!priorState || !next){
      this.initInitialState();
    }else if(this.triggerQueue.length == 0 && next){
      this.initFromPrior(priorState, next.action.perform(this.units[turn.actor.id], this.units[turn.target.id], this));
    }else if(priorState.triggerQueue.length > 0){
      this.initFromPrior(priorState.triggerQueue[0]);
      this.triggerQueue.pop();
    }else{
      throw "don't know how to make forward progress";
    }
  }

  initInitialState(){
    log.info("Building initial state...");

    this.units = {};

    let meele = Object.values(classes).filter(x => x.tags.meele);
    let ranged = Object.values(classes).filter(x => x.tags.ranged);
    let magic = Object.values(classes).filter(x => x.tags.magic);

    let select = function(vals){
      let j = Math.floor(Math.random() * Object.keys(vals).length);
      return vals[Object.keys(vals)[j]];
    };

    [0, 1].forEach((i) => {
      [0, 1, 2].forEach((x) => {
        [0, 1, 2].forEach((y) => {
          let classGroup = null
          if(y == 0) 
            classGroup = select([magic, magic, magic, ranged, ranged, meele])
          if(y == 1)
            classGroup = select([magic, ranged, ranged, ranged, meele])
          if(y == 2)
            classGroup = select([meele, meele, meele, meele, meele, ranged, ranged, magic])

          let clazz = select(classGroup);
          let unit = new Unit(clazz, i, x, y);

          this.units[unit.id] = unit;
        });
      });     
    });

    this.activePlayer = Math.floor(Math.random() * 2);
    this.turnCount = 0;
    this.event = null;
    this.triggerQueue = [];
    this.endTurnChecks();
  }

  clonePrior(prior){
    this.prior = prior;
    this.turnCount = prior.turnCount;
    this.activationsRemaining = prior.activationsRemaining;
    this.activePlayer = prior.activePlayer;
    this.triggerQueue = prior.triggerQueue.map(x => x);

    this.units = {};
    for(var key in prior.units){
      this.units[key] = prior.units[key].clone();
    }
  }

  initFromPrior(prior, turn){
    this.clonePrior(prior);
    this.event = turn.action.perform(this.units[turn.actor.id], this.units[turn.target.id], this);
    this.event.effects.map(x => x.apply(this));
    this.endTurnChecks();
  }

  newTurn(){
    this.turnCount++;
    this.activePlayer = (this.activePlayer + 1) % 2;

    this.activeUnits().forEach((u) => u.nextTurn());
    this.activationsRemaining = Math.min(5, this.turnCount);
  }

  endTurnChecks(){
    if(this.activeUnits().every((u) => !u.canAct(this)) || this.activationsRemaining <= 0){
      this.triggerQueue.push(new NextTurnEvent());
    }
  }

  unitByPosition(x, y, owner){
    for(var key in this.units){
      if(this.units[key].x == x && this.units[key].y == y && this.units[key].player == owner){
        return this.units[key];
      }
    }
    throw "no unit at this position: " + x + ", " + y;
  }

  activeUnits(){
    return Object.values(this.units).filter((u) => u.player == this.activePlayer);
  }

  playerDead(player){
    return Object.values(this.units).every((u) => u.player != player || !u.isAlive());
  }

  finished(){
    return this.playerDead(0) || this.playerDead(1);
  }

  victor(){
    if(this.playerDead(0) && this.playerDead(1)){
      return "tie";
    }
    if(this.playerDead(1)){
      return 0;
    }
    if(this.playerDead(0)){
      return 1;
    }
  }

  status(){
    return "Turn " + this.turnCount
      + "\nActive Player: " + this.activePlayer
      + "\nActivations: " + this.activationsRemaining;
  }
}
