import Status from "./Status.js";
import newUID from "./UID.js";

export default class StatusTemplate{
  constructor(duration, stats, tags, applies, name){
    this.duration = duration;
    this.stats = stats;
    this.tags = tags;
    this.applies = applies;
    this.name = name;
  }

  compute(magnitude, actor, target){
    let res = new Status();
    res.duration = this.duration.compute(magnitude, actor, target);

    for(var key in this.stats){
      res.stats[key] = this.stats[key].compute(magnitude, actor, target);
    }

    for(var key in this.applies){
      res.applies[key] = this.applies[key];
    }

    for(var key in this.tags){
      res.tags[key] = this.tags[key];
    }

    res.name = this.name;

    return res;
  }

  describe(){
    let comments = [];
    comments.push("duration: " + this.duration.describe());
    for(var key in this.stats){
      comments.push(key + ": " + this.stats[key].describe());
    }
    let applies = [];
    for(var key in this.applies){
      applies.push(key);
    }
    if(applies.length > 0){
      comments.push(applies.join("/"));
    }
    let tags = [];
    for(var key in this.tags){
      tags.push(key);
    }
    if(tags.length > 0){
      comments.push(tags.join("/"));
    }
    return comments.map(x => "  " + x).join("\n");
  }
}
