import attacks from "./BasicAttacks.js";

class Class {
  constructor(texture, name, basicAttack){
    this.texture = texture;
    this.name = name;
    this.maxHealth = 100;
    this.attack = 100;
    this.defense = 100;
    this.basicAttack = basicAttack;
  }
}

const classes = {
  "sword" : new Class(
    "assets/sword.png",
    "Swordsman",
    attacks.sword,
  ),
  "axe" : new Class(
    "assets/axe.png",
    "Axeman",
    attacks.axe,
  ),
  "spear" : new Class(
    "assets/spear.png",
    "Spearman",
    attacks.spear,
  ),
  "gun" : new Class(
    "assets/gun.png",
    "Gunner",
    attacks.gun,
  ),
  "bow" : new Class(
    "assets/bow.png",
    "Archer",
    attacks.bow,
  ),
  "cannon" : new Class(
    "assets/cannon.png",
    "Artilleryman",
    attacks.cannon,
  ),
  "shaman" : new Class(
    "assets/staff.png",
    "Shaman",
    attacks.staff,
  ),
  "monk" : new Class(
    "assets/staff.png",
    "Monk",
    attacks.staff,
  ),
}

export default classes;
