class Class {
  constructor(texture){
    this.texture = texture;
  }
}

const classes = {
  "sword" : new Class("assets/sword.png"),
  "axe" : new Class("assets/axe.png"),
  "spear" : new Class("assets/spear.png"),
  "rifle" : new Class("assets/rifle.png"),
  "bow" : new Class("assets/bow.png"),
  "cannon" : new Class("assets/cannon.png"),
  "staff" : new Class("assets/staff.png")
}

export default classes;
