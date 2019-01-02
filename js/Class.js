import attacks from "./BasicAttacks.js";

class Class {
  constructor(texture, name, basicAttack, stats){
    this.texture = texture;
    this.name = name;
    this.stats = stats;
    this.basicAttack = basicAttack;
  }
}

const classes = {
  "swordsman" : new Class(
    "assets/sword.png",
    "Swordsman",
    attacks.sword,
    {
      'atk': 100,
      'def': 200,
      'vit': 150,
      'int': 120,
      'wis': 150,
      'ala': 65,
    },
  ),

  "axeman" : new Class(
    "assets/axe.png",
    "Axeman",
    attacks.axe,
    {
      'atk': 150,
      'def': 130,
      'vit': 200,
      'int': 60,
      'wis': 50,
      'ala': 60,
    },
  ),

  "spearman" : new Class(
    "assets/spear.png",
    "Spearman",
    attacks.spear,
    {
      'atk': 180,
      'def': 115,
      'vit': 150,
      'int': 60,
      'wis': 80,
      'ala': 75,
    },
  ),

  "gunner" : new Class(
    "assets/gun.png",
    "Gunner",
    attacks.gun,
    {
      'atk': 120,
      'def': 100,
      'vit': 80,
      'int': 80,
      'wis': 100,
      'ala': 75,
    },
  ),

  "archer" : new Class(
    "assets/bow.png",
    "Archer",
    attacks.bow,
    {
      'atk': 150,
      'def': 85,
      'vit': 80,
      'int': 120,
      'wis': 120,
      'ala': 85,
    },
  ),

  "artilleryman" : new Class(
    "assets/cannon.png",
    "Artilleryman",
    attacks.cannon,
    {
      'atk': 50,
      'def': 115,
      'vit': 115,
      'int': 60,
      'wis': 85,
      'ala': 65,
    },
  ),

  "shaman" : new Class(
    "assets/staff.png",
    "Shaman",
    attacks.staff,
    {
      'atk': 80,
      'def': 100,
      'vit': 90,
      'int': 150,
      'wis': 150,
      'ala': 72,
    },
  ),

  "monk" : new Class(
    "assets/staff.png",
    "Monk",
    attacks.staff,
    {
      'atk': 110,
      'def': 110,
      'vit': 110,
      'int': 130,
      'wis': 180,
      'ala': 78,
    },
  ),
}

export default classes;
