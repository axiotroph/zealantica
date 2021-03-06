import attacks from "./BasicAttacks.js";
import {guard, swap} from "./BasicActions.js";
import spells from "./Spells.js";

class Class {
  constructor(texture, name, abilities, stats, tags){
    this.texture = texture;
    this.name = name;
    this.stats = stats;
    this.abilities = abilities;
    this.tags = tags;
    this.abilities.push(guard);
    this.abilities.push(swap);
  }
}

const classes = {
  "swordsman" : new Class(
    "assets/sword.png",
    "Swordsman",
    [attacks.sword, spells.flame_sword],
    {
      'atk': 100,
      'def': 150,
      'vit': 130,
      'int': 80,
      'wis': 130,
      'ala': 65,
    },
    {
      'meele': true,
    },
  ),

  "axeman" : new Class(
    "assets/axe.png",
    "Axeman",
    [attacks.axe, spells.freezing_axe],
    {
      'atk': 125,
      'def': 125,
      'vit': 175,
      'int': 60,
      'wis': 50,
      'ala': 60,
    },
    {
      'meele': true,
    },
  ),

  "spearman" : new Class(
    "assets/spear.png",
    "Spearman",
    [attacks.spear, spells.lightning_spear],
    {
      'atk': 150,
      'def': 115,
      'vit': 120,
      'int': 60,
      'wis': 80,
      'ala': 75,
    },
    {
      'meele': true,
    },
  ),

  "gunner" : new Class(
    "assets/gun.png",
    "Gunner",
    [attacks.gun],
    {
      'atk': 125,
      'def': 100,
      'vit': 80,
      'int': 80,
      'wis': 100,
      'ala': 75,
    },
    {
      'ranged': true,
    },
  ),

  "archer" : new Class(
    "assets/bow.png",
    "Archer",
    [attacks.bow, spells.silence],
    {
      'atk': 150,
      'def': 85,
      'vit': 80,
      'int': 120,
      'wis': 120,
      'ala': 85,
    },
    {
      'ranged': true,
    },
  ),

  "artilleryman" : new Class(
    "assets/cannon.png",
    "Artilleryman",
    [attacks.cannon, spells.deep_insight],
    {
      'atk': 75,
      'def': 115,
      'vit': 115,
      'int': 60,
      'wis': 85,
      'ala': 65,
    },
    {
      'ranged': true,
    },
  ),

  "shaman" : new Class(
    "assets/staff.png",
    "Shaman",
    [attacks.staff, spells.heal],
    {
      'atk': 80,
      'def': 100,
      'vit': 90,
      'int': 150,
      'wis': 150,
      'ala': 72,
    },
    {
      'magic': true,
    },
  ),

  "monk" : new Class(
    "assets/staff.png",
    "Monk",
    [attacks.staff, spells.awakening, spells.holy_guard],
    {
      'atk': 110,
      'def': 110,
      'vit': 110,
      'int': 130,
      'wis': 180,
      'ala': 78,
    },
    {
      'magic': true,
    },
  ),
}

export default classes;
