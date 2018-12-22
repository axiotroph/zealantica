const targetSpecs = {
  "free" : function(actor, target, game){
    return true;
  },

  "enemy" : function(actor, target, game){
    return actor.player != target.player && target.isAlive();
  },

  "ally" : function(actor, target, game){
    return actor.player == target.player && target.isAlive();
  },

  "front" : function(actor, target, game){
    let walk = 2;
    while(walk != target.y){
      if(game.unitByPosition(target.x, walk, target.player).isAlive()){
        return false;
      }
      walk--;
    }
    return true;
  },

  "and" : function(f, g){
    return function(actor, target, game){
      return f(actor, target, game) && g(actor, target, game);
    }
  },
}

export default targetSpecs;
