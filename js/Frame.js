let frame = {}

frame.stage = {x: 0, y: 0, height: window.innerHeight, width: window.innerWidth};

const panelWidthRatio = 0.4;
let sidePanelWidth = Math.floor(frame.stage.width * panelWidthRatio * 0.5);
frame.leftPanel = {x: 0, y: 0, height: frame.stage.height, width: sidePanelWidth};
frame.field = {x: sidePanelWidth, y: 0, height: frame.stage.height, width: frame.stage.width-2*sidePanelWidth};
frame.rightPanel = {x: frame.stage.width - sidePanelWidth, y: 0, height: frame.stage.height, width: sidePanelWidth};

const formationBorderRatio = 0.05;
let formationSideLength = Math.floor(Math.min(frame.field.height/2, frame.field.width));
let formationBorderWidth = Math.floor(formationSideLength * formationBorderRatio);
let formationInnerSideLength = formationSideLength - 2*formationBorderWidth;
let formationXGutter = Math.floor((frame.field.width - formationSideLength)/2);
let formationYGutter = Math.floor((frame.field.height - formationSideLength*2)/4);

frame.formation0 = {
  x: formationXGutter+formationBorderWidth, 
  y: formationYGutter+formationBorderWidth,
  height: formationInnerSideLength,
  width: formationInnerSideLength
}

frame.formation1 = {
  x: formationXGutter+formationBorderWidth, 
  y: formationYGutter+formationBorderWidth + Math.floor(frame.field.height/2),
  height: formationInnerSideLength,
  width: formationInnerSideLength
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

const unitIndicatorBarRatio = 0.2;
const unitTextOffsetRatio = 0.1;

frame.healthHeight = Math.floor(unitIndicatorBarRatio*unitSideLength);
frame.apOffset = Math.floor(unitTextOffsetRatio*unitSideLength);

export default frame;
