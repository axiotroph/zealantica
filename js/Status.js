import newUID from "./UID.js";

export default class Status{
  constructor(){
    this.stats = {};
    this.tags = {};
    this.applies = {};
    this.duration = 0;
    this.name = "[default status effect]";
    this.id = newUID();
  }

  clone(){
    let obj = Object.create(Status.prototype);
    Object.assign(obj, this);

    obj.tags = {};
    Object.assign(obj.tags, this.tags);

    obj.stats = {};
    Object.assign(obj.stats, this.stats);

    return obj;
  }

  tick(unit){
    this.duration--;
  }

  describe(){
    let items = [];
    for(let key in this.stats){
      items.push((this.stats[key] >= 0 ? "+" : "") + this.stats[key] + " " + key);
    }
    for(let key in this.applies){
      items.push(key);
    }
    for(let key in this.tags){
      items.push(key);
    }

    return this.name + " (" + this.duration + " turns)\n  " + items.join("/");
  }
}
