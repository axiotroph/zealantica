class Class {
  constructor(texture, name){
    this.texture = texture;
    this.name = name;
  }
}

const classes = {
  "sword" : new Class(
    "assets/sword.png",
    "Swordsman",
  ),
  "axe" : new Class(
    "assets/axe.png",
    "Axeman",
  ),
  "spear" : new Class(
    "assets/spear.png",
    "Spearman",
  ),
  "rifle" : new Class(
    "assets/rifle.png",
    "Gunner",
  ),
  "bow" : new Class(
    "assets/bow.png",
    "Archer",
  ),
  "cannon" : new Class(
    "assets/cannon.png",
    "Artilleryman",
  ),
  "shaman" : new Class(
    "assets/staff.png",
    "Shaman",
  ),
  "monk" : new Class(
    "assets/staff.png",
    "Monk",
  ),
}

export default classes;
