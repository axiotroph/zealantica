const patternSpecs = {
  "single" : function(primaryTarget, thisTarget){
    return (primaryTarget.x == thisTarget.x && primaryTarget.y == thisTarget.y) ? 1 : 0;
  }

  "spear" : function(primaryTarget, thisTarget){
    if(primaryTarget.x == thisTarget.x && primaryTarget.y == thisTarget.y){
      return 0.9;
    }else if(primaryTarget.x == thisTarget.x && primaryTarget.y-1 == thisTarget.y){
      return 0.6;
    }else{
      return 0;
    }
  }

  "axe" : function(primaryTarget, thisTarget){
    if(primaryTarget.x == thisTarget.x && primaryTarget.y == thisTarget.y){
      return 0.9;
    }else if(primaryTarget.y == thisTarget.y && math.abs(primaryTarget.x - thisTarget.x) == 1){
      return 0.6;
    }else{
      return 0;
    }
  }

  "spear" : function(primaryTarget, thisTarget){
    if(primaryTarget.x == thisTarget.x && primaryTarget.y == thisTarget.y){
      return 0.7;
    }else if(primaryTarget.x == thisTarget.x && primaryTarget.y-1 == thisTarget.y){
      return 0.5;
    }else if(primaryTarget.x == thisTarget.x && primaryTarget.y-2 == thisTarget.y){
      return 0.3;
    }else{
      return 0;
    }
  }

  "cannon" : function(primaryTarget, thisTarget){
    let manhattanDistance = Math.abs(primaryTarget.x - thisTarget.x) + Math.abs(primaryTarget.y + thisTarget.y);
    if(manhattanDistance == 0){
      return 0.5;
    }else if(manhattanDistance == 1){
      return 0.2;
    }else{
      return 0;
    }
  }

  "column" : function(primaryTarget, thisTarget){
    return primaryTarget.x == thisTarget.x ? 1 : 0;
  }

  "row" : function(primaryTarget, thisTarget){
    return primaryTarget.y == thisTarget.y ? 1 : 0;
  }

  "cross" : function(primaryTarget, thisTarget){
    let manhattanDistance = Math.abs(primaryTarget.x - thisTarget.x) + Math.abs(primaryTarget.y + thisTarget.y);
    return manhattanDistance <= 1 ? 1 : 0;
  }

  // spear: 0.9/0.6 (1.5)
  // axe  : 0.6/0.35/0.35 (1.3)
  // gun  : 0.7/0.5/0.3 (1.5)
  // cannon: 0.5/0.2/0.2/0.2/0.2 (1.3)


}

export default patternSpecs;
