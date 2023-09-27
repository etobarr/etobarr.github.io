//#region APP SETUP ///////////////////////////////////////////////////////////////////////////////////////////////////
  console.log('>> initializaing...');
  window.onload = function() {
      let app = new PIXI.Application(
          {
              width: 800,
              height: 600,
              backgroundColor: (0x808080)
          }
      );
  document.body.appendChild(app.view);

  let App = {
    w: app.screen.width,
    h: app.screen.height
  }
  let shape;
  console.log('> app ready');
//#endregion ----------------------------------------------------------------------------------------------------------

//#region MENU ////////////////////////////////////////////////////////////////////////////////////////////////////////

const menu1 = () => {
  // graphics
  const menu1 = new PIXI.Container();
  const easyMode = new PIXI.Graphics();
    easyMode.beginFill(0xBBBBBB)
    easyMode.drawRect(0,0, App.w, App.h / 3);
    easyMode.interactive = true; // enable mouse events
    easyMode.buttonMode = true; // show pointer cursor on hover
    const easyText = new PIXI.Text('EASY', {
      fontFamily: 'Arial',
      fontSize: 100,
      fill: 0x339933, // Text color in hexadecimal
    });
    easyText.x = App.w / 2;
    easyText.y = App.h / 6;
    easyText.pivot.x = easyText.width / 2;
    easyText.pivot.y = easyText.height / 2;
  const mediumMode = new PIXI.Graphics();
    mediumMode.beginFill(0x888888)
    mediumMode.drawRect(0, App.h / 3, App.w, App.h / 3);
    mediumMode.interactive = true; // enable mouse events
    mediumMode.buttonMode = true; // show pointer cursor on hover
    const mediumText = new PIXI.Text('MEDIUM', {
      fontFamily: 'Arial',
      fontSize: 100,
      fill: 0xCCCC00, // Text color in hexadecimal
      x: App.w / 2,
      y: App.h / 2
    });
    mediumText.x = App.w / 2.4;
    mediumText.y = App.h / 2;
    mediumText.pivot.x = easyText.width / 2;
    mediumText.pivot.y = easyText.height / 2;
  const hardMode = new PIXI.Graphics();
    hardMode.beginFill(0x555555)
    hardMode.drawRect(0, (App.h / 3) * 2, App.w, App.h / 3);
    hardMode.interactive = true; // enable mouse events
    hardMode.buttonMode = true; // show pointer cursor on hover
    const hardText = new PIXI.Text('HARD', {
      fontFamily: 'Arial',
      fontSize: 100,
      fill: 0xCC0000, // Text color in hexadecimal
      x: 100,
      y: 100
    });
    hardText.x = App.w / 2;
    hardText.y = (App.h / 6) * 5;
    hardText.pivot.x = easyText.width / 2;
    hardText.pivot.y = easyText.height / 2;
  menu1.addChild(easyMode, mediumMode, hardMode, easyText, mediumText, hardText);
  app.stage.addChild(menu1);
  // center containers
  menu1.x = App.w / 2; menu1.y = App.h / 2;
  menu1.pivot.x = App.w / 2; menu1.pivot.y = App.h / 2;


  // choose shape
  easyMode.on('click', () => {
    console.log('> selected easy mode');
    app.stage.removeChildren();
    menu2('easy');
  });

  mediumMode.on('click', () => {
    console.log('> selected medium mode');
    app.stage.removeChildren();
    menu2('medium');
  });

  hardMode.on('click', () => {
    console.log('> selected medium mode');
    app.stage.removeChildren();
    menu2('hard');
  });
  console.log('> menu1 drawn');
}

const menu2 = (mode) => {
  gameMode = mode;
// graphics
  const graphicsSize = App.w *.35
  const menu2 = new PIXI.Container();
  const chooseX = new PIXI.Graphics();
    chooseX.beginFill(0xBBBBBB)
    chooseX.drawRect(0,0, App.w / 2, App.h);
    chooseX.interactive = true; // enable mouse events
    chooseX.buttonMode = true; // show pointer cursor on hover
  const chooseCircle = new PIXI.Graphics();
    chooseCircle.beginFill(0x555555)
    chooseCircle.drawRect(App.w / 2, 0, App.w / 2, App.h);
    chooseCircle.interactive = true; // enable mouse events
    chooseCircle.buttonMode = true; // show pointer cursor on hover
  const menuGraphics1 = new PIXI.Container();
    const graphics = new PIXI.Graphics();
      // x
      graphics.lineStyle(10, 0x555555, 1);
      graphics.pivot.set(graphicsSize / 2, graphicsSize / 2);
      graphics.moveTo(graphicsSize * .1, graphicsSize * .1); graphics.lineTo(graphicsSize * .9, graphicsSize * .9);
      graphics.moveTo(graphicsSize * .1, graphicsSize * .9); graphics.lineTo(graphicsSize * .9, graphicsSize * .1);
      // circle
      graphics.lineStyle(10, 0xBBBBBB);
      graphics.drawCircle(graphicsSize / 2 + App.w / 2, graphicsSize / 2, graphicsSize * .8 * .5);
  menuGraphics1.addChild(graphics);
  menu2.addChild(chooseX, chooseCircle, menuGraphics1);
  app.stage.addChild(menu2);
  // center containers
  menuGraphics1.x = App.w / 4; menuGraphics1.y = App.h / 2;
  menu2.x = App.w / 2; menu2.y = App.h / 2;
  menu2.pivot.x = App.w / 2; menu2.pivot.y = App.h / 2;

  // choose shape
  chooseX.on('click', () => {
    console.log('> selected X');
    app.stage.removeChildren();
    game(mode, 'x');
  });

  chooseCircle.on('click', () => {
    console.log('> selected O');
    app.stage.removeChildren();
    game(mode, 'circle');
  });

  console.log('> menu2 drawn');
}

const gameOver = (winner) => {
  const gameOverContainer = new PIXI.Container();

  // Create "GAME OVER" text
  const gameOverText = new PIXI.Text('GAME OVER', {
    fontFamily: 'Arial',
    fontSize: 60, // Reduced font size
    fill: 0x000000,
  });
  gameOverText.x = App.w / 2;
  gameOverText.y = App.h / 4;
  gameOverText.anchor.set(0.5);

  // Create winner text
  const winnerText = new PIXI.Text(winner, {
    fontFamily: 'Arial',
    fontSize: 30, // Smaller font size
    fill: 0x000000,
  });
  winnerText.x = App.w / 2;
  winnerText.y = (App.h / 4) * 1.5;
  winnerText.anchor.set(0.5);

  // Create a restart button with a different color
  const restartButton = createButton('> RESTART <', 0x009900); // Green color
  restartButton.x = App.w / 4 - 10;
  restartButton.y = (App.h / 2) + 20;
  restartButton.on('click', () => {
    console.log('> Restarting');
    app.stage.removeChildren();
    menu1();
  });

  // Create a quit button with a different color
  const quitButton = createButton('> QUIT <', 0xFF0000); // Red color
  quitButton.x = (App.w / 2) + 10;
  quitButton.y = (App.h / 2) + 20;
  quitButton.on('click', () => {
    console.log('> Quitting');
    app.stage.removeChildren();
    window.location.href = '../index.html';
  });

  gameOverContainer.addChild(gameOverText, winnerText, restartButton, quitButton);
  app.stage.addChild(gameOverContainer);

  console.log('> Game over screen drawn');
};

// Function to create a button with a specified color and styling
function createButton(label, buttonColor) {
  const button = new PIXI.Graphics();
  button.beginFill(buttonColor);
  button.drawRect(0, 0, App.w / 4, 60); // Adjusted button size
  button.interactive = true;
  button.buttonMode = true;

  const buttonText = new PIXI.Text(label, {
    fontFamily: 'Arial',
    fontSize: 20, // Smaller font size
    fill: 0xFFFFFF, // White text color
  });
  buttonText.x = button.width / 2;
  buttonText.y = button.height / 2;
  buttonText.anchor.set(0.5);

  button.addChild(buttonText);

  return button;
}



//#endregion --------------------------------------------------------------------------------------------------------

  let game = (mode, shape) => {
//#region DRAW GAME ///////////////////////////////////////////////////////////////////////////////////////////////////
  // add grid container
  const grid = new PIXI.Container();
  app.stage.addChild(grid);

  // draw lines
  let squareSize = App.w *.2;
  const line = new PIXI.Graphics();
  // left line
  line.lineStyle(5, 0xFFFFFF, 1);
  line.moveTo(0, -squareSize); line.lineTo(0, squareSize * 2);
  // right line
  line.moveTo(squareSize, -squareSize); line.lineTo(squareSize, squareSize * 2);
  // top line
  line.moveTo(-squareSize, 0); line.lineTo(squareSize * 2, 0);
  // bottom line
  line.moveTo(-squareSize, squareSize); line.lineTo(squareSize * 2, squareSize);
  // add lines to grid container
  grid.addChild(line);

  // center grid in stage
  grid.x = App.w / 2; grid.y = App.h / 2;
  // center lines in container
  grid.pivot.x = squareSize / 2; grid.pivot.y = squareSize / 2;
  console.log('> grid drawn');

  // initialize containers
  const xCtnr = new PIXI.Container();
  app.stage.addChild(xCtnr);

  const oCtnr = new PIXI.Container();
  app.stage.addChild(oCtnr);

  // draw graphics
  for (let i = 0; i < 9; i++) {
    // draw Xs
    const xxx = new PIXI.Graphics();
    xxx.lineStyle(10, 0xFFFFFF, 1);
    xxx.moveTo(squareSize * .1, squareSize * .1); xxx.lineTo(squareSize * .9, squareSize * .9);
    xxx.moveTo(squareSize * .1, squareSize * .9); xxx.lineTo(squareSize * .9, squareSize * .1);
    xxx.x = (i % 3) * squareSize - squareSize;
    xxx.y = Math.floor(i / 3) * squareSize - squareSize;
    xxx.alpha = 0;
    xCtnr.addChild(xxx);

    // draw Os
    const ooo = new PIXI.Graphics();
    ooo.lineStyle(10, 0xFFFFFF);
    ooo.drawCircle(squareSize / 2, squareSize / 2, squareSize * .8 * .5);
    app.stage.addChild(ooo);
    ooo.x = (i % 3) * squareSize - squareSize;
    ooo.y = Math.floor(i / 3) * squareSize - squareSize;
    ooo.alpha = 0;
    oCtnr.addChild(ooo);
  }

  // center containers in stage
  xCtnr.x = grid.x; xCtnr.y = grid.y;
  oCtnr.x = grid.x; oCtnr.y = grid.y;
  //center children in containers
  xCtnr.pivot.x = squareSize / 2; xCtnr.pivot.y = squareSize / 2;
  oCtnr.pivot.x = squareSize / 2; oCtnr.pivot.y = squareSize / 2;
  console.log('> shapes drawn');
//#endregion -------------------------------------------------------------------------------------------

//#region LOGIC ///////////////////////////////////////////////////////////////////////////////////////////////////////
console.log('> initializing logic');
let gameMode = mode;
let box;
let moves =  [];
let allSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let playerMoves = [];
let aiMoves = [];
let gameIsOver = false;

const middle = [4];
const edges = [1, 3, 5, 7];
const corners = [0, 2, 6, 8];
const diagonals = [
  [0, 4, 8],
  [2, 4, 6]
]

let randomFromArray = (options) => {
    box = options[Math.floor(Math.random() * options.length)];
    return box;
}

function matched(array1, array2) {
  const matched = [];
  for (const item of array1) {
    if (array2.includes(item)) {
      matched.push(item);
    }
  }
  return matched;
}

function unmatched(array1, array2) {
  const unmatched = [];
  for (const item of array1) {
    if (!array2.includes(item)) {
      unmatched.push(item);
    }
  }
  return unmatched;
}

const winningCombos = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal from top-left to bottom-right
  [2, 4, 6]  // diagonal from top-right to bottom-left
];

const forkCombos = [
  [0, 8],
  [2, 6],
  [1, 8],
  [1, 6],
  [3, 2],
  [3, 8],
  [7, 0],
  [7, 2],
  [5, 0],
  [5, 6],
  [1, 5],
  [1, 3],
  [7, 5],
  [7, 3]
]

const forkAnswer = [
  [1, 3, 5, 7],
  [1, 3, 5, 7],
  [2],
  [0],
  [0],
  [6],
  [6],
  [8],
  [2],
  [8],
  [2],
  [0],
  [8],
  [6]
]

const comboTest = (moveset, combos, num, message) => {
  for (i = 0; i < combos.length; i++) {
    if (matched(moveset, combos[i]).length >= num && matched(moves, combos[i]).length < 3) {
      if (message != null) {
        console.log(message);
      }
      answer = unmatched(combos[i], moves)[0];
      return answer;
    } else {answer = -1}
  }
}

const forkTest = () => {
  for (i = 0; i < forkCombos.length; i++) {
    if (matched(playerMoves, forkCombos[i]).length == 2 && matched(moves, forkCombos[i]).length < 3) {
      answer = randomFromArray(unmatched(forkAnswer[i], moves));
      return answer;
    } else {answer = -1}
  }
}

let winTest = () => {
  for (i = 0; i < winningCombos.length; i++) {
    if (matched(playerMoves, winningCombos[i]).length > 2) {
      oCtnr.alpha = .25;
      xCtnr.alpha = .25;
      grid.alpha = .25;
      gameOver('PLAYER WINS !!!');
      gameIsOver = true;
      break;
    }
    else if (matched(aiMoves, winningCombos[i]).length > 2) {
      oCtnr.alpha = .25;
      xCtnr.alpha = .25;
      grid.alpha = .25;
      gameOver('AI WINS !!!');
      gameIsOver = true;
      break;
    }
    else if (moves.length > 8) {
      oCtnr.alpha = .25;
      xCtnr.alpha = .25;
      grid.alpha = .25;
      gameOver('TIE !!!');
      gameIsOver = true;
      break;
    }
  }
}



// PLAYER's MOVE LOGIC
let playerMove = (box) => {
  moves.push(box); // push to moves array
  playerMoves.push(box); // push to moves array
  // log move to console
  console.log('player box: ', box); console.log('moves ', moves);
  // ai's turn
  winTest();
  if (unmatched(allSquares, moves).length > 0){
    aiMove();
    console.log('> ai\'s move')
    console.log(moves);
  }
}

// AI's MOVE LOGIC
let aiMove = () => {
  let playable = unmatched(allSquares, moves);
  if (gameMode == 'easy') {
    if (matched(allSquares, playable).length > 0) {
      box = randomFromArray(matched(allSquares, playable));
      console.log('random square');
    }
  }

  if (gameMode == 'medium') {
    if (comboTest(playerMoves, winningCombos, 2) >= 0) {
      box = comboTest(playerMoves, winningCombos, 2, 'blocking player');
    }
    else if (matched(allSquares, playable).length > 0) {
      box = randomFromArray(matched(allSquares, playable));
      console.log('random square');
    } 
  }

  else if (gameMode == 'hard') {
    // 1) take the W
      if (comboTest(aiMoves, winningCombos, 2) >= 0) {
        box = comboTest(aiMoves, winningCombos, 2, 'taking the W');
      }
    // 2) if player has 2 in a row
      else if (comboTest(playerMoves, winningCombos, 2) >= 0) {
        box = comboTest(playerMoves, winningCombos, 2, 'blocking player');
      }
      else if (forkTest() >= 0) {
        box = forkTest();
      }
    // 3) play middle
      else if (matched(middle, playable).length > 0) {
        box = 4;
        console.log('taking middle');
      }
    // 4) play corner
      //optimal corner
      else if (matched(corners, playable).length > 0) {
        if (matched(matched(corners, playable), unmatched(corners, [comboTest(moves, diagonals, 2)])).length > 0) {
          box = randomFromArray(
            matched(
              matched(corners, playable), 
              unmatched(corners, [comboTest(moves, diagonals, 2)])
            )
          );
        } 
        //random corner
        else if (matched(matched(corners, playable), unmatched(corners, [comboTest(moves, diagonals, 2)])).length <= 0) {
          box = randomFromArray(matched(corners, playable))
        }
        console.log('random corner');
      }
    // 5) random edge
      else if (matched(edges, playable).length > 0) {
        box = randomFromArray(matched(edges, playable));
        console.log('random edge');
      }
  }
    // log move
    console.log('ai box: ', box);
    // push to moves arrays
    moves.push(box); 
    aiMoves.push(box);
    console.log('moves ', moves);
    // update graphics
    if (shape == 'circle') {
      xCtnr.getChildAt(box).alpha = 1;
    } else if (shape == 'x') {
      oCtnr.getChildAt(box).alpha = 1;
    }
    winTest();
    console.log('>> player\'s move...')
  }

// if ai goes first
if (shape == 'circle') {
  console.log('> ai moves first')
  aiMove();
}

//#endregion -------------------------------------------------------------------------------------------------

//#region INPUTS //////////////////////////////////////////////////////////////////////////////////////////////////////
  let topLeftX = grid.x - (squareSize * 1.5);
  let topLeftY = grid.y - (squareSize * 1.5);

  const squares = new PIXI.Container();
  app.stage.addChild(squares);

  // draw grid of shapes
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      const square = new PIXI.Graphics();
      // draw a clickable rectangle
      square.beginFill(0xFF0000); // color doesn't matter
      square.drawRect(topLeftX + squareSize * (j % 3), topLeftY + squareSize * (i % 3), squareSize, squareSize);
      square.endFill();
      square.alpha = 0;
      square.clicks = 0;
      // add a click event listener to the Graphics object
      square.interactive = true; // enable mouse events
      square.buttonMode = true; // show pointer cursor on hover
      squares.addChild(square);

      // MOUSE EVENTS
      square.on('mouseover', () => {
        if (square.clicks < 1 && !moves.includes(squares.getChildIndex(square))) {
          box = squares.getChildIndex(square);
          if (shape == "circle") {
            oCtnr.getChildAt(box).alpha = .5;
          } else if (shape == 'x') {
            xCtnr.getChildAt(box).alpha = .5;
          }
        }
      });

      square.on('mouseout', () => {
        if (square.clicks < 1) {
          box = squares.getChildIndex(square);
          if (shape == 'circle') {
            oCtnr.getChildAt(box).alpha = 0;
          } else if (shape == 'x') {
            xCtnr.getChildAt(box).alpha = 0;
          }
        }
      });

      square.on('click', () => {
        if (square.clicks < 1 && !moves.includes(squares.getChildIndex(square))) {
          square.clicks += 1;
          square.alpha = 0;
          box = squares.getChildIndex(square);
          if (shape == 'circle') {
            oCtnr.getChildAt(box).alpha = 1;
          } else if (shape == 'x') {
            xCtnr.getChildAt(box).alpha = 1;
          }
          if (gameIsOver = true) {
            playerMove(box);
          }
        }
      });
    }
  }

//#endregion -----------------------------------------------------------------------------------------------

//#region GAME LOOP
    app.ticker.add((delta) => {
      mouseX = app.renderer.plugins.interaction.mouse.global.x;
      mouseY = app.renderer.plugins.interaction.mouse.global.y;
    });
  /*function gameLoop() {
    requestAnimationFrame(gameLoop);
  } gameLoop();*/
//#endregion ------------------------------------------------------------------
}
menu1();
console.log('> window loaded'); console.log('>> waiting for input...');
}