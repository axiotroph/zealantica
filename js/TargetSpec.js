const targetSpecs = {
  "free" : function(actor, target, game){
    return true;
  },

  "enemy" : function(actor, target, game){
    return actor.player == target.player;
  },

  "ally" : function(actor, target, game){
    return actor.player != target.player;
  },

  "front" : function(actor, target, game){
    return target.y == 2;
  }

  "and" : function(f, g){
    return function(actor, target, game){
      return f(actor, target, game) && g(actor, target, game);
    }
  }
}

export default targetSpecs;
