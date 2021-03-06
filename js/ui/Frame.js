let frame = {}

frame.stage = {x: 0, y: 0, height: window.innerHeight, width: window.innerWidth};

const panelWidthRatio = 0.7;
let sidePanelWidth = Math.floor(frame.stage.width * panelWidthRatio * 0.5);
frame.leftPanel = {x: 0, y: 0, height: frame.stage.height, width: sidePanelWidth};
frame.field = {x: sidePanelWidth, y: 0, height: frame.stage.height, width: frame.stage.width-2*sidePanelWidth};
frame.rightPanel = {x: frame.stage.width - sidePanelWidth, y: 0, height: frame.stage.height, width: sidePanelWidth};

const actionSelectRatio = 0.20;
let actionSelectHeight = Math.floor(frame.field.height * actionSelectRatio);
let availableFrameHeight = frame.field.height - actionSelectHeight;

const formationBorderRatio = 0.05;
let formationSideLength = Math.floor(Math.min(availableFrameHeight/2, frame.field.width));
let formationBorderWidth = Math.floor(formationSideLength * formationBorderRatio);
let formationInnerSideLength = formationSideLength - 2*formationBorderWidth;
let formationXGutter = Math.floor((frame.field.width - formationSideLength)/2);
let formationYGutter = Math.floor((availableFrameHeight - formationSideLength*2)/4);

frame.formation0 = {
  x: formationXGutter+formationBorderWidth, 
  y: formationYGutter+formationBorderWidth,
  height: formationInnerSideLength,
  width: formationInnerSideLength
}

frame.formation1 = {
  x: formationXGutter + formationBorderWidth, 
  y: frame.field.height - formationYGutter - formationSideLength + formationBorderWidth,
  height: formationInnerSideLength,
  width: formationInnerSideLength
}

frame.actionBar = {
  x: formationXGutter+formationBorderWidth,
  y: frame.field.height/2 - actionSelectHeight/2,
  height: actionSelectHeight,
  width: formationInnerSideLength,
}

const actionsWidth = 4;
const actionsHeight = 2;
const actionBorderRatio = 0.05;

let actionSideLength = Math.floor(Math.min(frame.actionBar.height/actionsHeight, frame.actionBar.width/actionsWidth));
let actionYGutter = Math.floor((frame.actionBar.height - actionSideLength*actionsHeight)/2);
let actionXGutter = Math.floor((frame.actionBar.width - actionSideLength*actionsWidth)/2);
let actionBorderWidth = Math.floor(actionSideLength*actionBorderRatio);
let actionInnerSideLength = actionSideLength - 2*actionBorderWidth;

frame.actions = []
for(let j = 0; j<actionsHeight; j++){
  for(let i = 0; i<actionsWidth; i++){
    frame.actions.push({
      x: actionXGutter + actionBorderWidth + i*actionSideLength,
      y: actionYGutter + actionBorderWidth + j*actionSideLength,
      height: actionInnerSideLength,
      width: actionInnerSideLength,
    })
  }
}

const unitSpaceRatio = 0.1
let unitSpaceWidth = Math.floor(formationInnerSideLength * unitSpaceRatio / 2);
let unitSideLength = Math.floor((formationInnerSideLength - 2*unitSpaceWidth)/3);
let unitOffset = unitSpaceWidth + unitSideLength;

frame.units = {};
frame.units[0] = {};
[0, 1, 2].forEach((x) => {
  frame.units[0][x] = {};
  [0, 1, 2].forEach((y) => {
    frame.units[0][x][y] = {
      x: x*unitOffset, 
      y: y*unitOffset, 
      height: unitSideLength, 
      width: unitSideLength};
  });
});

frame.units[1] = {};
[0, 1, 2].forEach((x) => {
  frame.units[1][2-x] = {};
  [0, 1, 2].forEach((y) => {
    frame.units[1][2-x][2-y] = {
      x: x*unitOffset, 
      y: y*unitOffset, 
      height: unitSideLength, 
      width: unitSideLength};
  });
});

const unitIndicatorBarRatio = 0.15;
const unitBorderThicknessRatio = 0.075;

frame.healthHeight = Math.floor(unitIndicatorBarRatio*unitSideLength);
frame.borderThickness = Math.floor(unitBorderThicknessRatio*unitSideLength);

export default frame;
